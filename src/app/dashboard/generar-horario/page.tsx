"use client";

import { useGenerarHorario } from '@/feactures/generar-horario/hooks/useGenerarHorario';
import { 
  CalendarClock, 
  CalendarCheck, 
  Cpu, 
  Settings, 
  PieChart, 
  Clock, 
  BookOpen,
  Lightbulb,
  Users,
  Zap,
  Medal
} from 'lucide-react';
import ResultadoGeneracionHorario from '@/feactures/generar-horario/components/ResultadoGeneracionHorario';
import EstadoCargaHorario from '@/feactures/generar-horario/components/EstadocargaHorario';
import ErrorGeneracionHorario from '@/feactures/generar-horario/components/ErrorGeneracionHorario';

export default function GenerarHorarioPage() {
  const { isLoading, resultado, error, generarHorario, resetearResultado } = useGenerarHorario();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header con diseño moderno */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-r from-primary/20 to-primary/5 text-primary p-3 rounded-xl flex items-center justify-center">
            <CalendarClock size={28} />
          </div>
          
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">
              Generación de Horarios
            </h1>
            <p className="text-base-content/70">
              Generación automática de horarios optimizados
            </p>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Tarjeta principal con diseño modernizado */}
          <div className="card bg-base-100 shadow-md border border-base-200 overflow-hidden">
            {/* Header elegante */}
            <div className="bg-gradient-to-r from-primary/15 to-transparent px-6 py-4 border-b border-base-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <Settings className="text-primary" size={20} />
                  Generación de horarios
                </h2>
                
                <span className="badge badge-primary badge-outline gap-1 px-3 py-2">
                  <Zap size={14} /> 
                  <span>OptaPlanner</span>
                </span>
              </div>
            </div>
            
            <div className="card-body">
              <p className="mb-6 text-base-content/80">
                El sistema generará automáticamente un horario optimizado basado en las restricciones, 
                preferencias y disponibilidad configuradas previamente.
              </p>
              
              {/* Estado de carga */}
              {isLoading && <EstadoCargaHorario />}
              
              {/* Resultados */}
              {resultado && !isLoading && (
                <ResultadoGeneracionHorario 
                  resultado={resultado} 
                  onReiniciar={resetearResultado} 
                />
              )}
              
              {/* Estado de error */}
              {error && !isLoading && (
                <ErrorGeneracionHorario 
                  mensaje={error}
                  onReiniciar={resetearResultado}
                  errorCode="OPTAPLANNER-E1"
                />
              )}
              
              {/* Botón de acción modernizado */}
              {!isLoading && !resultado && !error && (
                <div className="card-actions justify-end mt-6">
                  <button 
                    className="btn btn-primary btn-wide gap-2 shadow-sm"
                    onClick={generarHorario}
                    disabled={isLoading}
                  >
                    <CalendarCheck size={18} />
                    <span>Generar Horario</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Tarjetas informativas en grid con diseño mejorado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tarjeta sobre OptaPlanner */}
            <div className="card bg-gradient-to-b from-base-100 to-base-100/98 shadow-md hover:shadow-lg transition-shadow border border-base-200">
              <div className="card-body p-5">
                <div className="flex items-start gap-4 mb-3">
                  <div className="bg-info/15 text-info p-2.5 rounded-lg">
                    <Cpu size={20} />
                  </div>
                  <h3 className="font-medium text-lg">OptaPlanner</h3>
                </div>
                
                <p className="text-base-content/70">
                  Motor de planificación que implementa algoritmos avanzados de optimización para resolver problemas complejos.
                </p>
                
                <div className="flex gap-2 mt-3">
                  <span className="badge badge-sm badge-info">Inteligente</span>
                  <span className="badge badge-sm badge-info">Adaptativo</span>
                </div>
              </div>
            </div>
            
            {/* Tarjeta sobre ventajas */}
            <div className="card bg-gradient-to-b from-base-100 to-base-100/98 shadow-md hover:shadow-lg transition-shadow border border-base-200">
              <div className="card-body p-5">
                <div className="flex items-start gap-4 mb-3">
                  <div className="bg-success/15 text-success p-2.5 rounded-lg">
                    <Medal size={20} />
                  </div>
                  <h3 className="font-medium text-lg">Ventajas</h3>
                </div>
                
                <p className="text-base-content/70">
                  Optimización multi-objetivo, respeto de restricciones duras y blandas, y soluciones de alta calidad.
                </p>
                
                <div className="flex gap-2 mt-3">
                  <span className="badge badge-sm badge-success">Eficiente</span>
                  <span className="badge badge-sm badge-success">Preciso</span>
                </div>
              </div>
            </div>
            
            {/* Tarjeta sobre cómo funciona */}
            <div className="card bg-gradient-to-b from-base-100 to-base-100/98 shadow-md hover:shadow-lg transition-shadow border border-base-200">
              <div className="card-body p-5">
                <div className="flex items-start gap-4 mb-3">
                  <div className="bg-warning/15 text-warning p-2.5 rounded-lg">
                    <Lightbulb size={20} />
                  </div>
                  <h3 className="font-medium text-lg">Funcionamiento</h3>
                </div>
                
                <p className="text-base-content/70">
                  Evalúa millones de combinaciones usando búsqueda local, recocido simulado y búsqueda tabú.
                </p>
                
                <div className="flex gap-2 mt-3">
                  <span className="badge badge-sm badge-warning">Inteligente</span>
                  <span className="badge badge-sm badge-warning">Optimizado</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Características con diseño renovado */}
          <div className="card bg-base-100 shadow-md border border-base-200 overflow-hidden">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-5 pb-2 border-b border-base-200">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                  <PieChart size={18} />
                </div>
                <h3 className="font-medium text-lg">Características</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 group">
                  <div className="bg-primary/10 rounded-lg p-2.5 group-hover:bg-primary/15 transition-colors">
                    <Clock className="text-primary" size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Optimización temporal</h4>
                    <p className="text-sm text-base-content/70">Distribución óptima en franjas horarias garantizando los mejores resultados</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="bg-primary/10 rounded-lg p-2.5 group-hover:bg-primary/15 transition-colors">
                    <BookOpen className="text-primary" size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Asignación de recursos</h4>
                    <p className="text-sm text-base-content/70">Aulas asignadas eficientemente según capacidad y necesidades específicas</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="bg-primary/10 rounded-lg p-2.5 group-hover:bg-primary/15 transition-colors">
                    <Users className="text-primary" size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Preferencias docentes</h4>
                    <p className="text-sm text-base-content/70">Respeto de disponibilidad individual y preferencias de cada profesor</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="bg-primary/10 rounded-lg p-2.5 group-hover:bg-primary/15 transition-colors">
                    <Settings className="text-primary" size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Configuración flexible</h4>
                    <p className="text-sm text-base-content/70">Adaptable a distintas políticas institucionales y requisitos especiales</p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-center bg-base-200/50 rounded-lg p-3 mt-6">
                <div className="flex items-center justify-center gap-2">
                  <Cpu size={14} className="text-primary" />
                  <span className="text-base-content/70">
                    Powered by OptaPlanner - Solución de optimización de clase mundial
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}