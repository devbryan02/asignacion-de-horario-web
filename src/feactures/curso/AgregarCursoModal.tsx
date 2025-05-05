"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Book, Loader2, AlertCircle, X } from "lucide-react";
import { createCurso } from "./CursoService";
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

  return (
    <>
      <button
        className="btn btn-primary btn-sm flex items-center gap-2 hover:shadow-lg transition-all duration-200"
        onClick={openModal}
      >
        <PlusCircle size={16} />
        Agregar Curso
      </button>

      {isOpen && (
        <div
          className="modal modal-open flex justify-center items-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-box max-w-2xl relative">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
            <h3 className="font-bold text-2xl text-primary flex items-center gap-2">
              <Book className="text-primary" size={24} />
              Agregar Nuevo Curso
            </h3>
            <p className="text-base-content/70">
              {unidadId
                ? `Agregando curso para ${unidadNombre}.`
                : "Complete la información del nuevo curso."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              {/* Nombre */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nombre del curso</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: Programación Web"
                  className={`input input-bordered ${errors.nombre ? "input-error" : ""}`}
                  value={formData.nombre}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {errors.nombre && (
                  <span className="text-error text-sm mt-1">{errors.nombre}</span>
                )}
              </div>

              {/* Horas semanales */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Horas semanales</span>
                </label>
                <input
                  type="number"
                  name="horasSemanales"
                  placeholder="Ej: 6"
                  className={`input input-bordered ${errors.horasSemanales ? "input-error" : ""}`}
                  value={formData.horasSemanales}
                  onChange={handleInputChange}
                  min="1"
                  max="40"
                  disabled={isLoading}
                />
                {errors.horasSemanales && (
                  <span className="text-error text-sm mt-1">{errors.horasSemanales}</span>
                )}
              </div>

              {/* Tipo */}
              <div className="form-control">
                <label className="label">
                  <span>Curso se enseña en un aula</span>
                </label>
                <select
                  name="tipo"
                  className={`select select-bordered ${errors.tipo ? "select-error" : ""}`}
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
                {errors.tipo && (
                  <span className="text-error text-sm mt-1">{errors.tipo}</span>
                )}
              </div>

              {/* Unidad académica */}
              {!unidadId && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Unidad Académica</span>
                  </label>
                  {isLoadingUnidades ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Cargando...</span>
                    </div>
                  ) : (
                    <select
                      name="unidadId"
                      className={`select select-bordered ${errors.unidadId ? "select-error" : ""}`}
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
                  )}
                  {errors.unidadId && (
                    <span className="text-error text-sm mt-1">{errors.unidadId}</span>
                  )}
                </div>
              )}
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={closeModal}>
                Cancelar
              </button>
              <button
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                onClick={handleSubmit}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AgregarCursoModal;