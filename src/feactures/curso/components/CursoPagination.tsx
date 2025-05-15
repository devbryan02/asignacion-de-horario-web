import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface CursoPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CursoPagination({ 
  currentPage, 
  totalPages,
  onPageChange 
}: CursoPaginationProps) {
  if (totalPages <= 1) return null;
  
  // Función para generar el rango de páginas a mostrar
  const getPageRange = (): (number | 'ellipsis')[] => {
    const maxButtons = 5; // Número máximo de botones numéricos
    
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Siempre mostrar primera y última página
    const pages: (number | 'ellipsis')[] = [1];
    
    // Cálculo del rango central
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Ajustes para mantener el tamaño del rango
    if (currentPage <= 3) {
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(totalPages - 3, 2);
    }
    
    // Añadir ellipsis inicial si es necesario
    if (startPage > 2) {
      pages.push('ellipsis');
    }
    
    // Añadir el rango central
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Añadir ellipsis final si es necesario
    if (endPage < totalPages - 1) {
      pages.push('ellipsis');
    }
    
    // Añadir la última página si hay más de una página
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageRange = getPageRange();
  
  return (
    <div className="flex justify-center items-center gap-1 mt-6">
      {/* Botón anterior */}
      <button
        className="w-9 h-9 flex items-center justify-center rounded-md border border-base-300 bg-base-100 text-base-content/80 transition-colors hover:bg-base-200 disabled:opacity-50 disabled:hover:bg-base-100"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Botones de página */}
      <div className="flex items-center gap-1">
        {pageRange.map((page, index) => 
          page === 'ellipsis' ? (
            <div 
              key={`ellipsis-${index}`} 
              className="w-9 h-9 flex items-center justify-center text-base-content/60"
            >
              <MoreHorizontal size={16} />
            </div>
          ) : (
            <button
              key={`page-${page}`}
              className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                currentPage === page 
                  ? 'bg-primary text-white hover:bg-primary/90 shadow-sm' 
                  : 'border border-base-300 bg-base-100 text-base-content/80 hover:bg-base-200'
              }`}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              aria-label={`Ir a página ${page}`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Botón siguiente */}
      <button
        className="w-9 h-9 flex items-center justify-center rounded-md border border-base-300 bg-base-100 text-base-content/80 transition-colors hover:bg-base-200 disabled:opacity-50 disabled:hover:bg-base-100"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}