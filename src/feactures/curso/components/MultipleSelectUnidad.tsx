"use client";

import { fetchUnidadAcademica } from "@/feactures/unidadad-academica/UnidadAcademicaService";
import { useEffect, useState } from "react";
import { UUID } from "crypto";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface UnidadAcademica {
  id: UUID;
  nombre: string;
}

interface MultipleUnidadAcademicaSelectProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
  disabledIds?: string[];
  readOnly?: boolean;
  isEdit?: boolean;
  className?: string;
}

export default function MultipleUnidadAcademicaSelect({
  selectedIds = [],
  onChange,
  disabled = false,
  disabledIds = [],
  readOnly = false,
  isEdit = false,
  className = "",
}: MultipleUnidadAcademicaSelectProps) {
  const [unidades, setUnidades] = useState<UnidadAcademica[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar unidades académicas
  useEffect(() => {
    loadUnidadesAcademicas();
  }, []);

  const loadUnidadesAcademicas = async () => {
    setLoading(true);
    try {
      const data = await fetchUnidadAcademica();
      setUnidades(data);
    } catch (error) {
      console.error("Error al cargar unidades académicas:", error);
      toast.error("No se pudieron cargar las unidades académicas");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id: string) => {
    // Evitar duplicados
    if (!selectedIds.includes(id)) {
      onChange([...selectedIds, id]);
    }
    setSearchTerm("");
  };

  const handleRemove = (id: string) => {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  const filteredUnidades = unidades.filter(
    (unidad) => 
      unidad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) && 
      !selectedIds.includes(unidad.id.toString()) &&
      !disabledIds.includes(unidad.id.toString())
  );

  // Obtener nombres de las unidades seleccionadas
  const selectedUnidades = unidades.filter(
    (unidad) => selectedIds.includes(unidad.id.toString())
  );

  if (readOnly) {
    return (
      <div className={`border rounded-lg p-3 bg-base-200/50 text-base-content/80 ${className}`}>
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="loading loading-spinner loading-xs"></span>
            <span>Cargando información...</span>
          </div>
        ) : selectedUnidades.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedUnidades.map(unidad => (
              <span key={unidad.id.toString()} className="badge badge-primary badge-outline">
                {unidad.nombre}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-base-content/60">No hay unidades académicas seleccionadas</span>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Unidades seleccionadas */}
      <div className="flex flex-wrap gap-2 min-h-10">
        {loading ? (
          <div className="flex items-center gap-2 py-1">
            <span className="loading loading-spinner loading-xs"></span>
            <span>Cargando...</span>
          </div>
        ) : (
          selectedUnidades.map((unidad) => (
            <div 
              key={unidad.id.toString()} 
              className="badge badge-primary gap-1 py-3"
            >
              <span>{unidad.nombre}</span>
              {!disabled && !disabledIds.includes(unidad.id.toString()) && (
                <button 
                  type="button" 
                  onClick={() => handleRemove(unidad.id.toString())} 
                  className="btn btn-xs btn-circle btn-ghost"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input de búsqueda */}
      {!disabled && (
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar unidad académica..."
            className="input input-bordered w-full input-sm"
            disabled={disabled || loading}
          />
          
          {/* Dropdown de resultados */}
          {searchTerm && (
            <ul className="absolute z-10 mt-1 w-full bg-base-100 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border border-base-300">
              {filteredUnidades.length > 0 ? (
                filteredUnidades.map((unidad) => (
                  <li
                    key={unidad.id.toString()}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-base-200"
                    onClick={() => handleSelect(unidad.id.toString())}
                  >
                    {unidad.nombre}
                  </li>
                ))
              ) : (
                <li className="cursor-default select-none relative py-2 pl-3 pr-9 text-base-content/60">
                  No se encontraron resultados
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}