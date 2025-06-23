import axios from 'axios';

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
export const indexToDiaSemana = {
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

// Servicio para recuperar y transformar datos de horarios
export class VisualizarHorarioService {
  // Obtener horarios por sección
  static async obtenerHorariosPorSeccion(seccionID: string): Promise<HorarioDto[]> {
    try {
      const response = await axios.get(`${API_URL}/horarios/seccion/${seccionID}`,{
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
      const response = await axios.get(`${API_URL}/horarios/docente/${docenteID}`,{
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
      const response = await axios.get(`${API_URL}/horarios/periodo/${periodoID}`,{
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
}