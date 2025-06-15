"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, X, Check } from "lucide-react";
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
    formState: { errors, isSubmitting }, 
    reset 
  } = useForm({
    resolver: zodResolver(periodoSchema),
    defaultValues: {
      nombre: "",
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0]
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-base-100 w-full max-w-lg rounded-lg shadow-xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary/10 to-transparent relative">
          <div className="flex items-center gap-4">
            <div className="bg-primary/15 text-primary p-3 rounded-full">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Nuevo Periodo Académico</h3>
              <p className="text-sm text-base-content/70">
                Configure los datos del nuevo periodo
              </p>
            </div>
          </div>
          
          {/* Close button */}
          <button 
            className="btn btn-sm btn-circle absolute right-4 top-4"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Form content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Nombre del Periodo</span>
            </label>
            <input
              type="text"
              placeholder="Ej: 2024-1"
              className={`input input-bordered w-full ${errors.nombre ? 'input-error' : ''}`}
              {...register("nombre")}
            />
            {errors.nombre && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.nombre.message}</span>
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Fecha de Inicio</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  className={`input input-bordered w-full pl-10 ${errors.fechaInicio ? 'input-error' : ''}`}
                  {...register("fechaInicio")}
                />
              </div>
              {errors.fechaInicio && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.fechaInicio.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Fecha de Fin</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  className={`input input-bordered w-full pl-10 ${errors.fechaFin ? 'input-error' : ''}`}
                  {...register("fechaFin")}
                />
              </div>
              {errors.fechaFin && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.fechaFin.message}</span>
                </label>
              )}
            </div>
          </div>
        </form>
        
        {/* Modal footer */}
        <div className="bg-base-200/30 p-4 flex justify-end gap-3 rounded-b-lg">
          <button 
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancelar
          </button>
          <button 
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Check size={16} className="mr-1" />
            )}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};