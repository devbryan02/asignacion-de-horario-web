import { Docente } from '@/types/response/DocenteResponse';
import { User, Search, X, Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface RestriccionDocenteSelectProps {
  searchQuery: string;
  isSelectOpen: boolean;
  isLoadingDocentes: boolean;
  selectedDocente: Docente | null;
  filteredDocentes: Docente[];
  docentes: Docente[];
  onSearchChange: (value: string) => void;
  onSelectDocente: (docente: Docente) => void;
  onClearSearch: () => void;
  onToggleSelect: (isOpen: boolean) => void;
}

export default function RestriccionDocenteSelect({
  searchQuery,
  isSelectOpen,
  isLoadingDocentes,
  selectedDocente,
  filteredDocentes,
  onSearchChange,
  onSelectDocente,
  onClearSearch,
  onToggleSelect
}: RestriccionDocenteSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isSelectOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onToggleSelect(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSelectOpen, onToggleSelect]);
  
  return (
    <div className="form-control w-full md:w-80" ref={containerRef}>
      <label className="label">
        <span className="label-text font-medium flex items-center gap-2">
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
            <div className="relative flex items-center w-full">
              <div className="absolute left-3 text-base-content/50">
                <Search size={16} />
              </div>
              
              <input
                type="text"
                className="input input-bordered w-full pl-10 pr-10 focus:input-primary"
                placeholder="Escriba para buscar docentes..."
                value={selectedDocente && !searchQuery ? selectedDocente.nombre : searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => onToggleSelect(true)}
              />

              <div className="absolute right-3 flex items-center gap-1">
                {searchQuery && (
                  <button
                    className="btn btn-ghost btn-xs btn-circle"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearSearch();
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
                {selectedDocente && !searchQuery && (
                  <span className="badge badge-primary badge-sm">Seleccionado</span>
                )}
              </div>
            </div>

            {isSelectOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black/20 z-40"
                  onClick={() => onToggleSelect(false)}
                />
                
                <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-lg shadow-lg border border-base-200 z-50 max-h-64 overflow-y-auto">
                  {filteredDocentes.length > 0 ? (
                    filteredDocentes.map(docente => (
                      <button
                        key={docente.id}
                        className={`w-full px-4 py-3 text-left hover:bg-base-200 flex items-center gap-2 border-b border-base-200 last:border-none ${selectedDocente?.id === docente.id ? 'bg-primary/10 text-primary' : ''}`}
                        onClick={() => onSelectDocente(docente)}
                      >
                        <div className="bg-base-200 text-base-content/70 h-8 w-8 rounded-full flex items-center justify-center">
                          <User size={16} />
                        </div>
                        <div>
                          <div>{docente.nombre}</div>
                          <div className="text-xs text-base-content/50">{docente.horasContratadas} hrs. contratadas</div>
                        </div>
                      </button>
                    ))
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

      <label className="label">
        <span className="label-text-alt text-sm text-base-content/60">
          {selectedDocente ? 
            `Docente seleccionado: ${selectedDocente.nombre}` : 
            "Seleccione un docente para ver sus restricciones"}
        </span>
      </label>
    </div>
  );
}