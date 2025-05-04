"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchRestriccionByDocente } from "./RestriccionService";
import { fetchDocentes } from "@/feactures/docente/DocenteService";
import { RestriccionResponse } from "@/types/RestriccionResponse";
import { Docente } from "@/types/Docente";
import { UUID } from "crypto";
import {
    Clock,
    AlertTriangle,
    Check,
    Calendar,
    Loader2,
    UserSearch,
    User,
    Search,
    X,
    CalendarClock
} from "lucide-react";
import { DiaSemana } from "@/types/DiaSemana";

interface RestriccionDataCalendarProps {
    initialDocenteId?: UUID;
}

function RestriccionDataCalendar({ initialDocenteId }: RestriccionDataCalendarProps) {
    const [docentes, setDocentes] = useState<Docente[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [selectedDocenteId, setSelectedDocenteId] = useState<UUID | undefined>(initialDocenteId);
    const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
    const [restricciones, setRestricciones] = useState<RestriccionResponse[]>([]);
    const [isLoadingDocentes, setIsLoadingDocentes] = useState(true);
    const [isLoadingRestricciones, setIsLoadingRestricciones] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const diasSemana: DiaSemana[] = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

    // Filtrar docentes basado en la búsqueda
    const filteredDocentes = useMemo(() => {
        // Si hay búsqueda, mostrar todos los resultados que coincidan
        if (searchQuery.trim()) {
            const searchTerms = searchQuery.toLowerCase().split(" ");
            return docentes.filter(docente =>
                searchTerms.every(term =>
                    docente.nombre.toLowerCase().includes(term)
                )
            );
        }
        return docentes.slice(0, 5);
    }, [docentes, searchQuery]);

    // Cargar la lista de docentes
    useEffect(() => {
        const loadDocentes = async () => {
            setIsLoadingDocentes(true);
            try {
                const data = await fetchDocentes();
                setDocentes(data);

                if (initialDocenteId) {
                    const docente = data.find(d => d.id === initialDocenteId);
                    if (docente) {
                        setSelectedDocente(docente);
                    } else if (data.length > 0) {
                        setSelectedDocente(data[0]);
                        setSelectedDocenteId(data[0].id);
                    }
                } else if (data.length > 0) {
                    setSelectedDocente(data[0]);
                    setSelectedDocenteId(data[0].id);
                }
            } catch (err) {
                console.error("Error al cargar docentes:", err);
                setError("No se pudieron cargar los docentes. Intente nuevamente.");
            } finally {
                setIsLoadingDocentes(false);
            }
        };

        loadDocentes();
    }, [initialDocenteId]);

    // Cargar restricciones cuando cambia el docente seleccionado
    useEffect(() => {
        const loadRestricciones = async () => {
            if (!selectedDocenteId) return;

            setIsLoadingRestricciones(true);
            setError(null);

            try {
                const data = await fetchRestriccionByDocente(selectedDocenteId);
                setRestricciones(data);
            } catch (err) {
                console.error("Error al cargar restricciones:", err);
                setError("No se pudieron cargar las restricciones. Intente nuevamente.");
            } finally {
                setIsLoadingRestricciones(false);
            }
        };

        if (selectedDocenteId) {
            loadRestricciones();
        } else {
            setRestricciones([]);
        }
    }, [selectedDocenteId]);

    const handleSelectDocente = (docente: Docente) => {
        setSelectedDocenteId(docente.id);
        setSelectedDocente(docente);
        setSearchQuery("");
        setIsSelectOpen(false);
    };

    const sortByHora = (a: RestriccionResponse, b: RestriccionResponse) => {
        return a.horaInicio.localeCompare(b.horaInicio);
    };

    const getRestriccionesPorDia = (dia: DiaSemana) => {
        return restricciones
            .filter(r => r.diaSemana === dia)
            .sort(sortByHora);
    };

    const formatHora = (hora: string) => hora.substring(0, 5);

    return (
        <div className="flex flex-col gap-6">
            <header className="card bg-base-100 shadow-sm p-5 border border-gray-300">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Calendar className="text-primary" size={24} />
                            Restricciones Horarias
                        </h2>
                        {selectedDocente && (
                            <p className="text-base-content/70">
                                Mostrando restricciones para{" "}
                                <span className="font-medium text-primary">{selectedDocente.nombre}</span>
                            </p>
                        )}
                    </div>

                    <div className="form-control w-full md:w-80">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-1">
                                <User size={14} className="text-primary" />
                                Buscar y seleccionar docente
                            </span>
                        </label>

                        <div className="relative">
                            {isLoadingDocentes ? (
                                <div className="select select-bordered w-full flex items-center justify-center gap-2 bg-base-100">
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    <span>Cargando docentes...</span>
                                </div>
                            ) : (
                                <>
                                    {/* Aquí está el cambio principal: separar el input del div clickeable */}
                                    <div className="relative flex items-center w-full">
                                        <input
                                            type="text"
                                            className="input input-bordered w-full pr-10 focus:input-primary"
                                            placeholder="Escriba para buscar docentes..."
                                            value={selectedDocente && !searchQuery ? selectedDocente.nombre : searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setIsSelectOpen(true);
                                                if (selectedDocente) setSelectedDocente(null);
                                            }}
                                            onFocus={() => setIsSelectOpen(true)}
                                        />

                                        <div className="absolute right-3 flex items-center gap-1">
                                            {searchQuery && (
                                                <button
                                                    className="btn btn-ghost btn-xs btn-circle"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSearchQuery("");
                                                        if (selectedDocente) {
                                                            setSelectedDocente(null);
                                                            setSelectedDocenteId(undefined);
                                                        }
                                                    }}
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                            <Search size={16} className="text-base-content/50" />
                                        </div>
                                    </div>

                                    {isSelectOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 bg-black/20 z-40"
                                                onClick={() => setIsSelectOpen(false)}
                                            />
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-lg shadow-lg border border-base-200 z-50 max-h-64 overflow-y-auto">
                                                {filteredDocentes.length > 0 ? (
                                                    <>
                                                        {filteredDocentes.map(docente => (
                                                            <button
                                                                key={docente.id}
                                                                className={`w-full px-4 py-3 text-left hover:bg-base-200 flex items-center gap-2 border-b border-base-200 last:border-none
                        ${selectedDocenteId === docente.id ? 'bg-primary/10 text-primary' : ''}
                      `}
                                                                onClick={() => handleSelectDocente(docente)}
                                                            >
                                                                <User size={16} />
                                                                <span>{docente.nombre}</span>
                                                            </button>
                                                        ))}
                                                        {!searchQuery && docentes.length > 5 && (
                                                            <div className="px-4 py-3 text-center text-sm text-base-content/70 bg-base-200/50">
                                                                Escriba para buscar más docentes...
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="px-4 py-3 text-center text-base-content/70">
                                                        No se encontraron docentes
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {isLoadingRestricciones ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    <p className="mt-4 text-base-content/70">Cargando restricciones...</p>
                </div>
            ) : error ? (
                <div className="alert alert-error shadow-lg">
                    <AlertTriangle className="h-6 w-6" />
                    <span>{error}</span>
                </div>
            ) : selectedDocente && restricciones.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <CalendarClock className="h-12 w-12 text-base-content/30" />
                    <p className="mt-4 text-base-content/70">
                        No hay restricciones registradas para {selectedDocente.nombre}.
                    </p>
                </div>
            ) : selectedDocente ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {diasSemana.map((dia) => (
                        <div
                            key={dia}
                            className="card bg-base-100 border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <div className="card-body p-4">
                                <h3 className="card-title text-lg flex items-center gap-2 border-b pb-2 mb-2">
                                    <Calendar size={16} className="text-primary" />
                                    {dia.charAt(0) + dia.slice(1).toLowerCase()}
                                </h3>

                                {getRestriccionesPorDia(dia).length > 0 ? (
                                    <div className="space-y-3">
                                        {getRestriccionesPorDia(dia).map((restriccion) => (
                                            <div
                                                key={restriccion.id}
                                                className={`p-3 rounded-lg flex flex-col gap-2 text-sm transition-all duration-200
                          ${restriccion.tipoRestriccion === "DISPONIBLE"
                                                        ? "bg-success/5 hover:bg-success/10 border-l-4 border-success"
                                                        : "bg-error/5 hover:bg-error/10 border-l-4 border-error"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} className={
                                                        restriccion.tipoRestriccion === "DISPONIBLE"
                                                            ? "text-success"
                                                            : "text-error"
                                                    } />
                                                    <span className="font-medium">
                                                        {formatHora(restriccion.horaInicio)} - {formatHora(restriccion.horaFin)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs">
                                                    {restriccion.tipoRestriccion === "DISPONIBLE" ? (
                                                        <>
                                                            <Check size={12} className="text-success" />
                                                            <span className="text-success font-medium">Disponible</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AlertTriangle size={12} className="text-error" />
                                                            <span className="text-error font-medium">Bloqueado</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-4 text-center text-sm text-base-content/50">
                                        Sin restricciones
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    <UserSearch className="h-12 w-12 text-base-content/30" />
                    <p className="mt-4 text-base-content/70">
                        Seleccione un docente para ver sus restricciones.
                    </p>
                </div>
            )}
        </div>
    );
}

export default RestriccionDataCalendar;