"use client";

import { useEffect } from 'react';
import BloqueHeader from './BloqueHearder';
import BloqueFilters from './BloqueFilters';
import BloquesCard from './BloquesCard';
import BloquePagination from './BloquePagination';
import { useBloques } from '../hooks/useBloques';

function BloqueContent() {
  const { refreshBloques } = useBloques();

  // Cargar los bloques cuando el componente se monta
  useEffect(() => {
    refreshBloques();
  }, [refreshBloques]);

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="bg-base-100  rounded-lg shadow-sm">
        {/* Encabezado con título y botón de agregar */}
        <BloqueHeader />
        
        {/* Filtros de búsqueda y por turno */}
        <div className="p-4">
          <BloqueFilters />
        </div>
        
        {/* Contenido principal - Cards de bloques */}
        <div className="bg-base-200 min-h-[60vh]">
          <BloquesCard />
        </div>
        
        {/* Paginación */}
        <div className="p-4">
          <BloquePagination />
        </div>
      </div>
    </div>
  );
}

export default BloqueContent;