import { useState, useEffect, useMemo } from "react";
import { CursoResponse } from "@/types/response/CursoResponse";
import { CursoRequest } from "@/types/request/CursoRequest";
import {
  fetchCursos,
  createCurso,
  updateCurso,
  deleteCurso,
  addSeccionesAndDocentesBulk as addSeccionesBulkService,
  CursoSeccionBulkRequest,
  RegistroResponse,
  ApiErrorDelete
} from "@/feactures/curso/CursoService";
import toast from "react-hot-toast";
import { UUID } from "crypto";
import Swal from "sweetalert2";

// Tipo para los filtros de tipo de curso
export type FilterTipo = {
  teorico: boolean;
  laboratorio: boolean;
};

export function useCursos() {
  // Estado para los cursos y operaciones
  const [cursos, setCursos] = useState<CursoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cursoEditando, setCursoEditando] = useState<CursoResponse | null>(null);

  // Estados para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTipo, setFilterTipo] = useState<FilterTipo>({
    teorico: false,
    laboratorio: false
  });

  // Cargar cursos al montar el componente
  useEffect(() => {
    loadCursos();
  }, []);

  // Función para cargar cursos
  const loadCursos = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCursos();
      setCursos(data);
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("No se pudieron cargar los cursos. Intente de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  // Memoizar cursos filtrados para evitar recálculos innecesarios
  const filteredCursos = useMemo(() => {
    return cursos.filter(curso => {
      // Filtro por búsqueda
      const matchesSearch = searchQuery === "" ||
        curso.nombre.toLowerCase().includes(searchQuery.toLowerCase()) 

      // Filtro por tipo
      const matchesTipo = (!filterTipo.teorico && !filterTipo.laboratorio) ||
        (filterTipo.teorico && curso.tipo === "TEORICO") ||
        (filterTipo.laboratorio && curso.tipo === "LABORATORIO");

      return matchesSearch && matchesTipo;
    });
  }, [cursos, searchQuery, filterTipo]);

  // Crear curso
  const handleCreateCurso = async (curso: CursoRequest): Promise<CursoResponse> => {
    try {
      setIsLoading(true);
      const newCurso = await createCurso(curso);
      setCursos(prevCursos => [...prevCursos, newCurso]);
      //refrescar la lista de cursos
      await loadCursos();
      return newCurso;
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("No se pudo crear el curso. Intente de nuevo.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Editar curso
  const handleEditCurso = (curso: CursoResponse) => {
    setCursoEditando(curso);
  };

  // Actualizar curso
  const handleUpdateCurso = async (cursoId: UUID, cursoActualizado: CursoRequest) => {
    try {
      setIsLoading(true);
      const updated = await updateCurso(cursoId, cursoActualizado);
      setCursos(prevCursos =>
        prevCursos.map(c => c.id === cursoId ? updated : c)
      );
      await loadCursos();
      setCursoEditando(null);
      return updated;
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("No se pudo actualizar el curso. Intente de nuevo.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar curso
  const handleDeleteCurso = async (cursoId: UUID) => {
    // Confirmación de eliminación con SweetAlert2
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: "Esta acción no se puede deshacer. Se eliminará el curso y todas sus asignaciones.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsLoading(true);
      const response: ApiErrorDelete = await deleteCurso(cursoId);
      setCursos(prevCursos => prevCursos.filter(c => c.id !== cursoId));
      await loadCursos();
      if (response.error != "Internal Server Error") {
        toast.success("Curso eliminado correctamente.");
      } else {
        Swal.fire({
          icon: "error",
          title: "No se pudo eliminar el curso",
          html: `
          <p><i>${response.message}</i></p>
          <p>Para continuar, desvincula el curso de las secciones asociadas y vuelve a intentarlo.</p>`,
          confirmButtonText: "Entendido",
          confirmButtonColor: "#d33"
        });

      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("No se pudo eliminar el curso. Intente de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Parte del useCursos hook que maneja la asignación de secciones y docentes
const handleAsignarSeccionesBulk = async (
  cursoId: UUID, 
  seccionesIds: UUID[], 
  docenteId: UUID | null,
  modo: string
): Promise<RegistroResponse> => {
  try {
    // Solo enviar la solicitud si hay secciones seleccionadas
    if (seccionesIds.length === 0) {
      return {
        success: false,
        message: "Debes seleccionar al menos una sección"
      };
    }

    const request: CursoSeccionBulkRequest = {
      cursoId,
      seccionesIds,
      docenteId: docenteId || null as any, // Si no se seleccionó un docente, enviamos null
      modo: modo || "ASIGNAR" // ASIGNAR o DESASIGNAR
    };

    const result = await addSeccionesBulkService(request);
    
    if (result.success) {
      // Actualizar el estado si fue exitoso
      await fetchCursos();
    }
    
    return result;
  } catch (error) {
    console.error("Error en la asignación de secciones:", error);
    return {
      success: false,
      message: "Error al procesar la asignación de secciones"
    };
  }
};


  // Cambiar filtro de tipo
  const handleFilterChange = (tipoKey: keyof FilterTipo) => {
    setFilterTipo(prev => ({
      ...prev,
      [tipoKey]: !prev[tipoKey]
    }));
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    setSearchQuery("");
    setFilterTipo({ teorico: false, laboratorio: false });
  };

  // Manejador de cambio para la búsqueda
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return {
    cursos,
    filteredCursos,
    isLoading,
    cursoEditando,
    setCursoEditando,
    loadCursos,
    handleCreateCurso,
    handleEditCurso,
    handleUpdateCurso,
    handleDeleteCurso,
    handleAsignarSeccionesBulk,
    // Búsqueda y filtros
    searchQuery,
    handleSearchChange,
    filterTipo,
    handleFilterChange,
    clearFilters
  };
}