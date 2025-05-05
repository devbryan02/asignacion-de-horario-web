"use client";

import { useDocentes } from '../hooks/useDocentes';
import DocenteTableHeader from './DocenteTableHeader';
import DocenteSearchBar from './DocenteSearchBar';
import DocenteFilters from './DocenteFilters';
import DocenteTableContent from './DocenteTableContent';
import DocentePagination from './DocentePagination';

export default function DocenteDataTable() {
  const {
    currentItems,
    isLoading,
    searchQuery,
    filterHours,
    currentPage,
    totalPages,
    filteredDocentes,
    indexOfFirstItem,
    indexOfLastItem,
    loadDocentes,
    handleFilterChange,
    handleSearchChange,
    clearFilters,
    paginate,
  } = useDocentes();

  return (
    <div className="overflow-hidden rounded p-4 bg-base-100 border border-gray-300">
      <DocenteTableHeader onDocenteCreated={loadDocentes} />

      <div className="flex flex-col gap-4 mb-6">
        <DocenteSearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          itemCount={filteredDocentes.length}
          startIndex={indexOfFirstItem}
          endIndex={Math.min(indexOfLastItem, filteredDocentes.length)}
        />
        
        <DocenteFilters
          filterHours={filterHours}
          searchQuery={searchQuery}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
      </div>

      <DocenteTableContent 
        isLoading={isLoading} 
        docentes={currentItems}
        onRestriccionCreated={loadDocentes}
      />

      <DocentePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginate}
        totalItems={filteredDocentes.length}
      />
    </div>
  );
}