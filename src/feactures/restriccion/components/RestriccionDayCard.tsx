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
        background: "bg-gradient-to-br from-primary/10 to-primary/30 hover:from-primary/20 hover:to-primary/40",
        border: "border-primary/30 hover:border-primary",
        icon: "text-primary bg-primary/20",
        header: "from-primary/80 to-primary"
      };
    case "MARTES":
      return {
        background: "bg-gradient-to-br from-secondary/10 to-secondary/30 hover:from-secondary/20 hover:to-secondary/40",
        border: "border-secondary/30 hover:border-secondary",
        icon: "text-secondary bg-secondary/20",
        header: "from-secondary/80 to-secondary"
      };
    case "MIERCOLES":
      return {
        background: "bg-gradient-to-br from-accent/10 to-accent/30 hover:from-accent/20 hover:to-accent/40",
        border: "border-accent/30 hover:border-accent",
        icon: "text-accent bg-accent/20",
        header: "from-accent/80 to-accent"
      };
    case "JUEVES":
      return {
        background: "bg-gradient-to-br from-info/10 to-info/30 hover:from-info/20 hover:to-info/40",
        border: "border-info/30 hover:border-info",
        icon: "text-info bg-info/20",
        header: "from-info/80 to-info"
      };
    case "VIERNES":
      return {
        background: "bg-gradient-to-br from-primary/10 to-primary/30 hover:from-primary/20 hover:to-primary/40",
        border: "border-primary/30 hover:border-primary",
        icon: "text-primary bg-primary/20",
        header: "from-primary/80 to-primary"
      };
    case "SABADO":
      return {
        background: "bg-gradient-to-br from-secondary/10 to-secondary/30 hover:from-secondary/20 hover:to-secondary/40",
        border: "border-secondary/30 hover:border-secondary",
        icon: "text-secondary bg-secondary/20",
        header: "from-secondary/80 to-secondary"
      };
    case "DOMINGO":
      return {
        background: "bg-gradient-to-br from-accent/10 to-accent/30 hover:from-accent/20 hover:to-accent/40",
        border: "border-accent/30 hover:border-accent",
        icon: "text-accent bg-accent/20",
        header: "from-accent/80 to-accent"
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
    <div className={`card overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:scale-105 ${styles.background} border ${styles.border}`}>
      {/* Header con gradiente */}
      <div className={`bg-gradient-to-r ${styles.header} p-3 text-white`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm">
            <Calendar size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-bold">{formatDiaSemana(dia)}</h3>
        </div>
      </div>

      <div className="card-body p-4">
        {/* Content */}
        {restricciones.length > 0 ? (
          <div className="space-y-4">
            {restricciones.map((restriccion) => (
              <RestriccionItem 
                key={restriccion.id} 
                restriccion={restriccion} 
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className={`mx-auto flex items-center justify-center w-12 h-12 mb-3 rounded-full ${styles.icon}`}>
              <Calendar size={24} />
            </div>
            <p className="text-base-content/60 font-medium">
              Sin restricciones
            </p>
          </div>
        )}
      </div>

      {/* Footer con contador */}
      <div className="bg-base-200/50 p-3 text-center border-t border-base-300">
        <span className="text-sm font-medium text-base-content/70">
          {restricciones.length} {restricciones.length === 1 ? 'restricción' : 'restricciones'}
        </span>
      </div>
      
      {/* Efecto de resplandor en hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300 bg-gradient-to-tr from-transparent via-white to-transparent pointer-events-none"></div>
    </div>
  );
}