"use client";

import { useEffect, useState, useRef } from 'react';
import { Clock, BookOpen, MapPin, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VisualizarHorarioService, 
  HorarioDto,
  DiaSemana,
  diaSemanaToIndex 
} from '../VisualizarHorarioService';

interface VistaHorarioSemanalProps {
  modo: 'seccion' | 'docente' | 'periodo';
  id: string;
}

// Colores para diferentes asignaturas
const COLORES_CURSO: Record<string, string> = {
  default: '#4285F4',  // azul por defecto
};

// Horas a mostrar: 07:00 a 22:00
const HORAS_HORARIO = Array.from({ length: 16 }, (_, i) => {
  const hora = i + 7;
  return hora < 10 ? `0${hora}:00` : `${hora}:00`;
});

// Nombres de los días
const DIAS_SEMANA = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

// Para el cálculo de franjas horarias
interface FranjaHoraria {
  id: string;
  curso: string;
  docente: string;
  aula: string;
  seccion: string;
  diaIndex: number;
  inicioIndex: number; // Índice en HORAS_HORARIO
  finIndex: number;    // Índice en HORAS_HORARIO
  horaInicio: string;
  horaFin: string;
}

export default function VistaHorarioSemanal({ modo, id }: VistaHorarioSemanalProps) {
  const [horarios, setHorarios] = useState<HorarioDto[]>([]);
  const [franjas, setFranjas] = useState<FranjaHoraria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<FranjaHoraria | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [dimensionesTabla, setDimensionesTabla] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // Asignar colores consistentes a cada curso
  const getColorCurso = (curso: string) => {
    if (!COLORES_CURSO[curso]) {
      const coloresBase = [
        '#EA4335', // rojo
        '#4285F4', // azul
        '#FBBC05', // amarillo
        '#34A853', // verde
        '#00ACC1', // cyan
        '#AB47BC', // morado
        '#FF7043', // naranja
        '#5E35B1', // indigo
      ];
      const index = Object.keys(COLORES_CURSO).length % coloresBase.length;
      COLORES_CURSO[curso] = coloresBase[index];
    }
    return COLORES_CURSO[curso];
  };

  // Efecto para calcular dimensiones de la tabla después de renderizar
  useEffect(() => {
    if (!isLoading && !error && contenedorRef.current) {
      const actualizarDimensiones = () => {
        const tabla = contenedorRef.current?.querySelector('table');
        const thead = tabla?.querySelector('thead');
        
        if (tabla) {
          const rect = tabla.getBoundingClientRect();
          const theadHeight = thead?.getBoundingClientRect().height || 0;
          
          setDimensionesTabla({ 
            top: rect.top + window.scrollY + theadHeight, 
            left: rect.left + window.scrollX 
          });
        }
      };

      // Actualizar dimensiones al cargar y al cambiar tamaño de ventana
      actualizarDimensiones();
      window.addEventListener('resize', actualizarDimensiones);
      
      return () => {
        window.removeEventListener('resize', actualizarDimensiones);
      };
    }
  }, [isLoading, error]);

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
          finIndex: Math.max(inicioIndex, finIndex), // Para asegurarnos que finIndex no sea menor que inicioIndex
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin
        });
      }
    });

    setFranjas(nuevasFranjas);
  };

  // Renderizar las franjas fuera de la tabla para evitar problemas de hydration
  const renderizarFranjas = () => {
    // Altura de una celda normal
    const altoCelda = 64; // 16px × 4 = 64px
    // Altura del encabezado de la tabla (aproximado)
    const alturaHeader = 54;
    
    return franjas.map((franja) => {
      const duracionEnHoras = franja.finIndex - franja.inicioIndex + 1;
      const alturaTotal = duracionEnHoras * altoCelda;
      const colorCurso = getColorCurso(franja.curso);
      
      // Calcular posición vertical y horizontal
      const posicionFila = franja.inicioIndex * altoCelda;
      const posicionColumna = franja.diaIndex * 160 + 80; // 160px es el ancho de cada columna, 80px para la primera columna
      
      return (
        <motion.div
          key={`franja-${franja.id}`}
          className="absolute rounded-md p-2 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          style={{
            top: `${posicionFila}px`,
            left: `${posicionColumna + 4}px`, // 4px de padding
            width: '152px', // Ancho de celda - padding
            height: `${alturaTotal - 8}px`, // Altura según duración - padding
            backgroundColor: `${colorCurso}15`,
            borderLeft: `3px solid ${colorCurso}`,
            zIndex: 10
          }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setCursoSeleccionado(franja)}
        >
          <div className="font-semibold text-sm mb-1 truncate" style={{ color: colorCurso }}>
            {franja.curso}
          </div>
          <div className="flex items-center gap-1 text-xs text-base-content/80 truncate">
            <MapPin size={10} />
            <span>{franja.aula}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-base-content/70 truncate">
            <User size={10} />
            <span>{franja.docente}</span>
          </div>
          <div className="text-[10px] text-base-content/60 absolute bottom-1 right-2">
            {formatTime(franja.horaInicio)}-{formatTime(franja.horaFin)}
          </div>
        </motion.div>
      );
    });
  };

  // Formatear hora para mostrar (HH:MM)
  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  // Calcular el nombre del día a partir del índice
  const getNombreDia = (diaIndex: number) => {
    return DIAS_SEMANA[diaIndex] || '';
  };

  // Calcular la duración en horas y minutos
  const calcularDuracion = (horaInicio: string, horaFin: string) => {
    const [horaInicioStr, minutosInicioStr] = horaInicio.split(':');
    const [horaFinStr, minutosFinStr] = horaFin.split(':');
    
    const inicioMinutos = parseInt(horaInicioStr) * 60 + parseInt(minutosInicioStr);
    const finMinutos = parseInt(horaFinStr) * 60 + parseInt(minutosFinStr);
    
    const diferencia = finMinutos - inicioMinutos;
    const horas = Math.floor(diferencia / 60);
    const minutos = diferencia % 60;
    
    if (horas === 0) {
      return `${minutos} min`;
    } else if (minutos === 0) {
      return `${horas} h`;
    } else {
      return `${horas} h ${minutos} min`;
    }
  };

  return (
    <div className="bg-base-100 rounded-lg shadow-xl border border-base-200 overflow-hidden">
      {/* Cabecera con título según modo */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent px-6 py-5 border-b border-base-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {modo === 'seccion' && 'Horario de Sección'}
              {modo === 'docente' && 'Horario de Docente'}
              {modo === 'periodo' && 'Horario del Periodo Académico'}
            </h2>
            <p className="text-base-content/70 text-sm">
              Vista semanal de los horarios programados
            </p>
          </div>
        </div>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75"></div>
            <div className="relative rounded-full h-16 w-16 border-t-2 border-r-2 border-primary animate-spin"></div>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && !isLoading && (
        <div className="p-8">
          <div className="bg-error/10 text-error p-4 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Vista de horario semanal - CORREGIDO para evitar errores de hydration */}
      {!isLoading && !error && (
        <div className="p-4 overflow-x-auto relative" ref={contenedorRef}>
          <div className="relative"> {/* Contenedor para la tabla y las franjas horarias */}
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="py-3 px-2 bg-base-200/50 border-b border-r border-base-200 min-w-[80px]">Hora</th>
                  {DIAS_SEMANA.map((dia, index) => (
                    <th 
                      key={dia} 
                      className="py-3 px-1 text-center border-b border-r last:border-r-0 border-base-200 bg-base-200/50 min-w-[160px]"
                    >
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{/* Sin espacios ni comentarios aquí */}
                {HORAS_HORARIO.map((hora, horaIndex) => (
                  <tr key={hora} className={horaIndex % 2 === 0 ? 'bg-base-100' : 'bg-base-100/50'}>
                    <td className="text-sm py-2 px-3 border-r border-b border-base-200 font-medium text-center h-16">
                      {hora}
                    </td>
                    
                    {/* Celdas vacías para cada día de la semana */}
                    {[0, 1, 2, 3, 4, 5].map((diaIndex) => (
                      <td 
                        key={`${hora}-${diaIndex}`} 
                        className="p-1 border-r border-b last:border-r-0 border-base-200 h-16 align-top"
                      >
                        {/* Celda vacía */}
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Contenedor de posición absoluta para las franjas horarias */}
            <div className="absolute top-[54px] left-0 right-0 bottom-0 pointer-events-none">
              <div className="relative w-full h-full">
                {/* Franjas horarias con pointer-events habilitados */}
                {franjas.map((franja) => {
                  const duracionEnHoras = franja.finIndex - franja.inicioIndex + 1;
                  const alturaTotal = duracionEnHoras * 64; // 64px es la altura de cada celda
                  const colorCurso = getColorCurso(franja.curso);
                  
                  return (
                    <motion.div
                      key={`franja-${franja.id}`}
                      className="absolute rounded-md p-2 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      style={{
                        top: `${franja.inicioIndex * 64}px`,
                        left: `${franja.diaIndex * 160 + 84}px`,
                        width: '152px',
                        height: `${alturaTotal - 8}px`,
                        backgroundColor: `${colorCurso}15`,
                        borderLeft: `3px solid ${colorCurso}`,
                        zIndex: 10,
                        pointerEvents: 'auto'
                      }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setCursoSeleccionado(franja)}
                    >
                      <div className="font-semibold text-sm mb-1 truncate" style={{ color: colorCurso }}>
                        {franja.curso}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-base-content/80 truncate">
                        <MapPin size={10} />
                        <span>{franja.aula}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-base-content/70 truncate">
                        <User size={10} />
                        <span>{franja.docente}</span>
                      </div>
                      <div className="text-[10px] text-base-content/60 absolute bottom-1 right-2">
                        {formatTime(franja.horaInicio)}-{formatTime(franja.horaFin)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal con detalles del curso */}
      <AnimatePresence>
        {cursoSeleccionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-base-200/70 backdrop-blur-md  flex items-center justify-center z-50 px-4"
            onClick={() => setCursoSeleccionado(null)}
          >
            <motion.div
              className="bg-base-100 rounded-lg shadow-lg border border-base-200 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.3, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="relative">
                {/* Barra de color del curso */}
                <div 
                  className="absolute -top-6 -left-6 -right-6 h-16 rounded-t-lg"
                  style={{ backgroundColor: getColorCurso(cursoSeleccionado.curso), opacity: 0.2 }}
                ></div>
                
                {/* Título del curso */}
                <div className="relative z-10">
                  <div 
                    className="inline-block rounded-full px-4 py-1 mb-4 text-white"
                    style={{ backgroundColor: getColorCurso(cursoSeleccionado.curso) }}
                  >
                    <span className="font-semibold">{cursoSeleccionado.curso}</span>
                  </div>
                </div>
                
                {/* Detalles del curso */}
                <div className="grid gap-4 my-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="text-sm text-base-content/70">Horario</div>
                      <div className="font-medium">
                        {getNombreDia(cursoSeleccionado.diaIndex)}, {' '}
                        {formatTime(cursoSeleccionado.horaInicio)} - {formatTime(cursoSeleccionado.horaFin)}
                        <div className="text-xs text-base-content/60 mt-0.5">
                          Duración: {calcularDuracion(cursoSeleccionado.horaInicio, cursoSeleccionado.horaFin)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className="text-sm text-base-content/70">Aula</div>
                      <div className="font-medium">{cursoSeleccionado.aula}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 text-success rounded-lg">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="text-sm text-base-content/70">Docente</div>
                      <div className="font-medium">{cursoSeleccionado.docente}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 text-warning rounded-lg">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <div className="text-sm text-base-content/70">Sección</div>
                      <div className="font-medium">{cursoSeleccionado.seccion}</div>
                    </div>
                  </div>
                </div>
                
                {/* Botón para cerrar */}
                <div className="mt-6 flex justify-end">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setCursoSeleccionado(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}