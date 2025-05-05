"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Clock, AlertCircle, X, Calendar, Clock3, Shield } from "lucide-react";
import { createRestriccionDocente } from "../DocenteService";
import { RestriccionRequest } from "@/types/request/RestriccionRequest";
import { DiaSemana } from "@/types/DiaSemana";
import { TipoRestriccion } from "@/types/TipoRestriccion";
import toast from "react-hot-toast";
import { UUID } from "crypto";

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
                    <div className="space-y-4">
                        <h4 className="font-medium text-base">Paso 1: Seleccione el día y tipo de restricción</h4>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium flex items-center gap-2">
                                    <Calendar size={16} className="text-primary" />
                                    Día de la semana
                                </span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {diasSemana.map(dia => (
                                    <label
                                        key={dia}
                                        className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all
                                            ${formData.diaSemana === dia
                                                ? 'border-primary bg-primary/10'
                                                : 'border-base-200 hover:border-primary/50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="diaSemana"
                                            value={dia}
                                            className="radio radio-primary hidden"
                                            checked={formData.diaSemana === dia}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                diaSemana: e.target.value as DiaSemana
                                            }))}
                                        />
                                        <span className="text-sm">
                                            {dia.charAt(0) + dia.slice(1).toLowerCase()}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-control mt-6">
                            <label className="label">
                                <span className="label-text font-medium flex items-center gap-2">
                                    <Shield size={16} className="text-primary" />
                                    Tipo de restricción
                                </span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {tiposRestriccion.map(tipo => (
                                    <label
                                        key={tipo}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                                            ${formData.tipoRestriccion === tipo
                                                ? 'border-primary bg-primary/10'
                                                : 'border-base-200 hover:border-primary/50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="tipoRestriccion"
                                            value={tipo}
                                            className="radio radio-primary hidden"
                                            checked={formData.tipoRestriccion === tipo}
                                            onChange={() => setFormData(prev => ({
                                                ...prev,
                                                tipoRestriccion: tipo as TipoRestriccion
                                            }))}
                                        />
                                        <span className={`text-sm font-medium ${tipo === "DISPONIBLE" ? "text-success" : "text-error"
                                            }`}>
                                            {tipo === "DISPONIBLE" ? "✓ Disponible" : "⛔ Bloqueado"}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h4 className="font-medium text-base">Paso 2: Seleccione el rango horario</h4>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium flex items-center gap-2">
                                    <Clock3 size={16} className="text-primary" />
                                    Rango de horas
                                </span>
                            </label>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-base-content/70">
                                        Desde
                                    </label>
                                    <select
                                        className="select select-bordered w-full focus:select-primary"
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
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-base-content/70">
                                        Hasta
                                    </label>
                                    <select
                                        className="select select-bordered w-full focus:select-primary"
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
                                </div>
                            </div>
                        </div>

                        <div className="bg-base-200 p-4 rounded-lg mt-6 border-l-4 border-primary">
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Clock size={16} className="text-primary" />
                                Resumen de la restricción:
                            </h4>
                            <p className="text-sm leading-relaxed">
                                <span className={`font-medium ${formData.tipoRestriccion === "DISPONIBLE"
                                        ? "text-success"
                                        : "text-error"
                                    }`}>
                                    {formData.tipoRestriccion === "DISPONIBLE" ? "✓ Disponible" : "⛔ Bloqueado"}
                                </span>
                                {" "} los días {" "}
                                <span className="font-medium">
                                    {formData.diaSemana.charAt(0) + formData.diaSemana.slice(1).toLowerCase()}
                                </span>
                                {" "} de {" "}
                                <span className="font-medium">{formatHora(formData.horaInicio)}</span>
                                {" "} a {" "}
                                <span className="font-medium">{formatHora(formData.horaFin)}</span>
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
                className="btn btn-sm btn-outline hover:btn-primary flex items-center gap-2 transition-all"
                onClick={openModal}
            >
                <PlusCircle size={14} />
                Agregar Restricción
            </button>

            {isOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl relative">
                        <div className="flex flex-col gap-2 mb-6">
                            <div className="flex items-center gap-2">
                                <Clock size={20} className="text-primary" />
                                <h3 className="font-bold text-xl">Nueva Restricción Horaria</h3>
                            </div>
                            <div className="divider mt-0 mb-2"></div>
                            <p className="text-base-content/70">
                                Agregue una restricción horaria para {" "}
                                <span className="font-medium text-primary">{docenteNombre}</span>
                            </p>

                            {/* Progress Steps */}
                            <div className="w-full flex items-center justify-center gap-4 mt-4">
                                {[1, 2].map((step) => (
                                    <button
                                        key={step}
                                        onClick={() => setCurrentStep(step)}
                                        className={`w-24 h-1 rounded-full transition-all ${step === currentStep
                                                ? 'bg-primary'
                                                : step < currentStep
                                                    ? 'bg-primary/40'
                                                    : 'bg-base-300'
                                            }`}
                                        aria-label={`Paso ${step}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="py-4">
                            {renderStepContent()}
                        </div>

                        {errorMensaje && (
                            <div className="alert alert-error shadow-lg mb-4">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5" />
                                    <span>{errorMensaje}</span>
                                </div>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => setErrorMensaje(null)}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        <div className="divider my-4"></div>

                        <div className="modal-action gap-3">
                            <button
                                className="btn btn-ghost hover:bg-base-200"
                                onClick={closeModal}
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>

                            {currentStep === 1 ? (
                                <button
                                    className="btn btn-primary hover:shadow-lg transition-all duration-200"
                                    onClick={() => setCurrentStep(2)}
                                >
                                    Siguiente
                                </button>
                            ) : (
                                <button
                                    className={`btn btn-primary hover:shadow-lg transition-all duration-200 ${isLoading ? 'loading' : ''
                                        }`}
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Guardando...' : 'Guardar Restricción'}
                                </button>
                            )}
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

export default AgregarRestriccionModal;