"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Loader2, X } from "lucide-react";
import { usePeriodoAcademico } from "../hooks/usePeriodo";
import { toast } from "react-hot-toast";

// Esquema de validación
const periodoSchema = z.object({
  nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido"),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido")
}).refine((data) => new Date(data.fechaInicio) < new Date(data.fechaFin), {
  message: "La fecha de inicio debe ser anterior a la fecha de fin",
  path: ["fechaFin"]
});

interface AgregarPeriodoAcademicoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgregarPeriodoAcademicoModal: React.FC<AgregarPeriodoAcademicoModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { createPeriodo } = usePeriodoAcademico();
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm({
    resolver: zodResolver(periodoSchema)
  });

  const onSubmit = async (data: z.infer<typeof periodoSchema>) => {
    try {
      const result = await createPeriodo({
        nombre: data.nombre,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin
      });

      if (result) {
        toast.success("Periodo académico creado exitosamente");
        reset();
        onClose();
      } else {
        toast.error("Error al crear el periodo académico");
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/45 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-base-100 rounded-lg shadow-xl overflow-hidden animate-fadeIn">
        {/* Modal header */}
        <div className="px-6 pt-5 pb-4 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary border border-primary/20">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-base-content">Agregar Nuevo Periodo Académico</h3>
              <p className="text-sm mt-1 text-base-content/70">
                Complete la información del nuevo periodo
              </p>
            </div>
          </div>
        </div>
        
        {/* Form content */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-base-content">
                Nombre del Periodo
              </label>
              <input
                type="text"
                placeholder="Ej: 2024-1"
                className={`w-full h-10 px-3 rounded-md border ${
                  errors.nombre 
                    ? 'border-error text-error' 
                    : 'border-base-300 focus:ring-primary/30 focus:border-primary'
                } bg-base-100 focus:outline-none focus:ring-2 transition-all`}
                {...register("nombre")}
              />
              {errors.nombre && (
                <p className="text-error text-xs mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-base-content">
                Fecha de Inicio
              </label>
              <input
                type="date"
                className={`w-full h-10 px-3 rounded-md border ${
                  errors.fechaInicio 
                    ? 'border-error text-error' 
                    : 'border-base-300 focus:ring-primary/30 focus:border-primary'
                } bg-base-100 focus:outline-none focus:ring-2 transition-all`}
                {...register("fechaInicio")}
              />
              {errors.fechaInicio && (
                <p className="text-error text-xs mt-1">{errors.fechaInicio.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-base-content">
                Fecha de Fin
              </label>
              <input
                type="date"
                className={`w-full h-10 px-3 rounded-md border ${
                  errors.fechaFin 
                    ? 'border-error text-error' 
                    : 'border-base-300 focus:ring-primary/30 focus:border-primary'
                } bg-base-100 focus:outline-none focus:ring-2 transition-all`}
                {...register("fechaFin")}
              />
              {errors.fechaFin && (
                <p className="text-error text-xs mt-1">{errors.fechaFin.message}</p>
              )}
            </div>
          </div>
        </form>
        
        {/* Modal footer */}
        <div className="px-6 py-4 bg-base-200/50 border-t border-base-200 flex justify-end gap-3">
          <button 
            className="px-4 py-2 rounded-md text-sm font-medium text-base-content/70 hover:bg-base-300 hover:text-base-content transition-colors" 
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancelar
          </button>
          <button 
            className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-content hover:bg-primary-focus transition-colors flex items-center gap-2"
            onClick={handleSubmit(onSubmit)}
          >
            Guardar Periodo
          </button>
        </div>

        {/* Close button */}
        <button 
          className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-base-content/60 hover:bg-base-200 hover:text-base-content transition-colors"
          onClick={() => {
            reset();
            onClose();
          }}
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};