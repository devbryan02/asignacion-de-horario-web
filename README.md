# Asignación de horarios — frontend

Interfaz con Next.js 16.4.6, React/React DOM 19.3.1 y Node.js 26 LTS.
Gestiona recursos académicos, genera horarios mediante la API Java y permite
consultarlos en calendario y exportarlos a Excel o PDF.

## Desarrollo

Usar Node 26.13.0 (también indicado en `.nvmrc`) y npm 11.20.0.

```powershell
npm ci
npm run dev
```

La web se sirve en `http://localhost:3000`. El código cliente consume
`http://localhost:8080/api/v1`; esta dirección todavía no está externalizada.
El contenedor de la API debe publicar el puerto 8080 para el navegador local.

## Verificación

```powershell
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm test
# Lint, tipos, build y pruebas de navegador:
npm run verify
```

Playwright inicia el build productivo en `127.0.0.1:3000`, con API simulada
y datos sintéticos. Ese puerto debe estar libre. Comprueba login rechazado,
páginas, validación de periodos, calendario, archivos Excel/PDF e importación
de restricciones. También caracteriza el proxy inactivo heredado.

`eslint-suppressions.json` registra la deuda existente por archivo, regla y
cantidad; las reglas siguen activas para nuevos errores. `npm run lint:debt`
muestra los errores sin esa línea base y devuelve un código no cero mientras
exista deuda. Las advertencias siguen visibles en el lint normal.

TypeScript 6.0.3 y ESLint 9.39.5 son las versiones estables compatibles con
los plugins de esta versión de Next. Sus peers aún no admiten TypeScript 7
ni ESLint 10; no se utilizaron `--force` ni `--legacy-peer-deps`. npm marca
ESLint 9 como fuera de soporte; queda pendiente el salto cuando los plugins
permitan ESLint 10.

## Organización

- `src/app/`: rutas App Router y dashboard.
- `src/feactures/`: componentes, hooks y servicios por dominio; conservar la
  escritura existente del directorio.
- `src/components/`, `src/lib/`, `src/types/`: código compartido.
- `public/`: assets y plantilla Excel.
- `tests/`: regresiones de navegador con API simulada.
- `vendor/xlsx-0.20.3.tgz`: distribución oficial de SheetJS, fijada localmente
  porque el paquete npm público `xlsx` sigue en una versión antigua.

## Docker y autenticación pendiente

El Dockerfile usa Node 26 y construye la aplicación; el Compose común está en
la raíz del workspace. Ejecutar `npm start` sirve un build ya generado.

`proxy.ts` conserva la ubicación raíz del antiguo `middleware.ts`. Con
`src/app`, Next no lo descubre y no aplica esa protección de navegación.
Además, el login guarda la sesión en localStorage y el proxy espera cookies.
Activarlo y unificar la sesión pertenecen a la corrección funcional pendiente;
la autorización real debe verificarse en la API.

El informe de migración y los puntos débiles están en `../docs/` del workspace,
fuera de este repositorio Git independiente.
