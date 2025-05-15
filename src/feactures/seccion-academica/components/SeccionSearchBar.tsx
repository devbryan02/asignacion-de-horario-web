import { Search, X } from 'lucide-react';

interface SeccionSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  itemCount: number;
  startIndex: number;
  endIndex: number;
}

export default function SeccionSearchBar({ 
  searchQuery, 
  onSearchChange, 
  onClearSearch,
  itemCount,
  startIndex,
  endIndex
}: SeccionSearchBarProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="relative max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-base-content/50" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar secciones..."
          className="input input-bordered pl-10 pr-10 w-full"
        />
        {searchQuery && (
          <button
            onClick={onClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-base-content/50 hover:text-base-content" />
          </button>
        )}
      </div>
      
      <div className="text-sm text-base-content/70 min-w-[200px] text-right">
        {itemCount === 0 ? (
          <span>No hay secciones</span>
        ) : (
          <span>
            Mostrando <span className="font-medium">{startIndex + 1}-{endIndex}</span> de{" "}
            <span className="font-medium">{itemCount}</span> secciones
          </span>
        )}
      </div>
    </div>
  );
}