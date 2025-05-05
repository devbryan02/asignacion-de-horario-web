"use client";

import { useAulas } from '../hooks/useAula';
import AulaTableHeader from './AulaTableHearder';
import AulaSearchBar from './AulaSearchBar';
import AulaFilters from './AulaFilters';
import AulaTableContent from './AulaTableContent';
import AulaPagination from './AulaPagination';
import AulaResultsInfo from './AulaResultsInfo';

export default function AulaDataTable() {
  const {
    currentItems,
    isLoading,
    searchQuery,
    filterTypes,
    currentPage,
    totalPages,
    filteredAulas,
    indexOfFirstItem,
    indexOfLastItem,
    loadAulas,
    handleFilterChange,
    handleSearchChange,
    clearFilters,
    paginate,
  } = useAulas();

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <AulaTableHeader onAulaCreated={loadAulas} />
      </div>

      <div className="px-6">
        <div className="border-t border-base-200 pt-5 mb-6">
          {/* Nueva organización: primero filtro, luego buscador, luego info */}
          <div className="flex flex-col md:flex-row items-start gap-4">
            {/* Filtros primero */}
            <div className="w-full md:w-1/3 lg:w-2/5">
              <AulaFilters
                filterTypes={filterTypes}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
            
            {/* Contenedor para buscador e info en columna */}
            <div className="w-full md:w-2/3 lg:w-3/5 flex flex-col gap-3">
              {/* Buscador */}
              <div className="w-full">
                <AulaSearchBar 
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                />
              </div>
              
              {/* Info debajo del buscador */}
              <div className="self-start">
                <AulaResultsInfo
                  totalCount={filteredAulas.length}
                  startIndex={indexOfFirstItem}
                  endIndex={Math.min(indexOfLastItem, filteredAulas.length)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal de la tabla */}
        <div className="mb-6">
          <AulaTableContent 
            isLoading={isLoading} 
            aulas={currentItems} 
            onEdit={(aula) => console.log('Edit aula', aula)}
            onDelete={(id) => console.log('Delete aula', id)}
          />
        </div>

        {/* Paginación */}
        <div className="flex justify-center border-t border-base-200 pt-5 pb-2">
          <AulaPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />
        </div>
      </div>
    </div>
  );
}