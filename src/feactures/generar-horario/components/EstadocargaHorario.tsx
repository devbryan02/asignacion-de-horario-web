import { Calendar, Check, BarChart4, Users, School, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EstadoCargaHorario() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      icon: <BarChart4 size={12} className="text-primary" />,
      text: "Analizando restricciones",
    },
    {
      icon: <Calendar size={12} className="text-primary" />,
      text: "Optimizando horarios",
    },
    {
      icon: <Users size={12} className="text-primary" />,
      text: "Resolviendo conflictos",
    },
    {
      icon: <School size={12} className="text-primary" />,
      text: "Aplicando reglas",
    },
  ];

  useEffect(() => {
    const totalDuration = 240000; // 4 minutos en milisegundos
    const interval = 100;
    const incrementPerInterval = 100 / (totalDuration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        const newValue = prev + incrementPerInterval;
        return newValue >= 100 ? (clearInterval(timer), 100) : newValue;
      });
    }, interval);

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
    <div className="card bg-base-100 shadow-xs max-w-sm mx-auto p-3">
      {/* Header compacto */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium flex items-center gap-1">
          <Calendar size={14} className="text-primary" />
          Generando horario
        </h3>
        <div className="badge badge-primary badge-outline badge-xs">
          <Zap size={8} className="mr-1" />
          <span className="text-xs">OptaPlanner</span>
        </div>
      </div>
      
      {/* Grid layout principal */}
      <div className="grid grid-cols-2 gap-3">
        {/* Columna izquierda: progreso circular */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div 
              className="radial-progress text-primary" 
              style={{ "--value": Math.round(progress), "--size": "5rem", "--thickness": "2px" } as React.CSSProperties}
            >
              <div className="bg-base-100 rounded-full p-2 flex flex-col items-center justify-center">
                <span className="font-bold text-sm">{Math.round(progress)}%</span>
              </div>
            </div>
            <span className="absolute -top-1 -right-1 badge badge-xs badge-primary animate-pulse">
              <Zap size={8} />
            </span>
          </div>
          <div className="text-xs opacity-60 mt-1">
            Est: 4 min
          </div>
        </div>
        
        {/* Columna derecha: pasos */}
        <div className="flex flex-col justify-center space-y-1">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex items-center text-xs gap-1 ${index <= activeStepIndex ? "text-primary" : "opacity-60"}`}
            >
              {index <= activeStepIndex ? 
                <Check size={10} className="text-success" /> : 
                <div className="w-2.5 h-2.5 rounded-full border border-base-300 mr-0.5" />
              }
              {step.icon}
              <span>{step.text}</span>
              {index === activeStepIndex && (
                <span className="w-1 h-1 rounded-full bg-primary animate-pulse ml-0.5"></span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Barra de progreso */}
      <progress 
        className="progress progress-primary h-1 w-full mt-3" 
        value={progress} 
        max="100"
      ></progress>
    </div>
  );
}