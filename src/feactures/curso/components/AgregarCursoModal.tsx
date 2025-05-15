"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Book, Loader2, X, Check, ChevronsUpDown } from "lucide-react";
import { createCurso } from "../CursoService";
import { CursoRequest } from "@/types/request/CursoRequest";
import { UnidadAcademica } from "@/types/UnidadAcademica";
import { fetchUnidadAcademica } from "@/feactures/unidadad-academica/UnidadAcademicaService";
import toast from "react-hot-toast";
import { UUID } from "crypto";

interface AgregarCursoModalProps {
  unidadId?: UUID;
  unidadNombre?: string;
  onCursoCreated?: () => void;
}

function AgregarCursoModal({ unidadId, unidadNombre, onCursoCreated }: AgregarCursoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUnidades, setIsLoadingUnidades] = useState(false);
  const [unidadesAcademicas, setUnidadesAcademicas] = useState<UnidadAcademica[]>([]);
  const [formData, setFormData] = useState<Omit<CursoRequest, "unidadId">>({
    nombre: "",
    horasSemanales: 2,
    tipo: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedUnidadId, setSelectedUnidadId] = useState<UUID | undefined>(unidadId);

  useEffect(() => {
    if (isOpen && !unidadId) {
      loadUnidadesAcademicas();
    }
  }, [isOpen, unidadId]);

  const loadUnidadesAcademicas = async () => {
    try {
      setIsLoadingUnidades(true);
      const data = await fetchUnidadAcademica();
      setUnidadesAcademicas(data);

      if (!selectedUnidadId && data.length > 0) {
        setSelectedUnidadId(data[0].id);
      }
    } catch (error) {
      console.error("Error cargando unidades académicas:", error);
      toast.error("Error al cargar las unidades académicas");
    } finally {
      setIsLoadingUnidades(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del curso es requerido";
    }

    if (!formData.tipo) {
      newErrors.tipo = "Debe seleccionar un tipo de curso";
    }

    if (!formData.horasSemanales || formData.horasSemanales <= 0) {
      newErrors.horasSemanales = "Las horas semanales deben ser mayores a 0";
    }

    if (!selectedUnidadId) {
      newErrors.unidadId = "Debe seleccionar una unidad académica";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "unidadId") {
      setSelectedUnidadId(value as UUID);
    } else {
      setFormData({
        ...formData,
        [name]: name === "horasSemanales" ? parseInt(value) || 0 : value,
      });
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(true);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }

    setFormData({
      nombre: "",
      horasSemanales: 2,
      tipo: "",
    });

    if (!unidadId) {
      setSelectedUnidadId(unidadesAcademicas.length > 0 ? unidadesAcademicas[0].id : undefined);
    }
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const toastId = toast.loading("Guardando curso...");

    try {
      const cursoData: CursoRequest = {
        ...formData,
        unidadId: selectedUnidadId || unidadId!,
      };

      await createCurso(cursoData);

      toast.success("Curso creado exitosamente", { id: toastId });

      if (onCursoCreated) {
        onCursoCreated();
      }

      closeModal();
    } catch (error) {
      console.error("Error al crear el curso:", error);
      toast.error(
        "Error al crear el curso: " +
          (error instanceof Error ? error.message : "Error desconocido"),
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
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <>
      <button
        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-focus text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
        onClick={openModal}
      >
        <PlusCircle size={16} className="stroke-[2.5]" />
        <span>Agregar Curso</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop overlay with animation */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
            onClick={closeModal}
          />

          {/* Modal container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div 
              className="bg-base-100 rounded-2xl shadow-xl max-w-xl w-full overflow-hidden animate-scale-in"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-base-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                      <Book size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Agregar Nuevo Curso</h3>
                      <p className="text-sm text-base-content/60">
                        {unidadId
                          ? `Agregando curso para ${unidadNombre}`
                          : "Complete la información del nuevo curso"}
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-8 h-8 rounded-lg hover:bg-base-200 flex items-center justify-center text-base-content/70"
                    onClick={closeModal}
                    aria-label="Cerrar"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Form body */}
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nombre del curso */}
                  <div className="form-control col-span-full">
                    <label className="label">
                      <span className="label-text font-medium">Nombre del curso</span>
                      <span className="text-error text-sm">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Ej: Programación Web"
                      className={`input input-bordered w-full bg-base-100 ${
                        errors.nombre ? "input-error" : "focus:border-primary"
                      }`}
                      value={formData.nombre}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    {errors.nombre && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                          <X size={12} className="inline" />
                          {errors.nombre}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Tipo de curso */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Tipo de curso</span>
                      <span className="text-error text-sm">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="tipo"
                        className={`select select-bordered w-full pr-10 ${
                          errors.tipo ? "select-error" : "focus:border-primary"
                        }`}
                        value={formData.tipo}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      >
                        <option value="" disabled>
                          Seleccione tipo
                        </option>
                        <option value="TEORICO">Teórico</option>
                        <option value="LABORATORIO">Laboratorio</option>
                      </select>
                    </div>
                    {errors.tipo && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                          <X size={12} className="inline" />
                          {errors.tipo}
                        </span>
                      </label>
                    )}
                    
                    {formData.tipo && (
                      <div className="mt-2">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getTipoColor(formData.tipo)}`}>
                          {formData.tipo === "TEORICO" ? "Teórico" : "Laboratorio"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Horas semanales */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Horas semanales</span>
                      <span className="text-error text-sm">*</span>
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        name="horasSemanales"
                        placeholder="2"
                        className={`input input-bordered w-full ${
                          errors.horasSemanales ? "input-error" : "focus:border-primary"
                        }`}
                        value={formData.horasSemanales}
                        onChange={handleInputChange}
                        min="1"
                        max="40"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.horasSemanales && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                          <X size={12} className="inline" />
                          {errors.horasSemanales}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Unidad académica */}
                  {!unidadId && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Unidad Académica</span>
                        <span className="text-error text-sm">*</span>
                      </label>
                      {isLoadingUnidades ? (
                        <div className="flex items-center gap-2 h-12 px-4 border border-base-300 rounded-lg text-base-content/60">
                          <Loader2 size={16} className="animate-spin" />
                          <span>Cargando unidades...</span>
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            name="unidadId"
                            className={`select select-bordered w-full pr-10 ${
                              errors.unidadId ? "select-error" : "focus:border-primary"
                            }`}
                            value={selectedUnidadId || ""}
                            onChange={handleInputChange}
                            disabled={isLoading || unidadesAcademicas.length === 0}
                          >
                            <option value="" disabled>
                              Seleccione unidad
                            </option>
                            {unidadesAcademicas.map((unidad) => (
                              <option key={unidad.id} value={unidad.id}>
                                {unidad.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {errors.unidadId && (
                        <label className="label">
                          <span className="label-text-alt text-error flex items-center gap-1">
                            <X size={12} className="inline" />
                            {errors.unidadId}
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex justify-end gap-3 px-5 py-4 bg-base-200/50 border-t border-base-200">
                <button
                  className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-300 text-base-content/80 font-medium transition-colors"
                  onClick={closeModal}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-primary hover:bg-primary-focus text-white rounded-lg font-medium shadow-sm flex items-center gap-2 transition-all hover:shadow disabled:opacity-70 disabled:hover:shadow-none disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Check size={18} className="stroke-[2.5]" />
                      <span>Guardar curso</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AgregarCursoModal;