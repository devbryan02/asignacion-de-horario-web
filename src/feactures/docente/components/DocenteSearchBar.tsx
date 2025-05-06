import { Search, X, Info } from 'lucide-react';

interface DocenteSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  itemCount: number;
  startIndex: number;
  endIndex: number;
}

export default function DocenteSearchBar({ 
  searchQuery, 
  onSearchChange,
  itemCount,
  startIndex,
  endIndex
}: DocenteSearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
      <div className="w-full md:w-72 lg:w-80">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar docente por nombre..."
            className="w-full h-10 pl-10 pr-10 rounded-md border border-base-300 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50">
            <Search size={16} />
          </div>
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-base-200 hover:bg-base-300 transition-colors text-base-content/70 hover:text-base-content"
              onClick={() => onSearchChange('')}
              aria-label="Limpiar búsqueda"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 bg-base-200/60 rounded-md border border-base-300/50 text-sm self-start md:self-auto">
        <Info size={14} className="text-primary/70" />
        <span className="text-base-content/70">
          Mostrando <span className="font-medium text-base-content">{itemCount === 0 ? 0 : startIndex + 1}-{endIndex}</span> de <span className="font-medium text-base-content">{itemCount}</span> {itemCount === 1 ? 'docente' : 'docentes'}
        </span>
      </div>
    </div>
  );
}