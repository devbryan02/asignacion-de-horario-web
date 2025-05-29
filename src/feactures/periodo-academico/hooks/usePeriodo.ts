import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  fetchPeriodosAcademicos,
  createPeriodoAcademico,
  updatePeriodoAcademico,
  deletePeriodoAcademico
} from '../PeriodoAcademicaService';
import { PeriodoRequest, PeriodoAcademico } from '../types';
import Swal from 'sweetalert2';

export const usePeriodoAcademico = () => {
  const [periodos, setPeriodos] = useState<PeriodoAcademico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // Configurable
  
  // Filtrar periodos basado en término de búsqueda
  const filteredPeriodos = useMemo(() => {
    if (!searchTerm.trim()) return periodos;
    
    return periodos.filter(periodo => 
      periodo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [periodos, searchTerm]);
  
  // Calcular total de páginas
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredPeriodos.length / itemsPerPage));
  }, [filteredPeriodos, itemsPerPage]);
  
  // Asegurar que la página actual es válida
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);
  
  // Obtener elementos de la página actual
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredPeriodos.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredPeriodos, currentPage, itemsPerPage]);
  
  // Calcular índices para mostrar info de "mostrando X-Y de Z resultados"
  const indexOfFirstItem = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);
  
  const indexOfLastItem = useMemo(() => {
    return Math.min(indexOfFirstItem + itemsPerPage, filteredPeriodos.length);
  }, [indexOfFirstItem, itemsPerPage, filteredPeriodos.length]);
  
  // Handler para cambiar de página
  const onPageChange = useCallback((pageNumber: number) => {
    // Asegurar que la página es válida
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  }, [totalPages]);

  // Solo búsqueda por palabra
  const fetchPeriodos = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    setError(null);
    
    // Si se proporciona un nuevo término de búsqueda, actualizamos el estado
    if (searchQuery !== undefined) {
      setSearchTerm(searchQuery);
      // Resetear a la primera página cuando se busca
      setCurrentPage(1);
    }
    
    try {
      const response = await fetchPeriodosAcademicos();
      console.log("Periodos recibidos del servidor:", response);
      
      setPeriodos(response);
      return response;
    } catch (err) {
      setError('Error al obtener periodos académicos');
      console.error("Error en fetchPeriodos:", err);
      setPeriodos([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar periodos automáticamente al montar el componente
  useEffect(() => {
    fetchPeriodos('');
  }, []);

  const createPeriodo = useCallback(async (
    periodoData: PeriodoRequest,
    onSuccess?: () => void
  ) => {
    setLoading(true);
    try {
      const response = await createPeriodoAcademico(periodoData);
      await fetchPeriodos(); // Recargar la lista
      onSuccess?.();
      return response;
    } catch (err) {
      setError('Error al crear periodo académico');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchPeriodos]);

  const updatePeriodo = useCallback(async (
    id: string,
    periodoData: PeriodoRequest,
    onSuccess?: () => void
  ) => {
    setLoading(true);
    try {
      const response = await updatePeriodoAcademico(id, periodoData);
      await fetchPeriodos();
      onSuccess?.();
      return response;
    } catch (err) {
      setError('Error al actualizar periodo académico');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchPeriodos]);

  const deletePeriodo = useCallback(async (
    id: string,
    nombrePeriodo: string,
    onSuccess?: () => void
  ) => {
    // El resto de la función de eliminación se mantiene igual
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `Está a punto de eliminar el periodo académico <strong>${nombrePeriodo}</strong>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await deletePeriodoAcademico(id);
        await fetchPeriodos();
        Swal.fire({
          title: 'Eliminado',
          text: `El periodo académico ${nombrePeriodo} ha sido eliminado.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        onSuccess?.();
        return response;
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el periodo académico',
          icon: 'error'
        });
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    }
    return null;
  }, [fetchPeriodos]);

  // Función para actualizar el número de elementos por página
  const setPageSize = useCallback((newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Resetear a la primera página cuando cambie el tamaño
  }, []);

  return {
    // Datos básicos
    periodos,
    loading,
    error,
    
    // Búsqueda
    searchTerm,
    setSearchTerm,
    
    // Paginación
    currentPage,
    totalPages,
    itemsPerPage,
    onPageChange,
    setPageSize,
    currentItems,
    filteredPeriodos,
    indexOfFirstItem,
    indexOfLastItem,
    
    // Operaciones CRUD
    fetchPeriodos,
    createPeriodo,
    updatePeriodo,
    deletePeriodo
  };
};