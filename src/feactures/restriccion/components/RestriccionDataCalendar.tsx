"use client";

import { UUID } from "crypto";
import { useRestricciones } from "../hooks/useRestricciones";
import RestriccionHeader from './RestriccionHeader';
import RestriccionDayCard from './RestriccionDayCard';
import { 
  RestriccionLoadingState, 
  RestriccionErrorState, 
  RestriccionEmptyDataState,
  RestriccionNoSelectionState
} from './RestriccionEmptyState';

interface RestriccionDataCalendarProps {
  initialDocenteId?: UUID;
}

function RestriccionDataCalendar({ initialDocenteId }: RestriccionDataCalendarProps) {
  const {
    docentes,
    filteredDocentes,
    searchQuery,
    isSelectOpen,
    selectedDocente,
    restricciones,
    isLoadingDocentes,
    isLoadingRestricciones,
    error,
    diasSemana,
    setIsSelectOpen,
    handleSelectDocente,
    getRestriccionesPorDia,
    handleSearchChange,
    clearSearch,
  } = useRestricciones(initialDocenteId);

  return (
    <div className="flex flex-col gap-6">
      <RestriccionHeader
        selectedDocente={selectedDocente}
        searchQuery={searchQuery}
        isSelectOpen={isSelectOpen}
        isLoadingDocentes={isLoadingDocentes}
        filteredDocentes={filteredDocentes}
        docentes={docentes}
        onSearchChange={handleSearchChange}
        onSelectDocente={handleSelectDocente}
        onClearSearch={clearSearch}
        onToggleSelect={(isOpen) => setIsSelectOpen(isOpen)}
      />

      {isLoadingRestricciones ? (
        <RestriccionLoadingState />
      ) : error ? (
        <RestriccionErrorState message={error} />
      ) : selectedDocente && restricciones.length === 0 ? (
        <RestriccionEmptyDataState docenteName={selectedDocente.nombre} />
      ) : selectedDocente ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {diasSemana.map((dia) => (
            <RestriccionDayCard
              key={dia}
              dia={dia}
              restricciones={getRestriccionesPorDia(dia)}
            />
          ))}
        </div>
      ) : (
        <RestriccionNoSelectionState />
      )}
    </div>
  );
}

export default RestriccionDataCalendar;