import { RestriccionResponse } from '@/types/response/RestriccionResponse';
import { Clock, Check, AlertTriangle } from 'lucide-react';
import { formatHora } from '../utils/formatters';

interface RestriccionItemProps {
  restriccion: RestriccionResponse;
}

export default function RestriccionItem({ restriccion }: RestriccionItemProps) {
  const isDisponible = restriccion.tipoRestriccion === "DISPONIBLE";
  
  return (
    <div
      className={`p-3 rounded-lg flex flex-col gap-2 text-sm transition-all duration-200
        ${isDisponible
          ? "bg-success/5 hover:bg-success/10 border-l-4 border-success"
          : "bg-error/5 hover:bg-error/10 border-l-4 border-error"
        }`}
    >
      <div className="flex items-center gap-2">
        <Clock 
          size={14} 
          className={isDisponible ? "text-success" : "text-error"} 
        />
        <span className="font-medium">
          {formatHora(restriccion.horaInicio)} - {formatHora(restriccion.horaFin)}
        </span>
      </div>
      <div className="flex items-center gap-1 text-xs">
        {isDisponible ? (
          <>
            <Check size={12} className="text-success" />
            <span className="text-success font-medium">Disponible</span>
          </>
        ) : (
          <>
            <AlertTriangle size={12} className="text-error" />
            <span className="text-error font-medium">Bloqueado</span>
          </>
        )}
      </div>
    </div>
  );
}