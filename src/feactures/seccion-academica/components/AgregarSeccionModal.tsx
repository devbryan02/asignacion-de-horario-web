import { useState, useEffect, useRef } from 'react';
import { X, BookOpen, Calendar, AlertCircle, Check } from 'lucide-react';
import { SeccionRequest } from '../types';
import { fetchPeriodosAcademicos } from '@/feactures/periodo-academico/PeriodoAcademicaService';

interface AgregarSeccionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSeccion: (seccion: SeccionRequest) => Promise<void>;
}

type PeriodoAcademico = {
  id: string;
  nombre: string;
};

export default function AgregarSeccionModal({ isOpen, onClose, onCreateSeccion }: AgregarSeccionModalProps) {
  const [formData, setFormData] = useState<SeccionRequest>({
    nombre: '',
    periodoAcademicoId: '' as any
  });
  
  const [periodos, setPeriodos] = useState<PeriodoAcademico[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPeriodos, setLoadingPeriodos] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  
  // Refs para animación y focus
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Cargar periodos cuando se abre el modal
  useEffect(() => {
    const loadPeriodos = async () => {
      if (!isOpen) return;
      
      try {
        setLoadingPeriodos(true);
        const data = await fetchPeriodosAcademicos();
        setPeriodos(data);
      } catch (error) {
        console.error('Error cargando periodos académicos:', error);
        setErrorMensaje('Error al cargar los periodos académicos');
      } finally {
        setLoadingPeriodos(false);
      }
    };

    loadPeriodos();
    
    // Autofocus en el input de nombre cuando se abre el modal
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
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
      await onCreateSeccion(formData);
      // Reset form
      setFormData({
        nombre: '',
        periodoAcademicoId: '' as any
      });
      onClose();
    } catch (error) {
      console.error('Error al crear sección:', error);
      setErrorMensaje('Error al crear la sección. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        ref={modalRef} 
        className="bg-base-100 rounded-lg shadow-xl w-full max-w-md border border-base-300"
      >
        {/* Modal Header con gradiente y icono */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-t-lg p-4 flex justify-between items-center border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <h3 className="text-lg font-semibold text-base-content">Nueva Sección Académica</h3>
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
            Complete los campos para crear una nueva sección académica. Todos los campos son obligatorios.
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
                className="select select-bordered w-full pl-10 appearance-none"
                disabled={isLoading || loadingPeriodos}
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
                <span className="label-text-alt text-base-content/50">Seleccione el periodo académico al que pertenece esta sección</span>
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
                  <Check size={16} />
                  Guardar Sección
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}