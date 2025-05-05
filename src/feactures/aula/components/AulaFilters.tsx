import { FilterX, CheckSquare, Filter } from "lucide-react";
import { FilterTypes } from "../hooks/useAula";

interface AulaFiltersProps {
  filterTypes: FilterTypes;
  onFilterChange: (type: keyof FilterTypes) => void;
  onClearFilters: () => void;
}

export default function AulaFilters({ 
  filterTypes, 
  onFilterChange, 
  onClearFilters 
}: AulaFiltersProps) {
  const hasActiveFilters = filterTypes.teorico || filterTypes.laboratorio;
  const activeCount = [filterTypes.teorico, filterTypes.laboratorio].filter(Boolean).length;

  return (
    <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center rounded bg-primary/10">
            <Filter size={14} className="text-primary" />
          </div>
          <h3 className="text-sm font-medium text-base-content">Filtrar por tipo</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-base-content/70 hover:bg-base-200 transition-colors"
            onClick={onClearFilters}
          >
            <FilterX size={12} />
            <span>Limpiar {activeCount > 1 ? `(${activeCount})` : ''}</span>
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3">
        <label 
          className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
            filterTypes.teorico 
              ? 'bg-primary/10 border border-primary/20' 
              : 'bg-base-200/50 border border-transparent hover:bg-base-200'
          }`}
        >
          <div className={`w-4 h-4 flex items-center justify-center ${filterTypes.teorico ? 'text-primary' : 'text-base-content/40'}`}>
            <CheckSquare size={16} className={filterTypes.teorico ? 'opacity-100' : 'opacity-0'} />
          </div>
          <input
            type="checkbox"
            className="hidden"
            checked={filterTypes.teorico}
            onChange={() => onFilterChange('teorico')}
          />
          <span className={`text-sm ${filterTypes.teorico ? 'font-medium text-primary' : 'text-base-content/80'}`}>
            Aulas Teóricas
          </span>
        </label>

        <label 
          className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
            filterTypes.laboratorio 
              ? 'bg-primary/10 border border-primary/20' 
              : 'bg-base-200/50 border border-transparent hover:bg-base-200'
          }`}
        >
          <div className={`w-4 h-4 flex items-center justify-center ${filterTypes.laboratorio ? 'text-primary' : 'text-base-content/40'}`}>
            <CheckSquare size={16} className={filterTypes.laboratorio ? 'opacity-100' : 'opacity-0'} />
          </div>
          <input
            type="checkbox"
            className="hidden"
            checked={filterTypes.laboratorio}
            onChange={() => onFilterChange('laboratorio')}
          />
          <span className={`text-sm ${filterTypes.laboratorio ? 'font-medium text-primary' : 'text-base-content/80'}`}>
            Laboratorios
          </span>
        </label>
      </div>
      
      {hasActiveFilters && (
        <div className="mt-2 text-xs text-base-content/60">
          {activeCount === 1 
            ? 'Mostrando aulas con 1 filtro aplicado'
            : `Mostrando aulas con ${activeCount} filtros aplicados`
          }
        </div>
      )}
    </div>
  );
}