import { XCircle, AlertTriangle, RefreshCw, HelpCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorGeneracionHorarioProps {
  mensaje: string;
  onReiniciar: () => void;
  errorCode?: string;
}

export default function ErrorGeneracionHorario({ 
  mensaje, 
  onReiniciar,
  errorCode 
}: ErrorGeneracionHorarioProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border-2 border-error/30 bg-gradient-to-r from-error/10 to-error/5 p-5 mb-6 shadow-sm"
    >
      {/* Cabecera del error */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-error/20 text-error">
          <XCircle size={24} />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg text-error-content font-semibold">
              Error al generar el horario
            </h3>
            
            {errorCode && (
              <span className="badge badge-error badge-outline text-xs py-2">
                Código: {errorCode}
              </span>
            )}
          </div>
          
          <p className="text-error-content/90 mt-1">
            {mensaje}
          </p>
        </div>
      </div>
      
      {/* Sugerencias de solución */}
      <div className="mt-5 p-4 bg-base-100 rounded-lg border border-base-300 shadow-inner">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <div className="p-1 rounded-full bg-warning/20 text-warning">
              <AlertTriangle size={18} />
            </div>
            <h4 className="font-medium text-base-content">Sugerencias para resolver el problema</h4>
          </div>
          
          <ul className="space-y-2 ml-8 mt-1">
            <li className="flex gap-2 items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-base-content/70 mt-2"></span>
              <span className="text-sm text-base-content/80">
                Verifique que existen suficientes aulas disponibles para todas las asignaturas
              </span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-base-content/70 mt-2"></span>
              <span className="text-sm text-base-content/80">
                Confirme que los docentes tienen disponibilidad suficiente en sus horarios
              </span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-base-content/70 mt-2"></span>
              <span className="text-sm text-base-content/80">
                Revise posibles restricciones incompatibles entre asignaturas y espacios
              </span>
            </li>
          </ul>
        </div>
        
        <div className="flex items-center gap-2 mt-3 pb-1 text-xs text-info">
          <HelpCircle size={14} />
          <span>Consulte la documentación para más información sobre restricciones</span>
        </div>
      </div>
      
      {/* Acciones */}
      <div className="mt-5 flex flex-wrap gap-3 justify-end">
        <button 
          onClick={() => window.history.back()}
          className="btn btn-ghost btn-sm"
          type="button"
        >
          <ArrowLeft size={16} />
          <span>Volver</span>
        </button>
        
        <button 
          onClick={onReiniciar} 
          className="btn btn-error btn-sm"
          type="button"
        >
          <RefreshCw size={16} />
          <span>Reintentar generación</span>
        </button>
      </div>
    </motion.div>
  );
}