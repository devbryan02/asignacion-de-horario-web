"use client";

import { useState, useEffect } from "react";
import { PlusCircle, User2, Clock, Building2, AlertCircle, X, Edit } from "lucide-react";
import { createDocente, updateDocente } from "../DocenteService";
import toast from "react-hot-toast";
import { DocenteRequest } from "@/types/request/DocenteRequest";
import { DocenteResponse } from "@/types/response/DocenteResponse";
import MultipleSelect from "./MultipleSelect";

type AgregarDocenteModalProps = {
  // Props unificadas
  docenteToEdit?: DocenteResponse | null;
  isEditMode?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onDocenteCreated?: () => void;
  onAddedDocente?: () => void;
}

function AgregarDocenteModal({ 
  docenteToEdit = null,
  isEditMode = false,
  isOpen: externalIsOpen,
  onClose,
  onDocenteCreated,
  onAddedDocente 
}: AgregarDocenteModalProps) {
  const [isOpen, setIsOpen] = useState(externalIsOpen !== undefined ? externalIsOpen : false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<DocenteRequest>>({
    nombre: "",
    horasContratadas: 0,
    horasMaximasPorDia: 0,
    unidadesIds: []
  });

  // Manejar estado controlado externamente
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  // Efecto para cargar datos de edición
  useEffect(() => {
    if (docenteToEdit) {
      setFormData({
        nombre: docenteToEdit.nombre,
        horasContratadas: docenteToEdit.horasContratadas,
        horasMaximasPorDia: docenteToEdit.horasMaximasPorDia,
        unidadesIds: [] // No incluimos unidades para edición
      });
    }
  }, [docenteToEdit]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombre?.trim()) 
      newErrors.nombre = "Nombre del docente es requerido";

    if (!formData.horasContratadas || formData.horasContratadas <= 0 || formData.horasContratadas > 40)
      newErrors.horasContratadas = "Horas inválidas (1-40)";

    if (!formData.horasMaximasPorDia || formData.horasMaximasPorDia <= 0 || formData.horasMaximasPorDia > 8)
      newErrors.horasMaximasPorDia = "Horas diarias inválidas (1-8)";

    // Solo validar unidades para creación
    if (!docenteToEdit && !formData.unidadesIds?.length)
      newErrors.unidadesIds = "Seleccione unidades académicas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      if (docenteToEdit) {
        // Lógica de actualización
        await updateDocente(docenteToEdit.id, {
          nombre: formData.nombre,
          horasContratadas: formData.horasContratadas,
          horasMaximasPorDia: formData.horasMaximasPorDia
        });
        
        toast.success("¡Docente actualizado exitosamente!", {
          duration: 4000,
          icon: "👨‍🏫",
        });
      } else {
        // Lógica de creación
        await createDocente(formData as DocenteRequest);
        
        toast.success("¡Docente registrado exitosamente!", {
          duration: 4000,
          icon: "👨‍🏫",
        });
      }

      // Notificar al componente padre
      if (onDocenteCreated) onDocenteCreated();
      if (onAddedDocente) onAddedDocente();

      // Cerrar modal
      handleClose();
      
      // Resetear formulario
      setFormData({
        nombre: "",
        horasContratadas: 0,
        horasMaximasPorDia: 0,
        unidadesIds: []
      });
    } catch (error) {
      toast.error(`Error al ${docenteToEdit ? 'actualizar' : 'crear'} el docente: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  // Botón para abrir modal de edición
  const EditButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      className="btn btn-ghost btn-sm btn-square"
      aria-label="Editar docente"
    >
      <Edit size={16} />
    </button>
  );

  // Botón para agregar docente
  const AddButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      className="btn btn-primary"
    >
      <PlusCircle size={16} className="mr-2" />
      Agregar Docente
    </button>
  );

  // Solo mostrar botón si el modal no está controlado externamente
  const renderButton = () => {
    if (externalIsOpen !== undefined) return null;
    return docenteToEdit ? <EditButton /> : <AddButton />;
  };

  // Renderizado condicional para diferentes estilos de modal según el modo
  const renderModalContent = () => {
    // Modal de edición (estilo minimalista según la captura)
    if (docenteToEdit) {
      return (
        <div className="modal-box max-w-md relative p-0 overflow-hidden bg-base-100 rounded-lg shadow-lg">
          {/* Cabecera */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-3 mb-4">
              <User2 className="text-primary" size={20} />
              <div>
                <h3 className="font-bold text-lg text-start">Editar Docente</h3>
                <p className="text-sm text-base-content/70">Actualice la información básica del docente</p>
              </div>
            </div>
            
            <button 
              onClick={handleClose}
              className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full text-base-content/60 hover:bg-base-200"
            >
              <X size={18} />
            </button>

            <hr className="border-base-200 my-4" />

            {/* Formulario simplificado */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Nombre */}
                <div className="form-control">
                  <label className="flex items-center gap-2 text-base-content/80 mb-2 text-sm">
                    <User2 size={15} className="text-primary" />
                    Nombre completo del docente
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Nombre completo"
                    className={`input input-bordered w-full ${errors.nombre ? 'input-error' : ''}`}
                    disabled={isLoading}
                    autoFocus
                  />
                  {errors.nombre && (
                    <div className="text-sm text-error mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.nombre}
                    </div>
                  )}
                </div>

                {/* Campos numéricos en un grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Horas Contratadas */}
                  <div className="form-control">
                    <label className="flex items-center gap-2 text-base-content/80 mb-2 text-sm">
                      <Clock size={15} className="text-primary" />
                      Horas contratadas
                    </label>
                    <input
                      type="number"
                      name="horasContratadas"
                      value={formData.horasContratadas || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        horasContratadas: parseInt(e.target.value) || 0 
                      }))}
                      placeholder="Ej: 20"
                      min="1"
                      max="40"
                      className={`input input-bordered w-full ${errors.horasContratadas ? 'input-error' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.horasContratadas && (
                      <div className="text-sm text-error mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.horasContratadas}
                      </div>
                    )}
                  </div>

                  {/* Horas Máximas por Día */}
                  <div className="form-control">
                    <label className="flex items-center gap-2 text-base-content/80 mb-2 text-sm">
                      <Clock size={15} className="text-primary" />
                      Horas máximas por día
                    </label>
                    <input
                      type="number"
                      name="horasMaximasPorDia"
                      value={formData.horasMaximasPorDia || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        horasMaximasPorDia: parseInt(e.target.value) || 0 
                      }))}
                      placeholder="Ej: 4"
                      min="1"
                      max="8"
                      className={`input input-bordered w-full ${errors.horasMaximasPorDia ? 'input-error' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.horasMaximasPorDia && (
                      <div className="text-sm text-error mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.horasMaximasPorDia}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button"
                  className="px-4 py-2 rounded text-base-content/70 hover:bg-base-200 transition-colors"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-primary text-primary-content rounded hover:bg-primary/90 transition-colors flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      <span>Actualizando...</span>
                    </>
                  ) : 'Actualizar Docente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
    
    // Modal de creación (estilo actual)
    return (
      <div className="modal-box max-w-2xl relative">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex justify-center items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <User2 size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Registrar Nuevo Docente</h3>
              <p className="text-sm text-base-content/70">
                Complete la información del nuevo docente
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4"
          >
            <X size={20} />
          </button>
        </div>

        {/* Separador */}
        <div className="divider my-2"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <User2 size={16} className="text-primary" />
                Nombre completo del docente
              </span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej: Juan Pérez Rodríguez"
              className={`input input-bordered w-full ${
                errors.nombre ? 'input-error' : ''
              }`}
              disabled={isLoading}
              autoFocus
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

          {/* Horas Contratadas y Máximas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Horas Contratadas */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  Horas contratadas
                </span>
              </label>
              <input
                type="number"
                name="horasContratadas"
                value={formData.horasContratadas || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  horasContratadas: parseInt(e.target.value) || 0 
                }))}
                placeholder="Ej: 20"
                min="1"
                max="40"
                className={`input input-bordered w-full ${
                  errors.horasContratadas ? 'input-error' : ''
                }`}
                disabled={isLoading}
              />
              {errors.horasContratadas && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.horasContratadas}
                  </span>
                </label>
              )}
            </div>

            {/* Horas Máximas por Día */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  Horas máximas por día
                </span>
              </label>
              <input
                type="number"
                name="horasMaximasPorDia"
                value={formData.horasMaximasPorDia || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  horasMaximasPorDia: parseInt(e.target.value) || 0 
                }))}
                placeholder="Ej: 4"
                min="1"
                max="8"
                className={`input input-bordered w-full ${
                  errors.horasMaximasPorDia ? 'input-error' : ''
                }`}
                disabled={isLoading}
              />
              {errors.horasMaximasPorDia && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.horasMaximasPorDia}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Unidades Académicas */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                Unidades Académicas
              </span>
            </label>
            <MultipleSelect
              isLoading={isLoading}
              selectedIds={formData.unidadesIds || []}
              onChange={(ids) => setFormData(prev => ({ ...prev, unidadesIds: ids }))}
            />
            {errors.unidadesIds && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.unidadesIds}
                </span>
              </label>
            )}
          </div>

          {/* Separador */}
          <div className="divider my-2"></div>

          {/* Pie de formulario */}
          <div className="modal-action">
            <button 
              type="button"
              className="btn btn-ghost"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Guardando...
                </>
              ) : 'Registrar Docente'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <>
      {renderButton()}

      {isOpen && (
        <div className="modal modal-open modal-middle bg-base-content/45 backdrop-blur-sm z-50">
          {renderModalContent()}
        </div>
      )}
    </>
  );
}

export default AgregarDocenteModal;