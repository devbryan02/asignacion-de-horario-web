import { useState } from 'react';
import { resolverHorario, GenerarHorarioResponse } from '../AsignacionHorarioService';
import toast from 'react-hot-toast';
import { UUID } from 'crypto';
import Swal from 'sweetalert2';

export function useGenerarHorario(periodoId: UUID) {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState<GenerarHorarioResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerarHorario = async () => {
    // Limpiar estados previos
    setError(null);
    setResultado(null);
    setIsLoading(true);

    try {

      const confirmacion = await Swal.fire({
        title: 'Confirmar generación de horario',
        text: '¿Estás seguro de que deseas generar el horario para este periodo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, generar',
        cancelButtonText: 'Cancelar'
      });
      if (!confirmacion.isConfirmed) {
        return; 
      }
      // Llamar al servicio para generar el horario
      const response = await resolverHorario(periodoId);
      
      if (response.success) {
        setResultado(response.data);
        toast.success('¡Horario generado exitosamente!');
      } else {
        setError(response.message || 'Error al generar el horario');
        toast.error(response.message || 'Error al generar el horario');
      }
    } catch (err) {
      console.error("Error en generación de horario:", err);
      setError('Ocurrió un error inesperado al generar el horario');
      toast.error('Ocurrió un error inesperado al generar el horario');
    } finally {
      setIsLoading(false);
    }
  };

  const resetearResultado = () => {
    setResultado(null);
    setError(null);
  };

  return {
    isLoading,
    resultado,
    error,
    generarHorario: handleGenerarHorario,
    resetearResultado
  };
}