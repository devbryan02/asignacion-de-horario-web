"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SeccionSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  itemCount: number;
  startIndex: number;
  endIndex: number;
}

export default function SeccionSearchBar({ 
  searchQuery, 
  onSearchChange, 
  onClearSearch,
  itemCount,
  startIndex,
  endIndex
}: SeccionSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Efecto para animar el enfoque
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-base-100 p-3 rounded-lg shadow-sm border border-base-200">
      <div className={`relative max-w-md w-full transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/20 ring-offset-0' : ''}`}>
        {/* Grupo con iconos y entrada */}
        <div className={`flex items-center bg-base-100 border rounded-md overflow-hidden ${isFocused ? 'border-primary' : 'border-base-300'}`}>
          {/* Icono de búsqueda con animación */}
          <div className={`flex items-center justify-center h-full pl-3 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-base-content/50'}`}>
            <Search size={18} strokeWidth={isFocused ? 2.5 : 2} />
          </div>
          
          {/* Input de búsqueda */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Buscar secciones..."
            className="py-2 px-3 flex-grow bg-transparent focus:outline-none text-base-content placeholder:text-base-content/40"
          />
          
          {/* Botón de limpiar con animación */}
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={onClearSearch}
                className="pr-3 py-2 text-base-content/50 hover:text-base-content transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
          
          {/* Separador vertical */}
          <div className="h-5 w-px bg-base-300 mx-1"></div>
          
          {/* Botón de filtro opcional */}
          <button 
            className="px-2 py-2 text-base-content/60 hover:text-primary transition-colors"
            aria-label="Opciones de filtro"
          >
            <Filter size={16} />
          </button>
        </div>
        
        {/* Texto de ayuda */}
        <div className="text-xs text-base-content/40 mt-1 ml-1">
          Busca por nombre, periodo académico o cualquier atributo
        </div>
      </div>
      
      {/* Indicador de resultados con animación */}
      <div className="flex items-center gap-2 bg-base-200/50 px-3 py-1.5 rounded-md min-w-[230px] border border-base-300">
        <List size={16} className="text-primary/70" />
        <div className="text-sm">
          {itemCount === 0 ? (
            <span className="text-base-content/60">No se encontraron secciones</span>
          ) : (
            <motion.span
              key={`${startIndex}-${endIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-base-content/80"
            >
              Mostrando <span className="font-semibold text-base-content">{startIndex + 1}-{endIndex}</span> de{" "}
              <span className="font-semibold text-base-content">{itemCount}</span> secciones
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}