"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Aula } from "@/types/AulaResponse";
import { createAula } from "./AulaService";
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
      capacidad: 0,
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
        className="btn btn-primary btn-sm flex items-center gap-2 hover:shadow-lg transition-all duration-200"
        onClick={openModal}
      >
        <PlusCircle size={16} />
        Agregar Aula
      </button>

      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl relative">
            <div className="flex flex-col gap-2 mb-6">
              <h3 className="font-bold text-2xl text-primary">Agregar Nueva Aula</h3>
              <div className="divider mt-0 mb-2"></div>
              <p className="text-base-content/70">
                Complete la información de la nueva aula. Todos los campos son requeridos.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Nombre del aula</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: Aula 101"
                  className="input input-bordered w-full focus:input-primary"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Capacidad</span>
                </label>
                <input
                  type="number"
                  name="capacidad"
                  placeholder="Ej: 30"
                  className="input input-bordered w-full focus:input-primary"
                  value={formData.capacidad}
                  onChange={handleInputChange}
                  min="1"
                  disabled={isLoading}
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">Tipo de aula</span>
                </label>
                <select
                  className="select select-bordered w-full focus:select-primary"
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
            
            <div className="divider my-6"></div>
            
            <div className="modal-action gap-3">
              <button 
                className="btn btn-ghost hover:bg-base-200" 
                onClick={closeModal}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                className={`btn btn-primary hover:shadow-lg transition-all duration-200 ${isLoading ? 'loading' : ''}`}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar Aula'}
              </button>
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

export default AgregarAulaModal;