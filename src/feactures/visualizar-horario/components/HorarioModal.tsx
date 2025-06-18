import React from 'react';
import { Clock, BookOpen, MapPin, User } from 'lucide-react';
import { FranjaHoraria } from '../hooks/useHorario';
import { formatTime, getNombreDia, calcularDuracion } from '../horarioUtlis';

interface HorarioModalProps {
  cursoSeleccionado: FranjaHoraria | null;
  getColorCurso: (curso: string) => string;
  diasSemana: string[];
  onClose: () => void;
}

export const HorarioModal: React.FC<HorarioModalProps> = ({ 
  cursoSeleccionado, 
  getColorCurso, 
  diasSemana,
  onClose 
}) => {
  if (!cursoSeleccionado) return null;

  const colorCurso = getColorCurso(cursoSeleccionado.curso);

  return (
      <div
        className="fixed inset-0 bg-base-200/70 backdrop-blur-md flex items-center justify-center z-50 px-4"
        onClick={onClose}
      >
        <div
          className="bg-base-100 rounded-lg shadow-lg border border-base-200 p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            {/* Barra de color del curso */}
            <div 
              className="absolute -top-6 -left-6 -right-6 h-16 rounded-t-lg"
              style={{ backgroundColor: colorCurso, opacity: 0.2 }}
            ></div>
            
            {/* Título del curso */}
            <div className="relative z-10">
              <div 
                className="inline-block rounded-full px-4 py-1 mb-4 text-white"
                style={{ backgroundColor: colorCurso }}
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
                    {getNombreDia(cursoSeleccionado.diaIndex, diasSemana)}, {' '}
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
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};