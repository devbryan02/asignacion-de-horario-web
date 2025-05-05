"use client";

import { useState } from "react";
import { PlusCircle, User2, Clock, Briefcase, Building2, AlertCircle, X } from "lucide-react";
import { Docente } from "@/types/response/DocenteResponse";
import { createDocente } from "../DocenteService";
import toast from "react-hot-toast";
import { DocenteRequest } from "@/types/request/DocenteRequest";
import MultipleSelect from "./MultipleSelect";

interface AgregarDocenteModalProps {
  onDocenteCreated?: () => void;
}

interface ValidationErrors {
  nombre?: string;
  horasContratadas?: string;
  horasMaximasPorDia?: string;
  unidadesIds?: string;
}

function AgregarDocenteModal({ onDocenteCreated }: AgregarDocenteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<Partial<DocenteRequest>>({
    nombre: "",
    horasContratadas: 0,
    horasMaximasPorDia: 0,
    unidadesIds: []
  });

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!formData.nombre?.trim()) {
      newErrors.nombre = "El nombre del docente es requerido";
      isValid = false;
    }

    if (!formData.horasContratadas || formData.horasContratadas <= 0) {
      newErrors.horasContratadas = "Las horas contratadas deben ser mayores a 0";
      isValid = false;
    } else if (formData.horasContratadas > 40) {
      newErrors.horasContratadas = "Las horas contratadas no pueden exceder 40 horas semanales";
      isValid = false;
    }

    if (!formData.horasMaximasPorDia || formData.horasMaximasPorDia <= 0) {
      newErrors.horasMaximasPorDia = "Las horas máximas por día deben ser mayores a 0";
      isValid = false;
    } else if (formData.horasMaximasPorDia > 8) {
      newErrors.horasMaximasPorDia = "Las horas máximas por día no pueden exceder 8 horas";
      isValid = false;
    }

    if (!formData.unidadesIds?.length) {
      newErrors.unidadesIds = "Debe seleccionar al menos una unidad académica";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "horasContratadas" || name === "horasMaximasPorDia"
        ? parseInt(value) || 0
        : value
    }));
    // Clear error when user types
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(true);
    setCurrentStep(1);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentStep(1);
    setErrors({});
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    setFormData({
      nombre: "",
      horasContratadas: 0,
      horasMaximasPorDia: 0,
      unidadesIds: []
    });
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.nombre?.trim()) {
      setErrors({ nombre: "El nombre del docente es requerido" });
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const toastId = toast.loading("Registrando docente...");

      await createDocente(formData as Docente);

      toast.success("¡Docente registrado exitosamente!", {
        id: toastId,
        duration: 4000,
        icon: "👨‍🏫",
      });

      if (onDocenteCreated) {
        onDocenteCreated();
      }

      closeModal();
    } catch (error) {
      console.error("Error al crear el docente:", error);
      toast.error("Error al crear el docente: " + (error instanceof Error ? error.message : "Error desconocido"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <User2 size={16} className="text-primary" />
                  Nombre completo del docente
                </span>
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej: Juan Pérez Rodríguez"
                className={`input input-bordered w-full focus:input-primary transition-all duration-200
                  ${errors.nombre ? 'input-error' : ''}`}
                value={formData.nombre}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.nombre && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.nombre}
                  </span>
                </label>
              )}
            </div>

            <div className="bg-base-200/50 p-4 rounded-lg border border-base-300">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Briefcase size={16} className="text-primary" />
                Información importante
              </h4>
              <p className="text-sm text-base-content/70">
                Asegúrese de ingresar el nombre completo del docente tal como aparece en sus documentos oficiales.
                Esta información será utilizada para la generación de horarios y documentación administrativa.
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    Horas contratadas
                  </span>
                </label>
                <input
                  type="number"
                  name="horasContratadas"
                  placeholder="Ej: 20"
                  className={`input input-bordered w-full focus:input-primary transition-all duration-200
                    ${errors.horasContratadas ? 'input-error' : ''}`}
                  value={formData.horasContratadas || ''}
                  onChange={handleInputChange}
                  min="1"
                  max="40"
                  disabled={isLoading}
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">Horas semanales totales (1-40)</span>
                  {errors.horasContratadas && (
                    <span className="label-text-alt text-error flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.horasContratadas}
                    </span>
                  )}
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    Horas máximas por día
                  </span>
                </label>
                <input
                  type="number"
                  name="horasMaximasPorDia"
                  placeholder="Ej: 4"
                  className={`input input-bordered w-full focus:input-primary transition-all duration-200
                    ${errors.horasMaximasPorDia ? 'input-error' : ''}`}
                  value={formData.horasMaximasPorDia || ''}
                  onChange={handleInputChange}
                  min="1"
                  max="8"
                  disabled={isLoading}
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">Máximo de horas por día (1-8)</span>
                  {errors.horasMaximasPorDia && (
                    <span className="label-text-alt text-error flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.horasMaximasPorDia}
                    </span>
                  )}
                </label>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Building2 size={16} className="text-primary" />
                  Unidades Académicas
                </span>
              </label>
              <MultipleSelect
                isLoading={isLoading}
                selectedIds={formData.unidadesIds || []}
                onChange={(ids) => {
                  setFormData(prev => ({ ...prev, unidadesIds: ids }));
                  if (errors.unidadesIds) {
                    setErrors(prev => ({ ...prev, unidadesIds: undefined }));
                  }
                }}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Seleccione las unidades académicas a las que pertenece el docente
                </span>
                {errors.unidadesIds && (
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.unidadesIds}
                  </span>
                )}
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <button
        className="btn btn-primary btn-sm flex items-center gap-2 hover:shadow-lg transition-all duration-200"
        onClick={openModal}
      >
        <PlusCircle size={16} />
        Agregar Docente
      </button>

      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl relative">
            {/* Header */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-2">
                <User2 size={24} className="text-primary" />
                <h3 className="font-bold text-2xl">Registrar Nuevo Docente</h3>
              </div>
              <div className="divider mt-0 mb-2"></div>
              <p className="text-base-content/70">
                Complete la información del nuevo docente. Todos los campos son requeridos.
              </p>

              {/* Progress Steps */}
              <div className="w-full flex items-center justify-center gap-4 mt-4">
                {[1, 2].map((step) => (
                  <button
                    key={step}
                    onClick={() => step < currentStep && setCurrentStep(step)}
                    className={`flex flex-col items-center gap-1 ${
                      step <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                      ${step === currentStep
                        ? 'border-primary bg-primary text-white'
                        : step < currentStep
                          ? 'border-primary text-primary'
                          : 'border-base-300 text-base-300'
                      }`}
                    >
                      {step}
                    </div>
                    <span className={`text-xs ${
                      step === currentStep ? 'text-primary font-medium' : 'text-base-content/70'
                    }`}>
                      {step === 1 ? 'Datos básicos' : 'Carga horaria'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="py-4">
              {renderStepContent()}
            </div>

            <div className="divider my-6"></div>

            {currentStep === 2 && (
              <p className="text-sm text-base-content/70 mb-4 flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                Las restricciones horarias del docente se podrán configurar posteriormente.
              </p>
            )}

            {/* Actions */}
            <div className="modal-action gap-3">
              <button
                className="btn btn-ghost hover:bg-base-200"
                onClick={closeModal}
                disabled={isLoading}
              >
                Cancelar
              </button>

              {currentStep > 1 && (
                <button
                  className="btn btn-outline"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Atrás
                </button>
              )}

              {currentStep < 2 ? (
                <button
                  className="btn btn-primary hover:shadow-lg transition-all duration-200"
                  onClick={handleNext}
                  disabled={isLoading || !formData.nombre?.trim()}
                >
                  Siguiente
                </button>
              ) : (
                <button
                  className={`btn btn-primary hover:shadow-lg transition-all duration-200 ${
                    isLoading ? 'loading' : ''
                  }`}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Guardando...' : 'Registrar Docente'}
                </button>
              )}
            </div>

            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
              disabled={isLoading}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AgregarDocenteModal;