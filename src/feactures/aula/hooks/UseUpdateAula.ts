import { useState, useEffect } from "react";
import { Aula } from "@/types/AulaResponse";
import { updateAula } from "../AulaService";
import toast from "react-hot-toast";
import { UUID } from "crypto";

interface UseUpdateAulaProps {
  onAulaUpdated?: () => void;
  aulaToUpdate?: Aula | null;
  onClose?: () => void; // Añadir esta callback para notificar al padre que cierre el modal
}

interface UseUpdateAulaReturn {
  isOpen: boolean;
  isLoading: boolean;
  formData: Partial<Aula>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  openModal: () => void;
  closeModal: () => void;
  handleSubmit: () => Promise<void>;
}

export const useUpdateAula = ({ onAulaUpdated, aulaToUpdate, onClose }: UseUpdateAulaProps): UseUpdateAulaReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Aula>>({
    nombre: "",
    capacidad: 50,
    tipo: ""
  });

  // Actualizar el formData cuando se proporciona un aula para editar
  useEffect(() => {
    if (aulaToUpdate) {
      setFormData({
        nombre: aulaToUpdate.nombre,
        capacidad: aulaToUpdate.capacidad,
        tipo: aulaToUpdate.tipo
      });
    }
  }, [aulaToUpdate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "capacidad" ? parseInt(value) || 0 : value
    });
  };

  const openModal = () => {
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
  };

  const validateForm = (): boolean => {
    if (!formData.nombre?.trim()) {
      toast.error("El nombre del aula es requerido");
      return false;
    }
    
    if (!formData.tipo) {
      toast.error("Debe seleccionar un tipo de aula");
      return false;
    }
    
    if (!formData.capacidad || formData.capacidad <= 0) {
      toast.error("La capacidad debe ser mayor a 0");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !aulaToUpdate?.id) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const toastId = toast.loading("Actualizando aula...");
      
      await updateAula(formData as Omit<Aula, "id">, aulaToUpdate.id as UUID);
      
      toast.success("Aula actualizada exitosamente", {
        id: toastId,
      });

      // Cerrar el modal interno
      closeModal();
      
      // Notificar al padre que debe cerrar el modal
      if (onClose) {
        onClose();
      }

      // Notificar que debe actualizar la lista de aulas
      if (onAulaUpdated) {
        onAulaUpdated();
      }
      
    } catch (error) {
      console.error("Error al actualizar el aula:", error);
      toast.error("Error al actualizar el aula: " + (error instanceof Error ? error.message : "Error desconocido"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    isLoading,
    formData,
    handleInputChange,
    openModal,
    closeModal,
    handleSubmit
  };
};