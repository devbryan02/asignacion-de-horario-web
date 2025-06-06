"use client";

import { useState } from "react";
import { PlusCircle, User2, Clock, Building2, AlertCircle, X, Loader2 } from "lucide-react";
import { createDocente } from "../DocenteService";
import toast from "react-hot-toast";
import { DocenteRequest } from "@/types/request/DocenteRequest";
import MultipleSelect from "./MultipleSelect";

type AgregarDocenteModalProps = {
  onAddedDocente?: () => void;
}

function AgregarDocenteModal({ onAddedDocente }: AgregarDocenteModalProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<DocenteRequest>>({
    nombre: "",
    horasContratadas: 0,
    horasMaximasPorDia: 0,
    unidadesIds: []
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombre?.trim()) 
      newErrors.nombre = "Nombre del docente es requerido";

    if (!formData.horasContratadas || formData.horasContratadas <= 0 || formData.horasContratadas > 40)
      newErrors.horasContratadas = "Horas inválidas (1-40)";

    if (!formData.horasMaximasPorDia || formData.horasMaximasPorDia <= 0 || formData.horasMaximasPorDia > 8)
      newErrors.horasMaximasPorDia = "Horas diarias inválidas (1-8)";

    if (!formData.unidadesIds?.length)
      newErrors.unidadesIds = "Seleccione unidades académicas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await createDocente(formData as DocenteRequest);
      // Si se proporciona la función onAddedDocente, se llama para actualizar la lista de docentes
      if(onAddedDocente) {
        onAddedDocente();
      }
      toast.success("¡Docente registrado exitosamente!", {
        duration: 4000,
        icon: "👨‍🏫",
      });

      setIsOpen(false);
      // Resetear formulario
      setFormData({
        nombre: "",
        horasContratadas: 0,
        horasMaximasPorDia: 0,
        unidadesIds: []
      });
    } catch (error) {
      toast.error(`Error al crear el docente: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-content text-sm font-medium shadow-sm hover:bg-primary-focus transition-colors"
      >
        <PlusCircle size={16} className="opacity-90" />
        <span>Agregar Docente</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/45 backdrop-blur-sm">
          <form 
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-base-100 rounded-lg shadow-xl overflow-hidden animate-fadeIn relative"
          >
            {/* Encabezado */}
            <div className="px-6 pt-5 pb-4 border-b border-base-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary border border-primary/20">
                  <User2 size={20} />
                </div>
                <h3 className="text-xl font-bold text-base-content">
                  Registrar Nuevo Docente
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-base-content/60 hover:text-base-content"
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido del formulario */}
            <div className="p-6 space-y-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content flex items-center gap-2">
                  <User2 size={16} className="text-primary" />
                  Nombre completo del docente
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej: Juan Pérez Rodríguez"
                  className={`w-full h-10 px-3 rounded-md border bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                    errors.nombre ? 'border-error text-error' : 'border-base-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.nombre && (
                  <p className="text-xs text-error flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors.nombre}
                  </p>
                )}
              </div>

              {/* Horas Contratadas */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
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
                  className={`w-full h-10 px-3 rounded-md border bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                    errors.horasContratadas ? 'border-error text-error' : 'border-base-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.horasContratadas && (
                  <p className="text-xs text-error flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors.horasContratadas}
                  </p>
                )}
              </div>

              {/* Horas Máximas por Día */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
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
                  className={`w-full h-10 px-3 rounded-md border bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                    errors.horasMaximasPorDia ? 'border-error text-error' : 'border-base-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.horasMaximasPorDia && (
                  <p className="text-xs text-error flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors.horasMaximasPorDia}
                  </p>
                )}
              </div>

              {/* Unidades Académicas */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content flex items-center gap-2">
                  <Building2 size={16} className="text-primary" />
                  Unidades Académicas
                </label>
                <MultipleSelect
                  isLoading={isLoading}
                  selectedIds={formData.unidadesIds || []}
                  onChange={(ids) => setFormData(prev => ({ ...prev, unidadesIds: ids }))}
                />
                {errors.unidadesIds && (
                  <p className="text-xs text-error flex items-center gap-1 mt-1">
                    <AlertCircle size={14} />
                    {errors.unidadesIds}
                  </p>
                )}
              </div>
            </div>

            {/* Pie de formulario */}
            <div className="px-6 py-4 bg-base-200/50 border-t border-base-200 flex justify-end">
              <button 
                type="submit"
                className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-content hover:bg-primary-focus transition-colors flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  'Registrar Docente'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default AgregarDocenteModal;