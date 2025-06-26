"use client";

import { useState, useRef, useEffect } from 'react';
import { useHorario } from '../hooks/useHorario';
import { HorarioModal } from './HorarioModal';
import { MapPin, User } from "lucide-react";
import { formatTime } from "../horarioUtlis";
import { ExportarButton } from './ExportarButton';
import ExportButtonPDF from './ExportButtonPDF';

interface VistaHorarioSemanalProps {
  modo: 'seccion' | 'docente' | 'periodo';
  id: string;
}

export default function VistaHorarioSemanal({ modo, id }: VistaHorarioSemanalProps) {
  const {
    horarios,
    franjas,
    isLoading,
    error,
    getColorCurso,
    DIAS_SEMANA,
    HORAS_HORARIO
  } = useHorario(modo, id);

  const [cursoSeleccionado, setCursoSeleccionado] = useState<any>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [dimensionesTabla, setDimensionesTabla] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

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
          
          {/* Botón de exportar */}
          {!isLoading && !error && horarios.length > 0 && (
            <div>
              <ExportarButton 
                horarios={horarios} 
                tipo={modo} 
                nombre={id} 
              />
              <ExportButtonPDF 
                horarios={horarios} 
                tipo={modo} 
                nombre={id} 
                className="ml-2" />
            </div>
          )}
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

      {/* Vista de horario semanal */}
      {!isLoading && !error && (
        <div className="p-4 overflow-x-auto relative" ref={contenedorRef}>
          <div className="relative">
            {/* Tabla de horarios */}
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="py-3 px-2 bg-base-200/50 border-b border-r border-base-200 min-w-[80px]">Hora</th>
                  {DIAS_SEMANA.map((dia) => (
                    <th 
                      key={dia} 
                      className="py-3 px-1 text-center border-b border-r last:border-r-0 border-base-200 bg-base-200/50 min-w-[160px]"
                    >
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HORAS_HORARIO.map((hora, horaIndex) => (
                  <tr key={hora} className={horaIndex % 2 === 0 ? 'bg-base-100' : 'bg-base-100/50'}>
                    <td className="text-sm py-2 px-3 border-r border-b border-base-200 font-medium text-center h-16">
                      {hora}
                    </td>
                    
                    {[0, 1, 2, 3, 4, 5].map((diaIndex) => (
                      <td 
                        key={`${hora}-${diaIndex}`} 
                        className="p-1 border-r border-b last:border-r-0 border-base-200 h-16 align-top"
                      >
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
                {franjas.map((franja) => {
                  const duracionEnHoras = franja.finIndex - franja.inicioIndex + 1;
                  const alturaTotal = duracionEnHoras * 64; // 64px es la altura de cada celda
                  const colorCurso = getColorCurso(franja.curso);
                  
                  return (
                    <div
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
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal con detalles del curso */}
      {cursoSeleccionado && (
        <HorarioModal 
          cursoSeleccionado={cursoSeleccionado}
          getColorCurso={getColorCurso}
          diasSemana={DIAS_SEMANA}
          onClose={() => setCursoSeleccionado(null)}
        />
      )}
    </div>
  );
}