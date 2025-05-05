import { Search, X } from "lucide-react";

interface AulaSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function AulaSearchBar({ 
  searchQuery, 
  onSearchChange
}: AulaSearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search size={18} className="text-base-content/40" />
      </div>
      
      <input
        type="text"
        placeholder="Buscar aulas por nombre..."
        className="w-full h-10 pl-10 pr-10 rounded-lg border border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      {searchQuery && (
        <button 
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/40 hover:text-base-content transition-colors"
          onClick={() => onSearchChange('')}
          aria-label="Limpiar búsqueda"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}