import { useGenerarHorario } from '../hooks/useGenerarHorario';
import { CalendarCheck, Loader2 } from 'lucide-react';

interface BotonGenerarHorarioProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  onHorarioGenerado?: () => void;
}

export default function BotonGenerarHorario({ 
  className = '', 
  variant = 'primary',
  onHorarioGenerado
}: BotonGenerarHorarioProps) {
  const { isLoading, generarHorario } = useGenerarHorario();
  
  const handleClick = async () => {
    await generarHorario();
    if (onHorarioGenerado) {
      onHorarioGenerado();
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
  
  return (
    <button 
      onClick={handleClick}
      className={getButtonClass()}
      disabled={isLoading}
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
  );
}