import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SeccionPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

export default function SeccionPagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems
}: SeccionPaginationProps) {
  
  if (totalItems === 0) return null;
  
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center">
      <div className="join">
        <button 
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>
        
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <button 
              key={index} 
              className={`join-item btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ) : (
            <button 
              key={index} 
              className="join-item btn btn-sm btn-disabled"
            >
              {page}
            </button>
          )
        ))}
        
        <button 
          className="join-item btn btn-sm"
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}