"use client";

import { Aula } from "@/types/Aula";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import AgregarAulaModal from "./AgregarAulaModal";
import { fetchAulas } from "./AulaService";
import toast from "react-hot-toast";

function AulaDataTable() {
    const [filterTypes, setFilterTypes] = useState({
        teorico: false,
        laboratorio: false
    });
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Puedes ajustar este número

    const loadAulas = async () => {
        setIsLoading(true);
        try {
            const data = await fetchAulas();
            setAulas(data);
        } catch (error) {
            console.error("Error fetching aulas:", error);
            toast.error("Error al cargar las aulas");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadAulas();
    }, []);

    const handleAulaCreated = () => {
        loadAulas();
    }

    const filteredAulas = aulas.filter((aula) => {
        // Primero filtramos por texto de búsqueda
        const matchesSearch = aula.nombre.toLowerCase().includes(searchQuery.toLowerCase());

        // Si no hay filtros de tipo activos, solo consideramos el texto
        const noTypeFiltersActive = !filterTypes.teorico && !filterTypes.laboratorio;

        // Si hay filtros de tipo, comprobamos si el aula coincide con alguno de los tipos seleccionados
        const matchesType = noTypeFiltersActive ||
            (filterTypes.teorico && aula.tipo === "TEORICO") ||
            (filterTypes.laboratorio && aula.tipo === "LABORATORIO");

        // El aula debe cumplir ambas condiciones
        return matchesSearch && matchesType;
    });

    const handleFilterChange = (type: 'teorico' | 'laboratorio') => {
        setFilterTypes(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
        setCurrentPage(1); // Reset a la primera página cuando se cambia el filtro
    };

    // Calcular índices para la paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAulas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAulas.length / itemsPerPage);

    // Cambiar de página
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="overflow-hidden rounded p-4 bg-base-100 border border-gray-300">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl text-nuetral">Aulas</h1>
                    <p className="text-sm text-gray-500">Lista de aulas disponibles</p>
                </div>
                <AgregarAulaModal onAulaCreated={handleAulaCreated} />
            </div>

            {/* Búsqueda y contador de resultados */}
            <div className="flex flex-row justify-between items-center mb-4">
                <div className="form-control">
                    <input
                        type="text"
                        placeholder="Buscar aula..."
                        className="input input-bordered w-[300px]"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset a la primera página cuando se busca
                        }}
                    />
                </div>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col">
                        <h3 className="text-sm font-medium mb-2">Filtrar por tipo:</h3>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    checked={filterTypes.teorico}
                                    onChange={() => handleFilterChange('teorico')}
                                />
                                <span className={`text-sm ${filterTypes.teorico ? 'font-medium text-primary' : ''}`}>
                                    Aulas Teóricas
                                </span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    checked={filterTypes.laboratorio}
                                    onChange={() => handleFilterChange('laboratorio')}
                                />
                                <span className={`text-sm ${filterTypes.laboratorio ? 'font-medium text-primary' : ''}`}>
                                    Laboratorios
                                </span>
                            </label>

                            {/* Botón para limpiar filtros */}
                            {(filterTypes.teorico || filterTypes.laboratorio) && (
                                <button
                                    className="btn btn-xs btn-ghost text-xs"
                                    onClick={() => {
                                        setFilterTypes({ teorico: false, laboratorio: false });
                                        setCurrentPage(1);
                                    }}
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAulas.length)} de {filteredAulas.length} aulas
                </div>
            </div>

            {/* Tabla con altura máxima y scroll */}
            <div className="overflow-x-auto">
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="table w-full">
                        <thead className="sticky top-0 bg-base-100">
                            <tr>
                                <th className="font-medium text-base-content">Nombre</th>
                                <th className="font-medium text-base-content">Capacidad</th>
                                <th className="font-medium text-base-content">Tipo</th>
                                <th className="font-medium text-base-content">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        <span className="loading loading-spinner loading-md"></span>
                                    </td>
                                </tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((aula) => (
                                    <tr key={aula.id} className="hover">
                                        <td className="text-base-content">{aula.nombre}</td>
                                        <td className="text-base-content">{aula.capacidad}</td>
                                        <td className="text-base-content">{aula.tipo}</td>
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
                                    <td colSpan={4} className="text-center text-base-content">
                                        No se encontraron aulas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginación */}
            {filteredAulas.length > 0 && (
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
                            className={`btn btn-sm ${currentPage === index + 1 ? 'btn-primary' : 'btn-ghost'
                                }`}
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

export default AulaDataTable;