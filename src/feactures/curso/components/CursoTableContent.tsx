import { CursoResponse } from '@/types/response/CursoResponse';
import { Clock, Book, Pencil, Trash2 } from 'lucide-react';
import { formatTipoCurso,getTipoBadgeColor } from '../utils/formatters';

interface CursoTableContentProps {
  isLoading: boolean;
  cursos: CursoResponse[];
}

export default function CursoTableContent({ isLoading, cursos }: CursoTableContentProps) {
  return (
    <div className="overflow-x-auto">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="table w-full">
          <thead className="sticky top-0 bg-base-100">
            <tr>
              <th className="font-medium text-base-content">Nombre</th>
              <th className="font-medium text-base-content">Horas semanales</th>
              <th className="font-medium text-base-content">Tipo</th>
              <th className="font-medium text-base-content">Unidad académica</th>
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
            ) : cursos.length > 0 ? (
              cursos.map((curso) => (
                <tr key={curso.id} className="hover">
                  <td className="text-base-content font-medium">{curso.nombre}</td>
                  <td className="text-base-content">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-500" />
                      {curso.horasSemanales} hrs/sem
                    </div>
                  </td>
                  <td>
                    <div className={`badge ${getTipoBadgeColor(curso.tipo)}`}>
                      {formatTipoCurso(curso.tipo)}
                    </div>
                  </td>
                  <td className="text-base-content">
                    <div className="flex items-center gap-1">
                      <Book size={14} className="text-gray-500" />
                      {curso.unidadAcademica}
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
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-base-content">
                  No se encontraron cursos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}