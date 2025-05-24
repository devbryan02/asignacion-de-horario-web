"use client";

import { useState } from 'react';
import { 
  BookOpen, 
  User, 
  CalendarRange, 
  Search, 
  CalendarCheck 
} from 'lucide-react';
import VistaHorarioSemanal from '@/feactures/visualizar-horario/components/CalendarioSemanal';

export default function VisualizarHorarioPage() {
  const [modo, setModo] = useState<'seccion' | 'docente' | 'periodo'>('seccion');
  const [id, setId] = useState('');
  const [busquedaActiva, setBusquedaActiva] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim()) {
      setBusquedaActiva(true);
    }
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
              
              {/* Campo de búsqueda */}
              <div>
                <label className="label">
                  <span className="label-text">
                    {modo === 'seccion' && 'ID de la sección'}
                    {modo === 'docente' && 'ID del docente'}
                    {modo === 'periodo' && 'ID del periodo académico'}
                  </span>
                </label>
                <div className="join w-full">
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Ingresa el ID"
                    className="input input-bordered w-full join-item"
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-primary join-item"
                    disabled={!id.trim()}
                  >
                    <Search size={16} />
                    <span>Buscar</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Vista de horarios en formato tabla */}
      {busquedaActiva && (
        <div className="mt-8">
          <VistaHorarioSemanal modo={modo} id={id} />
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
            Selecciona un modo de visualización e ingresa el ID correspondiente para 
            ver los horarios en formato de calendario semanal.
          </p>
        </div>
      )}
    </div>
  );
}