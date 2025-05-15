import { FilterX, CheckSquare, Filter } from "lucide-react";
import { FilterTypes } from "../hooks/useAula";

interface AulaFiltersProps {
  filterTypes: FilterTypes;
  onFilterChange: (type: keyof FilterTypes) => void;
  onClearFilters: () => void;
}

// Opciones de filtro predefinidas para facilitar la adición de nuevos tipos
const filterOptions = [
  { key: 'teorico' as const, label: 'Aulas Teóricas' },
  { key: 'laboratorio' as const, label: 'Laboratorios' },
];

export default function AulaFilters({ filterTypes, onFilterChange, onClearFilters }: AulaFiltersProps) {
  const hasActiveFilters = Object.values(filterTypes).some(Boolean);
  const activeCount = Object.values(filterTypes).filter(Boolean).length;

  return (
    <div className="bg-base-100 border border-base-300 rounded-lg p-3 shadow-sm">
      {/* Header con título y botón limpiar */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1.5">
          <Filter size={14} className="text-primary" />
          <h3 className="text-sm font-medium">Filtrar por tipo</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            className="text-xs flex items-center gap-1 py-1 px-1.5 rounded hover:bg-base-200 text-base-content/70"
            onClick={onClearFilters}
          >
            <FilterX size={12} />
            <span>Limpiar{activeCount > 1 ? ` (${activeCount})` : ''}</span>
          </button>
        )}
      </div>
      
      {/* Botones de filtro */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map(option => (
          <label 
            key={option.key}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md cursor-pointer ${
              filterTypes[option.key] 
                ? 'bg-primary/10 border border-primary/20' 
                : 'bg-base-200/50 border border-transparent hover:bg-base-200'
            }`}
          >
            <div className={filterTypes[option.key] ? 'text-primary' : 'text-base-content/40'}>
              <CheckSquare size={15} className={filterTypes[option.key] ? 'opacity-100' : 'opacity-0'} />
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={filterTypes[option.key]}
              onChange={() => onFilterChange(option.key)}
            />
            <span className={`text-sm ${filterTypes[option.key] ? 'font-medium text-primary' : ''}`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
      
      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-2 text-xs text-base-content/60">
          {`Mostrando aulas con ${activeCount} filtro${activeCount > 1 ? 's' : ''} aplicado${activeCount > 1 ? 's' : ''}`}
        </div>
      )}
    </div>
  );
}