import { UnidadAcademica } from "@/types/UnidadAcademica";
import { useEffect, useState } from "react";
import { fetchUnidadAcademica } from "../unidadad-academica/UnidadAcademicaService";
import { Check } from "lucide-react";

function MultipleSelect({ 
    isLoading, 
    selectedIds, 
    onChange 
  }: { 
    isLoading: boolean; 
    selectedIds: string[]; 
    onChange: (ids: string[]) => void 
  }) {
    const [unidades, setUnidades] = useState<UnidadAcademica[]>([]);
    const [isLoadingUnidades, setIsLoadingUnidades] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
  
    useEffect(() => {
      const loadUnidades = async () => {
        setIsLoadingUnidades(true);
        try {
          const data = await fetchUnidadAcademica();
          setUnidades(data);
        } catch (error) {
          console.error("Error cargando unidades académicas:", error);
        } finally {
          setIsLoadingUnidades(false);
        }
      };
  
      loadUnidades();
    }, []);
  
    const handleToggleSelect = (id: string) => {
      // Si ya está seleccionado, lo quitamos
      if (selectedIds.includes(id)) {
        onChange(selectedIds.filter(selectedId => selectedId !== id));
      } else {
        // Si no está seleccionado, lo añadimos
        onChange([...selectedIds, id]);
      }
    };
  
    return (
      <div className="relative">
        <div 
          className={`select select-bordered w-full flex items-center justify-between ${isOpen ? 'focus:select-primary' : ''}`}
          onClick={() => !isLoading && setIsOpen(!isOpen)}
          tabIndex={0}
          role="button"
          aria-expanded={isOpen}
          aria-disabled={isLoading}
        >
          <div className="flex flex-wrap gap-1">
            {selectedIds.length === 0 ? (
              <span className="text-gray-400">Seleccione unidades académicas</span>
            ) : (
              unidades
                .filter(unidad => selectedIds.includes(unidad.id))
                .map(unidad => (
                  <span key={unidad.id} className="badge badge-primary">
                    {unidad.nombre}
                  </span>
                ))
            )}
          </div>
          <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
        </div>
  
        {isOpen && (
          <div className="absolute z-20 mt-1 w-full border border-gray-300 rounded-md bg-base-100 shadow-md max-h-60 overflow-y-auto">
            {isLoadingUnidades ? (
              <div className="p-3 text-center">
                <span className="loading loading-spinner loading-sm"></span>
                <span className="ml-2 text-sm">Cargando...</span>
              </div>
            ) : unidades.length === 0 ? (
              <div className="p-3 text-center text-sm text-gray-500">
                No hay unidades académicas disponibles
              </div>
            ) : (
              unidades.map(unidad => (
                <div 
                  key={unidad.id}
                  className={`p-2 flex items-center gap-2 hover:bg-base-200 cursor-pointer
                    ${selectedIds.includes(unidad.id) ? 'bg-base-200' : ''}`}
                  onClick={() => handleToggleSelect(unidad.id)}
                >
                  <div className={`w-4 h-4 flex items-center justify-center border rounded
                    ${selectedIds.includes(unidad.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}
                  >
                    {selectedIds.includes(unidad.id) && <Check size={12} color="white" />}
                  </div>
                  <span>{unidad.nombre}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

export default MultipleSelect;