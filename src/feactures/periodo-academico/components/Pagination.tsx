"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PeriodoPagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages,
  onPageChange 
}) => {
  // Si solo hay una página, no mostramos la paginación
  if (totalPages <= 1) return null;
  
  // Función para generar el array de números de página a mostrar
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 5; // Máximo de páginas a mostrar
    
    if (totalPages <= maxPagesToShow) {
      // Si hay pocas páginas, mostramos todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Siempre mostramos la primera página
      pageNumbers.push(1);
      
      let startPage: number, endPage: number;
      
      if (currentPage <= 3) {
        // Si estamos en las primeras páginas
        startPage = 2;
        endPage = 4;
        pageNumbers.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Si estamos en las últimas páginas
        pageNumbers.push('...');
        startPage = totalPages - 3;
        endPage = totalPages - 1;
        pageNumbers.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
        pageNumbers.push(totalPages);
      } else {
        // Si estamos en páginas intermedias
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex justify-center items-center gap-1 mt-4">
      {/* Botón página anterior */}
      <button
        className="h-8 w-8 rounded-md flex items-center justify-center text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors disabled:opacity-40 disabled:pointer-events-none"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} />
      </button>
      
      {/* Números de página */}
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
            className={`h-8 min-w-[2rem] px-2 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
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
      
      {/* Botón página siguiente */}
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
};