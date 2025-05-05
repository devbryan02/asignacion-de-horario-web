"use client";

import { useCursos } from '../hooks/useCursos';
import CursoTableHeader from './CursoTableHeader';
import CursoSearchBar from './CursoSearchBar';
import CursoFilters from './CursoFilters';
import CursoTableContent from './CursoTableContent';
import CursoPagination from './CursoPagination';

export default function CursoDataTable() {
  const {
    currentItems,
    isLoading,
    searchQuery,
    filterTipo,
    currentPage,
    totalPages,
    filteredCursos,
    indexOfFirstItem,
    indexOfLastItem,
    loadCursos,
    handleFilterChange,
    handleSearchChange,
    clearFilters,
    paginate,
  } = useCursos();

  return (
    <div className="overflow-hidden rounded p-4 bg-base-100 border border-gray-300">
      <CursoTableHeader onCursoCreated={loadCursos} />

      <div className="flex flex-col gap-4 mb-6">
        <CursoSearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          itemCount={filteredCursos.length}
          startIndex={indexOfFirstItem}
          endIndex={Math.min(indexOfLastItem, filteredCursos.length)}
        />
        
        <CursoFilters
          filterTipo={filterTipo}
          searchQuery={searchQuery}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
      </div>

      <CursoTableContent isLoading={isLoading} cursos={currentItems} />

      <CursoPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginate}
      />
    </div>
  );
}