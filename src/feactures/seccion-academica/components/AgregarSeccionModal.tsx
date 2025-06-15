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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="card bg-base-100 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="card-body p-0">
          <div className="relative bg-gradient-to-r from-primary/10 to-transparent p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/15 p-3 rounded-full text-primary">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Nueva Sección</h3>
                <p className="text-sm text-base-content/70">
                  Complete la información para crear una sección
                </p>
              </div>
            </div>
            
            {/* Close button */}
            <button 
              onClick={onClose}
              className="btn btn-sm btn-circle absolute right-4 top-4"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Campo de Nombre */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Nombre de la Sección</span>
              </label>
              <div className="relative">
                <BookOpen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <input
                  ref={inputRef}
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Sección A"
                  className="input input-bordered w-full pl-10 bg-base-100 focus:ring-2 focus:ring-primary/30 transition-all"
                  disabled={isLoading}
                />
              </div>
              <label className="label">
                <span className="label-text-alt text-base-content/60">Ingrese un nombre descriptivo</span>
              </label>
            </div>
            
            {/* Campo de Periodo Académico */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Periodo Académico</span>
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <select
                  name="periodoAcademicoId"
                  value={formData.periodoAcademicoId}
                  onChange={handleInputChange}
                  className="select select-bordered w-full pl-10 bg-base-100 focus:ring-2 focus:ring-primary/30 transition-all"
                  disabled={isLoading || loadingPeriodos}
                >
                  <option value="">Seleccionar periodo</option>
                  {periodos.map((periodo) => (
                    <option key={periodo.id} value={periodo.id}>
                      {periodo.nombre}
                    </option>
                  ))}
                </select>
                {loadingPeriodos && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="loading loading-spinner loading-xs text-primary"></span>
                  </div>
                )}
              </div>
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  {loadingPeriodos ? "Cargando periodos..." : "Seleccione el periodo académico"}
                </span>
              </label>
            </div>
          
            {/* Mensaje de error */}
            {errorMensaje && (
              <div className="alert alert-error shadow-sm text-sm">
                <AlertCircle size={16} />
                <span>{errorMensaje}</span>
              </div>
            )}
          </form>
          
          {/* Footer */}
          <div className="card-actions justify-end p-4 bg-base-200/30">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary btn-sm"
              disabled={isLoading || loadingPeriodos}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Guardando
                </>
              ) : (
                <>
                  <Check size={14} />
                  Guardar Sección
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}