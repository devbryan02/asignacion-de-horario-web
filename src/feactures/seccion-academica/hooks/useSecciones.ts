import { useState, useEffect, useMemo, useCallback } from 'react';
import { SeccionResponse, SeccionRequest } from '../types';
import { 
  fetchSeccionAcademica, 
  createSeccionAcademica, 
  updateSeccionAcademica,
  deleteSeccionAcademica 
} from '../SeccionAcademicaService';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { UUID } from 'crypto';

export function useSecciones() {
  // Estados
  const [secciones, setSecciones] = useState<SeccionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Estado para edición
  const [seccionToEdit, setSeccionToEdit] = useState<SeccionResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Cargar datos
  const loadSecciones = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchSeccionAcademica();
      setSecciones(data);
    } catch (error) {
      console.error('Error fetching secciones:', error);
      toast.error('Error al cargar las secciones académicas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar al montar
  useEffect(() => {
    loadSecciones();
  }, [loadSecciones]);

  // Filtrar secciones
  const filteredSecciones = useMemo(() => {
    return secciones.filter((seccion) => 
      seccion.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seccion.periodoAcademico.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [secciones, searchQuery]);

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSecciones.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSecciones.length / itemsPerPage);

  // Manejador para editar seccion
  const handleEditSeccion = (seccion: SeccionResponse) => {
    setSeccionToEdit(seccion);
    setIsEditModalOpen(true);
  };

  // Manejador para crear seccion
  const handleCreateSeccion = async (seccionData: SeccionRequest) => {
    setIsLoading(true);
    try {
      await createSeccionAcademica(seccionData);
      toast.success('Sección académica creada correctamente');
      await loadSecciones();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating seccion:', error);
      toast.error('Error al crear la sección académica');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejador para actualizar seccion
  const handleUpdateSeccion = async (id: UUID, seccionData: SeccionRequest) => {
    setIsLoading(true);
    try {
      await updateSeccionAcademica(id, seccionData);
      toast.success('Sección académica actualizada correctamente');
      await loadSecciones();
      setSeccionToEdit(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating seccion:', error);
      toast.error('Error al actualizar la sección académica');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejador para eliminar seccion
  const handleDeleteSeccion = async (id: UUID, nombre: string) => {
    try {
      // Modal de confirmación mejorado con información clara
      const result = await Swal.fire({
        title: `¿Eliminar sección ${nombre}?`,
        html: `
          <p class="mb-2">Esta acción eliminará permanentemente la sección <strong>${nombre}</strong> del sistema.</p>
          <p class="text-sm text-gray-500">Si la sección está asociada a grupos o asignaturas, no podrá ser eliminada.</p>
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

      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        setIsLoading(true);
        
        // Toast para mostrar progreso
        const loadingToast = toast.loading(`Eliminando sección ${nombre}...`);
        
        // Llamar al servicio y obtener la respuesta
        const response = await deleteSeccionAcademica(id);
        
        if (response.success) {
          // Cerrar toast de carga
          toast.dismiss(loadingToast);
          
          // Mostrar mensaje de éxito con SweetAlert2
          Swal.fire({
            title: 'Sección eliminada',
            html: `
              <p>La sección <strong>${nombre}</strong> ha sido eliminada correctamente.</p>
            `,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
          });
          
          // Recargar la lista de secciones
          await loadSecciones();
        } else {
          // Cerrar toast de carga
          toast.dismiss(loadingToast);
          
          // Personalizar mensajes según código de error
          if (response.status === 409) {
            // Error de conflicto
            Swal.fire({
              title: 'No se puede eliminar la sección',
              html: `
                <p class="mb-3">${response.message || 'La sección tiene grupos o asignaturas asociadas.'}</p>
                <div class="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
                  <p>Para eliminar esta sección, primero debe:</p>
                  <ul class="list-disc pl-5 mt-1 space-y-1">
                    <li>Eliminar los grupos asociados a esta sección</li>
                    <li>Desvincular las asignaturas asignadas</li>
                  </ul>
                </div>
              `,
              icon: 'warning',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendido',
              width: '32rem'
            });
          } else {
            // Error general
            Swal.fire({
              title: 'Error al eliminar la sección',
              text: response.message || 'Ha ocurrido un problema al intentar eliminar la sección',
              icon: 'error',
              confirmButtonColor: '#3085d6'
            });
          }
        }
      }
    } catch (error) {
      console.error('Error en el proceso de eliminación:', error);
      
      Swal.fire({
        title: 'Error inesperado',
        text: 'Ha ocurrido un error al procesar la solicitud.',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Manejadores de búsqueda
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Paginación
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return {
    secciones,
    filteredSecciones,
    currentItems,
    isLoading,
    searchQuery,
    currentPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    seccionToEdit,
    isEditModalOpen,
    isAddModalOpen,
    loadSecciones,
    handleSearchChange,
    clearSearch,
    paginate,
    handleEditSeccion,
    handleCreateSeccion,
    handleUpdateSeccion,
    handleDeleteSeccion,
    setIsEditModalOpen,
    setIsAddModalOpen
  };
}