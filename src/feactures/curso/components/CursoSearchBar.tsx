interface CursoSearchBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    itemCount: number;
    startIndex: number;
    endIndex: number;
  }
  
  export default function CursoSearchBar({ 
    searchQuery, 
    onSearchChange, 
    itemCount, 
    startIndex, 
    endIndex 
  }: CursoSearchBarProps) {
    return (
      <div className="flex justify-between items-center">
        <div className="form-control w-[300px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar curso..."
              className="input input-bordered w-full pr-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-xs"
                onClick={() => onSearchChange('')}
              >
                ×
              </button>
            )}
          </div>
        </div>
  
        <div className="text-sm text-gray-500">
          Mostrando {itemCount === 0 ? 0 : startIndex + 1}-{endIndex} de {itemCount} cursos
        </div>
      </div>
    );
  }