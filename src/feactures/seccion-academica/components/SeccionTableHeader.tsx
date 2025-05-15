import { BookOpen, Plus } from 'lucide-react';

interface SeccionTableHeaderProps {
  onOpenAddModal: () => void;
}

export default function SeccionTableHeader({ onOpenAddModal }: SeccionTableHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <BookOpen size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Secciones Académicas
          </h1>
          <p className="text-sm text-base-content/70 mt-0.5">
            Gestión de secciones y su relación con periodos académicos
          </p>
        </div>
      </div>
      
      <div className="self-stretch sm:self-center">
        <button
          onClick={onOpenAddModal}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Nueva Sección</span>
        </button>
      </div>
    </div>
  );
}