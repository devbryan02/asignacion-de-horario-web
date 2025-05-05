"use client";

import { useState, useEffect } from "react";
import { fetchUnidadAcademica } from "./UnidadAcademicaService";
import { UnidadAcademica } from "@/types/UnidadAcademica";
import { BookOpen, Building, Loader2, School, Users } from "lucide-react";

function UnidadAcademicaCard() {
    const [unidadesAcademicas, setUnidadesAcademicas] = useState<UnidadAcademica[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Iconos y colores alternativos para cada unidad académica
    const backgroundColors = [
        "bg-gradient-to-br from-primary/10 to-primary/30 hover:from-primary/20 hover:to-primary/40",
        "bg-gradient-to-br from-secondary/10 to-secondary/30 hover:from-secondary/20 hover:to-secondary/40",
        "bg-gradient-to-br from-accent/10 to-accent/30 hover:from-accent/20 hover:to-accent/40",
        "bg-gradient-to-br from-info/10 to-info/30 hover:from-info/20 hover:to-info/40",
    ];

    const borderColors = [
        "border-primary/30 hover:border-primary",
        "border-secondary/30 hover:border-secondary",
        "border-accent/30 hover:border-accent",
        "border-info/30 hover:border-info",
    ];

    const iconColors = [
        "text-primary",
        "text-secondary",
        "text-accent",
        "text-info",
    ];

    const icons = [
        <School className="w-8 h-8" />,
        <Building className="w-8 h-8" />,
        <BookOpen className="w-8 h-8" />,
        <Users className="w-8 h-8" />,
    ];

    // Cargar unidades académicas
    useEffect(() => {
        const loadUnidadesAcademicas = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchUnidadAcademica();
                setUnidadesAcademicas(data);
            } catch (err) {
                console.error("Error al cargar unidades académicas:", err);
                setError("No se pudieron cargar las unidades académicas");
            } finally {
                setIsLoading(false);
            }
        };

        loadUnidadesAcademicas();
    }, []);

    // Estadísticas simuladas (podrías integrar datos reales en el futuro)
    const getRandomStats = (index: number) => {
        // Usar un valor seedeado basado en el índice para que los valores sean consistentes
        const baseSeed = index + 1;
        return {
            estudiantes: baseSeed * 120 + Math.floor(Math.random() * 50),
            docentes: baseSeed * 15 + Math.floor(Math.random() * 10),
            cursos: baseSeed * 8 + Math.floor(Math.random() * 5),
        };
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-4 text-gray-500">Cargando unidades académicas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>{error}</span>
            </div>
        );
    }

    if (unidadesAcademicas.length === 0) {
        return (
            <div className="alert alert-info">
                <span>No hay unidades académicas registradas.</span>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center md:text-left flex items-center gap-2">
                <School className="text-primary" />
                Unidades Académicas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {unidadesAcademicas.map((unidad, index) => {
                    const colorIndex = index % backgroundColors.length;
                    const stats = getRandomStats(index);

                    return (
                        <div
                            key={unidad.id}
                            className={`card transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg
                                        ${backgroundColors[colorIndex]} border ${borderColors[colorIndex]}`}
                        >
                            <div className="card-body p-6">
                                <div className="flex justify-between items-start">
                                    <div className={`${iconColors[colorIndex]}`}>
                                        {icons[colorIndex]}
                                    </div>

                                    <span className="badge badge-sm opacity-70">
                                        ID: {unidad.id.substring(0, 8)}...
                                    </span>
                                </div>

                                <h2 className="card-title mt-2 text-xl">{unidad.nombre}</h2>

                                <div className="divider my-2"></div>

                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <div className="flex flex-col items-center p-2 bg-base-100/60 rounded-md">
                                        <span className="text-lg font-bold">{stats.estudiantes}</span>
                                        <span className="text-xs text-base-content/70">Estudiantes</span>
                                    </div>

                                    <div className="flex flex-col items-center p-2 bg-base-100/60 rounded-md">
                                        <span className="text-lg font-bold">{stats.docentes}</span>
                                        <span className="text-xs text-base-content/70">Docentes</span>
                                    </div>

                                    <div className="flex flex-col items-center p-2 bg-base-100/60 rounded-md">
                                        <span className="text-lg font-bold">{stats.cursos}</span>
                                        <span className="text-xs text-base-content/70">Cursos</span>
                                    </div>
                                </div>

                                <div className="card-actions justify-end mt-4">
                                    <button className="btn btn-sm btn-outline">Ver detalles</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default UnidadAcademicaCard;