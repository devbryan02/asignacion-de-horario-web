"use client";

import { useState } from "react";
import { PlusCircle, X, SchoolIcon, Loader2 } from "lucide-react";
import { Aula } from "@/types/AulaResponse";
import { createAula } from "../AulaService";
import toast from "react-hot-toast";


interface AgregarAulaModalProps {
  onAulaCreated?: () => void;
}

function AgregarAulaModal({ onAulaCreated }: AgregarAulaModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Aula>>({
    nombre: "",
    capacidad: 50,
    tipo: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "capacidad" ? parseInt(value) || 0 : value
    });
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
    // Resetear el formulario al cerrar
    setFormData({
      nombre: "",
      capacidad: 50,
      tipo: ""
    });
  };

  const handleSubmit = async () => {
    if (!formData.nombre?.trim()) {
      toast.error("El nombre del aula es requerido");
      return;
    }
    
    if (!formData.tipo) {
      toast.error("Debe seleccionar un tipo de aula");
      return;
    }
    
    if (!formData.capacidad || formData.capacidad <= 0) {
      toast.error("La capacidad debe ser mayor a 0");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const toastId = toast.loading("Creando aula...");
      
      await createAula(formData as Aula);
      
      toast.success("Aula creada exitosamente", {
        id: toastId,
      });
      if (onAulaCreated) {
        onAulaCreated();
      }
      
      closeModal();
    } catch (error) {
      console.error("Error al crear el aula:", error);
      toast.error("Error al crear el aula: " + (error instanceof Error ? error.message : "Error desconocido"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-content text-sm font-medium shadow-sm hover:bg-primary-focus transition-colors"
        onClick={openModal}
      >
        <PlusCircle size={16} className="opacity-90" />
        <span>Agregar Aula</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/40 backdrop-blur-sm">
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