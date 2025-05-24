"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Clock, AlertCircle, X, Calendar, Clock3, Shield, Loader2 } from "lucide-react";
import { createRestriccionDocente } from "../DocenteService";
import { RestriccionRequest } from "@/types/request/RestriccionRequest";
import { DiaSemana } from "@/types/DiaSemana";
import { TipoRestriccion } from "@/types/TipoRestriccion";
import toast from "react-hot-toast";
import { UUID } from "crypto";
import { useRouter } from 'next/navigation';

interface AgregarRestriccionModalProps {
    docenteId: UUID;
    docenteNombre: string;
    onRestriccionCreated?: () => void;
}

function AgregarRestriccionModal({ docenteId, docenteNombre, onRestriccionCreated }: AgregarRestriccionModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Omit<RestriccionRequest, "docenteId">>({
        diaSemana: "LUNES",
        horaInicio: "08:00:00",
        horaFin: "10:00:00",
        tipoRestriccion: "DISPONIBLE"
    });
    
    const diasSemana: DiaSemana[] = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];
    const tiposRestriccion: TipoRestriccion[] = ["DISPONIBLE", "BLOQUEADO"];
    // Modificar la generación de horas disponibles para incluir hasta las 22:00
    const horasDisponibles = Array.from({ length: 16 }, (_, i) => {
        const hora = i + 7; // Empezar desde las 7:00 hasta 22:00 (7+15)
        return `${hora.toString().padStart(2, '0')}:00:00`;
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        if (formData.horaInicio >= formData.horaFin) {
            const horaInicioIndex = horasDisponibles.findIndex(h => h === formData.horaInicio);
            if (horaInicioIndex < horasDisponibles.length - 1) {
                setFormData(prev => ({
                    ...prev,
                    horaFin: horasDisponibles[horaInicioIndex + 1]
                }));
            }
        }
    }, [formData.horaInicio]);

    const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsOpen(true);
        setCurrentStep(1);
        if (typeof document !== "undefined") {
            document.body.style.overflow = "hidden";
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setCurrentStep(1);
        setErrorMensaje(null);
        if (typeof document !== "undefined") {
            document.body.style.overflow = "";
        }
        setFormData({
            diaSemana: "LUNES",
            horaInicio: "08:00:00",
            horaFin: "10:00:00",
            tipoRestriccion: "DISPONIBLE"
        });
    };

    const handleSubmit = async () => {
        if (formData.horaInicio >= formData.horaFin) {
            toast.error("La hora de fin debe ser posterior a la hora de inicio");
            return;
        }

        try {
            setIsLoading(true);
            setErrorMensaje(null);
            const toastId = toast.loading("Agregando restricción...");

            const restriccionCompleta: RestriccionRequest = {
                ...formData,
                docenteId: docenteId
            };

            const response = await createRestriccionDocente(restriccionCompleta);
    
            if (!response.success) {
                toast.dismiss(toastId);
                setErrorMensaje(response.message);
                return;
            }

            toast.success("Restricción agregada exitosamente", { id: toastId });
            if (onRestriccionCreated) {
                onRestriccionCreated();
            }
            closeModal();
        } catch (error) {
            setErrorMensaje("Error al crear la restricción. Por favor, inténtelo de nuevo más tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatHora = (hora: string) => hora.substring(0, 5);

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-base-content flex items-center gap-2">
                                <Calendar size={16} className="text-primary" />
                                Día de la semana
                            </label>
                            <div className="grid grid-cols-7 gap-1.5">
                                {diasSemana.map(dia => (
                                    <button
                                        key={dia}
                                        type="button"
                                        className={`py-2 px-1 rounded-md border transition-colors text-sm font-medium
                                            ${formData.diaSemana === dia
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-base-300 hover:border-primary/40 text-base-content/80 hover:bg-base-200/70'
                                            }`}
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            diaSemana: dia
                                        }))}
                                        disabled={isLoading}
                                    >
                                        {dia.charAt(0)}
                                        <span className="hidden sm:inline">
                                            {dia.substring(1, 3).toLowerCase()}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 mt-6">
                            <label className="text-sm font-medium text-base-content flex items-center gap-2">
                                <Shield size={16} className="text-primary" />
                                Tipo de restricción
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {tiposRestriccion.map(tipo => (
                                    <button
                                        key={tipo}
                                        type="button"
                                        className={`py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2
                                            ${formData.tipoRestriccion === tipo
                                                ? tipo === "DISPONIBLE"
                                                    ? 'border-success/30 bg-success/10 text-success'
                                                    : 'border-error/30 bg-error/10 text-error'
                                                : 'border-base-300 text-base-content/70 hover:border-base-400'
                                            }`}
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            tipoRestriccion: tipo
                                        }))}
                                        disabled={isLoading}
                                    >
                                        {tipo === "DISPONIBLE" ? (
                                            <>
                                                <span className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                </span>
                                                <span className="font-medium">Disponible</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-5 h-5 rounded-full bg-error/20 flex items-center justify-center text-error">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                </span>
                                                <span className="font-medium">Bloqueado</span>
                                            </>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-base-content flex items-center gap-2">
                                <Clock3 size={16} className="text-primary" />
                                Rango de horas
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-base-content/70">
                                        Hora de inicio
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="appearance-none w-full h-10 pl-3 pr-8 rounded-md border border-base-300 bg-base-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                                            name="horaInicio"
                                            value={formData.horaInicio}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                        >
                                            {horasDisponibles.map(hora => (
                                                <option key={`inicio-${hora}`} value={hora}>
                                                    {formatHora(hora)}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-base-content/50">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-base-content/70">
                                        Hora de fin
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="appearance-none w-full h-10 pl-3 pr-8 rounded-md border border-base-300 bg-base-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                                            name="horaFin"
                                            value={formData.horaFin}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                        >
                                            {horasDisponibles
                                                .filter(hora => hora > formData.horaInicio)
                                                .map(hora => (
                                                    <option key={`fin-${hora}`} value={hora}>
                                                        {formatHora(hora)}
                                                    </option>
                                                ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-base-content/50">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 rounded-md ${
                            formData.tipoRestriccion === "DISPONIBLE" 
                                ? 'bg-success/5 border border-success/20' 
                                : 'bg-error/5 border border-error/20'
                        }`}>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Clock size={16} className={formData.tipoRestriccion === "DISPONIBLE" ? 'text-success' : 'text-error'} />
                                <span className={formData.tipoRestriccion === "DISPONIBLE" ? 'text-success' : 'text-error'}>
                                    Resumen de la restricción
                                </span>
                            </h4>
                            <p className="text-sm leading-relaxed text-base-content/90">
                                Este horario quedará <span className={`font-semibold ${
                                    formData.tipoRestriccion === "DISPONIBLE" ? "text-success" : "text-error"
                                }`}>
                                    {formData.tipoRestriccion === "DISPONIBLE" ? "disponible" : "bloqueado"}
                                </span> los días <span className="font-medium">
                                    {formData.diaSemana.charAt(0) + formData.diaSemana.slice(1).toLowerCase()}
                                </span> de <span className="font-medium">{formatHora(formData.horaInicio)}</span> a <span className="font-medium">{formatHora(formData.horaFin)}</span>.
                            </p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <button
                className="w-8 h-8 flex items-center justify-center rounded-md text-base-content/70 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                title={`Agregar restricción para ${docenteNombre}`}
                onClick={openModal}
            >
                <Calendar size={15} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/45 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-base-100 rounded-lg shadow-xl overflow-hidden animate-fadeIn">
                        {/* Modal header */}
                        <div className="px-6 pt-5 pb-4 border-b border-base-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-base-content">Nueva Restricción Horaria</h3>
                                    <p className="text-sm text-base-content/70">
                                        Para el docente <span className="font-medium text-primary">{docenteNombre}</span>
                                    </p>
                                </div>
                            </div>
                            
                            {/* Progress Steps */}
                            <div className="flex items-center justify-center gap-2 mt-5">
                                {[1, 2].map((step) => (
                                    <div key={step} className="flex items-center">
                                        {step > 1 && (
                                            <div className={`w-12 h-0.5 ${
                                                step <= currentStep ? 'bg-amber-400' : 'bg-base-300'
                                            }`} />
                                        )}
                                        <button
                                            onClick={() => step < currentStep && setCurrentStep(step)}
                                            className={`flex flex-col items-center ${
                                                step <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'
                                            }`}
                                            disabled={step > currentStep || isLoading}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                                                step === currentStep
                                                    ? 'border-amber-400 bg-amber-400 text-white'
                                                    : step < currentStep
                                                        ? 'border-amber-400 text-amber-500 bg-amber-50'
                                                        : 'border-base-300 text-base-content/50 bg-base-100'
                                                }`}
                                            >
                                                {step}
                                            </div>
                                            <span className={`text-xs mt-1.5 ${
                                                step === currentStep ? 'text-amber-600 font-medium' : 'text-base-content/60'
                                            }`}>
                                                {step === 1 ? 'Tipo y día' : 'Horario'}
                                            </span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Form Content */}
                        <div className="px-6 py-5">
                            {renderStepContent()}
                        </div>
                        
                        {/* Error message */}
                        {errorMensaje && (
                            <div className="mx-6 text-start mb-4 p-3 rounded-md bg-error/10 border border-error/20 flex items-center gap-3">
                                <AlertCircle size={18} className="text-error" />
                                <div className="flex-1 text-sm text-error">{errorMensaje}</div>
                                <button 
                                    className="p-1 rounded-md hover:bg-error/10"
                                    onClick={() => setErrorMensaje(null)}
                                >
                                    <X size={14} className="text-error" />
                                </button>
                            </div>
                        )}
                        
                        {/* Modal footer */}
                        <div className="px-6 py-4 bg-base-200/50 border-t border-base-200 flex justify-end gap-3">
                            <button 
                                className="px-4 py-2 rounded-md text-sm font-medium text-base-content/70 hover:bg-base-300 hover:text-base-content transition-colors" 
                                onClick={closeModal}
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>

                            {currentStep === 1 ? (
                                <button 
                                    className="px-4 py-2 rounded-md text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                                    onClick={() => setCurrentStep(2)}
                                    disabled={isLoading}
                                >
                                    Siguiente
                                </button>
                            ) : (
                                <button 
                                    className="px-4 py-2 rounded-md text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center gap-2"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Guardando...</span>
                                        </>
                                    ) : 'Guardar Restricción'}
                                </button>
                            )}
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

export default AgregarRestriccionModal;