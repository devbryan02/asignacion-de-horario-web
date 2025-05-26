import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Renombrado para ser más genérico y reutilizable
export default function Pagination({ 
  currentPage, 
  totalPages,
  onPageChange 
}: PaginationProps) {
  if (totalPages <= 1) return null;
  
  // Esta función se mantiene aquí porque es específica de la visualización UI
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Lógica para mostrar subconjunto de páginas
      pageNumbers.push(1);
      
      if (currentPage > 3) {
        pageNumbers.push('...');
      }
      
      let startPage: number, endPage: number;
      
      if (currentPage <= 3) {
        startPage = 2;
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(totalPages - 3, 2);
        endPage = totalPages - 1;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1) {
          pageNumbers.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }
      
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex justify-center items-center gap-1 mt-4">
      <button
        className="h-8 w-8 rounded-md flex items-center justify-center text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors disabled:opacity-40 disabled:pointer-events-none"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} />
      </button>

      {pageNumbers.map((page, index) => (
        page === '...' ? (
          <div 
            key={`ellipsis-${index}`} 
            className="h-8 w-8 flex items-center justify-center text-base-content/60"
          >
            &hellip;
          </div>
        ) : (
          <button
            key={`page-${page}`}
            className={`h-8 w-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
              currentPage === page 
                ? 'bg-primary text-primary-content' 
                : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
            }`}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </button>
        )
      ))}

      <button
        className="h-8 w-8 rounded-md flex items-center justify-center text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors disabled:opacity-40 disabled:pointer-events-none"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}