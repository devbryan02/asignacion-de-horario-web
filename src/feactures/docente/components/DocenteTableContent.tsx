import { Docente } from '@/types/response/DocenteResponse';
import { Clock, Pencil, Trash2 } from 'lucide-react';
import AgregarRestriccionModal from './AgregarRestriccionModal';

interface DocenteTableContentProps {
  isLoading: boolean;
  docentes: Docente[];
  onRestriccionCreated: () => void;
}

export default function DocenteTableContent({ 
  isLoading, 
  docentes,
  onRestriccionCreated
}: DocenteTableContentProps) {
  return (
    <div className="overflow-x-auto">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="table w-full">
          <thead className="sticky top-0 bg-base-100">
            <tr>
              <th className="font-medium text-base-content">Nombre</th>
              <th className="font-medium text-base-content">Horas Contratadas</th>
              <th className="font-medium text-base-content">Máx. Horas/Día</th>
              <th className="font-medium text-base-content">Restricciones</th>
              <th className="font-medium text-base-content">Acción</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center">
                  <span className="loading loading-spinner loading-md"></span>
                </td>
              </tr>
            ) : docentes.length > 0 ? (
              docentes.map((docente) => (
                <tr key={docente.id} className="hover">
                  <td className="text-base-content font-medium">{docente.nombre}</td>
                  <td className="text-base-content">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-500" />
                      {docente.horasContratadas} hrs
                    </div>
                  </td>
                  <td className="text-base-content">{docente.horasMaximasPorDia} hrs/día</td>
                  <td className="text-base-content">
                    <div className="flex flex-wrap gap-1">
                      {docente.restricciones.length > 0 ? (
                        <span className="badge badge-sm">
                          {docente.restricciones.length} {docente.restricciones.length === 1 ? 'restricción' : 'restricciones'}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Sin restricciones</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-info">
                        <Pencil size={16} />
                      </button>
                      <button className="btn btn-sm btn-error">
                        <Trash2 size={16} />
                      </button>
                      <AgregarRestriccionModal
                        docenteId={docente.id}
                        docenteNombre={docente.nombre}
                        onRestriccionCreated={onRestriccionCreated}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-base-content">
                  No se encontraron docentes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}