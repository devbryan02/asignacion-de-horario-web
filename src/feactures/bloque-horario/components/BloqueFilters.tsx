import { Search, Filter, X } from 'lucide-react';

interface BloqueFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  turnoFilter: string | null;
  onTurnoFilterChange: (turno: string | null) => void;
  availableTurnos: string[];
  filteredCount: number;
  totalCount: number;
}

function BloqueFilters({
  searchTerm,
  onSearchChange,
  turnoFilter,
  onTurnoFilterChange,
  availableTurnos,
}: BloqueFiltersProps) {

  // Manejar el cambio en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  // Limpiar la búsqueda
  const clearSearch = () => {
    onSearchChange('');
  };

  // Manejar el cambio de filtro de turno
  const handleTurnoChange = (turno: string) => {
    // If the turno is already selected (case-insensitive), deselect it
    if (turnoFilter && turnoFilter.toLowerCase() === turno.toLowerCase()) {
      onTurnoFilterChange(null);
    } else {
      onTurnoFilterChange(turno);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
      {/* Barra de búsqueda mejorada */}
      <div className="relative w-full md:w-[320px] group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 group-focus-within:text-primary transition-colors duration-200">
          <Search size={18} strokeWidth={2} />
        </div>

        <input
          type="text"
          placeholder="Buscar por día o turno..."
          className="input input-bordered pl-10 pr-8 w-full bg-base-100/80 hover:bg-base-100 focus:bg-base-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-base-content/40"
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Buscar bloques"
        />

        {searchTerm && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-base-300/70 hover:bg-base-300 text-base-content/60 hover:text-base-content/80 flex items-center justify-center transition-all duration-200 hover:scale-110"
            onClick={clearSearch}
            aria-label="Limpiar búsqueda"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filtros por turno */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <span className="text-xs font-medium flex items-center gap-1 text-primary bg-primary/5 py-1 px-2 rounded">
          <Filter className="h-3 w-3" />
          Filtros:
        </span>

        <div className="flex gap-1 flex-wrap">
          {availableTurnos.map(turno => (
            <button
              key={turno}
              className={`btn btn-xs h-7 min-h-0 ${turnoFilter === turno
                  ? 'bg-gradient-to-r from-primary to-primary-focus text-white border-0 shadow-sm'
                  : 'btn-outline border-primary/40 hover:bg-primary/10 text-primary'
                }`}
              onClick={() => handleTurnoChange(turno)}
            >
              {turno}
            </button>
          ))}

          {turnoFilter && (
            <button
              className="btn btn-xs btn-ghost text-primary hover:bg-primary/10 h-7 min-h-0"
              onClick={() => onTurnoFilterChange(null)}
            >
              <X size={12} /> Limpiar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BloqueFilters;