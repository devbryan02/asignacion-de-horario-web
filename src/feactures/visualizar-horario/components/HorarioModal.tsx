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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-base-100 rounded-xl shadow-lg w-full max-w-sm overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with course color */}
        <div className="relative h-20 flex items-end p-4" style={{ backgroundColor: colorCurso, opacity: 0.9 }}>
          <h3 className="text-white font-bold text-lg">{cursoSeleccionado.curso}</h3>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Time info */}
          <div className="flex gap-3">
            <Clock className="text-primary w-5 h-5 mt-1" />
            <div>
              <p className="font-medium text-sm">
                {getNombreDia(cursoSeleccionado.diaIndex, diasSemana)}, {formatTime(cursoSeleccionado.horaInicio)} - {formatTime(cursoSeleccionado.horaFin)}
              </p>
              <p className="text-xs opacity-70">
                {calcularDuracion(cursoSeleccionado.horaInicio, cursoSeleccionado.horaFin)}
              </p>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex gap-3">
            <MapPin className="text-secondary w-5 h-5 mt-0.5" />
            <p className="text-sm">{cursoSeleccionado.aula}</p>
          </div>
          
          {/* Professor */}
          <div className="flex gap-3">
            <User className="text-success w-5 h-5 mt-0.5" />
            <p className="text-sm">{cursoSeleccionado.docente}</p>
          </div>
          
          {/* Section */}
          <div className="flex gap-3">
            <BookOpen className="text-warning w-5 h-5 mt-0.5" />
            <p className="text-sm">{cursoSeleccionado.seccion}</p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-base-200 p-4 flex justify-end">
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};