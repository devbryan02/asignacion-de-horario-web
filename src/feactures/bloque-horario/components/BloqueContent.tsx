"use client";

import BloqueHeader from './BloqueHearder';
import BloqueFilters from './BloqueFilters';
import BloquesCard from './BloquesCard';
import { useBloques } from '../hooks/useBloques';

function BloqueContent() {

  const {
    filteredBloques,
    loading,
    error,
    searchTerm,
    turnoFilter,
    filteredCount,
    totalBloques,
    handleSearchChange,
    handleTurnoFilterChange,
    deleteBloque,
    availableTurnos,
    refreshBloques
  } = useBloques();

  // Cargar los bloques cuando el componente se monta


  return (
    <div className="container mx-auto max-w-7xl">
      <div className="bg-base-100 rounded-box shadow-sm">
        {/* Encabezado con título y botón de agregar */}
        <BloqueHeader
        onAddBloque={refreshBloques} />

        {/* Filtros de búsqueda y por turno */}
        <div className="p-4">
          <BloqueFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            turnoFilter={turnoFilter}
            onTurnoFilterChange={handleTurnoFilterChange}
            availableTurnos={availableTurnos}
            filteredCount={filteredCount}
            totalCount={totalBloques}
          />
        </div>

        {/* Contenido principal - Cards de bloques */}
        <div className="bg-base-100 min-h-[60vh]">
          <BloquesCard
            bloques={filteredBloques}
            loading={loading}
            error={error}
            deleteBloque={deleteBloque}
            onBloqueAdded={refreshBloques}
          />
        </div>

      </div>
    </div>
  );
}

export default BloqueContent;