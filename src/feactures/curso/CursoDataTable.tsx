"use client";

import { CursoResponse } from "@/types/response/CursoResponse";
import { useEffect, useState } from "react";
import { fetchCursos } from "./CursoService";
import toast from "react-hot-toast";
import { Pencil, Trash2, ChevronLeft, ChevronRight, Book, Clock } from "lucide-react";
import AgregarCursoModal from "./AgregarCursoModal";

function CursoDataTable() {
    // Estados para filtrado
    const [filterTipo, setFilterTipo] = useState({
        teorico: false,
        laboratorio: false,
    });

    const [cursos, setCursos] = useState<CursoResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const loadCursos = async () => {
        setIsLoading(true);
        try {
            const data = await fetchCursos();
            setCursos(data);
        } catch (error) {
            console.error("Error fetching cursos:", error);
            toast.error("Error al cargar los cursos.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadCursos();
    }, []);

    const handleCursoCreated = () => {
        loadCursos();
    }

    const filteredCursos = cursos.filter((curso) => {
        // Filtrado por texto de búsqueda
        const matchesSearch = curso.nombre.toLowerCase().includes(searchQuery.toLowerCase());

        // Filtrado por tipo de curso
        const noTipoFiltersActive = !filterTipo.teorico && !filterTipo.laboratorio;

        const matchesTipo = noTipoFiltersActive ||
            (filterTipo.teorico && curso.tipo === "TEORICO") ||
            (filterTipo.laboratorio && curso.tipo === "LABORATORIO");

        // El curso debe cumplir ambas condiciones  
        return matchesSearch && matchesTipo;
    });

    const handleFilterChange = (type: 'teorico' | 'laboratorio') => {
        setFilterTipo(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
        setCurrentPage(1); // Reset a la primera página cuando se cambia el filtro
    };

    // Calcular índices para la paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCursos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);

    // Cambiar de página
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Función para obtener color de badge según tipo de curso
    const getTipoBadgeColor = (tipo: string) => {
        switch (tipo) {
            case "TEORICO":
                return "badge-primary";
            case "LABORATORIO":
                return "badge-secondary";
            default:
                return "badge-neutral";
        }
    };

    // Función para formatear el tipo de curso para mostrar
    const formatTipoCurso = (tipo: string) => {
        switch (tipo) {
            case "TEORICO":
                return "Teórico";
            case "PRACTICO":
                return "Práctico";
            default:
                return tipo;
        }
    };

    return (
        <div className="overflow-hidden rounded p-4 bg-base-100 border border-gray-300">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl text-neutral">Cursos</h1>
                    <p className="text-sm text-gray-500">Gestión de cursos académicos</p>
                </div>
                <AgregarCursoModal onCursoCreated={handleCursoCreated} />
            </div>

            {/* Búsqueda y filtros */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <div className="form-control w-[300px]">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar curso..."
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
                        Mostrando {filteredCursos.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCursos.length)} de {filteredCursos.length} cursos
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <h3 className="text-sm font-medium">Filtrar por tipo:</h3>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary checkbox-sm"
                                    checked={filterTipo.teorico}
                                    onChange={() => handleFilterChange('teorico')}
                                />
                                <span className={`text-sm ${filterTipo.teorico ? 'font-medium text-primary' : ''}`}>
                                    Teórico
                                </span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary checkbox-sm"
                                    checked={filterTipo.laboratorio}
                                    onChange={() => handleFilterChange('laboratorio')}
                                />
                                <span className={`text-sm ${filterTipo.laboratorio ? 'font-medium text-primary' : ''}`}>
                                    Laboratorio
                                </span>
                            </label>

                            {/* Botón para limpiar filtros */}
                            {(filterTipo.teorico || filterTipo.laboratorio || searchQuery) && (
                                <button
                                    className="btn btn-xs btn-outline"
                                    onClick={() => {
                                        setFilterTipo({ teorico: false, laboratorio: false});
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
                    {(filterTipo.teorico || filterTipo.laboratorio || searchQuery) && (
                        <div className="flex gap-2 items-center">
                            <span className="text-xs text-gray-500">Filtros activos:</span>
                            <div className="flex gap-2 flex-wrap">
                                {searchQuery && (
                                    <span className="badge badge-sm">
                                        Búsqueda: {searchQuery}
                                    </span>
                                )}
                                {filterTipo.teorico && (
                                    <span className="badge badge-sm badge-primary">
                                        Teórico
                                    </span>
                                )}
                                {filterTipo.laboratorio && (
                                    <span className="badge badge-sm badge-secondary">
                                        Práctico
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
                                <th className="font-medium text-base-content">Horas semanales</th>
                                <th className="font-medium text-base-content">Tipo</th>
                                <th className="font-medium text-base-content">Unidad académica</th>
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
                                currentItems.map((curso) => (
                                    <tr key={curso.id} className="hover">
                                        <td className="text-base-content font-medium">{curso.nombre}</td>
                                        <td className="text-base-content">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} className="text-gray-500" />
                                                {curso.horasSemanales} hrs/sem
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`badge ${getTipoBadgeColor(curso.tipo)}`}>
                                                {formatTipoCurso(curso.tipo)}
                                            </div>
                                        </td>
                                        <td className="text-base-content">
                                            <div className="flex items-center gap-1">
                                                <Book size={14} className="text-gray-500" />
                                                {curso.unidadAcademica}
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
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center text-base-content">
                                        No se encontraron cursos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginación */}
            {filteredCursos.length > 0 && (
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

export default CursoDataTable;