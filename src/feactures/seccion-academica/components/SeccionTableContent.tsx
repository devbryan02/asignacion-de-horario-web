import { SeccionResponse } from '../types';
import { PlusCircle, Edit, Trash2, Calendar } from 'lucide-react';
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
  return (
    <div className="overflow-hidden border border-base-300 rounded-lg">
      <div className="overflow-x-auto">
        <div className="max-h-[450px] overflow-y-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-base-200 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-base-content/80">Nombre</th>
                <th className="py-3 px-4 text-left font-medium text-base-content/80">Periodo Académico</th>
                <th className="py-3 px-4 text-center font-medium text-base-content/80">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-base-content/60">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                      <span>Cargando secciones...</span>
                    </div>
                  </td>
                </tr>
              ) : secciones && secciones.length > 0 ? (
                secciones.map((seccion) => (
                  <tr
                    key={seccion.id}
                    className="border-b border-base-200 hover:bg-base-100/80 transition-colors"
                  >
                    <td className="py-2 px-4">
                      <div className="font-medium">{seccion.nombre}</div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="inline-flex items-center gap-1.5 p-1 px-2 bg-primary/10 text-primary rounded-lg">
                        <Calendar size={14} /> {seccion.periodoAcademico}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-1.5  inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          onClick={() => onEdit(seccion)}
                          title="Editar sección"
                        >
                          <Edit size={16} />
                          Editar
                        </button>

                        <button
                          className="p-1.5 inline-flex items-center gap-1 rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors"
                          onClick={() => onDelete(seccion.id, seccion.nombre)}
                          title="Eliminar sección"
                        >
                          <Trash2 size={16} />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-base-content/60">
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