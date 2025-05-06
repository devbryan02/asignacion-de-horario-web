import { FilterHours } from '../hooks/useDocentes';
import { Filter, X } from 'lucide-react';

interface DocenteFiltersProps {
  filterHours: FilterHours;
  searchQuery: string;
  onFilterChange: (type: keyof FilterHours) => void;
  onClearFilters: () => void;
}

export default function DocenteFilters({ 
  filterHours, 
  searchQuery, 
  onFilterChange, 
  onClearFilters 
}: DocenteFiltersProps) {
  const hasActiveFilters = filterHours.menos15 || filterHours.mas15 || searchQuery;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 text-base-content/80">
          <Filter size={16} className="text-primary/70" />
          <h3 className="text-sm font-medium">Filtrar por horas:</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={filterHours.menos15}
                onChange={() => onFilterChange('menos15')}
              />
              <div className="w-4 h-4 border rounded border-base-300 peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center text-primary-content scale-0 peer-checked:scale-100 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <span className={`text-sm transition-colors ${filterHours.menos15 ? 'font-medium text-primary' : 'group-hover:text-base-content/90'}`}>
              Menos de 15 horas
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={filterHours.mas15}
                onChange={() => onFilterChange('mas15')}
              />
              <div className="w-4 h-4 border rounded border-base-300 peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center text-primary-content scale-0 peer-checked:scale-100 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <span className={`text-sm transition-colors ${filterHours.mas15 ? 'font-medium text-primary' : 'group-hover:text-base-content/90'}`}>
              15 horas o más
            </span>
          </label>

          {/* Botón para limpiar filtros */}
          {hasActiveFilters && (
            <button
              className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md border border-base-300 hover:bg-base-200 text-base-content/70 hover:text-base-content transition-colors"
              onClick={onClearFilters}
            >
              <X size={12} />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Badges para mostrar filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center mt-1">
          <span className="text-xs text-base-content/60">Filtros activos:</span>
          <div className="flex gap-1.5 flex-wrap">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-base-200 text-xs font-medium text-base-content/80">
                Búsqueda: <span className="font-semibold text-base-content">{searchQuery}</span>
              </span>
            )}
            {filterHours.menos15 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-xs font-medium text-primary">
                &lt;15 horas
              </span>
            )}
            {filterHours.mas15 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-xs font-medium text-primary">
                ≥15 horas
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}