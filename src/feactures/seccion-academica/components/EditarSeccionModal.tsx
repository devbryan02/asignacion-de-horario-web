"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Save, Calendar, BookOpen, AlertCircle, School } from 'lucide-react';
import { SeccionRequest, SeccionResponse } from '../types';
import { fetchPeriodosAcademicos } from '@/feactures/periodo-academico/PeriodoAcademicaService';
import { UUID } from 'crypto';

interface EditarSeccionModalProps {
  seccion: SeccionResponse;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSeccion: (id: UUID, seccion: SeccionRequest) => Promise<void>;
}

type PeriodoAcademico = {
  id: string;
  nombre: string;
};

export default function EditarSeccionModal({ 
  seccion, 
  isOpen, 
  onClose, 
  onUpdateSeccion 
}: EditarSeccionModalProps) {
  const [formData, setFormData] = useState<SeccionRequest>({
    nombre: seccion.nombre,
    periodoAcademicoId: '' as any
  });
  
  const [periodos, setPeriodos] = useState<PeriodoAcademico[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPeriodos, setLoadingPeriodos] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  
  // Refs para animación y focus
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadPeriodos = async () => {
      if (!isOpen) return;
      
      try {
        setLoadingPeriodos(true);
        const data = await fetchPeriodosAcademicos();
        setPeriodos(data);
        
        // Intentar encontrar el periodo basado en el nombre
        const periodoActual = data.find((p: PeriodoAcademico) => p.nombre === seccion.periodoAcademico);
        if (periodoActual) {
          setFormData(prev => ({
            ...prev,
            periodoAcademicoId: periodoActual.id
          }));
        }
      } catch (error) {
        console.error('Error cargando periodos académicos:', error);
        setErrorMensaje('Error al cargar los periodos académicos');
      } finally {
        setLoadingPeriodos(false);
      }
    };

    if (isOpen) {
      loadPeriodos();
      
      // Autofocus en el input de nombre cuando se abre el modal
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, seccion]);
  
  // Efecto para animar entrada del modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.classList.add('animate-in');
      modalRef.current.classList.add('fade-in');
      modalRef.current.classList.add('duration-300');
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMensaje) setErrorMensaje(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre.trim()) {
      setErrorMensaje('El nombre de la sección es obligatorio');
      inputRef.current?.focus();
      return;
    }
    
    if (!formData.periodoAcademicoId) {
      setErrorMensaje('Debe seleccionar un periodo académico');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMensaje(null);
      await onUpdateSeccion(seccion.id, formData);
      onClose();
    } catch (error) {
      console.error('Error al actualizar sección:', error);
      setErrorMensaje('Error al actualizar la sección. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-base-content/45 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        ref={modalRef} 
        className="bg-base-100 rounded-lg shadow-xl w-full max-w-md border border-base-300"
      >
        {/* Modal Header con gradiente y icono */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-t-lg p-4 flex justify-between items-center border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <School size={18} />
            </div>
            <h3 className="text-lg font-semibold text-base-content">Editar Sección Académica</h3>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-sm btn-ghost btn-circle"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Mensaje instructivo */}
          <p className="text-sm text-base-content/70 mb-6">
            Modifique los datos de la sección académica. El periodo académico no puede cambiarse.
          </p>
        
          {/* Campo de Nombre con icono */}
          <div className="form-control mb-5">
            <label className="label">
              <span className="label-text font-medium">Nombre de la Sección</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center">
                <BookOpen size={16} className="text-base-content/50" />
              </span>
              <input
                ref={inputRef}
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Sección A"
                className="input input-bordered w-full pl-10"
                disabled={isLoading}
              />
            </div>
            <label className="label">
              <span className="label-text-alt text-base-content/50">Ingrese un nombre descriptivo y único</span>
            </label>
          </div>
          
          {/* Campo de Periodo Académico con icono */}
          <div className="form-control mb-5">
            <label className="label">
              <span className="label-text font-medium">Periodo Académico</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center">
                <Calendar size={16} className="text-base-content/50" />
              </span>
              <select
                id="periodoAcademicoId"
                name="periodoAcademicoId"
                value={formData.periodoAcademicoId}
                onChange={handleInputChange}
                className="select select-bordered w-full pl-10 appearance-none bg-base-200/50"
                disabled={true}
              >
                <option value="">Seleccionar periodo académico</option>
                {periodos.map((periodo) => (
                  <option key={periodo.id} value={periodo.id}>
                    {periodo.nombre}
                  </option>
                ))}
              </select>
            </div>
            {loadingPeriodos ? (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-base-content/50">
                  <span className="loading loading-spinner loading-xs"></span>
                  Cargando periodos académicos...
                </span>
              </label>
            ) : (
              <label className="label">
                <span className="label-text-alt flex items-center gap-1 text-base-content/50">
                  <AlertCircle size={12} />
                  <span>El periodo académico no se puede modificar</span>
                </span>
              </label>
            )}
          </div>
          
          {/* Mensaje de error mejorado */}
          {errorMensaje && (
            <div className="bg-error/10 text-error rounded-lg px-4 py-3 mb-6 flex items-start gap-3">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span className="text-sm">{errorMensaje}</span>
            </div>
          )}
          
          {/* Botones de acción con mejor UX */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-base-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || loadingPeriodos}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Actualizar Sección
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}