import { DocenteResponse } from '@/types/response/DocenteResponse';
import { Clock, Pencil, Trash2, Calendar, Loader2, AlertCircle, User } from 'lucide-react';
import AgregarRestriccionModal from './AgregarRestriccionModal';
import { UUID } from 'crypto';

interface DocenteTableContentProps {
  isLoading: boolean;
  docentes: DocenteResponse[];
  onEdit: (docente: DocenteResponse) => void;
  onRestriccionCreated: () => void;
  onDelete: (id: UUID, nombre: string) => void;
}

export default function DocenteTableContent({
  isLoading,
  docentes,
  onEdit,
  onDelete,
  onRestriccionCreated
}: DocenteTableContentProps) {
  return (
    <div className="overflow-hidden border border-base-300 rounded-lg">
      <div className="overflow-x-auto">
        <div className="max-h-[450px] overflow-y-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-base-200/70 border-b border-base-300">
                <th className="text-left py-3 px-4 font-medium text-base-content/80">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-base-content/80">Horas Contratadas</th>
                <th className="text-left py-3 px-4 font-medium text-base-content/80">Máx. Horas/Día</th>
                <th className="text-left py-3 px-4 font-medium text-base-content/80">Restricciones</th>
                <th className="text-right py-3 px-4 font-medium text-base-content/80">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 size={24} className="text-primary animate-spin" />
                      <p className="text-sm text-base-content/60">Cargando docentes...</p>
                    </div>
                  </td>
                </tr>
              ) : docentes && docentes.length > 0 ? (
                docentes.map((docente) => (
                  <tr
                    key={docente.id}
                    className="border-b border-base-200 hover:bg-base-100/80 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-base-content">
                        <User size={16} className="inline-block items-center justify-center mr-2 text-primary" />
                        {docente.nombre}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-base-content">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock size={14} className="text-primary" />
                        </div>
                        <span>{docente.horasContratadas} <span className="text-base-content/70">hrs</span></span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-base-content">
                      <span>{docente.horasMaximasPorDia} <span className="text-base-content/70">hrs/día</span></span>
                    </td>
                    <td className="py-3 px-4">
                      {docente.restricciones && docente.restricciones.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700">
                          <Calendar size={12} />
                          {docente.restricciones.length} {docente.restricciones.length === 1 ? 'restricción' : 'restricciones'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-base-200/50 text-xs font-medium text-base-content/60">
                          Sin restricciones
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-1.5 rounded-md bg-info/10 text-info hover:bg-info/20 transition-colors"
                          title="Editar docente"
                          onClick={() => onEdit && onEdit(docente)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="p-1.5 rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors"
                          title="Eliminar docente"
                          onClick={() => onDelete && onDelete(docente.id, docente.nombre)}
                        >
                          <Trash2 size={15} />
                        </button>

                        {/* Componente AgregarRestriccionModal */}
                        <div className="w-8 h-8 flex items-center justify-center">
                          <AgregarRestriccionModal
                            docenteId={docente.id}
                            docenteNombre={docente.nombre}
                            onRestriccionCreated={onRestriccionCreated}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-base-200/80 flex items-center justify-center text-base-content/40">
                        <AlertCircle size={24} />
                      </div>
                      <p className="text-sm text-base-content/60 font-medium">No se encontraron docentes</p>
                      <p className="text-xs text-base-content/50">Intente cambiar los filtros o agregar un nuevo docente</p>
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