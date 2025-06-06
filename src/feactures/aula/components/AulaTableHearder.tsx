import { School } from "lucide-react";

interface AulaTableHeaderProps {
  onCreateClick: () => void; // Función para abrir el modal de creación
}

export default function AulaTableHeader({ onCreateClick }: AulaTableHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/20">
          <School size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-base-content">Aulas</h1>
          <p className="text-sm text-base-content/60 mt-0.5">Gestión de espacios académicos disponibles</p>
        </div>
      </div>
      <div className="self-end sm:self-auto">
        <button 
          className="btn btn-primary btn-sm"
          onClick={onCreateClick}
        >
          Agregar Aula
        </button>
      </div>
    </div>
  );
}