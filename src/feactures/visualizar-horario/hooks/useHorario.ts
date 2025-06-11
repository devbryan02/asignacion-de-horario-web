import { useState, useEffect } from 'react';
import { 
  VisualizarHorarioService, 
  HorarioDto,
  diaSemanaToIndex 
} from '../VisualizarHorarioService';

// Constantes compartidas
export const DIAS_SEMANA = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

export const HORAS_HORARIO = Array.from({ length: 16 }, (_, i) => {
  const hora = i + 7;
  return hora < 10 ? `0${hora}:00` : `${hora}:00`;
});

// Colores para diferentes asignaturas
export const COLORES_CURSO: Record<string, string> = {
  default: '#4285F4',  // azul por defecto
};

export interface FranjaHoraria {
  id: string;
  curso: string;
  docente: string;
  aula: string;
  seccion: string;
  diaIndex: number;
  inicioIndex: number;
  finIndex: number;
  horaInicio: string;
  horaFin: string;
}

export const useHorario = (modo: 'seccion' | 'docente' | 'periodo', id: string) => {
  const [horarios, setHorarios] = useState<HorarioDto[]>([]);
  const [franjas, setFranjas] = useState<FranjaHoraria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Asignar colores consistentes a cada curso
  const getColorCurso = (curso: string) => {
    if (!COLORES_CURSO[curso]) {
      const coloresBase = [
        '#EA4335', '#4285F4', '#FBBC05', '#34A853', 
        '#00ACC1', '#AB47BC', '#FF7043', '#5E35B1'
      ];
      const index = Object.keys(COLORES_CURSO).length % coloresBase.length;
      COLORES_CURSO[curso] = coloresBase[index];
    }
    return COLORES_CURSO[curso];
  };

  // Cargar datos de horarios
  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let resultado: HorarioDto[] = [];

        switch (modo) {
          case 'seccion':
            resultado = await VisualizarHorarioService.obtenerHorariosPorSeccion(id);
            break;
          case 'docente':
            resultado = await VisualizarHorarioService.obtenerHorariosPorDocente(id);
            break;
          case 'periodo':
            resultado = await VisualizarHorarioService.obtenerHorariosPorPeriodo(id);
            break;
        }

        // Asignar colores a los cursos
        resultado.forEach(horario => {
          getColorCurso(horario.curso);
        });

        setHorarios(resultado);
        procesarFranjasHorarias(resultado);
      } catch (err) {
        console.error('Error al cargar horarios:', err);
        setError('No se pudieron cargar los horarios. Intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      cargarHorarios();
    }
  }, [modo, id]);

  // Convertir horarios a franjas que ocupan múltiples celdas
  const procesarFranjasHorarias = (datos: HorarioDto[]) => {
    const nuevasFranjas: FranjaHoraria[] = [];

    datos.forEach(horario => {
      const diaIndex = diaSemanaToIndex[horario.diaSemana];
      
      if (diaIndex <= 5) { // Solo de lunes a sábado
        // Extracción de horas y minutos de inicio
        const [horaInicioStr, minutosInicioStr] = horario.horaInicio.split(':');
        const horaInicio = parseInt(horaInicioStr);
        const minutosInicio = parseInt(minutosInicioStr);
        
        // Extracción de horas y minutos de fin
        const [horaFinStr, minutosFinStr] = horario.horaFin.split(':');
        const horaFin = parseInt(horaFinStr);
        const minutosFin = parseInt(minutosFinStr);
        
        // Calculamos los índices de inicio y fin en nuestro array de horas
        const inicioIndex = Math.max(0, horaInicio - 7); // 7 es la hora base (07:00)
        let finIndex = horaFin - 7;
        
        // Ajustar fin: si la hora termina a las XX:00 exactas, consideramos que termina en la hora anterior
        if (minutosFin === 0 && finIndex > inicioIndex) {
          finIndex--;
        }
        
        // Crear la franja horaria
        nuevasFranjas.push({
          id: horario.id,
          curso: horario.curso,
          docente: horario.docente,
          aula: horario.aula,
          seccion: horario.seccion,
          diaIndex,
          inicioIndex,
          finIndex: Math.max(inicioIndex, finIndex),
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin
        });
      }
    });

    setFranjas(nuevasFranjas);
  };

  return {
    horarios,
    franjas,
    isLoading,
    error,
    getColorCurso,
    DIAS_SEMANA,
    HORAS_HORARIO
  };
};