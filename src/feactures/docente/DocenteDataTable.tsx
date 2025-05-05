"use client";

import { Docente } from "@/types/response/DocenteResponse";
import { useEffect, useState } from "react";
import { fetchDocentes } from "./DocenteService";
import toast from "react-hot-toast";
import { Pencil, Trash2, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import AgregarDocenteModal from "./AgregarDocenteModal";
import AgregarRestriccionModal from "./AgregarRestriccionModal";

function DocenteDataTable() {
    // Estados para filtrado por horas contratadas
    const [filterHours, setFilterHours] = useState({
        menos15: false,
        mas15: false
    });

    const [docentes, setDocentes] = useState<Docente[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const loadDocentes = async () => {
        setIsLoading(true);
        try {
            const data = await fetchDocentes();
            setDocentes(data);
        } catch (error) {
            console.error("Error fetching docentes:", error);
            toast.error("Error al cargar los docentes.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadDocentes();
    }, []);

    const handleDocenteCreated = () => {
        loadDocentes();
    }

    const filteredDocentes = docentes.filter((docente) => {
        // Filtrado por texto de búsqueda
        const matchesSearch = docente.nombre.toLowerCase().includes(searchQuery.toLowerCase());

        // Filtrado por horas contratadas
        const noHoursFiltersActive = !filterHours.menos15 && !filterHours.mas15;

        const matchesHours = noHoursFiltersActive ||
            (filterHours.menos15 && docente.horasContratadas < 15) ||
            (filterHours.mas15 && docente.horasContratadas >= 15);

        // El docente debe cumplir ambas condiciones
        return matchesSearch && matchesHours;
    });

    const handleFilterChange = (type: 'menos15' | 'mas15') => {
        setFilterHours(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
        setCurrentPage(1); // Reset a la primera página cuando se cambia el filtro
    };

    // Calcular índices para la paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDocentes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDocentes.length / itemsPerPage);

    // Cambiar de página
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="overflow-hidden rounded p-4 bg-base-100 border border-gray-300">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl text-neutral">Docentes</h1>
                    <p className="text-sm text-gray-500">Gestión de docentes y restricciones</p>
                </div>
                <AgregarDocenteModal onDocenteCreated={handleDocenteCreated} />
            </div>

            {/* Búsqueda y filtros */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <div className="form-control w-[300px]">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar docente..."
                                className="input input-bordered w-full pr-10"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            {searchQuery && (
                                <button
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-xs"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setCurrentPage(1);
                                    }}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="text-sm text-gray-500">
                        Mostrando {filteredDocentes.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredDocentes.length)} de {filteredDocentes.length} docentes
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <h3 className="text-sm font-medium">Filtrar por horas:</h3>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary checkbox-sm"
                                    checked={filterHours.menos15}
                                    onChange={() => handleFilterChange('menos15')}
                                />
                                <span className={`text-sm ${filterHours.menos15 ? 'font-medium text-primary' : ''}`}>
                                    Menos de 15 horas
                                </span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary checkbox-sm"
                                    checked={filterHours.mas15}
                                    onChange={() => handleFilterChange('mas15')}
                                />
                                <span className={`text-sm ${filterHours.mas15 ? 'font-medium text-primary' : ''}`}>
                                    15 horas o más
                                </span>
                            </label>

                            {/* Botón para limpiar filtros */}
                            {(filterHours.menos15 || filterHours.mas15 || searchQuery) && (
                                <button
                                    className="btn btn-xs btn-outline"
                                    onClick={() => {
                                        setFilterHours({ menos15: false, mas15: false });
                                        setSearchQuery("");
                                        setCurrentPage(1);
                                    }}
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Badges para mostrar filtros activos */}
                    {(filterHours.menos15 || filterHours.mas15 || searchQuery) && (
                        <div className="flex gap-2 items-center">
                            <span className="text-xs text-gray-500">Filtros activos:</span>
                            <div className="flex gap-2 flex-wrap">
                                {searchQuery && (
                                    <span className="badge badge-sm">
                                        Búsqueda: {searchQuery}
                                    </span>
                                )}
                                {filterHours.menos15 && (
                                    <span className="badge badge-sm badge-primary">
                                        &lt;15 horas
                                    </span>
                                )}
                                {filterHours.mas15 && (
                                    <span className="badge badge-sm badge-primary">
                                        ≥15 horas
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabla con altura máxima y scroll */}
            <div className="overflow-x-auto">
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="table w-full">
                        <thead className="sticky top-0 bg-base-100">
                            <tr>
                                <th className="font-medium text-base-content">Nombre</th>
                                <th className="font-medium text-base-content">Horas Contratadas</th>
                                <th className="font-medium text-base-content">Máx. Horas/Día</th>
                                <th className="font-medium text-base-content">Restricciones</th>
                                <th className="font-medium text-base-content">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="text-center">
                                        <span className="loading loading-spinner loading-md"></span>
                                    </td>
                                </tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((docente) => (
                                    <tr key={docente.id} className="hover">
                                        <td className="text-base-content font-medium">{docente.nombre}</td>
                                        <td className="text-base-content">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} className="text-gray-500" />
                                                {docente.horasContratadas} hrs
                                            </div>
                                        </td>
                                        <td className="text-base-content">{docente.horasMaximasPorDia} hrs/día</td>
                                        <td className="text-base-content">
                                            <div className="flex flex-wrap gap-1">
                                                {docente.restricciones.length > 0 ? (
                                                    <span className="badge badge-sm">
                                                        {docente.restricciones.length} {docente.restricciones.length === 1 ? 'restricción' : 'restricciones'}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">Sin restricciones</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="btn btn-sm btn-info">
                                                    <Pencil size={16} />
                                                </button>
                                                <button className="btn btn-sm btn-error">
                                                    <Trash2 size={16} />
                                                </button>
                                                <AgregarRestriccionModal
                                                    docenteId={docente.id}
                                                    docenteNombre={docente.nombre}
                                                    onRestriccionCreated={loadDocentes}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center text-base-content">
                                        No se encontraron docentes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginación */}
            {filteredDocentes.length > 0 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`btn btn-sm ${currentPage === index + 1 ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => paginate(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default DocenteDataTable;