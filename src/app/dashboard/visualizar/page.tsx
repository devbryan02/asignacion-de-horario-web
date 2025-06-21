"use client";

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  User, 
  CalendarRange, 
  Search, 
  CalendarCheck, 
  Loader2
} from 'lucide-react';
import dynamic from 'next/dynamic';
import VistaHorarioSemanal from '@/feactures/visualizar-horario/components/CalendarioSemanal';
import { fetchDocentes } from '@/feactures/docente/DocenteService';
import { fetchSeccionAcademica } from '@/feactures/seccion-academica/SeccionAcademicaService';
import { fetchPeriodosAcademicos } from '@/feactures/periodo-academico/PeriodoAcademicaService';

// Importar React Select de forma dinámica para evitar problemas de hidratación
const Select = dynamic(() => import('react-select'), { 
  ssr: false, // Importante: deshabilitar SSR para este componente
  loading: () => <div className="h-12 min-h-[3rem] w-full bg-base-200 animate-pulse rounded-lg"></div>
});

type OptionType = {
  value: string;
  label: string;
};

export default function VisualizarHorarioPage() {
  const [modo, setModo] = useState<'seccion' | 'docente' | 'periodo'>('seccion');
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Options for each entity type
  const [docentes, setDocentes] = useState<OptionType[]>([]);
  const [secciones, setSecciones] = useState<OptionType[]>([]);
  const [periodos, setPeriodos] = useState<OptionType[]>([]);

  // Establecer isMounted a true después de que el componente se monte
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset selection when mode changes
  useEffect(() => {
    setSelectedOption(null);
    setBusquedaActiva(false);
  }, [modo]);

  // Load data for each entity type
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Load docentes if they haven't been loaded yet or if mode is 'docente'
        if (modo === 'docente' && docentes.length === 0) {
          const docentesData = await fetchDocentes();
          setDocentes(docentesData.map(docente => ({
            value: docente.id,
            label: docente.nombre
          })));
        }
        
        // Load secciones if they haven't been loaded yet or if mode is 'seccion'
        if (modo === 'seccion' && secciones.length === 0) {
          const seccionesData = await fetchSeccionAcademica();
          setSecciones(seccionesData.map(seccion => ({
            value: seccion.id,
            label: seccion.nombre
          })));
        }
        
        // Load periodos if they haven't been loaded yet or if mode is 'periodo'
        if (modo === 'periodo' && periodos.length === 0) {
          const periodosData = await fetchPeriodosAcademicos();
          setPeriodos(periodosData.map(periodo => ({
            value: periodo.id,
            label: `${periodo.nombre} (${periodo.fechaInicio.substring(0, 10)} - ${periodo.fechaFin.substring(0, 10)})`
          })));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (isMounted) {
      loadData();
    }
  }, [modo, isMounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption) {
      setBusquedaActiva(true);
    }
  };

  // Get current options based on selected mode
  const getCurrentOptions = () => {
    switch (modo) {
      case 'docente': return docentes;
      case 'seccion': return secciones;
      case 'periodo': return periodos;
      default: return [];
    }
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      height: '3rem',
      borderRadius: 'var(--rounded-btn, 0.5rem)',
      borderColor: 'hsl(var(--bc) / 0.2)',
      '&:hover': {
        borderColor: 'hsl(var(--bc) / 0.4)'
      }
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 50
    })
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <CalendarCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Visualización de Horarios</h1>
            <p className="text-base-content/70">
              Consulta los horarios por sección, docente o periodo académico
            </p>
          </div>
        </div>
      </div>

      {/* Tarjeta de filtros */}
      <div className="card bg-base-100 shadow-md border border-base-200 mb-6">
        <div className="card-body">
          <h2 className="card-title text-lg mb-4">Filtros de Visualización</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Selector de modo */}
              <div>
                <label className="label">
                  <span className="label-text">Visualizar por</span>
                </label>
                <div className="join w-full">
                  <button
                    type="button"
                    className={`join-item btn ${modo === 'seccion' ? 'btn-primary' : 'btn-outline'} flex-1`}
                    onClick={() => setModo('seccion')}
                  >
                    <BookOpen size={16} />
                    <span>Sección</span>
                  </button>
                  <button
                    type="button"
                    className={`join-item btn ${modo === 'docente' ? 'btn-primary' : 'btn-outline'} flex-1`}
                    onClick={() => setModo('docente')}
                  >
                    <User size={16} />
                    <span>Docente</span>
                  </button>
                  <button
                    type="button"
                    className={`join-item btn ${modo === 'periodo' ? 'btn-primary' : 'btn-outline'} flex-1`}
                    onClick={() => setModo('periodo')}
                  >
                    <CalendarRange size={16} />
                    <span>Periodo</span>
                  </button>
                </div>
              </div>
              
              {/* Selector dropdown */}
              <div>
                <label className="label">
                  <span className="label-text">
                    {modo === 'seccion' && 'Seleccione una sección'}
                    {modo === 'docente' && 'Seleccione un docente'}
                    {modo === 'periodo' && 'Seleccione un periodo académico'}
                  </span>
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    {isMounted && (
                      <Select
                        instanceId="filter-select" // Agregar un ID estático
                        value={selectedOption}
                        onChange={(option) => setSelectedOption(option as OptionType | null)}
                        options={getCurrentOptions()}
                        placeholder={loading ? "Cargando..." : "Seleccionar..."}
                        isDisabled={loading}
                        styles={selectStyles}
                        isClearable
                        className="text-base-content"
                        noOptionsMessage={() => "No hay opciones disponibles"}
                      />
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!selectedOption || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Cargando</span>
                      </>
                    ) : (
                      <>
                        <Search size={16} />
                        <span>Buscar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Vista de horarios en formato tabla */}
      {busquedaActiva && selectedOption && (
        <div className="mt-8">
          <VistaHorarioSemanal modo={modo} id={selectedOption.value} />
        </div>
      )}

      {/* Mensaje inicial cuando no hay búsqueda activa */}
      {!busquedaActiva && (
        <div className="mt-10 text-center p-10 border border-base-200 rounded-lg bg-base-100">
          <div className="mb-4 flex justify-center">
            <CalendarRange size={64} className="text-primary/50" />
          </div>
          <h3 className="text-xl font-medium mb-2">Consulta los horarios</h3>
          <p className="text-base-content/70 max-w-md mx-auto">
            Selecciona un modo de visualización y elige la opción correspondiente para 
            ver los horarios en formato de calendario semanal.
          </p>
        </div>
      )}
    </div>
  );
}