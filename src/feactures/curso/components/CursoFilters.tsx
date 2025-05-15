import { FilterX, Filter } from "lucide-react";
import { FilterTipo } from "../hooks/useCursos";

interface CursoFiltersProps {
  filterTipo: FilterTipo;
  searchQuery: string;
  onFilterChange: (type: keyof FilterTipo) => void;
  onClearFilters: () => void;
}

export default function CursoFilters({
  filterTipo,
  searchQuery,
  onFilterChange,
  onClearFilters
}: CursoFiltersProps) {
  const hasActiveFilters = filterTipo.teorico || filterTipo.laboratorio || searchQuery;
  
  return (
    <div className="flex flex-wrap items-center gap-2 py-1">
      {/* Título de filtros */}
      <div className="flex items-center gap-1.5">
        <Filter size={14} className="text-base-content/70" />
        <span className="text-sm font-medium text-base-content/70">Filtros:</span>
      </div>
      
      {/* Botones de filtro */}
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => onFilterChange('teorico')}
          className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
            filterTipo.teorico 
              ? 'bg-primary/15 text-primary font-medium' 
              : 'bg-base-200/70 text-base-content/70 hover:bg-base-200'
          }`}
        >
          Teórico
        </button>

        <button 
          onClick={() => onFilterChange('laboratorio')}
          className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
            filterTipo.laboratorio 
              ? 'bg-secondary/15 text-secondary font-medium' 
              : 'bg-base-200/70 text-base-content/70 hover:bg-base-200'
          }`}
        >
          Laboratorio
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-base-200 text-base-content/60 hover:bg-base-300 transition-colors"
          >
            <FilterX size={12} />
            <span>Limpiar</span>
          </button>
        )}
        
        {searchQuery && (
          <span className="px-2.5 py-1 text-xs rounded-full bg-base-200/80 text-base-content/70">
            Búsqueda: <span className="font-medium">{searchQuery}</span>
          </span>
        )}
      </div>
    </div>
  );
}