"use client";

import { useState, useEffect, useRef } from "react";
import { Book, PlusCircle, Save, X, Info, Clock, BookOpen, Building2 } from "lucide-react";
import { CursoRequest } from "@/types/request/CursoRequest";
import { CursoResponse } from "@/types/response/CursoResponse";
import { UUID } from "crypto";
import toast from "react-hot-toast";
import { fetchUnidadAcademica } from "@/feactures/unidadad-academica/UnidadAcademicaService";
import MultipleUnidadAcademicaSelect from "@/feactures/curso/components/MultipleSelectUnidad";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUnidades, setLoadingUnidades] = useState(false);
  const [formData, setFormData] = useState<CursoRequest>({
    nombre: "",
    horasSemanales: 4,
    tipo: "TEORICO",
    unidadesIds: unidadId ? [unidadId as string] : [],
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const nombreInputRef = useRef<HTMLInputElement>(null);

  // Cargar unidades académicas cuando se abre el modal
  useEffect(() => {
    if (isOpen || isEdit) {
      loadUnidadesAcademicas();
    }
  }, [isOpen, isEdit]);

  const loadUnidadesAcademicas = async () => {
    setLoadingUnidades(true);
    try {
      await fetchUnidadAcademica();
    } catch (error) {
      toast.error("No se pudieron cargar las unidades académicas");
    } finally {
      setLoadingUnidades(false);
    }
  };

  // Cargar datos de curso en edición
  useEffect(() => {
    if (isEdit && cursoEditando) {
      const unidadesIdsArray = cursoEditando.unidadesAcademicasCount > 0 
        ? [cursoEditando.id?.toString() || ""]
        : unidadId ? [unidadId.toString()] : [];
        
      setFormData({
        nombre: cursoEditando.nombre,
        horasSemanales: cursoEditando.horasSemanales,
        tipo: cursoEditando.tipo,
        unidadesIds: unidadesIdsArray.filter(id => id !== ""),
      });
      setIsOpen(true);
    }
  }, [isEdit, cursoEditando, unidadId]);

  // Animación y autofocus
  useEffect(() => {
    if ((isOpen || isEdit) && modalRef.current) {
      setTimeout(() => nombreInputRef.current?.focus(), 100);
    }
  }, [isOpen, isEdit]);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      nombre: "",
      horasSemanales: 4,
      tipo: "TEORICO",
      unidadesIds: unidadId ? [unidadId as string] : [],
    });
    if (onClose) onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "horasSemanales" ? Number(value) : value,
    }));
  };

  const handleUnidadesChange = (unidadesIds: string[]) => {
    setFormData(prev => ({ ...prev, unidadesIds }));
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

    if (!isEdit && formData.unidadesIds.length === 0) {
      toast.error("Debe seleccionar al menos una unidad académica");
      return;
    }

    const toastId = toast.loading(isEdit ? "Actualizando curso..." : "Creando curso...");
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
      toast.error(
        `Error al ${isEdit ? "actualizar" : "crear"} el curso`, 
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "TEORICO": return "badge badge-primary";
      case "LABORATORIO": return "badge badge-secondary";
      default: return "badge";
    }
  };

  return (
    <>
      {!isEdit && (
        <button
          className="btn btn-primary btn-sm gap-2"
          onClick={openModal}
        >
          <PlusCircle size={16} />
          <span>Agregar Curso</span>
        </button>
      )}

      {(isOpen || isEdit) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div
            ref={modalRef}
            className="card bg-base-100 w-full max-w-2xl shadow-xl animate-in fade-in zoom-in duration-200"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-primary/10 to-transparent flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/15 p-3 text-primary">
                  <Book size={20} />
                </div>
                <h3 className="text-lg font-bold">
                  {isEdit ? "Editar Curso" : "Nuevo Curso"}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="btn btn-sm btn-circle"
                disabled={isLoading}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="card-body p-5 pt-3 gap-5">
                {/* Mensaje informativo */}
                <div className="bg-info/10 text-info rounded-lg p-3 flex gap-2 items-start text-sm">
                  <Info size={16} className="mt-0.5" />
                  <span>
                    {isEdit
                      ? "Modifique los datos del curso según sea necesario."
                      : `Complete los campos para crear un nuevo curso${unidadNombre ? ` en ${unidadNombre}` : ''}.`}
                  </span>
                </div>

                {/* Formulario en dos columnas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Columna izquierda */}
                  <div className="space-y-5">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium flex items-center gap-1.5">
                          <BookOpen size={14} className="text-primary" /> 
                          Nombre del Curso
                        </span>
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
                    </div>

                    {!isEdit && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium flex items-center gap-1.5">
                            <Building2 size={14} className="text-primary" />
                            Unidades Académicas
                          </span>
                        </label>
                        <MultipleUnidadAcademicaSelect
                          selectedIds={formData.unidadesIds}
                          onChange={handleUnidadesChange}
                          disabled={isLoading}
                          readOnly={false}
                        />
                      </div>
                    )}
                  </div>

                  {/* Columna derecha */}
                  <div className="space-y-5">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium flex items-center gap-1.5">
                          <Clock size={14} className="text-primary" />
                          Tipo de Curso
                        </span>
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
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium flex items-center gap-1.5">
                          <Clock size={14} className="text-primary" />
                          Horas Semanales
                        </span>
                      </label>
                      <div className="join w-full">
                        <input
                          type="number"
                          name="horasSemanales"
                          value={formData.horasSemanales}
                          onChange={handleChange}
                          min={1}
                          max={20}
                          className="input input-bordered w-full join-item"
                          disabled={isLoading}
                        />
                        <span className="join-item bg-base-200 px-3 flex items-center text-base-content/70">
                          hrs
                        </span>
                      </div>
                    </div>

                    {/* Vista previa */}
                    <div className="bg-base-200/30 rounded-lg p-3 mt-auto">
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
              
              {/* Footer */}
              <div className="card-actions justify-end bg-base-200/30 p-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-ghost"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading || loadingUnidades}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <Save size={16} />
                  )}
                  {isLoading 
                    ? isEdit ? "Actualizando..." : "Guardando..." 
                    : isEdit ? "Actualizar" : "Guardar"
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}