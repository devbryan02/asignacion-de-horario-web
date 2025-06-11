"use client";

import { useState, useEffect } from "react";
import { PlusCircle, User2, Clock, Building2, AlertCircle, X, Loader2, Edit } from "lucide-react";
import { createDocente, updateDocente } from "../DocenteService";
import toast from "react-hot-toast";
import { DocenteRequest } from "@/types/request/DocenteRequest";
import { DocenteResponse } from "@/types/response/DocenteResponse";
import MultipleSelect from "./MultipleSelect";

type AgregarDocenteModalProps = {
  onAddedDocente?: () => void;
  docenteToEdit?: DocenteResponse | null;
}

function AgregarDocenteModal({ 
  onAddedDocente, 
  docenteToEdit = null 
}: AgregarDocenteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<DocenteRequest>>({
    nombre: "",
    horasContratadas: 0,
    horasMaximasPorDia: 0,
    unidadesIds: []
  });

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
        
        if(onAddedDocente) {
          onAddedDocente();
        }
        
        toast.success("¡Docente registrado exitosamente!", {
          duration: 4000,
          icon: "👨‍🏫",
        });
      }

      setIsOpen(false);
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

  return (
    <>
      {docenteToEdit ? <EditButton /> : <AddButton />}

      {isOpen && (
        <div className="modal modal-open modal-middle bg-base-content/45 backdrop-blur-sm">
          <div className="modal-box max-w-2xl">
            {/* Encabezado */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex justify-center items-center gap-3">
                <div className=" placeholder">
                  <div className=" text-primary ">
                    <User2 size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl">
                    {docenteToEdit ? 'Editar Docente' : 'Registrar Nuevo Docente'}
                  </h3>
                  <p className="text-sm text-base-content/70">
                    {docenteToEdit 
                      ? "Actualice la información básica del docente" 
                      : "Complete la información del nuevo docente"
                    }
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
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
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej: Juan Pérez Rodríguez"
                  className={`input input-bordered w-full ${
                    errors.nombre ? 'input-error' : ''
                  }`}
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

              {/* Horas Contratadas y Máximas */}
              <div className="grid grid-cols-2 gap-4">
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

              {/* Unidades Académicas (solo para creación) */}
              {!docenteToEdit && (
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
              )}

              {/* Separador */}
              <div className="divider my-2"></div>

              {/* Pie de formulario */}
              <div className="modal-action">
                <button 
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsOpen(false)}
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
                  ) : (
                    docenteToEdit ? 'Actualizar Docente' : 'Registrar Docente'
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

export default AgregarDocenteModal;