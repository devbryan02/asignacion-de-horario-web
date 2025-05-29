import { useState, useEffect, useMemo, useCallback } from 'react';
import { Aula } from '@/types/AulaResponse';
import { fetchAulas, createAula, updateAula, deleteAula } from '../AulaService';
import toast from 'react-hot-toast';
import { UUID } from 'crypto';
import Swal from 'sweetalert2';

export type FilterTypes = {
  teorico: boolean;
  laboratorio: boolean;
};

export type AulaModalState = {
  type: 'create' | 'update' | null;
  isOpen: boolean;
  isLoading: boolean;
  aula: Aula | null;
};

export type AulaFormData = {
  nombre: string;
  capacidad: number;
  tipo: string;
};

export function useAulas() {
  // Estados para la lista de aulas
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para filtrado y búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTypes, setFilterTypes] = useState<FilterTypes>({
    teorico: false,
    laboratorio: false,
  });
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Constante para evitar inconsistencias
  
  // Estados para modales y formularios
  const [modalState, setModalState] = useState<AulaModalState>({
    type: null,
    isOpen: false,
    isLoading: false,
    aula: null,
  });
  
  const [formData, setFormData] = useState<AulaFormData>({
    nombre: '',
    capacidad: 50,
    tipo: '',
  });

  // Cargar la lista de aulas
  const loadAulas = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAulas();
      setAulas(data);
    } catch (error) {
      console.error('Error fetching aulas:', error);
      toast.error('Error al cargar las aulas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar al montar el componente
  useEffect(() => {
    loadAulas();
  }, [loadAulas]);
  
  // Actualizar formData cuando cambia el aula seleccionada
  useEffect(() => {
    if (modalState.aula) {
      setFormData({
        nombre: modalState.aula.nombre,
        capacidad: modalState.aula.capacidad,
        tipo: modalState.aula.tipo,
      });
    } else {
      // Reset form cuando no hay aula seleccionada
      setFormData({
        nombre: '',
        capacidad: 50,
        tipo: '',
      });
    }
  }, [modalState.aula]);

  // Filtrado de aulas
  const filteredAulas = useMemo(() => {
    return aulas.filter((aula) => {
      const matchesSearch = aula.nombre.toLowerCase().includes(searchQuery.toLowerCase());
      const noTypeFiltersActive = !filterTypes.teorico && !filterTypes.laboratorio;
      const matchesType = noTypeFiltersActive ||
          (filterTypes.teorico && aula.tipo === "TEORICO") ||
          (filterTypes.laboratorio && aula.tipo === "LABORATORIO");

      return matchesSearch && matchesType;
    });
  }, [aulas, searchQuery, filterTypes]);

  // Cálculos para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAulas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAulas.length / itemsPerPage);

  // Handlers para filtros y búsqueda
  const handleFilterChange = useCallback((type: keyof FilterTypes) => {
    setFilterTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilterTypes({ teorico: false, laboratorio: false });
    setCurrentPage(1);
  }, []);

  // Gestión de modales
  const openCreateModal = useCallback(() => {
    setModalState({
      type: 'create',
      isOpen: true,
      isLoading: false,
      aula: null,
    });
    setFormData({
      nombre: '',
      capacidad: 50,
      tipo: '',
    });
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const openUpdateModal = useCallback((aula: Aula) => {
    setModalState({
      type: 'update',
      isOpen: true,
      isLoading: false,
      aula,
    });
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false,
    }));
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    // Resetear el estado del modal después de la animación de cierre
    setTimeout(() => {
      setModalState({
        type: null,
        isOpen: false,
        isLoading: false,
        aula: null,
      });
    }, 300);
  }, []);

  // Manejador de cambios en el formulario
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "capacidad" ? parseInt(value) || 0 : value
    }));
  }, []);

  // Validación del formulario
  const validateForm = useCallback((): boolean => {
    if (!formData.nombre?.trim()) {
      toast.error("El nombre del aula es requerido");
      return false;
    }
    
    if (!formData.tipo) {
      toast.error("Debe seleccionar un tipo de aula");
      return false;
    }
    
    if (!formData.capacidad || formData.capacidad <= 0) {
      toast.error("La capacidad debe ser mayor a 0");
      return false;
    }

    return true;
  }, [formData]);

  // Creación de aula
  const handleCreateAula = useCallback(async () => {
    if (!validateForm()) return;
    
    try {
      setModalState(prev => ({ ...prev, isLoading: true }));
      
      const toastId = toast.loading("Creando aula...");
      
      await createAula(formData);
      
      toast.success("Aula creada exitosamente", {
        id: toastId,
      });
      
      await loadAulas();
      closeModal();
    } catch (error) {
      console.error("Error al crear el aula:", error);
      toast.error("Error al crear el aula: " + (error instanceof Error ? error.message : "Error desconocido"));
    } finally {
      setModalState(prev => ({ ...prev, isLoading: false }));
    }
  }, [formData, validateForm, loadAulas, closeModal]);

  // Actualización de aula
  const handleUpdateAula = useCallback(async () => {
    if (!validateForm() || !modalState.aula?.id) return;
    
    try {
      setModalState(prev => ({ ...prev, isLoading: true }));
      
      const toastId = toast.loading("Actualizando aula...");
      
      await updateAula(formData, modalState.aula.id as UUID);
      
      toast.success("Aula actualizada exitosamente", {
        id: toastId,
      });
      
      await loadAulas();
      closeModal();
    } catch (error) {
      console.error("Error al actualizar el aula:", error);
      toast.error("Error al actualizar el aula: " + (error instanceof Error ? error.message : "Error desconocido"));
    } finally {
      setModalState(prev => ({ ...prev, isLoading: false }));
    }
  }, [formData, validateForm, modalState.aula, loadAulas, closeModal]);

  // Eliminación de aula
  const handleDeleteAula = useCallback(async (aula: Aula) => {
    const result = await Swal.fire({
      title: `¿Eliminar aula ${aula.nombre}?`,
      html: `
        <p class="mb-2">Esta acción eliminará permanentemente el aula <strong>${aula.nombre}</strong> del sistema.</p>
        <p class="text-sm text-gray-500">Si el aula está siendo utilizada en algún horario, no podrá ser eliminada.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      width: '24rem',
      focusCancel: true,
    });
  
    if (result.isConfirmed) {
      const loadingToast = toast.loading(`Eliminando aula ${aula.nombre}...`);
      
      try {
        const response = await deleteAula(aula.id);
        
        if (response.success) {
          await loadAulas();
          toast.success(`¡Aula ${aula.nombre} eliminada con éxito!`, { 
            id: loadingToast,
            duration: 3000
          });
        } else {
          toast.dismiss(loadingToast);
          
          // Manejar diferentes tipos de errores según el código de estado
          if (response.status === 409) {
            Swal.fire({
              title: 'No se puede eliminar el aula',
              html: `
                <p class="mb-3">${response.message || 'El aula está siendo utilizada en uno o más horarios activos.'}</p>
                <div class="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
                  <p>Para eliminar esta aula, primero debe:</p>
                  <ul class="list-disc pl-5 mt-1 space-y-1">
                    <li>Eliminar todas las asignaciones de horarios donde se utiliza</li>
                    <li>Verificar que no esté asignada a grupos activos</li>
                  </ul>
                </div>
              `,
              icon: 'error',
              confirmButtonText: 'Entendido',
            });
          } else {
            // Error genérico
            toast.error(`Error al eliminar aula: ${response.message || 'Error desconocido'}`);
          }
        }
      } catch (error) {
        console.error("Error al eliminar aula:", error);
        toast.error("Error inesperado al intentar eliminar el aula", { 
          id: loadingToast
        });
      }
    }
  }, [loadAulas]);

  // Submit del formulario según el tipo de operación
  const handleSubmit = useCallback(async () => {
    if (modalState.type === 'create') {
      await handleCreateAula();
    } else if (modalState.type === 'update') {
      await handleUpdateAula();
    }
  }, [modalState.type, handleCreateAula, handleUpdateAula]);

  return {
    // Estados principales
    aulas,
    isLoading,
    filteredAulas,
    currentItems,
    
    // Estado del modal y formulario
    modalState,
    formData,
    
    // Paginación
    currentPage,
    totalPages,
    itemsPerPage,
    indexOfFirstItem,
    indexOfLastItem,
    
    // Filtros y búsqueda
    searchQuery,
    filterTypes,
    
    // Handlers de CRUD
    loadAulas,
    handleInputChange,
    handleSubmit,
    
    // Handlers de modales
    openCreateModal,
    openUpdateModal,
    closeModal,
    
    // Handlers específicos para operaciones
    handleCreateAula,
    handleUpdateAula,
    handleDeleteAula,
    
    // Handlers de filtros y búsqueda
    handleFilterChange,
    handleSearchChange,
    clearFilters,
    
    // Handler de paginación
    onPageChange: setCurrentPage
  };
}