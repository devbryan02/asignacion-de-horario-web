import { useState } from "react";
import { Aula } from "@/types/AulaResponse";
import { createAula } from "../AulaService";
import toast from "react-hot-toast";

interface UseCreateAulaProps {
  onAulaCreated?: () => void;
}

interface UseCreateAulaReturn {
  isOpen: boolean;
  isLoading: boolean;
  formData: Partial<Aula>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  openModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
  closeModal: () => void;
  handleSubmit: () => Promise<void>;
}

export const useCreateAula = ({ onAulaCreated }: UseCreateAulaProps): UseCreateAulaReturn => {
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
    if (!validateForm()) {
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