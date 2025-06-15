"use client";

import React, { useState, useEffect } from "react";
import { 
  Clipboard, Download, BarChart2, PieChart,
  Building2, GraduationCap, BookOpen, Calendar
} from "lucide-react";
import { fetchAulas } from "@/feactures/aula/AulaService";
import { fetchDocentes } from "@/feactures/docente/DocenteService";
import { fetchSeccionAcademica } from "@/feactures/seccion-academica/SeccionAcademicaService";

const DashboardPage = () => {
  // Estados para los datos
  const [aulas, setAulas] = useState<any[]>([]);
  const [docentes, setDocentes] = useState<any[]>([]);
  const [secciones, setSecciones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos reales al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Cargar aulas
        console.log("Cargando aulas...");
        const aulasData = await fetchAulas();
        console.log("Aulas cargadas:", aulasData);
        setAulas(Array.isArray(aulasData) ? aulasData : []);
        
        // Cargar docentes
        console.log("Cargando docentes...");
        const docentesData = await fetchDocentes();
        console.log("Docentes cargados:", docentesData);
        setDocentes(Array.isArray(docentesData) ? docentesData : []);
        
        // Cargar secciones
        console.log("Cargando secciones...");
        const seccionesData = await fetchSeccionAcademica();
        console.log("Secciones cargadas:", seccionesData);
        setSecciones(Array.isArray(seccionesData) ? seccionesData : []);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("Error al cargar datos. Por favor, intente nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Calcular porcentajes de tipos de aulas para el gráfico radial
  const calcularPorcentajesAulas = () => {
    if (aulas.length === 0) return { teorico: 0, laboratorio: 0 };
    
    const teorico = aulas.filter(a => a?.tipo === 'TEORICO').length;
    const laboratorio = aulas.filter(a => a?.tipo === 'LABORATORIO').length;
    
    const total = teorico + laboratorio;
    
    return {
      teorico: Math.round((teorico / total) * 100) || 0,
      laboratorio: Math.round((laboratorio / total) * 100) || 0
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <div className="text-center">
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
          <p className="mt-4 text-base-content/70">Cargando recursos académicos...</p>
        </div>
      </div>
    );
  }

  const porcentajesAulas = calcularPorcentajesAulas();
  const aulasTeorico = aulas.filter(a => a?.tipo === 'TEORICO').length;
  const aulasLaboratorio = aulas.filter(a => a?.tipo === 'LABORATORIO').length;
  const seccionesPorDocente = docentes.length > 0 
    ? (secciones.length / docentes.length).toFixed(1) 
    : "0";

  return (
    <div className="container mx-auto p-4 md:p-8 bg-base-100 rounded-box min-h-screen">
      {/* Header modernizado */}
      <div className="mb-8 border-b pb-4 border-base-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-base-content">Reportes del Sistema</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="badge badge-ghost">Dashboard</div>
              <p className="text-sm text-base-content/60">Análisis de recursos académicos</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-base-200 px-4 py-2 rounded-xl">
            <Calendar className="text-primary" size={18} />
            <div>
              <div className="text-xs text-base-content/60">Periodo actual</div>
              <div className="font-semibold text-sm">2023-II</div>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-error shadow-lg mb-6 max-w-xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}
      
      {/* Stats cards - Diseño moderno con tarjetas con borde */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stats bg-base-100 shadow border border-base-200 rounded-2xl overflow-hidden">
          <div className="stat">
            <div className="stat-figure text-primary">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary/10">
                <Building2 size={24} className="text-primary" />
              </div>
            </div>
            <div className="stat-title text-base-content/60 font-medium">Aulas</div>
            <div className="stat-value text-4xl my-1">{aulas.length}</div>
            <div className="stat-desc flex gap-2 text-xs">
              <span className="badge badge-primary badge-sm">{aulasTeorico} Teóricas</span>
              <span className="badge badge-accent badge-sm">{aulasLaboratorio} Labs</span>
            </div>
          </div>
        </div>
        
        <div className="stats bg-base-100 shadow border border-base-200 rounded-2xl overflow-hidden">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-secondary/10">
                <GraduationCap size={24} className="text-secondary" />
              </div>
            </div>
            <div className="stat-title text-base-content/60 font-medium">Docentes</div>
            <div className="stat-value text-4xl my-1">{docentes.length}</div>
            <div className="stat-desc text-xs">Activos en este periodo</div>
          </div>
        </div>
        
        <div className="stats bg-base-100 shadow border border-base-200 rounded-2xl overflow-hidden">
          <div className="stat">
            <div className="stat-figure text-accent">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-accent/10">
                <BookOpen size={24} className="text-accent" />
              </div>
            </div>
            <div className="stat-title text-base-content/60 font-medium">Secciones</div>
            <div className="stat-value text-4xl my-1">{secciones.length}</div>
            <div className="stat-desc text-xs">{seccionesPorDocente} por docente</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Distribución visual de aulas - Con diseño moderno */}
        <div className="card bg-base-100 shadow-md border border-base-200 rounded-2xl">
          <div className="card-body px-6">
            <h2 className="card-title flex items-center gap-2 pb-2 border-b border-base-200">
              <PieChart className="text-primary" size={18} />
              <span>Distribución de tipos de aulas</span>
            </h2>
            
            <div className="py-6">
              {aulas.length === 0 ? (
                <div className="alert alert-info bg-info/10 border-info/20 text-base-content">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>No hay datos de aulas disponibles en el sistema.</span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
                    <div className="relative">
                      <div className="tooltip tooltip-primary" data-tip={`${porcentajesAulas.teorico}% Aulas teóricas`}>
                        <div 
                          className="radial-progress text-primary border-4 border-primary/20" 
                          style={{ "--value": porcentajesAulas.teorico, "--size": "12rem", "--thickness": "8px" } as React.CSSProperties}
                        >
                        </div>
                      </div>
                      <div className="tooltip tooltip-accent absolute inset-0" data-tip={`${porcentajesAulas.laboratorio}% Laboratorios`}>
                        <div 
                          className="radial-progress text-accent border-4 border-accent/20" 
                          style={{ "--value": porcentajesAulas.laboratorio, "--size": "9rem", "--thickness": "8px" } as React.CSSProperties}
                        >
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center bg-base-100 rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-sm">
                          <p className="text-xl font-bold">{aulas.length}</p>
                          <p className="text-xs text-base-content/60">Total</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="divider md:divider-horizontal"></div>
                    
                    <div className="stats stats-vertical shadow bg-base-100 text-base-content border border-base-200">
                      <div className="stat px-6 py-3">
                        <div className="stat-title flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-sm"></div>
                          <span>Aulas Teóricas</span>
                        </div>
                        <div className="stat-value text-2xl">{aulasTeorico}</div>
                        <div className="stat-desc">{porcentajesAulas.teorico}% del total</div>
                      </div>
                      <div className="stat px-6 py-3">
                        <div className="stat-title flex items-center gap-2">
                          <div className="w-3 h-3 bg-accent rounded-sm"></div>
                          <span>Laboratorios</span>
                        </div>
                        <div className="stat-value text-2xl">{aulasLaboratorio}</div>
                        <div className="stat-desc">{porcentajesAulas.laboratorio}% del total</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divider">Detalle de aulas</div>
                  
                  <div className="overflow-x-auto">
                    <table className="table table-zebra bg-base-100">
                      <thead className="bg-base-200 text-base-content">
                        <tr>
                          <th>Nombre</th>
                          <th>Tipo</th>
                          <th>Capacidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aulas.slice(0, 5).map((aula, i) => (
                          <tr key={i} className="hover">
                            <td className="font-medium">{aula.nombre}</td>
                            <td>
                              <div className={`badge ${
                                aula.tipo === 'LABORATORIO' 
                                  ? 'badge-accent' 
                                  : 'badge-primary'
                              } badge-outline badge-sm`}>
                                {aula.tipo === 'LABORATORIO' ? 'Laboratorio' : 'Teórico'}
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <span>{aula.capacidad}</span>
                                <progress 
                                  className={`progress ${aula.capacidad > 30 ? 'progress-warning' : 'progress-success'} w-14`} 
                                  value={aula.capacidad} 
                                  max="50"
                                ></progress>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {aulas.length > 5 && (
                          <tr>
                            <td colSpan={3} className="text-center text-sm text-base-content/60">
                              <button className="btn btn-ghost btn-xs">Ver todas las {aulas.length} aulas</button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div> 
        
        {/* Mensaje cuando no hay datos */}
        {aulas.length === 0 && docentes.length === 0 && secciones.length === 0 && (
          <div className="card bg-base-100 shadow-md border border-warning/30">
            <div className="card-body">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-warning/20 flex items-center justify-center text-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold">No hay datos disponibles</h3>
                  <p className="text-base-content/70 mt-1">No se encontraron recursos académicos en el sistema. Verifique la conexión con el servidor o configure nuevos recursos.</p>
                  <div className="mt-4">
                    <button className="btn btn-outline btn-sm">Reintentar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;