import { FilterHours } from '../hooks/useDocentes';

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
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <h3 className="text-sm font-medium">Filtrar por horas:</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={filterHours.menos15}
              onChange={() => onFilterChange('menos15')}
            />
            <span className={`text-sm ${filterHours.menos15 ? 'font-medium text-primary' : ''}`}>
              Menos de 15 horas
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={filterHours.mas15}
              onChange={() => onFilterChange('mas15')}
            />
            <span className={`text-sm ${filterHours.mas15 ? 'font-medium text-primary' : ''}`}>
              15 horas o más
            </span>
          </label>

          {/* Botón para limpiar filtros */}
          {hasActiveFilters && (
            <button
              className="btn btn-xs btn-outline"
              onClick={onClearFilters}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Badges para mostrar filtros activos */}
      {hasActiveFilters && (
        <div className="flex gap-2 items-center">
          <span className="text-xs text-gray-500">Filtros activos:</span>
          <div className="flex gap-2 flex-wrap">
            {searchQuery && (
              <span className="badge badge-sm">
                Búsqueda: {searchQuery}
              </span>
            )}
            {filterHours.menos15 && (
              <span className="badge badge-sm badge-primary">
                &lt;15 horas
              </span>
            )}
            {filterHours.mas15 && (
              <span className="badge badge-sm badge-primary">
                ≥15 horas
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}