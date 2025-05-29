"use client";

import { useAulas } from '../hooks/useAula';
import AulaTableHeader from './AulaTableHearder';
import AulaSearchBar from './AulaSearchBar';
import AulaFilters from './AulaFilters';
import AulaTableContent from './AulaTableContent';
import AulaPagination from './AulaPagination';
import AgregarAulaModal from './AgregarAulaModal';
import EditarAulaModal from './EditarAulaModal';

export default function AulaDataTable() {
  const {
    currentItems,
    isLoading,
    searchQuery,
    filterTypes,
    modalState,
    formData,
    currentPage,
    totalPages,
    handleFilterChange,
    handleSearchChange,
    clearFilters,
    onPageChange,
    openCreateModal,
    openUpdateModal,
    closeModal,
    handleInputChange,
    handleSubmit,
    handleDeleteAula,
  } = useAulas();

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <AulaTableHeader onCreateClick={openCreateModal} />
      </div>

      <div className="px-6">
        {/* Filtros y buscador en fila (responsive) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          {/* Filtros */}
          <div className="w-full md:flex-1">
            <AulaFilters
              filterTypes={filterTypes}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Buscador */}
          <div className="w-full md:flex-1">
            <AulaSearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </div>
        </div>


        {/* Tabla de contenido */}
        <div className="mb-4">
          <AulaTableContent
            isLoading={isLoading}
            aulas={currentItems}
            onAulaUpdated={openUpdateModal}
            onDelete={handleDeleteAula}
          />
        </div>

        {/* Paginación */}
        <div className="flex justify-center pt-0 pb-3">
          <AulaPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>

      {/* Modal para crear aula */}
      {modalState.type === 'create' && (
        <AgregarAulaModal
          isOpen={modalState.isOpen}
          isLoading={modalState.isLoading}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}

      {/* Modal para editar aula */}
      {modalState.type === 'update' && modalState.aula && (
        <EditarAulaModal
          isOpen={modalState.isOpen}
          isLoading={modalState.isLoading}
          formData={formData}
          aulaId={modalState.aula.id}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
