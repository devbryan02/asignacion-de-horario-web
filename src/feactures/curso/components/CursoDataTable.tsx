"use client";

import { useState, useEffect } from "react";
import { useCursos } from "@/feactures/curso/hooks/useCursos";
import CursoTableHeader from "@/feactures/curso/components/CursoTableHeader";
import CursoTableContent from "@/feactures/curso/components/CursoTableContent";
import AgregarCursoModal from "@/feactures/curso/components/AgregarCursoModal";
import AsignarSeccionesModal from "./AsignarSeccionModal";
import CursoPagination from "./CursoPagination";
import { CursoResponse } from "@/types/response/CursoResponse";
import { SeccionResponse } from "@/feactures/seccion-academica/types";
import { fetchSeccionAcademica } from "@/feactures/seccion-academica/SeccionAcademicaService";
import { fetchDocentes } from "@/feactures/docente/DocenteService"; // Importar función para cargar docentes
import { DocenteResponse } from "@/types/response/DocenteResponse";
import { UUID } from "crypto";
import { RegistroResponse } from "../CursoService";

export default function CursoDataTable() {
  // Usar el hook de cursos que proporciona toda la lógica de negocio
  const {
    filteredCursos,
    isLoading,
    cursoEditando,
    setCursoEditando,
    handleCreateCurso,
    handleDeleteCurso,
    handleEditCurso,
    handleUpdateCurso,
    handleAsignarSeccionesBulk,
    // Búsqueda y filtros
    searchQuery,
    handleSearchChange,
    filterTipo,
    handleFilterChange,
    clearFilters
  } = useCursos();

  // Estado para el modal de asignar secciones
  const [seccionesModalOpen, setSeccionesModalOpen] = useState(false);
  const [cursoParaSecciones, setCursoParaSecciones] = useState<CursoResponse | null>(null);
  const [secciones, setSecciones] = useState<SeccionResponse[]>([]);
  const [docentes, setDocentes] = useState<DocenteResponse[]>([]); // Nuevo estado para docentes
  const [loadingSecciones, setLoadingSecciones] = useState(false);

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calcular valores para la paginación
  const totalItems = filteredCursos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Items actuales a mostrar en la página
  const currentItems = filteredCursos.slice(startIndex, endIndex);

  // Resetear la página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterTipo]);

  // Cargar secciones y docentes cuando se abre el modal de asignación
  useEffect(() => {
    if (seccionesModalOpen) {
      const loadData = async () => {
        try {
          setLoadingSecciones(true);
          // Cargar datos en paralelo
          const [seccionesData, docentesData] = await Promise.all([
            fetchSeccionAcademica(),
            fetchDocentes() // Asegúrate de tener esta función en tu servicio de docentes
          ]);
          
          setSecciones(seccionesData);
          setDocentes(docentesData);
        } catch (error) {
          console.error("Error cargando datos para asignación:", error);
        } finally {
          setLoadingSecciones(false);
        }
      };

      loadData();
    }
  }, [seccionesModalOpen]);

  // Abrir modal de asignación de secciones
  const handleAsignarSecciones = (curso: CursoResponse) => {
    setCursoParaSecciones(curso);
    setSeccionesModalOpen(true);
  };

  // Manejador para filtros específicos (TEORICO/LABORATORIO)
  const handleFilterTipo = (tipo: string) => {
    if (tipo === "TEORICO") {
      handleFilterChange("teorico");
    } else if (tipo === "LABORATORIO") {
      handleFilterChange("laboratorio");
    }
  };

  // Realizar la asignación de secciones y docentes
  const handleAsignarSecciones2 = async (
    cursoId: UUID, 
    seccionIds: UUID[],
    docentId: UUID | null, 
    modo: string
  ): Promise<RegistroResponse> => {
    try {
      // Llamar directamente al método del hook con secciones y docentes
      const result = await handleAsignarSeccionesBulk(cursoId, seccionIds, docentId, modo);

      // El modal se cerrará automáticamente solo en caso de éxito
      if (result.success) {
        setSeccionesModalOpen(false);
        setCursoParaSecciones(null);
      }

      // Siempre devolvemos el resultado tal cual viene del hook
      return result;
    } catch (error) {
      console.error("Error inesperado al asignar:", error);

      // En caso de error no controlado, devolver un objeto de error
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error inesperado al asignar secciones y docentes"
      };
    }
  };

  return (
    <div className="container mx-auto bg-base-100 p-1 rounded-lg shadow-sm">
      {/* Header con título, búsqueda y filtros */}
      <CursoTableHeader
        onCursoCreated={handleCreateCurso}
        onSearch={handleSearchChange}
        searchValue={searchQuery}
        totalCursos={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onFilterTipo={handleFilterTipo}
        onClearFilters={clearFilters}
        filterActive={filterTipo.teorico || filterTipo.laboratorio}
        filterTipo={filterTipo.teorico ? "TEORICO" : filterTipo.laboratorio ? "LABORATORIO" : ""}
      />

      {/* Tabla de contenido de cursos */}
      <CursoTableContent
        cursos={currentItems}
        isLoading={isLoading}
        onEdit={handleEditCurso}
        onDelete={handleDeleteCurso}
        onAsignarSecciones={handleAsignarSecciones}
      />

      {/* Paginación */}
      {totalItems > itemsPerPage && (
        <div className="mt-6 flex justify-center">
          <CursoPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Modal de edición */}
      {cursoEditando && (
        <AgregarCursoModal
          isEdit
          cursoEditando={cursoEditando}
          onClose={() => setCursoEditando(null)}
          onCursoUpdated={handleUpdateCurso}
        />
      )}

      {/* Modal para asignar secciones */}
      {seccionesModalOpen && cursoParaSecciones && (
        <AsignarSeccionesModal
          isOpen={seccionesModalOpen}
          onClose={() => {
            setSeccionesModalOpen(false);
            setCursoParaSecciones(null);
          }}
          cursoId={cursoParaSecciones.id}
          cursoNombre={cursoParaSecciones.nombre}
          onAsignar={handleAsignarSecciones2}
          secciones={secciones}
          docentes={docentes}
          isLoading={loadingSecciones}
        />
      )}
    </div>
  );
}