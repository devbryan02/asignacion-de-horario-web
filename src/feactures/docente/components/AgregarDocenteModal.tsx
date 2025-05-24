"use client";

import { useEffect, useState } from "react";
import { PlusCircle, User2, Clock, Briefcase, Building2, AlertCircle, X, Loader2 } from "lucide-react";
import { DocenteResponse } from "@/types/response/DocenteResponse";
import { createDocente, updateDocente, DocenteUpdateRequest } from "../DocenteService";
import toast from "react-hot-toast";
import { DocenteRequest } from "@/types/request/DocenteRequest";
import MultipleSelect from "./MultipleSelect";

interface AgregarDocenteModalProps {
  onDocenteCreated?: () => void;
  docenteToEdit?: DocenteResponse | null;
  isEditMode?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

interface ValidationErrors {
  nombre?: string;
  horasContratadas?: string;
  horasMaximasPorDia?: string;
  unidadesIds?: string;
}

function AgregarDocenteModal({ 
  onDocenteCreated, 
  docenteToEdit = null, 
  isEditMode = false,
  isOpen: externalIsOpen = false,
  onClose
}: AgregarDocenteModalProps) {
  const [isOpen, setIsOpen] = useState(externalIsOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<Partial<DocenteRequest>>({
    nombre: "",
    horasContratadas: 0,
    horasMaximasPorDia: 0,
    unidadesIds: []
  });

  // Actualizar estado cuando cambia docenteToEdit o isOpen externo
  useEffect(() => {
    if (docenteToEdit) {
      setFormData({
        nombre: docenteToEdit.nombre,
        horasContratadas: docenteToEdit.horasContratadas,
        horasMaximasPorDia: docenteToEdit.horasMaximasPorDia
        // No incluimos unidadesIds para edición ya que usaremos actualización parcial
      });
    }
  }, [docenteToEdit]);
  
  useEffect(() => {
    setIsOpen(externalIsOpen);
    if (externalIsOpen) {
      setCurrentStep(1);
    }
  }, [externalIsOpen]);

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

    // Solo validamos unidadesIds para creación, no para edición
    if (!isEditMode && !formData.unidadesIds?.length) {
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
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
    setCurrentStep(1);
    setErrors({});
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    // Solo resetear formulario si no estamos en modo edición
    if (!isEditMode) {
      setFormData({
        nombre: "",
        horasContratadas: 0,
        horasMaximasPorDia: 0,
        unidadesIds: []
      });
    }
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
      const action = isEditMode ? "Actualizando" : "Registrando";
      const toastId = toast.loading(`${action} docente...`);

      if (isEditMode && docenteToEdit) {
        // Para edición, usamos la actualización parcial
        const updateData: DocenteUpdateRequest = {
          nombre: formData.nombre,
          horasContratadas: formData.horasContratadas,
          horasMaximasPorDia: formData.horasMaximasPorDia
        };
        
        await updateDocente(docenteToEdit.id, updateData);
        
        toast.success("¡Docente actualizado exitosamente!", {
          id: toastId,
          duration: 4000,
          icon: "👨‍🏫",
        });
      } else {
        // Para creación, enviamos el objeto completo
        await createDocente(formData as DocenteRequest);
        toast.success("¡Docente registrado exitosamente!", {
          id: toastId,
          duration: 4000,
          icon: "👨‍🏫",
        });
      }

      if (onDocenteCreated) {
        onDocenteCreated();
      }

      closeModal();
    } catch (error) {
      console.error(`Error al ${isEditMode ? "actualizar" : "crear"} el docente:`, error);
      toast.error(`Error al ${isEditMode ? "actualizar" : "crear"} el docente: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-base-content flex items-center gap-2">
                <User2 size={16} className="text-primary" />
                Nombre completo del docente
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej: Juan Pérez Rodríguez"
                className={`w-full h-10 px-3 rounded-md border bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                  errors.nombre 
                    ? 'border-error text-error placeholder:text-error/50' 
                    : 'border-base-300'
                }`}
                value={formData.nombre}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.nombre && (
                <p className="text-xs text-error flex items-center gap-1 mt-1">
                  <AlertCircle size={14} />
                  {errors.nombre}
                </p>
              )}
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-base-content">
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
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  Horas contratadas
                </label>
                <input
                  type="number"
                  name="horasContratadas"
                  placeholder="Ej: 20"
                  className={`w-full h-10 px-3 rounded-md border bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                    errors.horasContratadas 
                      ? 'border-error text-error placeholder:text-error/50' 
                      : 'border-base-300'
                  }`}
                  value={formData.horasContratadas || ''}
                  onChange={handleInputChange}
                  min="1"
                  max="40"
                  disabled={isLoading}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-base-content/60 mt-1">
                    Horas semanales totales (1-40)
                  </p>
                  {errors.horasContratadas && (
                    <p className="text-xs text-error flex items-center gap-1 mt-1">
                      <AlertCircle size={14} />
                      {errors.horasContratadas}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  Horas máximas por día
                </label>
                <input
                  type="number"
                  name="horasMaximasPorDia"
                  placeholder="Ej: 4"
                  className={`w-full h-10 px-3 rounded-md border bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                    errors.horasMaximasPorDia 
                      ? 'border-error text-error placeholder:text-error/50' 
                      : 'border-base-300'
                  }`}
                  value={formData.horasMaximasPorDia || ''}
                  onChange={handleInputChange}
                  min="1"
                  max="8"
                  disabled={isLoading}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-base-content/60 mt-1">
                    Máximo de horas por día (1-8)
                  </p>
                  {errors.horasMaximasPorDia && (
                    <p className="text-xs text-error flex items-center gap-1 mt-1">
                      <AlertCircle size={14} />
                      {errors.horasMaximasPorDia}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sólo mostrar el selector de unidades para creación, no para edición */}
            {!isEditMode && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-base-content flex items-center gap-2">
                  <Building2 size={16} className="text-primary" />
                  Unidades Académicas
                </label>
                <div className={`${errors.unidadesIds ? 'border-error rounded-md border' : ''}`}>
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
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-base-content/60 mt-1">
                    Seleccione las unidades académicas a las que pertenece el docente
                  </p>
                  {errors.unidadesIds && (
                    <p className="text-xs text-error flex items-center gap-1 mt-1">
                      <AlertCircle size={14} />
                      {errors.unidadesIds}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Mensaje informativo para modo edición */}
            {isEditMode && (
              <div className="bg-info/10 p-4 rounded-lg border border-info/20">
                <p className="text-sm text-base-content flex items-center gap-2">
                  <Building2 size={16} className="text-info" />
                  No es posible actualizar las unidades académicas asignadas al docente porque ya tiene restricciones y asignaciones horarias generadas. 
                </p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Si el control es externo, solo renderizar cuando isOpen es true
  if (onClose && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Solo mostrar el botón si no es controlado externamente */}
      {!onClose && (
        <button
          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-content text-sm font-medium shadow-sm hover:bg-primary-focus transition-colors"
          onClick={openModal}
        >
          <PlusCircle size={16} className="opacity-90" />
          <span>Agregar Docente</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/45 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-base-100 rounded-lg shadow-xl overflow-hidden animate-fadeIn">
            {/* Modal header */}
            <div className="px-6 pt-5 pb-4 border-b border-base-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary border border-primary/20">
                  <User2 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-base-content">
                    {isEditMode ? "Editar Docente" : "Registrar Nuevo Docente"}
                  </h3>
                  <p className="text-sm mt-1 text-base-content/70">
                    {isEditMode 
                      ? "Actualice la información básica del docente."
                      : "Complete la información del nuevo docente. Todos los campos son requeridos."
                    }
                  </p>
                </div>
              </div>
              
              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {[1, 2].map((step) => (
                  <div key={step} className="flex items-center">
                    {step > 1 && (
                      <div className={`w-10 h-0.5 ${
                        step <= currentStep ? 'bg-primary' : 'bg-base-300'
                      }`} />
                    )}
                    <button
                      onClick={() => step < currentStep && setCurrentStep(step)}
                      className={`flex flex-col items-center ${
                        step <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'
                      }`}
                      disabled={step > currentStep || isLoading}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                        step === currentStep
                          ? 'border-primary bg-primary text-primary-content'
                          : step < currentStep
                            ? 'border-primary text-primary bg-primary/10'
                            : 'border-base-300 text-base-content/50 bg-base-100'
                        }`}
                      >
                        {step}
                      </div>
                      <span className={`text-xs mt-1.5 ${
                        step === currentStep ? 'text-primary font-medium' : 'text-base-content/60'
                      }`}>
                        {step === 1 ? 'Datos básicos' : 'Carga horaria'}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Form Content */}
            <div className="px-6 py-5">
              {renderStepContent()}
            </div>
            
            {currentStep === 2 && (
              <div className="px-6 pt-0 pb-4">
                <p className="text-sm text-base-content/70 flex items-center gap-2">
                  <Clock size={16} className="text-primary/70" />
                  Las restricciones horarias del docente se podrán configurar posteriormente.
                </p>
              </div>
            )}
            
            {/* Modal footer */}
            <div className="px-6 py-4 bg-base-200/50 border-t border-base-200 flex justify-end gap-3">
              <button 
                className="px-4 py-2 rounded-md text-sm font-medium text-base-content/70 hover:bg-base-300 hover:text-base-content transition-colors" 
                onClick={closeModal}
                disabled={isLoading}
              >
                Cancelar
              </button>

              {currentStep > 1 && (
                <button 
                  className="px-4 py-2 rounded-md text-sm font-medium border border-base-300 hover:bg-base-200 transition-colors" 
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Atrás
                </button>
              )}

              {currentStep < 2 ? (
                <button 
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-content hover:bg-primary-focus transition-colors"
                  onClick={handleNext}
                  disabled={isLoading || !formData.nombre?.trim()}
                >
                  Siguiente
                </button>
              ) : (
                <button 
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-content hover:bg-primary-focus transition-colors flex items-center gap-2"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : isEditMode ? 'Actualizar Docente' : 'Registrar Docente'}
                </button>
              )}
            </div>

            {/* Close button */}
            <button 
              className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-base-content/60 hover:bg-base-200 hover:text-base-content transition-colors"
              onClick={closeModal}
              disabled={isLoading}
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AgregarDocenteModal;