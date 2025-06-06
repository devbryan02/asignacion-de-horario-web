import { motion } from 'framer-motion';
import { Calendar, Check, BarChart4, Users, School, Zap, Gauge, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EstadoCargaHorario() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Elementos que se animan secuencialmente
  const steps = [
    {
      icon: <BarChart4 size={18} className="text-primary" />,
      text: "Analizando todas las restricciones y preferencias",
    },
    {
      icon: <Calendar size={18} className="text-primary" />,
      text: "Optimizando la distribución de aulas y horarios",
    },
    {
      icon: <Users size={18} className="text-primary" />,
      text: "Evitando conflictos de docentes y espacios",
    },
    {
      icon: <School size={18} className="text-primary" />,
      text: "Aplicando las reglas de prioridad institucionales",
    },
  ];

  // Simular progreso y activación secuencial de pasos - ajustado para 10 segundos total
  useEffect(() => {
    const totalDuration = 30000; // 10 segundos
    const interval = 100; // Actualizar cada 100ms
    const incrementPerInterval = 100 / (totalDuration / interval);
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const newValue = prev + incrementPerInterval;
        if (newValue >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newValue;
      });
    }, interval);
    
    // Activar pasos en tiempos específicos
    const stepTimers = [
      setTimeout(() => setActiveStepIndex(1), totalDuration * 0.25), // 25% del tiempo
      setTimeout(() => setActiveStepIndex(2), totalDuration * 0.5),  // 50% del tiempo
      setTimeout(() => setActiveStepIndex(3), totalDuration * 0.75)  // 75% del tiempo
    ];
    
    return () => {
      clearInterval(timer);
      stepTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Estimación de tiempo restante basado en el progreso
  const getTimeRemaining = () => {
    if (progress >= 100) return "Completando...";
    // Para 10 segundos totales
    const secondsRemaining = Math.round((100 - progress) / 10);
    return `~${secondsRemaining} segundos`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-8 relative"
    >
      {/* Círculo de carga estilo moderno */}
      <div className="relative mb-8">
        {/* Fondo del spinner */}
        <div className="w-24 h-24 rounded-full border-4 border-base-200 relative flex items-center justify-center">
          {/* Arco de progreso animado */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle 
              className="text-base-200 stroke-current" 
              strokeWidth="4"
              fill="transparent" 
              r="42" 
              cx="50" 
              cy="50" 
            />
            <circle 
              className="text-primary stroke-current progress-circle" 
              strokeWidth="4" 
              strokeLinecap="round"
              fill="transparent" 
              r="42" 
              cx="50" 
              cy="50" 
              style={{
                strokeDasharray: 264,
                strokeDashoffset: 264 - (progress / 100) * 264,
                transition: "stroke-dashoffset 0.3s"
              }}
            />
          </svg>
          
          {/* Icono central */}
          <div className="w-16 h-16 rounded-full bg-base-100 flex items-center justify-center z-10 border border-base-200 shadow-inner">
            <Calendar size={24} className="text-primary" />
          </div>
        </div>
      </div>
      
      {/* Título y texto explicativo */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-base-content mb-2">
          Generando horario optimizado
        </h3>
        
        <div className="flex items-center justify-center gap-2 text-primary mb-4">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Zap size={16} />
          </motion.div>
          <span className="text-sm font-medium">OptaPlanner en ejecución</span>
        </div>
      </div>
      
      {/* Pasos de progreso con indicadores */}
      <div className="w-full max-w-md px-4 mb-6">
        <div className="bg-base-100 shadow border border-base-200 rounded-lg">
          <div className="p-4 border-b border-base-200">
            <h4 className="font-medium text-base-content">Progreso del algoritmo</h4>
          </div>
          
          <div className="py-3 px-4">
            <ol className="relative">
              {steps.map((step, index) => (
                <li 
                  key={index} 
                  className={`flex relative pb-4 ${
                    index === steps.length - 1 ? "" : "border-l border-base-200 ml-3 last:border-0"
                  }`}
                >
                  <div className={`absolute -left-3 mt-1.5 w-6 h-6 rounded-full flex items-center justify-center z-10 
                    ${index < activeStepIndex 
                      ? "bg-success text-white" 
                      : index === activeStepIndex 
                        ? "bg-primary text-white" 
                        : "bg-base-200 text-base-content/50"}`}
                  >
                    {index < activeStepIndex ? (
                      <Check size={14} />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className={`pl-8 ${
                    index === activeStepIndex ? "" : "opacity-60"
                  }`}>
                    <div className={`flex items-center mb-1 ${
                      index === activeStepIndex ? "text-primary font-medium" : ""
                    }`}>
                      {step.icon}
                      <span className="ml-2 text-sm">
                        {step.text}
                      </span>
                      
                      {index === activeStepIndex && (
                        <motion.div
                          className="ml-2 w-1.5 h-1.5 rounded-full bg-primary"
                          animate={{ 
                            opacity: [0, 1, 0]
                          }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      
      {/* Barra de progreso y porcentaje */}
      <div className="w-full max-w-md px-4 mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-base-content/60">Progreso</span>
          <span className="text-xs font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-base-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Tiempo estimado */}
      <div className="text-center mt-2">
        <span className="text-xs text-base-content/70">
          Tiempo estimado restante: {getTimeRemaining()}
        </span>
      </div>
    </motion.div>
  );
}