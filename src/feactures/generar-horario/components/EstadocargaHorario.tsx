import { Calendar, Check, BarChart4, Users, School, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EstadoCargaHorario() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Elementos que se animan secuencialmente
  const steps = [
    {
      icon: <BarChart4 size={16} className="text-primary" />,
      text: "Analizando restricciones y preferencias",
    },
    {
      icon: <Calendar size={16} className="text-primary" />,
      text: "Optimizando distribución de horarios",
    },
    {
      icon: <Users size={16} className="text-primary" />,
      text: "Evitando conflictos de docentes y aulas",
    },
    {
      icon: <School size={16} className="text-primary" />,
      text: "Aplicando reglas institucionales",
    },
  ];

  // Simular progreso y activación secuencial de pasos
  useEffect(() => {
    const totalDuration = 60000; // 60 segundos
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
      setTimeout(() => setActiveStepIndex(1), totalDuration * 0.25),
      setTimeout(() => setActiveStepIndex(2), totalDuration * 0.5),
      setTimeout(() => setActiveStepIndex(3), totalDuration * 0.75)
    ];

    return () => {
      clearInterval(timer);
      stepTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* Círculo de carga con DaisyUI */}
      <div className="mb-6">
        <div className="relative">
          {/* Radial progress de DaisyUI */}
          <div 
            className="radial-progress text-primary" 
            style={{ "--value": Math.round(progress), "--size": "8rem", "--thickness": "4px" } as React.CSSProperties}
          >
            {/* Contenedor del icono central */}
            <div className="bg-base-100 rounded-full p-4 flex items-center justify-center border border-base-200">
              <Calendar size={24} className="text-primary" />
            </div>
          </div>
          
          {/* Indicador pulsante */}
          <span className="absolute top-0 right-0 badge badge-primary badge-sm animate-pulse">
            <Zap size={10} />
          </span>
        </div>
      </div>

      {/* Título y texto explicativo */}
      <div className="text-center mb-5">
        <h3 className="text-lg font-bold mb-1">
          Generando horario optimizado
        </h3>
        <div className="badge badge-primary badge-outline gap-1">
          <Zap size={12} />
          <span className="text-xs">OptaPlanner</span>
        </div>
      </div>

      {/* Pasos de progreso con timeline de DaisyUI */}
      <div className="max-w-sm w-full px-4 mb-5">
        <div className="card bg-base-100 shadow-sm compact">
          <div className="card-body p-0">
            <div className="p-3 border-b border-base-200">
              <h4 className="card-title text-sm">Progreso del algoritmo</h4>
            </div>
            <ul className="steps steps-vertical py-2 px-4">
              {steps.map((step, index) => (
                <li 
                  key={index}
                  data-content={index < activeStepIndex ? "✓" : (index + 1)}
                  className={`step ${index <= activeStepIndex ? "step-primary" : ""}`}
                >
                  <div className="flex items-center">
                    {step.icon}
                    <span className="ml-2 text-xs">
                      {step.text}
                    </span>
                    {index === activeStepIndex && (
                      <span className="ml-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Barra de progreso y porcentaje */}
      <div className="w-full max-w-sm px-4">
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="text-base-content/60">Progreso</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <progress 
          className="progress progress-primary w-full h-1" 
          value={progress} 
          max="100"
        ></progress>
        <div className="text-xs text-center text-base-content/60 mt-2">
          Este proceso puede tardar unos minutos
        </div>
      </div>
    </div>
  );
}