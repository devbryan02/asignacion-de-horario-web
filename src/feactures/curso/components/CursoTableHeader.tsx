import { Book, Plus } from "lucide-react";
import AgregarCursoModal from "./AgregarCursoModal";

interface CursoTableHeaderProps {
  onCursoCreated: () => void;
}

export default function CursoTableHeader({ onCursoCreated }: CursoTableHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      {/* Título e ícono */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Book size={18} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-base-content">Cursos</h1>
          <p className="text-xs text-base-content/60">Gestión de cursos académicos</p>
        </div>
      </div>

      {/* Botón de agregar */}
      <div>
        <AgregarCursoModal onCursoCreated={onCursoCreated} />
      </div>
    </div>
  );
}