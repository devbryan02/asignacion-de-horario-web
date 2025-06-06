import { useState, useEffect } from 'react';
import { BloqueHorario, BloqueHorarioRequest } from '../types';
import { useBloques } from '../hooks/useBloques';
import Swal from 'sweetalert2';

interface EditarBloqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  bloque: BloqueHorario | null;
}

const diasSemana = [
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
  'DOMINGO'
];

const turnos = ['MANANA', 'TARDE', 'NOCHE'];

function EditarBloqueModal({ isOpen, onClose, bloque }: EditarBloqueModalProps) {
  const { updateBloque } = useBloques();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<BloqueHorarioRequest>({
    diaSemana: '',
    horaInicio: '',
    horaFin: '',
    turno: ''
  });

  // Cargar datos del bloque cuando cambia
  useEffect(() => {
    if (bloque) {
      setFormData({
        diaSemana: bloque.diaSemana,
        horaInicio: bloque.horaInicio,
        horaFin: bloque.horaFin,
        turno: bloque.turno
      });
    }
  }, [bloque]);

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
    
    if (!bloque || !validateForm()) return;
    
    setLoading(true);
    try {
      const response = await updateBloque(bloque.id, formData);
      
      if (response.success) {
        Swal.fire({
          title: '¡Actualizado!',
          text: 'Bloque horario actualizado correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Cerrar el modal
        onClose();
      } else {
        Swal.fire({
          title: 'Error',
          text: response.message || 'No se pudo actualizar el bloque horario',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al actualizar el bloque horario',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !bloque) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-base-content/45 backdrop-blur-sm flex justify-center items-center">
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-md bg-base-100 shadow-xl">
          <h3 className="font-bold text-lg text-primary mb-4">Editar Bloque Horario</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Día de la semana */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Día de la semana</span>
              </label>
              <select 
                name="diaSemana"
                value={formData.diaSemana}
                onChange={handleChange}
                className="select select-bordered w-full focus:select-primary"
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
                <span className="label-text font-medium">Turno</span>
              </label>
              <select 
                name="turno"
                value={formData.turno}
                onChange={handleChange}
                className="select select-bordered w-full focus:select-primary"
                required
              >
                {turnos.map(turno => (
                  <option key={turno} value={turno}>{turno}</option>
                ))}
              </select>
            </div>

            {/* Hora de inicio y fin */}
            <div className="grid grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Hora inicio</span>
                </label>
                <input 
                  type="time" 
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:input-primary"
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
                  className="input input-bordered w-full focus:input-primary"
                  required
                />
              </div>
            </div>

            <div className="modal-action pt-2">
              <button 
                type="button" 
                className="btn btn-ghost"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Actualizar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarBloqueModal;