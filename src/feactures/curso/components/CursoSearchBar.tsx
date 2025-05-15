import { Search, X, Database } from "lucide-react";

interface CursoSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  itemCount: number;
  startIndex: number;
  endIndex: number;
}

export default function CursoSearchBar({ 
  searchQuery, 
  onSearchChange, 
  itemCount, 
  startIndex, 
  endIndex 
}: CursoSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3  mt-3">
      {/* Barra de búsqueda */}
      <div className="relative w-full sm:w-[300px] group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 group-focus-within:text-primary transition-colors">
          <Search size={18} />
        </div>
        
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="input input-bordered pl-10 pr-8 w-full bg-base-100/80 hover:bg-base-100 focus:bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Buscar cursos"
        />
        
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-base-300/80 hover:bg-base-300 text-base-content/70 flex items-center justify-center transition-colors"
            onClick={() => onSearchChange('')}
            aria-label="Limpiar búsqueda"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center gap-2 text-xs font-medium text-base-content/60">
        <div className="w-5 h-5 rounded-full bg-base-200/80 flex items-center justify-center">
          <Database size={12} className="text-base-content/50" />
        </div>
        
        {itemCount > 0 ? (
          <span>
            Mostrando <span className="font-semibold text-base-content/80">{startIndex + 1}-{endIndex}</span> de{" "}
            <span className="font-semibold text-base-content/80">{itemCount}</span> cursos
          </span>
        ) : (
          <span>No se encontraron cursos</span>
        )}
      </div>
    </div>
  );
}