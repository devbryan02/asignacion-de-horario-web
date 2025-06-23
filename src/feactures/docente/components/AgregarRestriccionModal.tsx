"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, X, Shield, Clock3, AlertCircle, Loader2, Upload, RefreshCw } from "lucide-react";
import { createRestriccionDocente } from "../DocenteService";
import { RestriccionRequest } from "@/types/request/RestriccionRequest";
import { DiaSemana } from "@/types/DiaSemana";
import { TipoRestriccion } from "@/types/TipoRestriccion";
import toast from "react-hot-toast";
import { UUID } from "crypto";
import RestriccionUploader from "./RestriccionUploader";

interface AgregarRestriccionModalProps {
    docenteId: UUID;
    docenteNombre: string;
    onRestriccionCreated?: () => void;
}

function AgregarRestriccionModal({ docenteId, docenteNombre, onRestriccionCreated }: AgregarRestriccionModalProps) {
    // Estados principales
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'individual' | 'masiva'>('individual');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
    
    // Estado del formulario
    const [formData, setFormData] = useState<Omit<RestriccionRequest, "docenteId">>({
        diaSemana: "LUNES",
        horaInicio: "08:00:00",
        horaFin: "10:00:00",
        tipoRestriccion: "DISPONIBLE"
    });
    
    // Datos de referencia
    const diasSemana: DiaSemana[] = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];
    const tiposRestriccion: TipoRestriccion[] = ["DISPONIBLE", "BLOQUEADO"];
    const horasDisponibles = Array.from({ length: 16 }, (_, i) => {
        const hora = i + 7; // 7:00 hasta 22:00
        return `${hora.toString().padStart(2, '0')}:00:00`;
    });

    // Manejadores de eventos
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Efecto para validar horas
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

    // Abrir/cerrar modal
    const openModal = () => {
        setIsOpen(true);
        if (typeof document !== "undefined") {
            document.body.style.overflow = "hidden";
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setErrorMensaje(null);
        setActiveTab('individual');
        if (typeof document !== "undefined") {
            document.body.style.overflow = "";
        }
        resetForm();
    };
    
    // Resetear formulario
    const resetForm = () => {
        setFormData({
            diaSemana: "LUNES",
            horaInicio: "08:00:00",
            horaFin: "10:00:00",
            tipoRestriccion: "DISPONIBLE"
        });
    };

    // Enviar formulario
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

    // Formatear hora para mostrar solo HH:MM
    const formatHora = (hora: string) => hora.substring(0, 5);
    
    // Manejar éxito de carga masiva
    const handleUploaderSuccess = () => {
        if (onRestriccionCreated) {
            onRestriccionCreated();
        }
        closeModal();
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
                    <div className="w-full max-w-2xl bg-base-100 rounded-lg shadow-xl overflow-hidden animate-fadeIn">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-base-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-base-content text-start">Restricciones Horarias</h3>
                                    <p className="text-sm text-base-content/70">
                                        Para el docente <span className="font-medium text-amber-600">{docenteNombre}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-4 mt-4">
                                <button
                                    className={`py-2 flex items-center gap-1.5 border-b-2 transition-colors ${
                                        activeTab === 'individual' 
                                            ? 'border-amber-500 text-amber-700 font-medium' 
                                            : 'border-transparent text-base-content/70 hover:text-base-content/90'
                                    }`}
                                    onClick={() => setActiveTab('individual')}
                                    disabled={isLoading}
                                >
                                    <Calendar size={15} />
                                    Individual
                                </button>
                                <button
                                    className={`py-2 flex items-center gap-1.5 border-b-2 transition-colors ${
                                        activeTab === 'masiva' 
                                            ? 'border-amber-500 text-amber-700 font-medium' 
                                            : 'border-transparent text-base-content/70 hover:text-base-content/90'
                                    }`}
                                    onClick={() => setActiveTab('masiva')}
                                    disabled={isLoading}
                                >
                                    <Upload size={15} />
                                    Carga masiva
                                </button>
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-6">
                            {activeTab === 'individual' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Columna izquierda */}
                                    <div className="space-y-5">
                                        {/* Día de semana */}
                                        <div>
                                            <label className="text-sm font-medium flex items-center gap-2 mb-2">
                                                <Calendar size={14} className="text-amber-600" />
                                                Día de la semana
                                            </label>
                                            <div className="grid grid-cols-7 gap-1">
                                                {diasSemana.map(dia => (
                                                    <button
                                                        key={dia}
                                                        type="button"
                                                        className={`py-2 text-center rounded text-sm transition-colors ${
                                                            formData.diaSemana === dia
                                                                ? 'bg-amber-100 text-amber-800 font-medium'
                                                                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                                                        }`}
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev, diaSemana: dia
                                                        }))}
                                                        disabled={isLoading}
                                                    >
                                                        {dia.slice(0, 2)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tipo restricción */}
                                        <div>
                                            <label className="text-sm font-medium flex items-center gap-2 mb-2">
                                                <Shield size={14} className="text-amber-600" />
                                                Tipo de restricción
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {tiposRestriccion.map(tipo => (
                                                    <button
                                                        key={tipo}
                                                        type="button"
                                                        className={`py-2.5 px-2 rounded border flex items-center justify-center gap-2 transition-colors ${
                                                            formData.tipoRestriccion === tipo
                                                                ? tipo === "DISPONIBLE"
                                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                    : 'bg-red-50 text-red-700 border-red-200'
                                                                : 'bg-base-100 border-base-300 text-base-content/70'
                                                        }`}
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev, tipoRestriccion: tipo
                                                        }))}
                                                        disabled={isLoading}
                                                    >
                                                        {tipo === "DISPONIBLE" ? (
                                                            <>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M20 6L9 17l-5-5" />
                                                                </svg>
                                                                Disponible
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M18 6L6 18M6 6l12 12" />
                                                                </svg>
                                                                Bloqueado
                                                            </>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Columna derecha */}
                                    <div className="space-y-5">
                                        {/* Rango de horas */}
                                        <div>
                                            <label className="text-sm font-medium flex items-center gap-2 mb-2">
                                                <Clock3 size={14} className="text-amber-600" />
                                                Rango horario
                                            </label>

                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Hora inicio */}
                                                <div>
                                                    <label className="text-xs text-base-content/70 mb-1 block">
                                                        Hora inicio
                                                    </label>
                                                    <select
                                                        className="w-full h-9 px-2 rounded border border-base-300 bg-base-100 text-sm"
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

                                                {/* Hora fin */}
                                                <div>
                                                    <label className="text-xs text-base-content/70 mb-1 block">
                                                        Hora fin
                                                    </label>
                                                    <select
                                                        className="w-full h-9 px-2 rounded border border-base-300 bg-base-100 text-sm"
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

                                        {/* Resumen */}
                                        <div className={`mt-4 p-3 rounded text-sm ${
                                            formData.tipoRestriccion === "DISPONIBLE"
                                                ? "bg-emerald-50 border border-emerald-100"
                                                : "bg-red-50 border border-red-100"
                                        }`}>
                                            <div className="flex items-center gap-1.5 mb-1 font-medium">
                                                {formData.tipoRestriccion === "DISPONIBLE" ? (
                                                    <span className="text-emerald-600">Horario disponible</span>
                                                ) : (
                                                    <span className="text-red-600">Horario bloqueado</span>
                                                )}
                                            </div>
                                            <p className={
                                                formData.tipoRestriccion === "DISPONIBLE" ? "text-emerald-700" : "text-red-700"
                                            }>
                                                Los días <span className="font-medium">{formData.diaSemana.toLowerCase()}</span> de <span className="font-medium">{formatHora(formData.horaInicio)}</span> a <span className="font-medium">{formatHora(formData.horaFin)}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <RestriccionUploader onSuccess={handleUploaderSuccess}
                                docenteId={docenteId} />
                            )}
                        </div>

                        {/* Mensaje de error */}
                        {errorMensaje && (
                            <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-sm text-red-700">
                                <AlertCircle size={16} />
                                <span>{errorMensaje}</span>
                                <button
                                    className="ml-auto hover:bg-red-100 p-1 rounded"
                                    onClick={() => setErrorMensaje(null)}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="px-6 py-3 bg-base-200 border-t border-base-300 flex justify-between">
                            <button
                                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded hover:bg-base-300 text-base-content/70"
                                onClick={resetForm}
                                disabled={isLoading}
                            >
                                <RefreshCw size={14} />
                                Limpiar
                            </button>
                            
                            <div className="flex gap-2">
                                <button
                                    className="px-3 py-1.5 rounded text-sm text-base-content/80 hover:bg-base-300"
                                    onClick={closeModal}
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </button>
                                
                                {activeTab === 'individual' && (
                                    <button
                                        className="px-4 py-1.5 rounded text-sm bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5"
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <Calendar size={14} />
                                                Guardar restricción
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Botón cerrar */}
                        <button
                            className="absolute right-3 top-3 w-7 h-7 flex items-center justify-center rounded-full text-base-content/60 hover:bg-base-200"
                            onClick={closeModal}
                            disabled={isLoading}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default AgregarRestriccionModal;