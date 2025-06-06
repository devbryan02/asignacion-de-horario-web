import { useState } from 'react';
import { resolverHorario, GenerarHorarioResponse } from '../AsignacionHorarioService';
import toast from 'react-hot-toast';

export function useGenerarHorario() {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState<GenerarHorarioResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerarHorario = async () => {
    // Limpiar estados previos
    setError(null);
    setResultado(null);
    setIsLoading(true);

    try {
      const response = await resolverHorario();
      
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