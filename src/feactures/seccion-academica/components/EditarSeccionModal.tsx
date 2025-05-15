import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SeccionRequest, SeccionResponse } from '../types';
import { fetchPeriodosAcademicos } from '@/feactures/periodo-academico/PeriodoAcademicaService';

interface EditarSeccionModalProps {
  seccion: SeccionResponse;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSeccion: (id: string, seccion: SeccionRequest) => Promise<void>;
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
  // Necesitamos identificar el ID del periodo actual basado en el nombre
  const [formData, setFormData] = useState<SeccionRequest>({
    nombre: seccion.nombre,
    periodoAcademicoId: '' as any // Se llenará cuando se carguen los periodos
  });
  
  const [periodos, setPeriodos] = useState<PeriodoAcademico[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  useEffect(() => {
    const loadPeriodos = async () => {
      try {
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
      }
    };

    if (isOpen) {
      loadPeriodos();
    }
  }, [isOpen, seccion]);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Editar Sección Académica</h3>
          <button 
            onClick={onClose} 
            className="btn btn-sm btn-ghost btn-circle"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="nombre">
              Nombre de la Sección
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Sección A"
              className="input input-bordered w-full"
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="periodoAcademicoId">
              Periodo Académico
            </label>
            <select
              id="periodoAcademicoId"
              name="periodoAcademicoId"
              value={formData.periodoAcademicoId}
              onChange={handleInputChange}
              className="select select-bordered w-full"
              disabled={isLoading}
            >
              <option value="">Seleccionar periodo</option>
              {periodos.map((periodo) => (
                <option key={periodo.id} value={periodo.id}>
                  {periodo.nombre}
                </option>
              ))}
            </select>
          </div>
          
          {errorMensaje && (
            <div className="alert alert-error mb-4 py-3">
              <span>{errorMensaje}</span>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Guardando...
                </>
              ) : (
                'Actualizar Sección'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}