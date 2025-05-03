"use client";

import { Curso } from "@/types/Curso";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import AgregarCursoModal from "./AgregarCursoModal";

type CursoDataTableProps = {
    cursos: Curso[];
};

function CursoDataTable({ cursos }: CursoDataTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCursos = cursos.filter((curso) =>
        curso.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        // Cambiado overflow-x-auto por overflow-hidden para contener todo el contenido
        <div className="overflow-hidden rounded p-4 bg-base-100 border border-gray-300">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl text-nuetral">Cursos</h1>
                    <p className="text-gray-600">Gestiona los cursos académicos y sus relaciones con unidades académicas</p>
                </div>
                <AgregarCursoModal/>
            </div>
            <div className="form-control mb-4">
                <input
                    type="text"
                    placeholder="Buscar curso..."
                    className="input input-bordered w-1/2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {/* Envuelto la tabla en un div con overflow-x-auto para manejar tablas grandes */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    {/* head */}
                    <thead>
                        <tr>
                            <th className="font-medium text-base-content">Nombre</th>
                            <th className="font-medium text-base-content">Horas semanales</th>
                            <th className="font-medium text-base-content">Tipo</th>
                            <th className="font-medium text-base-content">Unidad académica</th>
                            <th className="font-medium text-base-content">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCursos.length > 0 ? (
                            filteredCursos.map((curso) => (
                                <tr key={curso.id} className="hover">
                                    <td className="text-base-content">{curso.nombre}</td>
                                    <td className="text-base-content">{curso.horasSemanales}</td>
                                    <td>
                                        <div className={`badge ${curso.tipo === "LABORATORIO" ? "badge-primary" : "badge-secondary"} badge-sm`}>
                                            {curso.tipo}
                                        </div>
                                    </td>
                                    <td className="text-base-content">{curso.unidadAcademica}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button 
                                                className="btn btn-sm btn-info"
                                            >
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
    );
}

export default CursoDataTable;