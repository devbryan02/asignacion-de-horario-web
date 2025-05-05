import { Aula } from '@/types/AulaResponse';
import { Pencil,School, Trash2, BookOpen,Computer ,Loader2 } from 'lucide-react';
// Necesitas importar este icono al principio del archivo


interface AulaTableContentProps {
  isLoading: boolean;
  aulas: Aula[];
  onEdit?: (aula: Aula) => void;
  onDelete?: (aulaId: string) => void;
}

export default function AulaTableContent({ 
  isLoading, 
  aulas,
  onEdit,
  onDelete
}: AulaTableContentProps) {
  // Función para formatear el tipo de aula
  const formatTipoAula = (tipo: string) => {
    switch (tipo) {
      case "TEORICO": 
        return "Aula teórica";
      case "LABORATORIO":
        return "Laboratorio";
      default:
        return tipo;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "TEORICO":
        return <BookOpen size={14} />;
      case "LABORATORIO":
        return <Computer size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border border-base-300 overflow-hidden">
      <div className="max-h-[500px] overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-base-200 border-b border-base-300">
              <th className="py-3 px-4 text-sm font-semibold text-base-content/80 text-left">Nombre</th>
              <th className="py-3 px-4 text-sm font-semibold text-base-content/80 text-left">Capacidad</th>
              <th className="py-3 px-4 text-sm font-semibold text-base-content/80 text-left">Tipo</th>
              <th className="py-3 px-4 text-sm font-semibold text-base-content/80 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-10">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 size={24} className="text-primary animate-spin mb-2" />
                    <span className="text-sm text-base-content/70">Cargando aulas...</span>
                  </div>
                </td>
              </tr>
            ) : aulas.length > 0 ? (
              aulas.map((aula) => (
                <tr 
                  key={aula.id} 
                  className="hover:bg-base-200/50 transition-colors duration-150"
                >
                  <td className="py-3 px-4 text-sm text-base-content">{aula.nombre}</td>
                  <td className="py-3 px-4 text-sm text-base-content">
                    <div className="font-medium">{aula.capacidad}</div>
                    <div className="text-xs text-base-content/60">estudiantes</div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className={`
                      inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium 
                      ${aula.tipo === 'TEORICO' 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'bg-secondary/10 text-secondary border border-secondary/20'
                      }
                    `}>
                      {getTipoIcon(aula.tipo)}
                      {formatTipoAula(aula.tipo)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        className="p-1.5 rounded-md bg-info/10 text-info hover:bg-info/20 transition-colors"
                        onClick={() => onEdit?.(aula)}
                        aria-label="Editar aula"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        className="p-1.5 rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors"
                        onClick={() => onDelete?.(aula.id)}
                        aria-label="Eliminar aula"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-12">
                  <div className="flex flex-col items-center justify-center text-base-content/70">
                    <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-3">
                      <School size={24} className="text-base-content/30" />
                    </div>
                    <p className="font-medium mb-1">No se encontraron aulas</p>
                    <p className="text-sm text-base-content/60">Intenta con otra búsqueda o agrega una nueva aula</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
