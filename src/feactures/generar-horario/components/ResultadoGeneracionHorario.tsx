import { GenerarHorarioResponse } from '../AsignacionHorarioService';
import { 
  CheckCircle, 
  RefreshCw, 
  CalendarCheck, 
  Award, 
  Grid, 
  Clock, 
  Users, 
  Building2, 
  Share2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ResultadoGeneracionHorarioProps {
  resultado: GenerarHorarioResponse;
  onReiniciar: () => void;
}

export default function ResultadoGeneracionHorario({ 
  resultado, 
  onReiniciar 
}: ResultadoGeneracionHorarioProps) {
  // Animación del contenedor
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  // Animación para los items
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Determinar el color y el icono según la calidad
  const getCalidadConfig = () => {
    switch (resultado.calidadGeneracion) {
      case 'Excelente':
        return { 
          color: 'success',
          icon: <Award size={18} />
        };
      case 'Buena':
        return {
          color: 'info',
          icon: <CheckCircle size={18} />
        };
      default:
        return {
          color: 'warning',
          icon: <Clock size={18} />
        };
    }
  };
  
  const calidadConfig = getCalidadConfig();

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-8"
    >
      {/* Banner de éxito */}
      <motion.div 
        variants={itemVariants} 
        className="rounded-xl border-2 border-success/30 bg-gradient-to-r from-success/20 to-success/5 p-5 mb-8 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-success/20 text-success flex-shrink-0">
            <CheckCircle size={24} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl text-base-content font-semibold">{resultado.mensaje}</h3>
            <p className="text-base-content/80 mt-2">{resultado.mensajeEvaluacion}</p>
            
            <div className="mt-4 flex items-center gap-2">
              <div className={`badge badge-${calidadConfig.color} gap-1 py-3`}>
                {calidadConfig.icon}
                <span>Calidad {resultado.calidadGeneracion}</span>
              </div>
              
              <Share2 size={16} className="ml-3 text-success-content/50 cursor-pointer hover:text-success transition-colors" xlinkTitle="Compartir resultado" />
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.h3 
        variants={itemVariants}
        className="text-lg font-semibold mb-4 flex items-center gap-2"
      >
        <Grid size={18} className="text-primary" />
        <span>Resumen de Indicadores Generados</span>
      </motion.h3>
      
      {/* Tarjetas de estadísticas */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <div className="stats bg-base-100 shadow-md border border-base-200">
          <div className="stat">
            <div className="stat-figure text-primary bg-primary/10 p-3 rounded-full">
              <Grid size={20} className="text-primary" />
            </div>
            <div className="stat-title">Asignaciones</div>
            <div className="stat-value text-primary">{resultado.cantidadAsignaciones}</div>
            <div className="stat-desc">Total de clases asignadas</div>
          </div>
        </div>
        
        <div className="stats bg-base-100 shadow-md border border-base-200">
          <div className="stat">
            <div className="stat-figure text-secondary bg-secondary/10 p-3 rounded-full">
              <Building2 size={20} className="text-secondary" />
            </div>
            <div className="stat-title">Aulas</div>
            <div className="stat-value text-secondary">{resultado.cantidadAulasUsadas}</div>
            <div className="stat-desc">Aulas utilizadas en el horario</div>
          </div>
        </div>
        
        <div className="stats bg-base-100 shadow-md border border-base-200">
          <div className="stat">
            <div className="stat-figure text-accent bg-accent/10 p-3 rounded-full">
              <Clock size={20} className="text-accent" />
            </div>
            <div className="stat-title">Bloques</div>
            <div className="stat-value text-accent">{resultado.cantidadBloquesUsados}</div>
            <div className="stat-desc">Bloques horarios utilizados</div>
          </div>
        </div>
        
        <div className="stats bg-base-100 shadow-md border border-base-200">
          <div className="stat">
            <div className="stat-figure text-info bg-info/10 p-3 rounded-full">
              <Users size={20} className="text-info" />
            </div>
            <div className="stat-title">Docentes</div>
            <div className="stat-value text-info">{resultado.cantidadDocentesAsignados}</div>
            <div className="stat-desc">Docentes con clases asignadas</div>
          </div>
        </div>
      </motion.div>
      
      {/* Tarjeta informativa */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-base-200 to-base-100 rounded-xl p-5 shadow-sm border border-base-300 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col">
            <h4 className="text-base font-medium text-base-content">Rendimiento del horario</h4>
            <p className="text-sm text-base-content/70 mt-1">
              El horario generado ha utilizado óptimamente los recursos disponibles.
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <div className={`radial-progress text-${calidadConfig.color}`} style={{"--value": resultado.calidadGeneracion === 'Excelente' ? 100 : resultado.calidadGeneracion === 'Buena' ? 75 : 50, "--thickness": "3px"} as any}>
              {calidadConfig.icon}
            </div>
            
            <div>
              <div className="font-medium text-sm">Calidad</div>
              <div className={`text-${calidadConfig.color} font-semibold`}>{resultado.calidadGeneracion}</div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Botones de acción */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8"
      >
        <Link 
          href="/dashboard/visualizar" 
          className="btn btn-primary shadow-lg shadow-primary/20 w-full sm:w-auto btn-lg gap-3"
        >
          <CalendarCheck size={20} />
          <span>Ver Horario</span>
        </Link>
        
        <button 
          onClick={onReiniciar} 
          className="btn btn-outline btn-lg border-2 w-full sm:w-auto gap-3"
        >
          <RefreshCw size={20} />
          <span>Generar Nuevo Horario</span>
        </button>
      </motion.div>
      
      {/* Footer con información adicional */}
      <motion.div 
        variants={itemVariants}
        className="text-center text-xs text-base-content/50 mt-8 pt-4 border-t border-base-200"
      >
        <p>Horario generado el {new Date().toLocaleDateString()} a las {new Date().toLocaleTimeString()}</p>
        <p className="mt-1">El horario puede ser modificado manualmente si es necesario</p>
      </motion.div>
    </motion.div>
  );
}