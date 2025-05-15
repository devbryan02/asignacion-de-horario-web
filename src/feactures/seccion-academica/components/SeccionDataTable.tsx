"use client";

import { useSecciones } from '../hooks/useSecciones';
import SeccionTableHeader from './SeccionTableHeader';
import SeccionSearchBar from './SeccionSearchBar';
import SeccionTableContent from './SeccionTableContent';
import SeccionPagination from './SeccionPagination';
import AgregarSeccionModal from './AgregarSeccionModal';
import EditarSeccionModal from './EditarSeccionModal';

export default function SeccionDataTable() {
  const {
    currentItems,
    isLoading,
    searchQuery,
    currentPage,
    totalPages,
    filteredSecciones,
    indexOfFirstItem,
    indexOfLastItem,
    seccionToEdit,
    isEditModalOpen,
    isAddModalOpen,
    handleSearchChange,
    clearSearch,
    paginate,
    handleEditSeccion,
    handleCreateSeccion,
    handleUpdateSeccion,
    handleDeleteSeccion,
    setIsEditModalOpen,
    setIsAddModalOpen,
    loadSecciones
  } = useSecciones();

  return (
    <div className="overflow-hidden rounded-lg p-4 bg-base-100 border border-base-300 shadow-sm">
      <SeccionTableHeader 
        onOpenAddModal={() => setIsAddModalOpen(true)} 
      />

      <div className="flex flex-col gap-4 mb-6">
        <SeccionSearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
          itemCount={filteredSecciones.length}
          startIndex={indexOfFirstItem}
          endIndex={Math.min(indexOfLastItem, filteredSecciones.length)}
        />
      </div>

      <SeccionTableContent 
        isLoading={isLoading} 
        secciones={currentItems}
        onEdit={handleEditSeccion}
        onDelete={handleDeleteSeccion}
      />

      <div className="mt-4">
        <SeccionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
          totalItems={filteredSecciones.length}
        />
      </div>
      
      {/* Modal para agregar sección */}
      <AgregarSeccionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreateSeccion={handleCreateSeccion}
      />
      
      {/* Modal para editar sección */}
      {isEditModalOpen && seccionToEdit && (
        <EditarSeccionModal 
          seccion={seccionToEdit}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateSeccion={handleUpdateSeccion}
        />
      )}
    </div>
  );
}