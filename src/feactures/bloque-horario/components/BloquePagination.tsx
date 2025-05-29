import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBloques } from '../hooks/useBloques';

function BloquePagination() {
  const { currentPage, totalPages, handlePageChange, filteredCount, totalBloques } = useBloques();

  // Si no hay páginas o solo hay una, no mostramos paginación
  if (totalPages <= 1) {
    return (
      <div className="py-4 text-center text-sm font-medium text-base-content/60 bg-gradient-to-r from-transparent via-base-200/40 to-transparent">
        {filteredCount > 0 ? (
          <span>Mostrando <span className="text-primary font-bold">{filteredCount}</span> de <span className="text-primary font-bold">{totalBloques}</span> bloques</span>
        ) : (
          <span>No se encontraron bloques</span>
        )}
      </div>
    );
  }

  // Calcular qué botones de página mostrar
  const getPageNumbers = () => {
    // Siempre mostrar la página actual y algunas páginas circundantes
    const delta = 1; // Cuántas páginas mostrar a cada lado de la actual
    const pages = [];
    
    // Siempre incluimos la primera página
    pages.push(1);
    
    // Calculamos el rango de páginas alrededor de la actual
    let start = Math.max(2, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);

    // Ajustamos si estamos cerca de los extremos
    if (currentPage - delta > 2) {
      pages.push('...'); // Ellipsis en lugar de muchas páginas
    }
    
    // Añadimos las páginas del rango
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Añadimos ellipsis si hay un salto a la última página
    if (currentPage + delta < totalPages - 1) {
      pages.push('...');
    }
    
    // Siempre incluimos la última página si hay más de una
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-5 px-4 border-t bg-gradient-to-r from-base-200/10 via-base-100 to-base-200/10">
      <div className="text-sm font-medium text-base-content/70 mb-4 sm:mb-0 bg-base-200/40 py-2 px-4 rounded-full shadow-inner">
        Mostrando <span className="text-primary font-bold">{filteredCount}</span> de <span className="text-primary font-bold">{totalBloques}</span> bloques
      </div>
      
      <div className="join shadow-md">
        {/* Botón anterior */}
        <button 
          className={`join-item btn btn-sm ${currentPage === 1 ? 'btn-disabled bg-base-200' : 'bg-base-100 hover:bg-base-200'}`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {/* Números de página */}
        {getPageNumbers().map((page, index) => 
          typeof page === 'number' ? (
            <button 
              key={index}
              className={`join-item btn btn-sm transition-all duration-200 ${
                currentPage === page 
                ? 'bg-gradient-to-r from-primary to-primary-focus text-primary-content font-bold shadow-md border-0' 
                : 'bg-base-100 hover:bg-base-200 text-base-content'
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ) : (
            <button 
              key={index}
              className="join-item btn btn-sm btn-disabled bg-base-200/50 text-base-content/50"
            >
              {page}
            </button>
          )
        )}
        
        {/* Botón siguiente */}
        <button 
          className={`join-item btn btn-sm ${currentPage === totalPages ? 'btn-disabled bg-base-200' : 'bg-base-100 hover:bg-base-200'}`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default BloquePagination;