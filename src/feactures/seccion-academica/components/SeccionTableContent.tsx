import { SeccionResponse } from '../types';
import { PlusCircle, Edit, Trash2, Calendar, Users, BookOpen, Clock } from 'lucide-react';
import { UUID } from 'crypto';

interface SeccionTableContentProps {
  isLoading: boolean;
  secciones: SeccionResponse[];
  onEdit: (seccion: SeccionResponse) => void;
  onDelete: (id: UUID, nombre: string) => void;
}

export default function SeccionTableContent({
  isLoading,
  secciones,
  onEdit,
  onDelete
}: SeccionTableContentProps) {
  // Función para mostrar un color aleatorio pero consistente para cada sección
  const getSectionColor = (nombre: string) => {
    const colors = ['#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#f39c12', '#1abc9c'];
    let sum = 0;
    for (let i = 0; i < nombre.length; i++) {
      sum += nombre.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  return (
    <div className="overflow-hidden border border-base-300 rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <div className="max-h-[450px] overflow-y-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-base-200 sticky top-0 z-10">
              <tr>
                <th className="py-2 px-4 text-left font-medium text-base-content/80">Nombre</th>
                <th className="py-2 px-4 text-left font-medium text-base-content/80">Periodo</th>
                <th className="py-2 px-4 text-left font-medium text-base-content/80">Estudiantes</th>
                <th className="py-2 px-4 text-left font-medium text-base-content/80">Fecha inicio</th>
                <th className="py-2 px-4 text-left font-medium text-base-content/80">Fecha fin</th>
                <th className="py-2 px-4 text-center font-medium text-base-content/80">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="border-b border-base-200">
                    <td className="py-3 px-4">
                      <div className="animate-pulse h-4 bg-base-300 rounded w-24"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="animate-pulse h-6 bg-base-300 rounded w-16"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="animate-pulse h-4 bg-base-300 rounded w-12"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="animate-pulse h-6 bg-base-300 rounded w-20"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-2">
                        <div className="animate-pulse h-8 bg-base-300 rounded w-16"></div>
                        <div className="animate-pulse h-8 bg-base-300 rounded w-16"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : secciones && secciones.length > 0 ? (
                secciones.map((seccion) => (
                  <tr
                    key={seccion.id}
                    className="border-b border-base-200 hover:bg-base-100/80 transition-colors"
                  >
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-md flex items-center justify-center text-white font-medium" 
                          style={{ backgroundColor: getSectionColor(seccion.nombre) }}
                        >
                          {seccion.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium">{seccion.nombre}</div>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="inline-flex items-center gap-1 p-1 px-2 bg-primary/10 text-primary rounded-lg text-xs">
                        <Calendar size={12} />Periodo {seccion.periodoAcademico}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="inline-flex items-center gap-1">
                        <Users size={14} className="text-base-content/60" />
                        <span>{Math.floor(Math.random() * 30) + 10}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="inline-flex items-center gap-1 p-1 px-2 bg-info/10 text-info rounded-lg text-xs">
                        <Clock size={12} />
                        {new Date(seccion.fechaInicio).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="inline-flex items-center gap-1 p-1 px-2 bg-info/10 text-info rounded-lg text-xs">
                        <Clock size={12} />
                        {new Date(seccion.fechaFin).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="p-1 inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs"
                          onClick={() => onEdit(seccion)}
                          title="Editar sección"
                        >
                          <Edit size={14} />
                          Editar
                        </button>

                        <button
                          className="p-1 inline-flex items-center gap-1 rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors text-xs"
                          onClick={() => onDelete(seccion.id, seccion.nombre)}
                          title="Eliminar sección"
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-base-content/60">
                    <div className="flex flex-col items-center justify-center">
                      <PlusCircle size={24} className="mb-2 opacity-60" />
                      <p>No hay secciones registradas</p>
                      <p className="text-xs mt-1">Agrega una sección para empezar</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}