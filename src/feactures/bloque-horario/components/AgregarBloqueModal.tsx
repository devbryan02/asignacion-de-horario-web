import { useState } from 'react';
import { BloqueHorarioRequest } from '../types';
import { useBloques } from '../hooks/useBloques';
import Swal from 'sweetalert2';
import { Clock, Calendar, CheckCircle2, X } from 'lucide-react';

interface AgregarBloqueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const diasSemana = [
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SÁBADO',
  'DOMINGO'
];

const turnos = ['MANANA', 'TARDE', 'NOCHE'];

function AgregarBloqueModal({ isOpen, onClose }: AgregarBloqueModalProps) {
  const { createBloque } = useBloques();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<BloqueHorarioRequest>({
    diaSemana: 'LUNES',
    horaInicio: '08:00',
    horaFin: '10:00',
    turno: 'MANANA'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    // Validar que la hora de inicio sea anterior a la hora de fin
    if (formData.horaInicio >= formData.horaFin) {
      Swal.fire({
        title: 'Error de validación',
        text: 'La hora de inicio debe ser anterior a la hora de fin',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await createBloque(formData);
      
      if (response.success) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Bloque horario creado correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Restablecer el formulario
        setFormData({
          diaSemana: 'LUNES',
          horaInicio: '08:00',
          horaFin: '10:00',
          turno: 'Mañana'
        });
        
        // Cerrar el modal
        onClose();
      } else {
        Swal.fire({
          title: 'Error',
          text: response.message || 'No se pudo crear el bloque horario',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al crear el bloque horario',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-base-content/45 backdrop-blur-sm flex justify-center items-center animate-fadeIn">
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-md bg-base-100 shadow-xl border border-base-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
              <div className="p-2 rounded-md bg-gradient-to-br from-primary/10 to-secondary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              Agregar Nuevo Bloque
            </h3>
            <button 
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="divider my-0"></div>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Día de la semana */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  Día de la semana
                </span>
              </label>
              <select 
                name="diaSemana"
                value={formData.diaSemana}
                onChange={handleChange}
                className="select select-bordered w-full focus:select-primary bg-base-100 shadow-sm"
                required
              >
                {diasSemana.map(dia => (
                  <option key={dia} value={dia}>{dia}</option>
                ))}
              </select>
            </div>

            {/* Turno */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4 text-primary" />
                  Turno
                </span>
              </label>
              <select 
                name="turno"
                value={formData.turno}
                onChange={handleChange}
                className="select select-bordered w-full focus:select-primary bg-base-100 shadow-sm"
                required
              >
                {turnos.map(turno => (
                  <option key={turno} value={turno}>{turno}</option>
                ))}
              </select>
            </div>

            {/* Hora de inicio y fin */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Hora inicio</span>
                </label>
                <input 
                  type="time" 
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:input-primary bg-base-100 shadow-sm"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Hora fin</span>
                </label>
                <input 
                  type="time" 
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:input-primary bg-base-100 shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="modal-action pt-3 ">
              <button 
                type="button" 
                className="btn btn-sm btn-ghost px-4"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className={`btn btn-sm px-6 ${
                  loading 
                  ? 'loading bg-primary/70' 
                  : 'bg-gradient-to-r from-primary to-primary-focus hover:shadow-md'
                } text-white border-0`}
                disabled={loading}
              >
                {loading ? 'Guardando...' : (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Guardar
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgregarBloqueModal;