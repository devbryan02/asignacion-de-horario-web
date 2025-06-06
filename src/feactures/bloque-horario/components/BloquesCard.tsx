import { useState } from 'react';
import { Clock, Calendar, Edit, Trash2, AlertCircle } from 'lucide-react';
import { BloqueHorario } from '../types';
import EditarBloqueModal from './EditarBloqueModal';
import { UUID } from 'crypto';


interface BloquesCardProps {
  bloques: BloqueHorario[];
  loading: boolean;
  error: string | null;
  deleteBloque: (id: UUID) => Promise<{ success: boolean; message: string }>;
  onBloqueAdded?: () => void;
}

function BloquesCard({ bloques, loading, error, deleteBloque, onBloqueAdded }: BloquesCardProps) {
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
      <div className="flex flex-col justify-center items-center py-8">
        <span className="loading loading-spinner loading-md text-primary mb-2"></span>
        <p className="text-sm text-primary font-medium animate-pulse">Cargando bloques horarios...</p>
      </div>
    );
  }

  // Mostrador de error
  if (error) {
    return (
      <div className="alert alert-error shadow-md max-w-3xl mx-auto my-4">
        <AlertCircle className="w-5 h-5" />
        <div>
          <h3 className="font-bold">Error al cargar los bloques</h3>
          <div className="text-xs">{error}</div>
        </div>
      </div>
    );
  }

  // Mostrador de sin resultados
  if (bloques.length === 0) {
    return (
      <div className="card bg-base-100 shadow-md max-w-xl mx-auto my-6 border border-base-300">
        <div className="card-body items-center text-center py-10">
          <div className="bg-base-200 p-4 rounded-full mb-4">
            <Calendar className="w-12 h-12 text-primary opacity-70" />
          </div>
          <h2 className="card-title text-xl text-primary mb-1">No hay bloques horarios</h2>
          <p className="text-base-content/70 text-sm">
            No se encontraron bloques horarios con los criterios de búsqueda actuales.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-4">
      {bloques.map(bloque => (
        <div 
          key={bloque.id.toString()} 
          className={`card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 ${getDayBorderColor(bloque.diaSemana)}`}
        >
          <div className="card-body p-3">
            <div className="flex justify-between items-start">
              <h2 className="text-sm font-bold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                {bloque.diaSemana}
              </h2>
              <span className={`badge badge-sm ${getTurnoColor(bloque.turno)} px-2 py-1.5 text-xs shadow-sm`}>
                {bloque.turno}
              </span>
            </div>
            
            <div className="mt-2 p-2 bg-base-200/40 rounded-md flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium text-sm">
                {bloque.horaInicio} - {bloque.horaFin}
              </span>
            </div>
            
            <div className="card-actions justify-end mt-2 pt-1 border-t border-base-200/50">
              <button 
                className="btn btn-xs btn-ghost text-primary"
                onClick={() => handleEdit(bloque)}
              >
                <Edit className="w-3 h-3 mr-1" /> Editar
              </button>
              <button 
                className="btn btn-xs btn-ghost text-error"
                onClick={() => handleDelete(bloque)}
              >
                <Trash2 className="w-3 h-3 mr-1" /> Eliminar
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