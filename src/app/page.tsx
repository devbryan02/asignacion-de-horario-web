"use client";

import { useState, useEffect } from "react";
import LoginForm from "@/feactures/autenticacion/components/LoginForm";
import RegisterForm from "@/feactures/autenticacion/components/RegisterForm";
import { AuthProvider } from "@/feactures/autenticacion/hooks/useAuth";
import { 
  LogIn, UserPlus, Clock, Calendar, CheckSquare, BookOpen, 
  Users, School, ChevronRight, Award, BarChart, Layers
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AuthProvider>
      <main className="min-h-screen bg-base-200 flex flex-col items-center">
        {/* Header con logo - responsivo */}
        <div className="w-full bg-base-100 shadow-sm py-4 mb-6">
          <div className="container max-w-5xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <School className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary hidden xs:inline">HorarioPontificia</span>
            </div>
            <div className="badge badge-primary gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden xs:inline">Gestión de Horarios</span>
            </div>
          </div>
        </div>

        {/* Main content grid - ajustado para responsividad */}
        <div className="container max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 px-4">
          {/* Columna de información - ajustada para móvil */}
          <div className={`card bg-base-100 shadow-xl transition-all duration-500 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} order-2 md:order-1`}>
            <div className="card-body p-4 sm:p-6">
              <h2 className="card-title text-xl sm:text-2xl">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <span className="line-clamp-2">Gestiona horarios de forma eficiente</span>
              </h2>
              
              {/* Stats mejoradas para responsividad */}
              <div className="stats shadow mt-4 stats-vertical sm:stats-horizontal overflow-x-auto w-full">
                <div className="stat">
                  <div className="stat-figure text-primary">
                    <BarChart className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <div className="stat-title text-xs sm:text-sm">Horarios</div>
                  <div className="stat-value text-2xl sm:text-3xl">100%</div>
                  <div className="stat-desc text-xs">Eficiencia en la gestión</div>
                </div>
                
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <div className="stat-title text-xs sm:text-sm">Usuarios</div>
                  <div className="stat-value text-2xl sm:text-3xl">+500</div>
                  <div className="stat-desc text-xs">Profesores y administrativos</div>
                </div>
              </div>
              
              <div className="divider my-2 sm:my-4"></div>
              
              {/* Características con mejor responsividad */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="badge badge-lg badge-primary p-2 sm:p-3 flex-shrink-0">
                    <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm sm:text-base">Control completo</h3>
                    <p className="text-xs sm:text-sm text-base-content/70">Asignación de horarios para las clases con prevención de conflictos</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="badge badge-lg badge-secondary p-2 sm:p-3 flex-shrink-0">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm sm:text-base">Dashboard moderno</h3>
                    <p className="text-xs sm:text-sm text-base-content/70">Visualiza horarios, disponibilidad de aulas y estadísticas en tiempo real</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="badge badge-lg badge-accent p-2 sm:p-3 flex-shrink-0">
                    <Layers className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm sm:text-base">Coordinación eficiente</h3>
                    <p className="text-xs sm:text-sm text-base-content/70">Gestiona profesores, materias y salones con facilidad y sin conflictos</p>
                  </div>
                </div>
              </div>
              
              {/* Badges en contenedor con scroll horizontal para móvil */}
              <div className="card-actions justify-center mt-4 sm:mt-6 flex-wrap">
                <div className="badge badge-outline">Control</div> 
                <div className="badge badge-outline">Estadísticas</div>
                <div className="badge badge-outline">Reportes</div>
              </div>
            </div>
          </div>
          
          {/* Columna de autenticación - primera en móvil */}
          <div className={`card bg-base-100 shadow-xl transition-all duration-500 transform ${mounted ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-4'} order-1 md:order-2 mb-4 md:mb-0`}>
            <div className="tabs tabs-boxed m-2 mt-3">
              <button 
                className={`tab grow text-xs sm:text-sm ${activeTab === 'login' ? 'tab-active bg-primary rounded text-white' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                <LogIn className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="whitespace-nowrap">Iniciar Sesión</span>
              </button>
              <button 
                className={`tab grow text-xs sm:text-sm ${activeTab === 'register' ? 'tab-active bg-secondary rounded text-white' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="whitespace-nowrap">Registrarse</span>
              </button>
            </div>
            
            <div className="card-body p-4 sm:p-6">
              {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
              
              <div className="divider text-xs text-base-content/50 my-2 sm:my-4">Acceso institucional</div>
              
              <div className="flex items-center justify-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-xs sm:text-sm">Escuela Superior La Pontificia</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Separator before footer */}
        <div className="container max-w-5xl px-4 w-full">
          <div className="divider"></div>
        </div>
        
        {/* Footer responsivo */}
        <footer className="footer footer-center p-4 bg-base-300 text-base-content w-full">
          <div className="flex flex-col sm:flex-row items-center gap-2 justify-center">
            <div className="flex items-center">
              <School className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-bold">HorarioPontificia</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <p className="text-xs">© {new Date().getFullYear()} - Sistema de Asignación de Horarios</p>
          </div>
        </footer>
      </main>
    </AuthProvider>
  );
}