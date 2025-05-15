import { useCallback } from 'react';
import { Aula } from '@/types/AulaResponse';
import { deleteAula, ServiceResponse } from '../AulaService';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

interface UseDeleteAulaProps {
  onSuccess?: () => Promise<void> | void;
  onDelete?: (id: string) => void;
}

export const useDeleteAula = ({ onSuccess, onDelete }: UseDeleteAulaProps = {}) => {
  const handleDelete = useCallback(async (aula: Aula) => {
    // Modal de confirmación con mensaje claro y personalizado
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
      // Toast con mensaje descriptivo del proceso
      const loadingToast = toast.loading(`Eliminando aula ${aula.nombre}...`);
      
      try {
        // Procesamiento de la solicitud de eliminación
        const response: ServiceResponse = await deleteAula(aula.id);
        
        if (response.success) {
          // Notificación de éxito más descriptiva
          if (onDelete) onDelete(aula.id);
          if (onSuccess) await onSuccess();
          
          toast.success(`¡Aula ${aula.nombre} eliminada con éxito!`, { 
            id: loadingToast,
            duration: 3000
          });
        } else {
          // Manejo de errores con mensajes más informativos
          toast.dismiss(loadingToast);
          
          if (response.status === 409) {
            // Mensaje detallado para conflictos con restricciones de integridad
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
              icon: 'warning',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendido',
              width: '32rem'
            });
          } else if (response.status === 404) {
            // Mensaje para recursos no encontrados
            toast.error(`El aula "${aula.nombre}" ya no existe en el sistema o ha sido eliminada por otro usuario`, {
              duration: 4000,
              icon: '🔍'
            });
          } else if (response.status === 403) {
            // Mensaje para problemas de permisos
            Swal.fire({
              title: 'Permiso denegado',
              html: `
                <p>${response.message || 'No tienes los permisos necesarios para eliminar esta aula.'}</p>
                <p class="text-sm text-gray-500 mt-2">Si necesitas realizar esta acción, contacta al administrador del sistema.</p>
              `,
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            });
          } else {
            // Error general con más contexto
            Swal.fire({
              title: 'Error al eliminar el aula',
              html: `
                <p>${response.message || 'Ha ocurrido un problema al intentar eliminar el aula.'}</p>
                <p class="text-sm text-gray-500 mt-2">Código de error: ${response.status || 'Desconocido'}</p>
              `,
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            });
          }
        }
      } catch (error: any) {
        // Error inesperado con sugerencias de solución
        console.error("Error no controlado al eliminar aula:", error);
        toast.dismiss(loadingToast);
        
        Swal.fire({
          title: 'Error inesperado',
          html: `
            <p>No se pudo procesar la solicitud para eliminar el aula "${aula.nombre}".</p>
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
      }
    }
  }, [onDelete, onSuccess]);

  return { handleDelete };
};