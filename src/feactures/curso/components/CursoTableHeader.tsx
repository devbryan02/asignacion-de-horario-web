import AgregarCursoModal from "./AgregarCursoModal";

interface CursoTableHeaderProps {
  onCursoCreated: () => void;
}

export default function CursoTableHeader({ onCursoCreated }: CursoTableHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-3xl text-neutral">Cursos</h1>
        <p className="text-sm text-gray-500">Gestión de cursos académicos</p>
      </div>
      <AgregarCursoModal onCursoCreated={onCursoCreated} />
    </div>
  );
}