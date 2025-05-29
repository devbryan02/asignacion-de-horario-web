import { useState } from 'react';
import { Clock, Calendar, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useBloques } from '../hooks/useBloques';
import { BloqueHorario } from '../types';
import EditarBloqueModal from './EditarBloqueModal';
import Swal from 'sweetalert2';

function BloquesCard() {
  const { bloques, loading, error, deleteBloque } = useBloques();
  const [editingBloque, setEditingBloque] = useState<BloqueHorario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para manejar la edición de un bloque
  const handleEdit = (bloque: BloqueHorario) => {
    setEditingBloque(bloque);
    setIsModalOpen(true);
  };

  // Función para eliminar un bloque
  const handleDelete = async (bloque: BloqueHorario) => {
    await deleteBloque(bloque.id);
  };

  // Función para obtener el color de fondo según el turno
  const getTurnoColor = (turno: string) => {
    const turnoLower = turno.toLowerCase();
    switch (turnoLower) {
      case 'mañana':
      case 'manana':
        return 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white';
      case 'tarde':
        return 'bg-gradient-to-r from-amber-500 to-orange-400 text-white';
      case 'noche':
        return 'bg-gradient-to-r from-indigo-500 to-purple-400 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-400 text-white';
    }
  };

  // Función para obtener el color del borde según el día
  const getDayBorderColor = (dia: string) => {
    const diaLower = dia.toLowerCase();
    switch (diaLower) {
      case 'lunes':
        return 'border-l-4 border-primary';
      case 'martes':
        return 'border-l-4 border-secondary';
      case 'miércoles':
      case 'miercoles':
        return 'border-l-4 border-accent';
      case 'jueves':
        return 'border-l-4 border-info';
      case 'viernes':
        return 'border-l-4 border-success';
      case 'sábado':
      case 'sabado':
        return 'border-l-4 border-warning';
      case 'domingo':
        return 'border-l-4 border-error';
      default:
        return 'border-l-4 border-neutral';
    }
  };

  // Mostrador de carga
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-16">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-primary font-medium animate-pulse">Cargando bloques horarios...</p>
      </div>
    );
  }

  // Mostrador de error
  if (error) {
    return (
      <div className="alert alert-error shadow-lg max-w-3xl mx-auto my-8 animate__animated animate__fadeIn">
        <AlertCircle className="w-6 h-6" />
        <div>
          <h3 className="font-bold">Error al cargar los bloques</h3>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  // Mostrador de sin resultados
  if (bloques.length === 0) {
    return (
      <div className="card bg-base-100 shadow-lg max-w-3xl mx-auto my-8 border border-base-300">
        <div className="card-body items-center text-center py-16">
          <div className="bg-base-200 p-6 rounded-full mb-6">
            <Calendar className="w-16 h-16 text-primary opacity-70" />
          </div>
          <h2 className="card-title text-2xl text-primary mb-2">No hay bloques horarios</h2>
          <p className="text-base-content/70 max-w-md">
            No se encontraron bloques horarios con los criterios de búsqueda actuales. 
            Intenta con otros filtros o agrega un nuevo bloque.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {bloques.map(bloque => (
        <div 
          key={bloque.id.toString()} 
          className={`card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 ${getDayBorderColor(bloque.diaSemana)}`}
        >
          <div className="card-body p-5">
            <div className="flex justify-between items-start">
              <h2 className="card-title flex items-center gap-2 text-base-content">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-bold">{bloque.diaSemana}</span>
              </h2>
              <span className={`badge badge-lg font-medium ${getTurnoColor(bloque.turno)} px-3 py-3 shadow-sm`}>
                {bloque.turno}
              </span>
            </div>
            
            <div className="mt-4 p-3 bg-base-200/50 rounded-lg flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium text-lg">
                {bloque.horaInicio} - {bloque.horaFin}
              </span>
            </div>
            
            <div className="card-actions justify-end mt-5 pt-2 border-t border-base-200">
              <button 
                className="btn btn-sm glass text-primary hover:bg-primary hover:text-primary-content"
                onClick={() => handleEdit(bloque)}
              >
                <Edit className="w-4 h-4 mr-1" /> Editar
              </button>
              <button 
                className="btn btn-sm glass text-error hover:bg-error hover:text-error-content"
                onClick={() => handleDelete(bloque)}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Modal de edición */}
      <EditarBloqueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bloque={editingBloque}
      />
    </div>
  );
}

export default BloquesCard;