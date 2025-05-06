import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DocentePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

export default function DocentePagination({ 
  currentPage, 
  totalPages,
  onPageChange,
  totalItems
}: DocentePaginationProps) {
  if (totalItems === 0) return null;

  // Determinar qué páginas mostrar (para evitar mostrar demasiados botones)
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 5) {
      // Si hay 5 páginas o menos, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Si hay más de 5 páginas, mostrar un rango inteligente
      if (currentPage <= 3) {
        // Cerca del inicio: 1, 2, 3, 4, ..., totalPages
        pageNumbers.push(1, 2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Cerca del final: 1, ..., totalPages-3, totalPages-2, totalPages-1, totalPages
        pageNumbers.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // En medio: 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
        pageNumbers.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex flex-col items-center gap-3 mt-6 sm:flex-row sm:justify-between">
      <div className="text-sm text-base-content/70">
        Mostrando <span className="font-medium text-base-content">{Math.min(totalItems, 10)}</span> elementos de <span className="font-medium text-base-content">{totalItems}</span>
      </div>
      
      <div className="flex items-center">
        <button
          className="w-9 h-9 flex items-center justify-center rounded-md text-base-content/70 hover:bg-base-200 transition-colors disabled:opacity-40 disabled:pointer-events-none disabled:hover:bg-transparent"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1 px-1">
          {pageNumbers.map((page, index) => (
            page === 'ellipsis' ? (
              <div key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-base-content/60">
                &#8230;
              </div>
            ) : (
              <button
                key={index}
                className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-all ${
                  currentPage === page 
                    ? 'bg-primary text-primary-content shadow-sm' 
                    : 'text-base-content/80 hover:bg-base-200'
                }`}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          className="w-9 h-9 flex items-center justify-center rounded-md text-base-content/70 hover:bg-base-200 transition-colors disabled:opacity-40 disabled:pointer-events-none disabled:hover:bg-transparent"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}