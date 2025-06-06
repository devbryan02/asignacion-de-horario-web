import AgregarDocenteModal from "./AgregarDocenteModal";
import { Users } from 'lucide-react';

interface DocenteTableHeaderProps {
  onDocenteCreated: () => void;
}

export default function DocenteTableHeader({ onDocenteCreated }: DocenteTableHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Docentes
          </h1>
          <p className="text-sm text-base-content/70 mt-0.5">
            Gestión de personal académico y disponibilidad horaria
          </p>
        </div>
      </div>
      
      <div className="self-stretch sm:self-center">
        <AgregarDocenteModal onAddedDocente={onDocenteCreated} />
      </div>
    </div>
  );
}