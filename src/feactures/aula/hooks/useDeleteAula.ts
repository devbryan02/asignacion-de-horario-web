import { useCallback } from 'react';
import { Aula } from '@/types/AulaResponse';
import { deleteAula } from '../AulaService';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

interface UseDeleteAulaProps {
  onSuccess?: () => Promise<void> | void;
  onDelete?: (id: string) => void;
}

export const useDeleteAula = ({ onSuccess, onDelete }: UseDeleteAulaProps = {}) => {
  const handleDelete = useCallback(async (aula: Aula) => {
    // Modal de confirmación más compacto
    const result = await Swal.fire({
      title: '¿Eliminar aula?',
      html: `<p>¿Estás seguro de eliminar <strong>${aula.nombre}</strong>?</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      width: '20rem',
      focusCancel: true,
    });
  
    if (result.isConfirmed) {
      // Usar toast para mostrar el estado de carga
      const loadingToast = toast.loading(`Eliminando ${aula.nombre}...`);
      
      try {
        // Eliminar aula
        await deleteAula(aula.id);
        
        // Notificar callbacks
        if (onDelete) onDelete(aula.id);
        if (onSuccess) await onSuccess();
        
        // Actualizar el toast a éxito
        toast.success(`Aula ${aula.nombre} eliminada`, { id: loadingToast });
      } catch (error: any) {
        console.error("Error al eliminar aula:", error);
        
        // Actualizar el toast a error
        toast.dismiss(loadingToast);
        
        // Manejar diferentes tipos de errores
        if (error?.tipo === 'DeleteException') {
          // Error de relaciones
          Swal.fire({
            title: 'Imposible eliminar',
            text: error.mensaje,
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Entendido',
            width: '24rem',
            footer: 'Primero elimina las asignaciones asociadas a esta aula'
          });
        } else {
          // Error general
          toast.error(error?.message || 'Error al eliminar el aula');
        }
      }
    }
  }, [onDelete, onSuccess]);

  return { handleDelete };
};