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
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <h3 className="text-sm font-medium">Filtrar por tipo:</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={filterTipo.teorico}
              onChange={() => onFilterChange('teorico')}
            />
            <span className={`text-sm ${filterTipo.teorico ? 'font-medium text-primary' : ''}`}>
              Teórico
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={filterTipo.laboratorio}
              onChange={() => onFilterChange('laboratorio')}
            />
            <span className={`text-sm ${filterTipo.laboratorio ? 'font-medium text-primary' : ''}`}>
              Laboratorio
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
            {filterTipo.teorico && (
              <span className="badge badge-sm badge-primary">
                Teórico
              </span>
            )}
            {filterTipo.laboratorio && (
              <span className="badge badge-sm badge-secondary">
                Práctico
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}