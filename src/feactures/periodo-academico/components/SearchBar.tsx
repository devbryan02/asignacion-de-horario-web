"use client";

import { useState, useEffect, useCallback } from "react";
import { usePeriodoAcademico } from "../hooks/usePeriodo";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch?: (results: any[]) => void; // Opcional: callback para pasar resultados al padre
}

export const PeriodoAcademicoSearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { fetchPeriodos, setSearchTerm: setGlobalSearchTerm } = usePeriodoAcademico();
  const [searchTerm, setSearchTerm] = useState("");

  // Función para manejar búsqueda con debounce
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      fetchPeriodos(term).then(results => {
        // Si existe un callback onSearch, pasamos los resultados al componente padre
        if (onSearch) {
          onSearch(results);
        }
      });
    }, 300), // 300ms de retraso para evitar muchas llamadas
    [fetchPeriodos, onSearch]
  );

  // Efecto para actualizar la búsqueda cuando cambia el término
  useEffect(() => {
    // Actualiza el término de búsqueda global si existe esa función
    if (setGlobalSearchTerm) {
      setGlobalSearchTerm(searchTerm);
    }

    // Ejecuta la búsqueda con debounce
    debouncedSearch(searchTerm);

    // Clean-up function al desmontar el componente
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, setGlobalSearchTerm, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Ya no es necesario llamar a fetchPeriodos aquí porque lo maneja el useEffect
  };

  const handleClear = () => {
    setSearchTerm("");
    // El useEffect se encargará de actualizar la búsqueda
  };

  return (
    <div className="flex items-center gap-2 mb-4 relative">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-base-content/40" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre de periodo..."
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full h-10 pl-10 pr-10 rounded-lg border border-base-300 bg-base-100 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />

        {searchTerm && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={handleClear}
            title="Limpiar búsqueda"
          >
            <X size={16} className="hover:text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

// Función helper para implementar debounce (retraso controlado)
function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
  let timeout: NodeJS.Timeout;

  // Crear una versión con tipo del resultado
  const debouncedFunc = ((...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as F & { cancel: () => void };

  // Añadir método para cancelar
  debouncedFunc.cancel = () => {
    clearTimeout(timeout);
  };

  return debouncedFunc;
}