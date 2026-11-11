import { useState, useEffect, useMemo } from 'react';
import { DocenteResponse } from '@/types/response/DocenteResponse';
import { fetchDocentes, updateDocente, DocenteUpdateRequest, deleteDocente } from '../DocenteService';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import type { UUID } from 'node:crypto';

export type FilterHours = {
  menos15: boolean;
  mas15: boolean;
};

export function useDocentes() {
  // Estados existentes
  const [docentes, setDocentes] = useState<DocenteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHours, setFilterHours] = useState<FilterHours>({
    menos15: false,
    mas15: false,
  });

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Estado para edición
  const [docenteToEdit, setDocenteToEdit] = useState<DocenteResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Cargar datos
  const loadDocentes = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDocentes();
      setDocentes(data);
    } catch (error) {
      console.error('Error fetching docentes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar al montar
  useEffect(() => {
    loadDocentes();
  }, []);

  // Filtrar docentes
  const filteredDocentes = useMemo(() => {
    return docentes.filter((docente) => {
      // Filtrado por texto de búsqueda
      const matchesSearch = docente.nombre.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtrado por horas contratadas
      const noHoursFiltersActive = !filterHours.menos15 && !filterHours.mas15;

      const matchesHours = noHoursFiltersActive ||
        (filterHours.menos15 && docente.horasContratadas < 15) ||
        (filterHours.mas15 && docente.horasContratadas >= 15);

      // El docente debe cumplir ambas condiciones
      return matchesSearch && matchesHours;
    });
  }, [docentes, searchQuery, filterHours]);

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocentes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocentes.length / itemsPerPage);

  // Manejador para editar docente
  const handleEditDocente = (docente: DocenteResponse) => {
    setDocenteToEdit(docente);
    setIsEditModalOpen(true);
  };

  // Manejador para actualizar docente
  const handleUpdateDocente = async (id: UUID, updatedDocente: DocenteUpdateRequest) => {
    setIsLoading(true);
    try {
      // Extraemos solo los campos que queremos actualizar, omitiendo unidadesIds
      const { nombre, horasContratadas, horasMaximasPorDia } = updatedDocente;

      // Construimos el objeto de actualización parcial
      const docenteUpdate: DocenteUpdateRequest = {
        nombre,
        horasContratadas,
        horasMaximasPorDia
      };

      await updateDocente(id, docenteUpdate);
      toast.success('Docente actualizado correctamente');
      await loadDocentes();
      setDocenteToEdit(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating docente:', error);
      toast.error('Error al actualizar el docente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocente = async (id: UUID, nombre: string) => {
    try {
      // Modal de confirmación mejorado con información más clara
      const result = await Swal.fire({
        title: `¿Eliminar docente ${nombre}?`,
        html: `
        <p class="mb-2">Esta acción eliminará permanentemente al docente <strong>${nombre}</strong> del sistema.</p>
        <p class="text-sm text-gray-500">Si el docente tiene restricciones o está asignado a horarios, no podrá ser eliminado.</p>
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
        const loadingToast = toast.loading(`Eliminando docente ${nombre}...`);

        // Llamar al servicio y obtener la respuesta
        const response = await deleteDocente(id);

        if (response.success) {
          // Cerrar toast de carga
          toast.dismiss(loadingToast);

          // Mostrar mensaje de éxito con SweetAlert2
          Swal.fire({
            title: 'Docente eliminado',
            html: `
            <p>El docente <strong>${nombre}</strong> ha sido eliminado correctamente.</p>
            <p class="text-sm text-green-600 mt-2">Los horarios y configuraciones asociados han sido actualizados.</p>
          `,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
          });

          // Recargar la lista de docentes
          await loadDocentes();
        } else {
          // Cerrar toast de carga
          toast.dismiss(loadingToast);

          // Personalizar mensajes según código de error
          if (response.status === 409) {
            // Error de conflicto por restricciones existentes
            Swal.fire({
              title: 'No se puede eliminar el docente',
              html: `
              <p class="mb-3">${response.message || 'El docente tiene restricciones o asignaciones activas.'}</p>
              <div class="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
                <p>Para eliminar este docente, primero debe:</p>
                <ul class="list-disc pl-5 mt-1 space-y-1">
                  <li>Eliminar las restricciones horarias asociadas al docente</li>
                  <li>Quitar al docente de los horarios donde está asignado</li>
                </ul>
              </div>
            `,
              icon: 'warning',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendido',
              width: '32rem'
            });
          } else if (response.status === 404) {
            // Error no encontrado
            toast.error(`El docente "${nombre}" ya no existe en el sistema o ha sido eliminado por otro usuario`, {
              duration: 4000,
              icon: '🔍'
            });
          } else if (response.status === 403) {
            // Error de permisos
            Swal.fire({
              title: 'Permiso denegado',
              html: `
              <p>${response.message || 'No tienes los permisos necesarios para eliminar este docente.'}</p>
              <p class="text-sm text-gray-500 mt-2">Si necesitas realizar esta acción, contacta al administrador del sistema.</p>
            `,
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            });
          } else {
            // Error general con más contexto
            Swal.fire({
              title: 'Error al eliminar el docente',
              html: `
              <p>${response.message || 'Ha ocurrido un problema al intentar eliminar el docente.'}</p>
              <p class="text-sm text-gray-500 mt-2">Código de error: ${response.status || 'Desconocido'}</p>
            `,
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            });
          }
        }
      }
    } catch (error) {
      console.error('Error en el proceso de eliminación:', error);

      // Mensaje de error inesperado con sugerencias
      Swal.fire({
        title: 'Error inesperado',
        html: `
        <p>No se pudo procesar la solicitud para eliminar al docente "${nombre}".</p>
        <div class="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm">
          <p>Sugerencias:</p>
          <ul class="list-disc pl-5 mt-1">
            <li>Verifica tu conexión a internet</li>
            <li>Actualiza la página e intenta nuevamente</li>
            <li>Si el problema persiste, contacta al soporte técnico</li>
          </ul>
        </div>
      `,
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Manejadores de filtros
  const handleFilterChange = (type: keyof FilterHours) => {
    setFilterHours((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilterHours({ menos15: false, mas15: false });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return {
    docentes,
    filteredDocentes,
    currentItems,
    isLoading,
    searchQuery,
    filterHours,
    currentPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    loadDocentes,
    handleFilterChange,
    handleSearchChange,
    clearFilters,
    paginate,
    // Para edición
    docenteToEdit,
    isEditModalOpen,
    handleEditDocente,
    handleUpdateDocente,
    setIsEditModalOpen,
    // Para eliminación
    handleDeleteDocente,
  };
}