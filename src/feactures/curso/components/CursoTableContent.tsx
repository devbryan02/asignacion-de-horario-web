import { BookOpen, Pencil, Trash2, Users } from "lucide-react";
import { CursoResponse } from "@/types/response/CursoResponse";
import { UUID } from "crypto";

interface CursoTableContentProps {
  cursos: CursoResponse[];
  isLoading: boolean;
  onEdit: (curso: CursoResponse) => void;
  onDelete: (id: UUID) => void;
  onAsignarSecciones?: (curso: CursoResponse) => void;
}

export default function CursoTableContent({
  cursos,
  isLoading,
  onEdit,
  onDelete,
  onAsignarSecciones,
}: CursoTableContentProps) {
  // Helper para determinar el color según el tipo de curso
  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "TEORICO":
        return "badge badge-primary badge-outline";
      case "LABORATORIO":
        return "badge badge-secondary badge-outline";
      default:
        return "badge badge-outline";
    }
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center bg-base-200/20 rounded-lg border border-base-200 my-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4 text-base-content/70 font-medium">Cargando cursos...</p>
      </div>
    );
  }

  // Estado vacío (sin resultados)
  if (!cursos.length) {
    return (
      <div className="p-10 flex flex-col items-center justify-center bg-base-200/20 rounded-lg border border-base-200 my-4">
        <div className="w-20 h-20 rounded-full bg-base-300/40 flex items-center justify-center mb-4">
          <BookOpen className="w-10 h-10 text-base-content/30" />
        </div>
        <h3 className="text-lg font-medium text-base-content/80">No hay cursos registrados</h3>
        <p className="text-sm text-base-content/50 mt-1 max-w-md text-center">
          Utilice el botón "Agregar Curso" para comenzar a gestionar sus cursos.
        </p>
      </div>
    );
  }

  // Tabla con datos
  return (
    <div className="overflow-x-auto  rounded-xl border border-base-200 shadow-sm m-2">
      <table className="table w-full">
        <thead className="bg-base-200/50">
          <tr>
            <th className="font-medium text-base-content/70">Nombre</th>
            <th className="font-medium text-base-content/70">Tipo</th>
            <th className="font-medium text-base-content/70">Horas</th>
            <th className="font-medium text-base-content/70">Unidad Académica</th>
            <th className="text-right font-medium text-base-content/70">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso, index) => (
            <tr
              key={curso.id?.toString() || `curso-${index}`}
              className="border-b border-base-200 hover:bg-base-200/40 group transition-colors"
            >
              <td>
                <div className="font-medium text-base-content">
                  <BookOpen size={16} className="inline-block mr-2 " />
                  {curso.nombre}
                </div>
              </td>
              <td>
                <span className={getTipoColor(curso.tipo)}>
                  {curso.tipo === "TEORICO" ? "Teórico" : "Laboratorio"}
                </span>
              </td>
              <td>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">{curso.horasSemanales}</span>
                  </div>
                  <span className="text-xs text-base-content/60">hrs/sem</span>
                </div>
              </td>
              <td> Asig. a {curso.unidadesAcademicasCount || "No asignada"} unidades</td>
              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(curso)}
                    className="btn btn-ghost btn-sm text-info"
                    title="Editar curso"
                  >
                    <Pencil size={16} />
                    <span className="ml-1 hidden sm:inline"></span>
                  </button>
                  
                  {onAsignarSecciones && (
                    <button
                      onClick={() => onAsignarSecciones(curso)}
                      className="btn btn-ghost btn-sm text-secondary"
                      title="Asignar secciones"
                    >
                      <Users size={16} />
                      <span className="ml-1 hidden sm:inline">Asig. Secciones</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => onDelete(curso.id)}
                    className="btn btn-ghost btn-sm text-error"
                    title="Eliminar curso"
                  >
                    <Trash2 size={16} />
                    <span className="ml-1 hidden sm:inline"></span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}