import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AulaPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AulaPagination({ 
  currentPage, 
  totalPages,
  onPageChange 
}: AulaPaginationProps) {
  if (totalPages <= 1) return null;
  
  // Función para generar los números de página con elipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Siempre mostrar la primera página
      pageNumbers.push(1);
      
      // Calcular el rango de páginas alrededor de la actual
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Ajustar si estamos cerca del inicio
      if (currentPage <= 3) {
        endPage = 4;
      }
      
      // Ajustar si estamos cerca del final
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Añadir elipsis si es necesario
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Añadir páginas del medio
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Añadir elipsis si es necesario
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Siempre mostrar la última página
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex justify-center items-center gap-1 mt-6">
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