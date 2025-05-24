"use client";

import { useGenerarHorario } from '@/feactures/generar-horario/hooks/useGenerarHorario';
import { 
  CalendarClock, 
  CalendarCheck, 
  Cpu, 
  Settings, 
  PieChart, 
  Clock, 
  CheckCircle, 
  BookOpen,
  Lightbulb,
  Users,
  Zap,
  Medal
} from 'lucide-react';
import ResultadoGeneracionHorario from '@/feactures/generar-horario/components/ResultadoGeneracionHorario';
import EstadoCargaHorario from '@/feactures/generar-horario/components/EstadocargaHorario';
import ErrorGeneracionHorario from '@/feactures/generar-horario/components/ErrorGeneracionHorario';
import { motion } from 'framer-motion';

export default function GenerarHorarioPage() {
  const { isLoading, resultado, error, generarHorario, resetearResultado } = useGenerarHorario();

  const container = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.4
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={container}
      className="container mx-auto p-6 pb-12"
    >
      {/* Header con gradiente moderno */}
      <motion.div variants={item} className="mb-10">
        <div className="relative mb-10">
          {/* Círculos decorativos de fondo */}
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-secondary/5 blur-2xl"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-secondary/70 flex items-center justify-center text-white shadow-lg shadow-primary/20 p-0.5">
              <div className="w-full h-full bg-base-100 rounded-xl flex items-center justify-center">
                <CalendarClock size={28} className="text-primary" />
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-1">
                Generación de Horarios
              </h1>
              <p className="text-base-content/70">
                Utilice el algoritmo avanzado para generar horarios optimizados automáticamente
              </p>
            </div>
          </div>
        </div>
        
        <motion.div variants={item} className="flex flex-col gap-8 mb-8">
          {/* Tarjeta principal de generación con efecto glassmorphism */}
          <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden backdrop-blur-sm">
            {/* Header con gradiente premium */}
            <div className="bg-gradient-to-r from-primary/20 via-secondary/10 to-transparent px-8 py-4 border-b border-base-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Settings className="text-primary" size={20} />
                  Generación automática de horarios
                </h2>
                
                <span className="badge badge-primary badge-outline gap-1 py-2 px-3">
                  <Zap size={14} /> 
                  <span>OptaPlanner</span>
                </span>
              </div>
            </div>
            
            <div className="card-body relative">
              {/* Círculo decorativo */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
              
              <p className="mb-8 max-w-3xl text-base">
                El sistema generará automáticamente un horario optimizado basado en todas las restricciones, 
                preferencias y disponibilidad configuradas previamente. Utilizamos algoritmos avanzados
                para encontrar la mejor distribución posible.
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
              
              {/* Botón de acción con efectos modernos */}
              {!isLoading && !resultado && !error && (
                <div className="card-actions justify-end mt-8 relative z-10">
                  <motion.button 
                    className="relative btn btn-primary btn-lg gap-3 shadow-lg shadow-primary/20 px-8 overflow-hidden group"
                    onClick={generarHorario}
                    disabled={isLoading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Efecto de brillo en hover */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    
                    <CalendarCheck size={20} />
                    <span>Generar Horario Optimizado</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
          
          {/* Información sobre el algoritmo con tarjetas modernas */}
          <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tarjeta sobre OptaPlanner */}
            <div className="card bg-gradient-to-br from-base-100 to-base-100/95 shadow-md border border-base-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative px-6 py-6">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-info/5 rounded-full blur-2xl"></div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-info to-info/70 flex items-center justify-center text-white shadow-md shadow-info/20">
                    <Cpu size={24} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="font-semibold text-lg mb-2">OptaPlanner</h3>
                    <p className="text-sm text-base-content/70">
                      Utilizamos el motor de planificación OptaPlanner, un solucionador de problemas de restricciones 
                      de código abierto que implementa algoritmos avanzados de optimización.
                    </p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className="badge badge-sm badge-info bg-opacity-20 text-info">Inteligente</span>
                      <span className="badge badge-sm badge-info bg-opacity-20 text-info">Adaptativo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tarjeta sobre ventajas */}
            <div className="card bg-gradient-to-br from-base-100 to-base-100/95 shadow-md border border-base-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative px-6 py-6">
                {/* Decoración de fondo */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-2xl"></div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-success to-success/70 flex items-center justify-center text-white shadow-md shadow-success/20">
                    <Medal size={24} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="font-semibold text-lg mb-2">Ventajas del algoritmo</h3>
                    <p className="text-sm text-base-content/70">
                      Optimización multi-objetivo, respeto de restricciones duras y blandas, tiempos de respuesta rápidos 
                      y soluciones de alta calidad incluso para problemas complejos.
                    </p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className="badge badge-sm badge-success bg-opacity-20 text-success">Eficiente</span>
                      <span className="badge badge-sm badge-success bg-opacity-20 text-success">Preciso</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tarjeta sobre cómo funciona */}
            <div className="card bg-gradient-to-br from-base-100 to-base-100/95 shadow-md border border-base-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative px-6 py-6">
                {/* Decoración de fondo */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-warning/5 rounded-full blur-2xl"></div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-warning to-warning/70 flex items-center justify-center text-white shadow-md shadow-warning/20">
                    <Lightbulb size={24} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="font-semibold text-lg mb-2">Cómo funciona</h3>
                    <p className="text-sm text-base-content/70">
                      El algoritmo evalúa millones de combinaciones posibles usando búsqueda local, recocido simulado y 
                      búsqueda tabú para encontrar la solución óptima a su problema de horarios.
                    </p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className="badge badge-sm badge-warning bg-opacity-20 text-warning">Inteligente</span>
                      <span className="badge badge-sm badge-warning bg-opacity-20 text-warning">Optimizado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Características del sistema con efecto neomorfismo */}
          <motion.div variants={item} className="card bg-gradient-to-br from-base-100 to-base-100/95 shadow-md border border-base-200">
            <div className="card-body">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-6 pb-2 border-b border-base-200">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <PieChart size={18} className="text-primary" />
                </div>
                <span>Características del generador de horarios</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                    <Clock className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-base">Optimización temporal</h4>
                    <p className="text-sm text-base-content/70 mt-1">Distribución óptima de clases en franjas horarias para maximizar eficiencia</p>
                  </div>
                </div>
                
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                    <BookOpen className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-base">Asignación de recursos</h4>
                    <p className="text-sm text-base-content/70 mt-1">Aulas y espacios asignados según capacidad, equipamiento y necesidades específicas</p>
                  </div>
                </div>
                
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                    <Users className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-base">Preferencias docentes</h4>
                    <p className="text-sm text-base-content/70 mt-1">Respeto de disponibilidad y preferencias individuales de cada profesor</p>
                  </div>
                </div>
                
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                    <Settings className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-base">Configuración flexible</h4>
                    <p className="text-sm text-base-content/70 mt-1">Adaptable a diferentes reglas institucionales y políticas educativas</p>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-center bg-gradient-to-r from-base-300/50 to-base-200/50 rounded-lg px-4 py-3 mt-8">
                <div className="flex items-center justify-center gap-2">
                  <Cpu size={14} className="text-primary" />
                  <span className="font-medium text-base-content/70">
                    Powered by OptaPlanner - Motor de planificación y optimización de restricciones
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}