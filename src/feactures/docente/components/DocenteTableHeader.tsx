import AgregarDocenteModal from "./AgregarDocenteModal";

interface DocenteTableHeaderProps {
  onDocenteCreated: () => void;
}

export default function DocenteTableHeader({ onDocenteCreated }: DocenteTableHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-3xl text-neutral">Docentes</h1>
        <p className="text-sm text-gray-500">Gestión de docentes y restricciones</p>
      </div>
      <AgregarDocenteModal onDocenteCreated={onDocenteCreated} />
    </div>
  );
}