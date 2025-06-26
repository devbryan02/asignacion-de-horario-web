import axios from 'axios';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

// Define la forma de los datos que recibiremos del backend
export interface HorarioDto {
  id: string;
  curso: string;
  docente: string;
  aula: string;
  seccion: string;
  diaSemana: DiaSemana;
  horaInicio: string; // LocalTime en formato ISO
  horaFin: string; // LocalTime en formato ISO
}

export enum DiaSemana {
  LUNES = 'LUNES',
  MARTES = 'MARTES',
  MIERCOLES = 'MIERCOLES',
  JUEVES = 'JUEVES',
  VIERNES = 'VIERNES',
  SABADO = 'SABADO',
  DOMINGO = 'DOMINGO'
}

// Mapeo de días de la semana a números para uso en calendarios
export const diaSemanaToIndex = {
  [DiaSemana.LUNES]: 0,
  [DiaSemana.MARTES]: 1,
  [DiaSemana.MIERCOLES]: 2,
  [DiaSemana.JUEVES]: 3,
  [DiaSemana.VIERNES]: 4,
  [DiaSemana.SABADO]: 5,
  [DiaSemana.DOMINGO]: 6,
};

// Mapeo inverso para mostrar nombres en la UI
export const indexToDiaSemana: { [key: number]: string } = {
  0: 'Lunes',
  1: 'Martes',
  2: 'Miércoles',
  3: 'Jueves',
  4: 'Viernes',
  5: 'Sábado',
  6: 'Domingo'
};

// Convertir respuesta del backend a eventos para el calendario
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: {
    curso: string;
    docente: string;
    aula: string;
    seccion: string;
  };
  backgroundColor?: string;
  borderColor?: string;
}

// URL base para la API
const API_URL = 'http://localhost:8080/api/v1';

// Función auxiliar para calcular duración en minutos
function calcularDuracion(horaInicio: string, horaFin: string): number {
  const [horaIni, minIni] = horaInicio.split(':').map(Number);
  const [horaFin2, minFin] = horaFin.split(':').map(Number);

  const minutosInicio = horaIni * 60 + minIni;
  const minutosFin = horaFin2 * 60 + minFin;

  return minutosFin - minutosInicio;
}

// Servicio para recuperar y transformar datos de horarios
export class VisualizarHorarioService {
  // Obtener horarios por sección
  static async obtenerHorariosPorSeccion(seccionID: string): Promise<HorarioDto[]> {
    try {
      const response = await axios.get(`${API_URL}/horarios/seccion/${seccionID}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener horarios por sección:', error);
      throw error;
    }
  }

  // Obtener horarios por docente
  static async obtenerHorariosPorDocente(docenteID: string): Promise<HorarioDto[]> {
    try {
      const response = await axios.get(`${API_URL}/horarios/docente/${docenteID}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener horarios por docente:', error);
      throw error;
    }
  }

  // Obtener horarios por periodo
  static async obtenerHorariosPorPeriodo(periodoID: string): Promise<HorarioDto[]> {
    try {
      const response = await axios.get(`${API_URL}/horarios/periodo/${periodoID}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener horarios por periodo:', error);
      throw error;
    }
  }

  // Convertir horarios a formato de eventos para el calendario
  static convertirHorariosAEventos(horarios: HorarioDto[], fechaInicio: Date): CalendarEvent[] {
    // Asignamos colores distintos según el curso para mejor visualización
    const coloresPorCurso = new Map<string, string>();
    const coloresBase = [
      '#4285F4', // Google Blue
      '#EA4335', // Google Red
      '#FBBC05', // Google Yellow
      '#34A853', // Google Green
      '#00ACC1', // Cyan
      '#AB47BC', // Purple
      '#FF7043', // Deep Orange
      '#9E9E9E', // Grey
    ];

    return horarios.map(horario => {
      // Asignar un color al curso si no tiene ya uno asignado
      if (!coloresPorCurso.has(horario.curso)) {
        coloresPorCurso.set(
          horario.curso,
          coloresBase[coloresPorCurso.size % coloresBase.length]
        );
      }
      const color = coloresPorCurso.get(horario.curso) || coloresBase[0];

      // Convertir hora de inicio y fin a objetos Date para el calendario
      const diaIndice = diaSemanaToIndex[horario.diaSemana];

      // Crear una fecha a partir de la fecha de inicio de la semana y el día correspondiente
      const fechaEvento = new Date(fechaInicio);
      fechaEvento.setDate(fechaInicio.getDate() + diaIndice);

      // Parsear las horas de inicio y fin (formato "HH:MM:SS")
      const [horaInicio, minutosInicio] = horario.horaInicio.split(':').map(Number);
      const [horaFin, minutosFin] = horario.horaFin.split(':').map(Number);

      // Crear las fechas de inicio y fin del evento
      const start = new Date(fechaEvento);
      start.setHours(horaInicio, minutosInicio, 0);

      const end = new Date(fechaEvento);
      end.setHours(horaFin, minutosFin, 0);

      // Retornar el evento formateado
      return {
        id: horario.id,
        title: `${horario.curso} - ${horario.aula}`,
        start,
        end,
        extendedProps: {
          curso: horario.curso,
          docente: horario.docente,
          aula: horario.aula,
          seccion: horario.seccion
        },
        backgroundColor: color,
        borderColor: color
      };
    });
  }

  // Obtener la fecha de inicio de la semana actual (lunes)
  static obtenerFechaInicioSemana(): Date {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0 = domingo, 1 = lunes, ...
    const diff = hoy.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1); // ajuste cuando hoy es domingo

    const inicioSemana = new Date(hoy.setDate(diff));
    inicioSemana.setHours(0, 0, 0, 0);

    return inicioSemana;
  }

  // Exportar horario a Excel con diseño visual mejorado
  static exportarHorarioAExcel(horarios: HorarioDto[], tipo: string, nombre: string): void {
  try {
    // Validar que hay horarios para exportar
    if (!horarios || horarios.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No hay datos para exportar',
        text: 'Por favor, asegúrate de que hay horarios disponibles para exportar.',
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    // Paleta de colores para diferentes cursos/materias
    const coloresCursos = [
      { bg: "E8F5E8", border: "4CAF50", text: "1B5E20" }, // Verde
      { bg: "E3F2FD", border: "2196F3", text: "0D47A1" }, // Azul
      { bg: "FFF3E0", border: "FF9800", text: "E65100" }, // Naranja
      { bg: "F3E5F5", border: "9C27B0", text: "4A148C" }, // Púrpura
      { bg: "FFEBEE", border: "F44336", text: "B71C1C" }, // Rojo
      { bg: "E0F2F1", border: "009688", text: "004D40" }, // Teal
      { bg: "FFF8E1", border: "FFC107", text: "F57F17" }, // Amarillo
      { bg: "FAFAFA", border: "607D8B", text: "263238" }, // Gris
    ];

    // Agrupar horarios por día de la semana
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const horariosPorDia: Record<string, HorarioDto[]> = {};
    dias.forEach(dia => horariosPorDia[dia] = []);

    // Obtener cursos únicos para asignar colores consistentes
    const cursosUnicos = [...new Set(horarios.map(h => h.curso))];
    const colorPorCurso: Record<string, any> = {};
    cursosUnicos.forEach((curso, index) => {
      colorPorCurso[curso] = coloresCursos[index % coloresCursos.length];
    });

    // Agrupar horarios por día
    horarios.forEach(horario => {
      const dia = indexToDiaSemana[diaSemanaToIndex[horario.diaSemana]];
      if (dia) {
        horariosPorDia[dia].push(horario);
      }
    });

    // Crear datos para la hoja
    const data: any[] = [];

    // Título principal
    data.push([
      {
        v: `HORARIO ${tipo.toUpperCase()} - ${nombre.toUpperCase()}`,
        s: {
          font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "1565C0" } },
          alignment: { horizontal: "center", vertical: "center" }
        }
      },
      '', '', '', '', '', ''
    ]);

    // Fila vacía
    data.push(['', '', '', '', '', '', '']);

    // Procesar cada día
    dias.forEach(dia => {
      const items = horariosPorDia[dia].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

      if (items.length > 0) {
        // Encabezado del día
        data.push([
          {
            v: `📅 ${dia.toUpperCase()}`,
            s: {
              font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
              fill: { fgColor: { rgb: "424242" } },
              alignment: { horizontal: "center", vertical: "center" }
            }
          },
          { v: '', s: { fill: { fgColor: { rgb: "424242" } } } },
          { v: '', s: { fill: { fgColor: { rgb: "424242" } } } },
          { v: '', s: { fill: { fgColor: { rgb: "424242" } } } },
          { v: '', s: { fill: { fgColor: { rgb: "424242" } } } },
          { v: '', s: { fill: { fgColor: { rgb: "424242" } } } },
          { v: '', s: { fill: { fgColor: { rgb: "424242" } } } }
        ]);

        // Encabezados de columnas para este día
        const headers = ['⏰ Horario', '📚 Curso', '👨‍🏫 Docente', '🏫 Aula', '📋 Sección', '📊 Detalles'];
        data.push(headers.map(header => ({
          v: header,
          s: {
            font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "37474F" } },
            alignment: { horizontal: "center", vertical: "center" }
          }
        })));

        // Filas de horarios (estilo card, con estilos compatibles)
        items.forEach((horario, index) => {
          const color = colorPorCurso[horario.curso];
          const isEven = index % 2 === 0;
          const bgColor = isEven ? color.bg : "FFFFFF";

          // Solo propiedades ampliamente soportadas
          const cardStyle: any = {
            font: { name: "Arial", sz: 10, color: { rgb: color.text } },
            fill: { fgColor: { rgb: bgColor } },
            alignment: { horizontal: "center", vertical: "center" }
            // Los bordes se omiten por compatibilidad con SheetJS community
          };

          data.push([
            { v: `${horario.horaInicio.substring(0, 5)} - ${horario.horaFin.substring(0, 5)}`, s: { ...cardStyle, font: { ...cardStyle.font, bold: true } } },
            { v: horario.curso, s: { ...cardStyle, font: { ...cardStyle.font, bold: true, sz: 11 } } },
            { v: horario.docente, s: cardStyle },
            { v: horario.aula, s: { ...cardStyle, font: { ...cardStyle.font, bold: true } } },
            { v: horario.seccion, s: cardStyle },
            { v: `${calcularDuracion(horario.horaInicio, horario.horaFin)} min`, s: { ...cardStyle, font: { ...cardStyle.font, italic: true, sz: 9 } } }
          ]);
        });

        // Fila de resumen del día
        const totalClases = items.length;
        const totalMinutos = items.reduce((total, horario) =>
          total + calcularDuracion(horario.horaInicio, horario.horaFin), 0
        );

        data.push([
          {
            v: `📊 Resumen: ${totalClases} clases - ${Math.floor(totalMinutos / 60)}h ${totalMinutos % 60}min`,
            s: {
              font: { bold: true, sz: 10, color: { rgb: "37474F" } },
              fill: { fgColor: { rgb: "F5F5F5" } },
              alignment: { horizontal: "center", vertical: "center" }
            }
          },
          { v: '', s: { fill: { fgColor: { rgb: "F5F5F5" } } } },
          { v: '', s: { fill: { fgColor: { rgb: "F5F5F5" } } } },
          { v: '', s: { fill: { fgColor: { rgb: "F5F5F5" } } } },
          { v: '', s: { fill: { fgColor: { rgb: "F5F5F5" } } } },
          { v: '', s: { fill: { fgColor: { rgb: "F5F5F5" } } } }
        ]);

        // Espaciador entre días
        data.push(['', '', '', '', '', '', '']);
      }
    });

    // Leyenda de colores
    if (cursosUnicos.length > 0) {
      data.push([
        {
          v: '🎨 LEYENDA DE COLORES POR CURSO',
          s: {
            font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "FF6F00" } },
            alignment: { horizontal: "center", vertical: "center" }
          }
        },
        '', '', '', '', '', ''
      ]);

      cursosUnicos.forEach(curso => {
        const color = colorPorCurso[curso];
        data.push([
          {
            v: `■ ${curso}`,
            s: {
              font: { bold: true, sz: 10, color: { rgb: color.text } },
              fill: { fgColor: { rgb: color.bg } }
            }
          },
          '', '', '', '', '', ''
        ]);
      });
    }

    // Crear hoja y libro
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Horario Visual');

    // Configurar anchos de columna optimizados
    ws['!cols'] = [
      { wch: 18 }, // Horario
      { wch: 35 }, // Curso
      { wch: 25 }, // Docente
      { wch: 12 }, // Aula
      { wch: 15 }, // Sección
      { wch: 12 }, // Detalles
      { wch: 5 }   // Extra
    ];

    // Configurar altura de filas
    ws['!rows'] = data.map(() => ({ hpx: 25 }));

    // Merge cells para título principal
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } } // Título principal
    ];

    // Merge cells para encabezados de días y leyenda
    let mergeRow = 2;
    if (!ws['!merges']) ws['!merges'] = [];

    dias.forEach(dia => {
      const items = horariosPorDia[dia];
      if (items.length > 0) {
        ws['!merges']!.push({ s: { r: mergeRow, c: 0 }, e: { r: mergeRow, c: 6 } });
        mergeRow += items.length + 4;
      }
    });

    // Merge para leyenda
    if (cursosUnicos.length > 0) {
      const legendStart = data.length - cursosUnicos.length - 1;
      ws['!merges']!.push({ s: { r: legendStart, c: 0 }, e: { r: legendStart, c: 6 } });
    }

    // Configurar impresión
    ws['!margins'] = { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 };
    ws['!pageSetup'] = {
      paperSize: 9, // A4
      orientation: 'landscape',
      scale: 85,
      fitToWidth: 1,
      fitToHeight: 0
    };

    // Guardar archivo
    const fechaActual = new Date().toISOString().split('T')[0];
    const fileName = `Horario_Visual_${tipo}_${nombre}_${fechaActual}.xlsx`;
    XLSX.writeFile(wb, fileName);

    // Mostrar mensaje de éxito
    console.log(`✅ Horario exportado exitosamente: ${fileName}`);
    Swal.fire({
      icon: 'success',
      title: 'Horario Exportado',
      text: `El horario ha sido exportado exitosamente.`,
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 2000});

  } catch (error) {
    console.error('❌ Error al exportar a Excel:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al Exportar',
      text: `Ocurrió un error al exportar el horario. Por favor, verifica que los datos sean correctos.`,
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 2000});
  }
}
}