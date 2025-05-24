import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface CursoPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

export default function CursoPagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 5
}: CursoPaginationProps) {
  // Si solo hay una página, no mostramos paginación
  if (totalPages <= 1) return null;
  
  // Función para obtener rango de páginas con mejor visualización
  const getPageRange = () => {
    // Mostrar máximo 5 números de página
    let startPage: number;
    let endPage: number;
    
    if (totalPages <= 5) {
      // Menos de 5 páginas, mostrar todas
      startPage = 1;
      endPage = totalPages;
    } else {
      // Más de 5 páginas, calcular rango centrado
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }
    
    // Crear array con los números de página
    const pages: (number | string)[] = [];
    
    // Agregar "primera página" si no estamos al inicio
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }
    
    // Agregar páginas centrales
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Agregar "última página" si no estamos al final
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pageRange = getPageRange();

  return (
    <div className="flex items-center justify-center gap-2 my-4">
      {/* Botones de navegación */}
      <div className="join shadow-sm">
        {/* Botón Primera página */}
        <button
          className="join-item btn btn-sm btn-outline"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="Primera página"
        >
          <ChevronsLeft size={16} />
        </button>
        
        {/* Botón Anterior */}
        <button
          className="join-item btn btn-sm btn-outline"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          title="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>
      </div>
      
      {/* Números de página */}
      <div className="join shadow-sm">
        {pageRange.map((page, index) => (
          typeof page === "number" ? (
            <button
              key={`page-${index}-${page}`}
              className={`join-item btn btn-sm ${
                page === currentPage ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ) : (
            <button 
              key={`ellipsis-${index}`} 
              className="join-item btn btn-sm btn-disabled btn-outline"
              tabIndex={-1}
            >
              {page}
            </button>
          )
        ))}
      </div>
      
      {/* Botones de navegación */}
      <div className="join shadow-sm">
        {/* Botón Siguiente */}
        <button
          className="join-item btn btn-sm btn-outline"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          title="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
        
        {/* Botón Última página */}
        <button
          className="join-item btn btn-sm btn-outline"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Última página"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
      
      {/* Información de página */}
      <div className="text-xs text-base-content/70 ml-2">
        Página <span className="font-medium text-base-content">{currentPage}</span> de{" "}
        <span className="font-medium text-base-content">{totalPages}</span>
      </div>
    </div>
  );
}