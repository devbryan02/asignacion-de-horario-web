import { CursoResponse } from '@/types/response/CursoResponse';
import { Clock, Book, Pencil, Trash2, Search, AlertCircle, Award, Building, Loader2 } from 'lucide-react';
import { formatTipoCurso, getTipoBadgeColor } from '../utils/formatters';
import { useMemo } from 'react';

interface CursoTableContentProps {
  isLoading: boolean;
  cursos: CursoResponse[];
  onEdit?: (curso: CursoResponse) => void;
  onDelete?: (id: string) => void;
}

export default function CursoTableContent({ 
  isLoading, 
  cursos, 
  onEdit, 
  onDelete 
}: CursoTableContentProps) {
  // Función para obtener color para unidad académica
  const getUnidadColor = (unidad: string | undefined) => {
    if (!unidad) return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
    
    // Hash simple para convertir el nombre de la unidad en un color consistente
    const hash = Array.from(unidad).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const colors = [
      "bg-indigo-50 border border-indigo-200 text-indigo-700",
      "bg-purple-50 border border-purple-200 text-purple-700",
      "bg-pink-50 border border-pink-200 text-pink-700",
      "bg-rose-50 border border-rose-200 text-rose-700",
      "bg-emerald-50 border border-emerald-200 text-emerald-700",
      "bg-cyan-50 border border-cyan-200 text-cyan-700",
      "bg-teal-50 border border-teal-200 text-teal-700",
      "bg-sky-50 border border-sky-200 text-sky-700",
    ];
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Memoizar los colores de unidad para evitar recálculos innecesarios
  const unidadColors = useMemo(() => {
    const colors: Record<string, string> = {};
    
    cursos.forEach(curso => {
      if (curso.unidadAcademica && !colors[curso.unidadAcademica]) {
        colors[curso.unidadAcademica] = getUnidadColor(curso.unidadAcademica);
      }
    });
    
    return colors;
  }, [cursos]);

  // Función para obtener el ícono según el tipo
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'TEORICO':
        return <Award size={14} className="text-blue-600" />;
      case 'LABORATORIO':
        return <Building size={14} className="text-amber-600" />;
      default:
        return <Book size={14} className="text-gray-500" />;
    }
  };

  const getTipoBadgeStyle = (tipo: string) => {
    switch (tipo) {
      case 'TEORICO':
        return "bg-blue-50 border border-blue-200 text-blue-700";
      case 'LABORATORIO':
        return "bg-amber-50 border border-amber-200 text-amber-700";
      default:
        return "bg-gray-50 border border-gray-200 text-gray-700";
    }
  };

  return (
    <div className="overflow-hidden border border-base-300 rounded-lg">
      <div className="overflow-x-auto">
        <div className="max-h-[450px] overflow-y-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-base-200/70 border-b border-base-300">
                <th className="text-left py-3 px-4 font-medium text-base-content/80">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-base-content/80">Horas Semanales</th>
                <th className="text-left py-3 px-4 font-medium text-base-content/80">Tipo</th>
                <th className="text-left py-3 px-4 font-medium text-base-content/80">Unidad Académica</th>
                <th className="text-right py-3 px-4 font-medium text-base-content/80">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 size={24} className="text-primary animate-spin" />
                      <p className="text-sm text-base-content/60">Cargando cursos...</p>
                    </div>
                  </td>
                </tr>
              ) : cursos.length > 0 ? (
                cursos.map((curso) => (
                  <tr 
                    key={curso.id} 
                    className="border-b border-base-200 hover:bg-base-100/80 transition-colors"
                  >
                    <td className="py-3 px-4 text-base-content font-medium">{curso.nombre}</td>
                    
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-base-content">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock size={14} className="text-primary" />
                        </div>
                        <span>{curso.horasSemanales} <span className="text-base-content/70">hrs/sem</span></span>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getTipoBadgeStyle(curso.tipo)}`}>
                        {getTipoIcon(curso.tipo)}
                        {formatTipoCurso(curso.tipo)}
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      {curso.unidadAcademica ? (
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${unidadColors[curso.unidadAcademica] || getUnidadColor(curso.unidadAcademica)}`}>
                          <Book size={12} />
                          <span className="truncate max-w-[150px]">{curso.unidadAcademica}</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-base-200/50 text-xs font-medium text-base-content/60">
                          Sin asignar
                        </span>
                      )}
                    </td>
                    
                    <td className="py-2 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-1.5 rounded-md bg-info/10 text-info hover:bg-info/20 transition-colors"
                          title="Editar curso"
                          onClick={() => onEdit && onEdit(curso)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button 
                          className="p-1.5 rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors"
                          title="Eliminar curso"
                          onClick={() => onDelete && onDelete(curso.id)}
                        >
                          <Trash2 size={15} />
                        </button>
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
                      <p className="text-sm text-base-content/60 font-medium">No se encontraron cursos</p>
                      <p className="text-xs text-base-content/50">Intente cambiar los filtros o agregar un nuevo curso</p>
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