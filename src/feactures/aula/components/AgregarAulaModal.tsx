"use client";

import { PlusCircle, X, School as SchoolIcon, Loader2 } from "lucide-react";
import { useCreateAula } from "../hooks/useCreateAula";

interface AgregarAulaModalProps {
  onAulaCreated?: () => void;
}

function AgregarAulaModal({ onAulaCreated }: AgregarAulaModalProps) {
  const {
    isOpen,
    isLoading,
    formData,
    handleInputChange,
    openModal,
    closeModal,
    handleSubmit
  } = useCreateAula({ onAulaCreated });

  return (
    <>
      <button
        className="inline-flex cursor-pointer items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-content text-sm font-medium shadow-sm hover:bg-primary-focus transition-colors"
        onClick={openModal}
      >
        <PlusCircle size={16} className="opacity-90" />
        <span>Agregar Aula</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/45 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-base-100 rounded-lg shadow-xl overflow-hidden animate-fadeIn">
            {/* Modal header */}
            <div className="px-6 pt-5 pb-4 border-b border-base-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary border border-primary/20">
                  <SchoolIcon size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-base-content">Agregar Nueva Aula</h3>
                  <p className="text-sm mt-1 text-base-content/70">
                    Complete la información de la nueva aula
                  </p>
                </div>
              </div>
            </div>
            
            {/* Form content */}
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-base-content">
                    Nombre del aula
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Aula 101"
                    className="w-full h-10 px-3 rounded-md border border-base-300 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-base-content">
                    Capacidad
                  </label>
                  <input
                    type="number"
                    name="capacidad"
                    placeholder="Ej: 30"
                    className="w-full h-10 px-3 rounded-md border border-base-300 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    value={formData.capacidad}
                    onChange={handleInputChange}
                    min="1"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-base-content">
                    Tipo de aula
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-base-300 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  >
                    <option value="" disabled>Seleccione tipo</option>
                    <option value="LABORATORIO">Laboratorio</option>
                    <option value="TEORICO">Teórico</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Modal footer */}
            <div className="px-6 py-4 bg-base-200/50 border-t border-base-200 flex justify-end gap-3">
              <button 
                className="px-4 py-2 rounded-md text-sm font-medium text-base-content/70 hover:bg-base-300 hover:text-base-content transition-colors" 
                onClick={closeModal}
                disabled={isLoading}
              >
                Cancelar
              </button>
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
                ) : 'Guardar Aula'}
              </button>
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

export default AgregarAulaModal;