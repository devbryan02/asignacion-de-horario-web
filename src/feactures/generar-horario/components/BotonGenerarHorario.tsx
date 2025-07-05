import { useGenerarHorario } from '../hooks/useGenerarHorario';
import { CalendarCheck, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchPeriodosAcademicos } from '@/feactures/periodo-academico/PeriodoAcademicaService';
import { PeriodoAcademico } from '@/feactures/periodo-academico/types';
import type { UUID } from 'crypto';
import { GenerarHorarioResponse } from '../AsignacionHorarioService';
import EstadoCargaHorario from './EstadocargaHorario';
import ErrorGeneracionHorario from './ErrorGeneracionHorario';
import ResultadoGeneracionHorario from './ResultadoGeneracionHorario';

interface BotonGenerarHorarioProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  onHorarioGenerado?: (resultado: GenerarHorarioResponse) => void;
  onError?: (mensaje: string) => void;
  onIniciar?: () => void;
}

export default function BotonGenerarHorario({
  className = '',
  variant = 'primary',
  onHorarioGenerado,
  onError,
  onIniciar
}: BotonGenerarHorarioProps) {
  const [periodos, setPeriodos] = useState<PeriodoAcademico[]>([]);
  const [selectedPeriodoId, setSelectedPeriodoId] = useState<UUID | null>(null);
  const [loadingPeriodos, setLoadingPeriodos] = useState(true);

  const { 
    isLoading, 
    resultado, 
    error, 
    generarHorario, 
    resetearResultado 
  } = useGenerarHorario(selectedPeriodoId as UUID);

  useEffect(() => {
    const loadPeriodos = async () => {
      try {
        const data = await fetchPeriodosAcademicos();
        setPeriodos(data);
        if (data.length > 0) {
          setSelectedPeriodoId(data[0].id as UUID);
        }
      } catch (error) {
        console.error('Error loading periodos:', error);
        onError?.('Error al cargar los períodos académicos');
      } finally {
        setLoadingPeriodos(false);
      }
    };

    loadPeriodos();
  }, [onError]);

  const handleClick = async () => {
    if (!selectedPeriodoId) return;
    
    try {
      onIniciar?.();
      await generarHorario();
      
      if (resultado) {
        onHorarioGenerado?.(resultado);
      }
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error desconocido al generar el horario';
      onError?.(mensaje);
    }
  };

  const getButtonClass = () => {
    let baseClass = `btn ${className}`;

    switch (variant) {
      case 'primary':
        return `${baseClass} btn-primary`;
      case 'secondary':
        return `${baseClass} btn-secondary`;
      case 'accent':
        return `${baseClass} btn-accent`;
      case 'outline':
        return `${baseClass} btn-outline`;
      default:
        return `${baseClass} btn-primary`;
    }
  };

  // Renderizado condicional basado en el estado
  if (isLoading) {
    return <EstadoCargaHorario />;
  }

  if (error) {
    return <ErrorGeneracionHorario 
      mensaje={error} 
      onReiniciar={resetearResultado}
      errorCode="GEN-001"
    />;
  }

  if (resultado) {
    return <ResultadoGeneracionHorario 
      resultado={resultado}
      onReiniciar={resetearResultado}
    />;
  }

  return (
    <div className="flex flex-row items-end gap-3">
      <div className="form-control flex-1">
        <label className="label">
          <span className="label-text">Período Académico</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={selectedPeriodoId || ''}
          onChange={(e) => setSelectedPeriodoId(e.target.value as UUID)}
          disabled={loadingPeriodos || isLoading}
        >
          {loadingPeriodos ? (
            <option disabled>Cargando períodos...</option>
          ) : (
            <>
              <option disabled value="">Selecciona un período</option>
              {periodos.map((periodo) => (
                <option key={periodo.id} value={periodo.id}>
                  {periodo.nombre} ({new Date(periodo.fechaInicio).getFullYear()})
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      <button
        onClick={handleClick}
        className={getButtonClass()}
        disabled={isLoading || !selectedPeriodoId || loadingPeriodos}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Generando...</span>
          </>
        ) : (
          <>
            <CalendarCheck size={18} />
            <span>Generar Horario</span>
          </>
        )}
      </button>
    </div>
  );
}