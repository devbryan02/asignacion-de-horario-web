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
  
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        className="btn btn-sm btn-ghost"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={20} />
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={`btn btn-sm ${currentPage === index + 1 ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      <button
        className="btn btn-sm btn-ghost"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}