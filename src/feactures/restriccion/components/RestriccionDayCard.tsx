import { RestriccionResponse } from '@/types/response/RestriccionResponse';
import { Calendar } from 'lucide-react';
import { DiaSemana } from '@/types/DiaSemana';
import RestriccionItem from './RestriccionItem';
import { formatDiaSemana } from '../utils/formatters';

interface RestriccionDayCardProps {
  dia: DiaSemana;
  restricciones: RestriccionResponse[];
}

// Función para obtener estilos según el día
const getDayStyles = (dia: DiaSemana): { 
  background: string;
  border: string;
  icon: string;
  header: string 
} => {
  switch (dia) {
    case "LUNES": 
      return {
        background: "bg-gradient-to-br from-primary/5 to-primary/20 hover:from-primary/10 hover:to-primary/30",
        border: "border-primary/30 hover:border-primary/60",
        icon: "text-primary bg-primary/10",
        header: "from-primary/70 to-primary/90"
      };
    case "MARTES":
      return {
        background: "bg-gradient-to-br from-secondary/5 to-secondary/20 hover:from-secondary/10 hover:to-secondary/30",
        border: "border-secondary/30 hover:border-secondary/60",
        icon: "text-secondary bg-secondary/10",
        header: "from-secondary/70 to-secondary/90"
      };
    case "MIERCOLES":
      return {
        background: "bg-gradient-to-br from-accent/5 to-accent/20 hover:from-accent/10 hover:to-accent/30",
        border: "border-accent/30 hover:border-accent/60",
        icon: "text-accent bg-accent/10",
        header: "from-accent/70 to-accent/90"
      };
    case "JUEVES":
      return {
        background: "bg-gradient-to-br from-info/5 to-info/20 hover:from-info/10 hover:to-info/30",
        border: "border-info/30 hover:border-info/60",
        icon: "text-info bg-info/10",
        header: "from-info/70 to-info/90"
      };
    case "VIERNES":
      return {
        background: "bg-gradient-to-br from-primary/5 to-primary/20 hover:from-primary/10 hover:to-primary/30",
        border: "border-primary/30 hover:border-primary/60",
        icon: "text-primary bg-primary/10",
        header: "from-primary/70 to-primary/90"
      };
    case "SABADO":
      return {
        background: "bg-gradient-to-br from-secondary/5 to-secondary/20 hover:from-secondary/10 hover:to-secondary/30",
        border: "border-secondary/30 hover:border-secondary/60",
        icon: "text-secondary bg-secondary/10",
        header: "from-secondary/70 to-secondary/90"
      };
    case "DOMINGO":
      return {
        background: "bg-gradient-to-br from-accent/5 to-accent/20 hover:from-accent/10 hover:to-accent/30",
        border: "border-accent/30 hover:border-accent/60",
        icon: "text-accent bg-accent/10",
        header: "from-accent/70 to-accent/90"
      };
    default:
      return {
        background: "bg-gradient-to-br from-base-200 to-base-300 hover:from-base-300 hover:to-base-200",
        border: "border-base-300 hover:border-base-content/30",
        icon: "text-base-content bg-base-300",
        header: "from-base-300 to-base-content/50"
      };
  }
};

export default function RestriccionDayCard({ dia, restricciones }: RestriccionDayCardProps) {
  const styles = getDayStyles(dia);
  
  return (
    <div className={`card overflow-hidden shadow-md rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-102 ${styles.background} border ${styles.border}`}>
      {/* Header con gradiente más compacto */}
      <div className={`bg-gradient-to-r ${styles.header} py-2 px-3 text-white`}>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm">
            <Calendar size={16} className="text-white" />
          </div>
          <h3 className="font-bold">{formatDiaSemana(dia)}</h3>
          <div className="ml-auto badge badge-sm badge-outline badge-white text-xs">
            {restricciones.length}
          </div>
        </div>
      </div>

      <div className="card-body p-3">
        {/* Content */}
        {restricciones.length > 0 ? (
          <div className="space-y-2">
            {restricciones.map((restriccion) => (
              <RestriccionItem 
                key={restriccion.id} 
                restriccion={restriccion} 
              />
            ))}
          </div>
        ) : (
          <div className="py-4 text-center">
            <div className={`mx-auto flex items-center justify-center w-10 h-10 mb-2 rounded-full ${styles.icon}`}>
              <Calendar size={18} />
            </div>
            <p className="text-base-content/60 text-sm font-medium">
              Sin restricciones
            </p>
          </div>
        )}
      </div>

      {/* Footer con contador más compacto */}
      <div className="bg-base-200/30 py-1.5 px-3 text-center border-t border-base-300/50">
        <span className="text-xs font-medium text-base-content/70">
          {restricciones.length} {restricciones.length === 1 ? 'restricción' : 'restricciones'}
        </span>
      </div>
      
      {/* Efecto de resplandor en hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300 bg-gradient-to-tr from-transparent via-white to-transparent pointer-events-none"></div>
    </div>
  );
}