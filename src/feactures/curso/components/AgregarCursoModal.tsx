"use client";

import { useState, useEffect, useRef } from "react";
import { Book, PlusCircle, Save, X, Info, Clock, BookOpen, Building2 } from "lucide-react";
import { CursoRequest } from "@/types/request/CursoRequest";
import { CursoResponse } from "@/types/response/CursoResponse";
import { UUID } from "crypto";
import toast from "react-hot-toast";
import { fetchUnidadAcademica } from "@/feactures/unidadad-academica/UnidadAcademicaService";

// Define el tipo para la unidad académica
interface UnidadAcademica {
  id: UUID;
  nombre: string;
}

interface AgregarCursoModalProps {
  unidadId?: UUID;
  unidadNombre?: string;
  onCursoCreated?: (curso: CursoRequest) => Promise<CursoResponse | void>;
  isEdit?: boolean;
  cursoEditando?: CursoResponse | null;
  onCursoUpdated?: (id: UUID, curso: CursoRequest) => Promise<CursoResponse | void>;
  onClose?: () => void;
}

export default function AgregarCursoModal({
  unidadId,
  unidadNombre,
  onCursoCreated,
  isEdit = false,
  cursoEditando = null,
  onCursoUpdated,
  onClose,
}: AgregarCursoModalProps) {
  // Estados y refs
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unidades, setUnidades] = useState<UnidadAcademica[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(false);
  const [formData, setFormData] = useState<CursoRequest>({
    nombre: "",
    horasSemanales: 4,
    tipo: "TEORICO",
    unidadId: unidadId as UUID,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const nombreInputRef = useRef<HTMLInputElement>(null);

  // Lógica existente...
  // Cargar unidades académicas cuando se abre el modal
  useEffect(() => {
    if (isOpen || isEdit) {
      loadUnidadesAcademicas();
    }
  }, [isOpen, isEdit]);

  // Función para cargar unidades académicas
  const loadUnidadesAcademicas = async () => {
    setLoadingUnidades(true);
    try {
      const data = await fetchUnidadAcademica();
      setUnidades(data);
    } catch (error) {
      console.error("Error al cargar unidades académicas:", error);
      toast.error("No se pudieron cargar las unidades académicas");
    } finally {
      setLoadingUnidades(false);
    }
  };

  // Si estamos en modo edición, cargar los datos del curso
  useEffect(() => {
    if (isEdit && cursoEditando) {
      // En modo edición, usar la unidadId del curso que estamos editando si existe
      setFormData({
        nombre: cursoEditando.nombre,
        horasSemanales: cursoEditando.horasSemanales,
        tipo: cursoEditando.tipo,
        // Priorizar la unidadId del cursoEditando si existe,
        // de lo contrario usar el prop unidadId (si existe)
        unidadId: unidadId as UUID,
      });
      setIsOpen(true);
    }
  }, [isEdit, cursoEditando, unidadId]);

  // Efecto para animar entrada del modal
  useEffect(() => {
    if ((isOpen || isEdit) && modalRef.current) {
      modalRef.current.classList.add("animate-in");
      modalRef.current.classList.add("fade-in");
      modalRef.current.classList.add("duration-300");

      // Autofocus en el input de nombre
      setTimeout(() => {
        nombreInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isEdit]);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      nombre: "",
      horasSemanales: 4,
      tipo: "TEORICO",
      unidadId: unidadId as UUID,
    });
    if (onClose) onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "horasSemanales" ? Number(value) :
        name === "unidadId" ? value as unknown as UUID : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación
    if (!formData.nombre.trim()) {
      toast.error("El nombre del curso es obligatorio");
      nombreInputRef.current?.focus();
      return;
    }

    if (formData.horasSemanales <= 0) {
      toast.error("Las horas semanales deben ser un número positivo");
      return;
    }

    // En modo edición, no validamos unidadId si ya tenemos el cursoEditando
    // Solo validar unidadId cuando NO estamos en modo edición
    if (!isEdit && !formData.unidadId) {
      toast.error("La unidad académica es obligatoria");
      return;
    }

    const toastId = toast.loading(
      isEdit ? "Actualizando curso..." : "Creando curso..."
    );

    setIsLoading(true);

    try {
      if (isEdit && cursoEditando && onCursoUpdated) {
        await onCursoUpdated(cursoEditando.id, formData);
        toast.success("Curso actualizado correctamente", { id: toastId });
      } else if (onCursoCreated) {
        await onCursoCreated(formData);
        toast.success("Curso creado correctamente", { id: toastId });
      }

      closeModal();
    } catch (error) {
      console.error("Error al procesar el curso:", error);
      toast.error(
        `Error al ${isEdit ? "actualizar" : "crear"} el curso: ${error instanceof Error ? error.message : "Ocurrió un error"}`,
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "TEORICO":
        return "badge badge-primary";
      case "LABORATORIO":
        return "badge badge-secondary";
      default:
        return "badge";
    }
  };

  return (
    <>
      {!isEdit && (
        <button
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-focus text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
          onClick={openModal}
        >
          <PlusCircle size={16} className="stroke-[2.5]" />
          <span>Agregar Curso</span>
        </button>
      )}

      {(isOpen || isEdit) && (
        <div className="fixed inset-0 bg-base-content/45 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div
            ref={modalRef}
            className="bg-base-100 rounded-lg shadow-xl w-full max-w-3xl border border-base-300"
          >
            {/* Header del modal */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-t-lg p-4 flex justify-between items-center border-b border-base-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                  <Book size={18} />
                </div>
                <h3 className="text-lg font-semibold text-base-content">
                  {isEdit ? "Editar Curso" : "Nuevo Curso"}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="btn btn-sm btn-ghost btn-circle"
                aria-label="Cerrar"
                disabled={isLoading}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Layout horizontal con dos columnas */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Columna izquierda */}
                <div className="flex-1">
                  {/* Información de contexto */}
                  <div className="bg-base-200/40 rounded-lg p-3 mb-5 flex items-start gap-3">
                    <div className="text-primary mt-0.5">
                      <Info size={18} />
                    </div>
                    <p className="text-sm text-base-content/80">
                      {isEdit
                        ? "Modifique los datos del curso según sea necesario."
                        : `Complete los campos para crear un nuevo curso${unidadNombre ? ` en ${unidadNombre}` : ''}.`}
                    </p>
                  </div>

                  {/* Sección de datos principales */}
                  <div className="mb-5">
                    <h4 className="text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-2">
                      <BookOpen size={16} className="text-primary" />
                      Información del curso
                    </h4>
                    <div className="divider my-0"></div>

                    {/* Campo de nombre */}
                    <div className="form-control mt-3 mb-3">
                      <label className="label">
                        <span className="label-text font-medium">Nombre del Curso</span>
                      </label>
                      <input
                        ref={nombreInputRef}
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Matemáticas Básicas"
                        className="input input-bordered w-full"
                        disabled={isLoading}
                      />
                      <label className="label">
                        <span className="label-text-alt text-base-content/50">Ingrese un nombre descriptivo para el curso</span>
                      </label>
                    </div>

                    {/* Selector de Unidad Académica */}
                    <div className="form-control mb-3">
                      <label className="label">
                        <span className="label-text font-medium flex items-center gap-1.5">
                          <Building2 size={14} className="text-primary/70" />
                          Unidad Académica
                        </span>
                      </label>

                      {isEdit ? (
                        // Cuando estamos en modo edición, mostrar solo el nombre de la unidad como texto
                        <div className="border rounded-lg p-3 bg-base-200/50 text-base-content/80">
                          {loadingUnidades ? (
                            <div className="flex items-center gap-2">
                              <span className="loading loading-spinner loading-xs"></span>
                              <span>Cargando información...</span>
                            </div>
                          ) : (
                            // Mostrar directamente el string de unidadAcademica
                            cursoEditando?.unidadAcademica || unidadNombre || "Unidad no especificada"
                          )}
                        </div>
                      ) : (
                        // Selector normal cuando no estamos en modo edición
                        <select
                          name="unidadId"
                          value={formData.unidadId ? formData.unidadId.toString() : ""}
                          onChange={handleChange}
                          className="select select-bordered w-full"
                          disabled={isLoading || loadingUnidades || !!unidadId}
                        >
                          <option value="" disabled>
                            {loadingUnidades ? "Cargando unidades..." : "Seleccione una unidad"}
                          </option>
                          {unidades.map((unidad) => (
                            <option key={unidad.id.toString()} value={unidad.id.toString()}>
                              {unidad.nombre}
                            </option>
                          ))}
                        </select>
                      )}

                      <label className="label">
                        <span className="label-text-alt text-base-content/50">
                          {isEdit
                            ? "La unidad académica no se puede modificar"
                            : unidadNombre
                              ? `Curso asignado a ${unidadNombre}`
                              : "Seleccione la unidad académica para este curso"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="flex-1">
                  {/* Sección de configuración */}
                  <div className="mb-5 mt-0 lg:mt-14"> {/* Añadido mt-14 para alinear con la columna izquierda */}
                    <h4 className="text-sm font-semibold text-base-content/80 mb-2 flex items-center gap-2">
                      <Clock size={16} className="text-primary" />
                      Configuración del curso
                    </h4>
                    <div className="divider my-0"></div>

                    {/* Campo de tipo */}
                    <div className="form-control mb-3 mt-3">
                      <label className="label">
                        <span className="label-text font-medium">Tipo de Curso</span>
                      </label>
                      <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                        disabled={isLoading}
                      >
                        <option value="TEORICO">Teórico</option>
                        <option value="LABORATORIO">Laboratorio</option>
                      </select>
                      <label className="label">
                        <span className="label-text-alt text-base-content/50">Seleccione el tipo de curso</span>
                      </label>
                    </div>

                    {/* Campo de horas semanales */}
                    <div className="form-control mb-3">
                      <label className="label">
                        <span className="label-text font-medium">Horas Semanales</span>
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          name="horasSemanales"
                          value={formData.horasSemanales}
                          onChange={handleChange}
                          min={1}
                          max={20}
                          className="input input-bordered w-full"
                          disabled={isLoading}
                        />
                        <span className="inline-flex items-center px-3 bg-base-200 border border-l-0 border-base-300 rounded-r-lg text-base-content/70">
                          hrs
                        </span>
                      </div>
                      <label className="label">
                        <span className="label-text-alt text-base-content/50">Horas por semana</span>
                      </label>
                    </div>

                    {/* Previsualización del curso */}
                    <div className="bg-base-200/30 rounded-lg p-3 mb-0">
                      <h4 className="text-xs font-medium text-base-content/70 mb-2">Vista previa:</h4>
                      <div className="flex items-center gap-2">
                        <span className={getTipoColor(formData.tipo)}>
                          {formData.tipo === "TEORICO" ? "Teórico" : "Laboratorio"}
                        </span>
                        <span className="text-sm font-medium">{formData.nombre || "Nombre del curso"}</span>
                        <span className="text-xs text-base-content/60 ml-auto">{formData.horasSemanales} hrs/sem</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="divider mt-4"></div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-outline"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary gap-2"
                  disabled={isLoading || loadingUnidades}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      {isEdit ? "Actualizando..." : "Guardando..."}
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {isEdit ? "Actualizar Curso" : "Guardar Curso"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}