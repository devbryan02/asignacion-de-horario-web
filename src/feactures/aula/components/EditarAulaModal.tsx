"use client";

import { X, School as SchoolIcon, CheckCircle2, Loader2 } from "lucide-react";
import { AulaFormData } from "../hooks/useAula";
import { UUID } from "crypto";

interface EditarAulaModalProps {
  isOpen: boolean;
  isLoading: boolean;
  formData: AulaFormData;
  aulaId: string | UUID;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: () => Promise<void>;
  onClose: () => void;
}

function EditarAulaModal({
  isOpen,
  isLoading,
  formData,
  aulaId,
  onInputChange,
  onSubmit,
  onClose
}: EditarAulaModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="card bg-base-100 w-full max-w-lg shadow-xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-info/10 to-transparent relative">
          <div className="flex items-center gap-4">
            <div className="bg-info/15 text-info p-3 rounded-full">
              <SchoolIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Editar Aula</h3>
              <p className="text-sm text-base-content/70">
                Modificar <span className="font-medium">{formData.nombre}</span>
              </p>
            </div>
          </div>
          
          {/* Close button */}
          <button 
            className="btn btn-sm btn-circle absolute right-4 top-4"
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Form content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Nombre del Aula</span>
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej: Aula 101"
                className="input input-bordered w-full focus:input-info"
                value={formData.nombre}
                onChange={onInputChange}
                disabled={isLoading}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">Identificador único del aula</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Capacidad</span>
              </label>
              <input
                type="number"
                name="capacidad"
                placeholder="Ej: 30"
                className="input input-bordered w-full focus:input-info"
                value={formData.capacidad}
                onChange={onInputChange}
                min="1"
                disabled={isLoading}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">Número de estudiantes</span>
              </label>
            </div>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Tipo de Aula</span>
            </label>
            <select
              className="select select-bordered w-full focus:select-info"
              name="tipo"
              value={formData.tipo}
              onChange={onInputChange}
              disabled={isLoading}
            >
              <option value="" disabled>Seleccione tipo</option>
              <option value="LABORATORIO">Laboratorio</option>
              <option value="TEORICO">Teórico</option>
            </select>
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Define el tipo de actividades que pueden realizarse
              </span>
            </label>
          </div>
          
          {/* Vista previa */}
          <div className="bg-base-200/30 p-3 rounded-lg">
            <div className="text-xs font-medium text-base-content/70 mb-2">Vista previa:</div>
            <div className="flex items-center gap-2">
              <span className={`badge ${formData.tipo === "LABORATORIO" ? "badge-secondary" : "badge-primary"}`}>
                {formData.tipo === "LABORATORIO" ? "Laboratorio" : "Teórico"}
              </span>
              <span className="font-medium">{formData.nombre || "Nombre del aula"}</span>
              {formData.capacidad > 0 && (
                <span className="text-xs text-base-content/60 ml-auto">
                  {formData.capacidad} estudiantes
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Modal footer */}
        <div className="bg-base-200/30 p-4 flex justify-end gap-3 rounded-b-lg">
          <button 
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            className="btn btn-info"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                <span>Actualizando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} className="mr-1" />
                <span>Actualizar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditarAulaModal;