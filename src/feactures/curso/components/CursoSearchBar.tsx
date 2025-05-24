import { Search, X, Database, LayoutGrid } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      {/* Barra de búsqueda mejorada */}
      <div className="relative w-full sm:w-[320px] group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 group-focus-within:text-primary transition-colors duration-200">
          <Search size={18} strokeWidth={2} />
        </div>
        
        <input
          type="text"
          placeholder="Buscar cursos por nombre..."
          className="input input-bordered pl-10 pr-8 w-full bg-base-100/80 hover:bg-base-100 focus:bg-base-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-base-content/40"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Buscar cursos"
        />
        
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-base-300/70 hover:bg-base-300 text-base-content/60 hover:text-base-content/80 flex items-center justify-center transition-all duration-200 hover:scale-110"
            onClick={() => onSearchChange('')}
            aria-label="Limpiar búsqueda"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Contador de resultados con diseño mejorado */}
      <div className="flex items-center gap-2 text-xs font-medium text-base-content/60 bg-base-200/40 py-1.5 px-3 rounded-full shadow-sm">
        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
          <Database size={12} className="text-primary/80" />
        </div>
        
        {itemCount > 0 ? (
          <span>
            Mostrando <span className="font-semibold text-primary">{startIndex + 1}-{endIndex}</span> de{" "}
            <span className="font-semibold text-primary">{itemCount}</span> cursos
          </span>
        ) : (
          <span className="text-warning/80 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-warning"></div>
            No se encontraron cursos
          </span>
        )}
      </div>
    </div>
  );
}