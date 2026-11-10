import { expect, test, type Page } from '@playwright/test';
import * as XLSX from 'xlsx';
import fs from 'node:fs';

const id = '00000000-0000-0000-0000-000000000001';
const periodo = { id, nombre: '2026-I', fechaInicio: '2026-01-01', fechaFin: '2026-06-30' };
const docente = { id, nombre: 'Docente sintetico', horasContratadas: 20, horasMaximasPorDia: 6, restricciones: [] };
const horario = { id, curso: 'Matematica', docente: docente.nombre, aula: 'Aula 1', seccion: 'A',
  diaSemana: 'LUNES', horaInicio: '08:00:00', horaFin: '10:00:00' };

async function prepare(page: Page) {
  await page.context().addCookies([
    { name: 'token', value: 'synthetic-token', url: 'http://127.0.0.1:3000' },
    { name: 'userRole', value: 'COORDINADOR', url: 'http://127.0.0.1:3000' },
  ]);
  await page.addInitScript(() => {
    localStorage.setItem('token', 'synthetic-token');
    localStorage.setItem('userRole', 'COORDINADOR');
  });
  await page.route('http://localhost:8080/api/v1/**', async route => {
    const path = new URL(route.request().url()).pathname;
    let data: unknown = [];
    if (path.endsWith('/periodo-academico')) data = [periodo];
    if (path.endsWith('/docente')) data = [docente];
    if (path.endsWith('/seccion-academica')) data = [{ id, nombre: 'A', periodoAcademico: periodo.nombre }];
    if (path.includes('/horarios/')) data = [horario];
    if (path.endsWith('/aula')) data = [{ id, nombre: 'Aula 1', capacidad: 30, tipo: 'TEORICO' }];
    await route.fulfill({ json: data, headers: { 'Access-Control-Allow-Origin': '*' } });
  });
}

test('login renders and displays an API authentication rejection', async ({ page }) => {
  await page.route('**/api/v1/auth/login', async route => {
    expect(route.request().postDataJSON()).toEqual({ username: 'demo', password: 'incorrecta' });
    await route.fulfill({ json: { success: false, message: 'Credenciales invalidas', token: null, role: null } });
  });
  await page.goto('/');
  await page.getByPlaceholder('Ingresa tu usuario').fill('demo');
  await page.locator('input[type=password]').fill('incorrecta');
  await page.locator('form').getByRole('button', { name: /Iniciar Sesi/i }).click();
  await expect(page.getByText('Credenciales invalidas', { exact: true })).toBeVisible();
});

test('successful login preserves token and role storage', async ({ page }) => {
  await page.route('http://localhost:8080/api/v1/**', async route => {
    const login = route.request().url().endsWith('/auth/login');
    await route.fulfill({ json: login ? { success: true, username: 'demo', message: 'ok',
      token: 'synthetic-token', role: 'COORDINADOR' } : [] });
  });
  await page.goto('/');
  await page.getByPlaceholder('Ingresa tu usuario').fill('demo');
  await page.locator('input[type=password]').fill('correcta');
  await page.locator('form').getByRole('button', { name: /Iniciar Sesi/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  expect(await page.evaluate(() => ({ token: localStorage.getItem('token'), role: localStorage.getItem('userRole') })))
    .toEqual({ token: 'synthetic-token', role: 'COORDINADOR' });
});

test('academic pages render using synthetic API data', async ({ page }) => {
  await prepare(page);
  for (const path of ['/', '/dashboard', '/dashboard/periodo-academico', '/dashboard/docentes',
    '/dashboard/aulas', '/dashboard/cursos', '/dashboard/secciones', '/dashboard/bloques-de-horario',
    '/dashboard/restricciones', '/dashboard/unidades-academicas', '/dashboard/generar-horario',
    '/dashboard/personalizacion', '/dashboard/visualizar']) {
    const errors: string[] = [];
    const onError = (error: Error) => errors.push(error.message);
    page.on('pageerror', onError);
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('body')).not.toContainText('Application error');
    await page.waitForTimeout(200);
    page.off('pageerror', onError);
    expect(errors, path).toEqual([]);
  }
});

test('characterizes inherited inactive root proxy without session cookies', async ({ page }) => {
  // Baseline middleware was also outside src/. Activating protection belongs
  // to the separate session fix: login currently writes localStorage only.
  await page.route('http://localhost:8080/api/v1/**', route => route.fulfill({ json: [] }));
  const response = await page.goto('/dashboard');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/dashboard$/);
  expect(await page.context().cookies()).toEqual([]);
});

test('period form rejects invalid input and submits valid dates through Zod', async ({ page }) => {
  await prepare(page);
  let submitted: unknown;
  await page.route('**/api/v1/periodo-academico', async route => {
    if (route.request().method() === 'POST') {
      submitted = route.request().postDataJSON();
      await route.fulfill({ json: { success: true, message: 'Periodo registrado' } });
    } else await route.fulfill({ json: [periodo] });
  });
  await page.goto('/dashboard/periodo-academico');
  await page.getByRole('button', { name: /agregar|nuevo/i }).first().click();
  const name = page.locator('input[type=text]').last();
  await name.fill('A');
  const dates = page.locator('input[type=date]');
  await dates.nth(0).fill('2026-01-01');
  await dates.nth(1).fill('2026-06-30');
  await page.getByRole('button', { name: /guardar|crear|registrar/i }).last().click();
  await expect(page.getByText('El nombre debe tener al menos 3 caracteres')).toBeVisible();
  expect(submitted).toBeUndefined();
  await name.fill('2026-II');
  await dates.nth(1).fill('2025-12-31');
  await page.getByRole('button', { name: /guardar|crear|registrar/i }).last().click();
  await expect(page.getByText('La fecha de inicio debe ser anterior a la fecha de fin')).toBeVisible();
  expect(submitted).toBeUndefined();
  await dates.nth(1).fill('2026-06-30');
  await page.getByRole('button', { name: /guardar|crear|registrar/i }).last().click();
  await expect.poll(() => submitted).toEqual({ nombre: '2026-II', fechaInicio: '2026-01-01', fechaFin: '2026-06-30' });
});

test('calendar displays a class and exports readable Excel and PDF', async ({ page }) => {
  await prepare(page);
  await page.goto('/dashboard/visualizar');
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'A', exact: true }).click();
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  await expect(page.getByText('Matematica', { exact: true }).first()).toBeVisible();
  const excelDownload = page.waitForEvent('download');
  await page.getByTitle('Exportar horario a Excel').click();
  const excel = await excelDownload;
  const workbook = XLSX.readFile((await excel.path())!);
  const cells = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 }).flat();
  expect(cells).toContain('Matematica');
  const pdfDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: /PDF/i }).click();
  const pdf = await pdfDownload;
  expect(fs.readFileSync((await pdf.path())!).subarray(0, 5).toString()).toBe('%PDF-');
});

test('teacher restriction uploader parses Excel and submits the expected payload', async ({ page }) => {
  await prepare(page);
  let submitted: unknown;
  await page.route('**/api/v1/restriccion-docente/batch', async route => {
    submitted = route.request().postDataJSON();
    await route.fulfill({ json: { success: true, message: '1 restriccion cargada' } });
  });
  await page.goto('/dashboard/docentes');
  await page.getByTitle(/Agregar restricci/).click();
  await page.getByRole('button', { name: 'Carga masiva' }).click();
  const sheet = XLSX.utils.json_to_sheet([{ diaSemana: 'LUNES', horaInicio: '08:00', horaFin: '10:00', tipoRestriccion: 'BLOQUEADO' }]);
  const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, sheet, 'Restricciones');
  await page.locator('input[type=file]').setInputFiles({ name: 'restricciones.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }) });
  await page.getByRole('button', { name: 'Cargar (1)' }).click();
  await expect.poll(() => submitted).toEqual([{ docenteId: id, diaSemana: 'LUNES',
    horaInicio: '08:00', horaFin: '10:00', tipoRestriccion: 'BLOQUEADO' }]);
});
