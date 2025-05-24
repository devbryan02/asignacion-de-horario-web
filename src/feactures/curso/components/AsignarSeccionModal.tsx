import { useState, useEffect } from "react";
import { Check, X, Search, Users, Filter, CheckCircle, AlertTriangle, FileText, School, Layers } from "lucide-react";
import { UUID } from "crypto";
import { SeccionResponse } from "@/feactures/seccion-academica/types";
import { RegistroResponse } from "../CursoService";

interface AsignarSeccionModalProps {
  isOpen: boolean;
  onClose: () => void;
  cursoId: UUID;
  cursoNombre: string;
  secciones: SeccionResponse[];
  onAsignar: (cursoId: UUID, seccionesIds: UUID[]) => Promise<RegistroResponse>;
  isLoading?: boolean;
}

export default function AsignarSeccionesModal({
  isOpen,
  onClose,
  cursoId,
  cursoNombre,
  secciones,
  onAsignar,
  isLoading = false,
}: AsignarSeccionModalProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [selectedSecciones, setSelectedSecciones] = useState<UUID[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Resetear estados cuando cambia isOpen
  useEffect(() => {
    if (!isOpen) {
      setMessage(null);
      setMessageType(null);
      setSelectedSecciones([]);
      setSearchQuery("");
      setShowAll(false);
    }
  }, [isOpen]);

  const filteredSecciones = secciones.filter((seccion) =>
    seccion.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mostrar solo las primeras 4 secciones o todas si showAll está activado
  const displayedSecciones = searchQuery 
    ? filteredSecciones 
    : (showAll ? filteredSecciones : filteredSecciones.slice(0, 6));

  const handleToggleSeccion = (seccionId: UUID) => {
    setSelectedSecciones((prev) =>
      prev.includes(seccionId)
        ? prev.filter((id) => id !== seccionId)
        : [...prev, seccionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSecciones.length === filteredSecciones.length) {
      setSelectedSecciones([]);
    } else {
      setSelectedSecciones(filteredSecciones.map(seccion => seccion.id));
    }
  };

  const handleAsignar = async () => {
    try {
      setMessage("Procesando la asignación...");
      setMessageType(null);

      const response = await onAsignar(cursoId, selectedSecciones);

      if (response.success) {
        setMessage(response.message || "Asignación completada correctamente");
        setMessageType("success");

        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
          onClose();
        }, 3000);
      } else {
        setMessage(response.message || "Error al asignar secciones");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error inesperado al asignar secciones:", error);
      setMessage("Error inesperado al procesar la solicitud");
      setMessageType("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/45 backdrop-blur-sm">
      <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in duration-300 border border-base-300">
        {/* Encabezado del modal con diseño corporativo */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6 border-b border-base-200 rounded-t-xl">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2.5 rounded-lg">
                <Users className="text-primary" size={22} />
              </div>
              <h3 className="text-xl font-bold text-base-content">Asignar Secciones</h3>
            </div>
            <button 
              className="btn btn-sm btn-ghost btn-circle" 
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 text-sm">
              <FileText size={16} className="text-primary/70" />
              <span className="text-base-content/70">Curso:</span>
              <span className="font-semibold text-primary/90">{cursoNombre}</span>
            </div>
            <div className="divider divider-horizontal hidden sm:flex"></div>
            <div className="flex items-center gap-2 text-sm">
              <Layers size={16} className="text-primary/70" />
              <span className="text-base-content/70">Total:</span>
              <span className="font-semibold">{secciones.length} secciones</span>
            </div>
          </div>
        </div>

        {/* Mensaje de estado con animación */}
        {message && (
          <div 
            className={`mx-6 my-4 py-3 px-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top duration-300
              ${messageType === "success" ? "bg-success/10 text-success border border-success/20" : 
                messageType === "error" ? "bg-error/10 text-error border border-error/20" : 
                "bg-info/10 text-info border border-info/20"}
            `}
          >
            {messageType === "success" ? (
              <CheckCircle size={18} className="text-success" />
            ) : messageType === "error" ? (
              <AlertTriangle size={18} className="text-error" />
            ) : (
              <span className="loading loading-spinner loading-sm text-info"></span>
            )}
            <span>{message}</span>
          </div>
        )}

        {/* Barra de búsqueda y acciones */}
        <div className="px-6 py-4 border-b border-base-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search 
              size={16} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" 
            />
            <input
              type="text"
              placeholder="Buscar por nombre de sección..."
              className="input input-bordered input-sm pl-9 w-full focus:border-primary transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-primary"
                onClick={() => setSearchQuery("")}
                title="Limpiar búsqueda"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              className="btn btn-sm btn-outline"
              onClick={handleSelectAll}
              disabled={isLoading || filteredSecciones.length === 0}
            >
              {selectedSecciones.length === filteredSecciones.length && filteredSecciones.length > 0 
                ? "Deseleccionar todo" 
                : "Seleccionar todo"}
            </button>
          </div>
        </div>

        {/* Cuerpo del modal con secciones */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center gap-3 h-64">
              <span className="loading loading-spinner loading-md text-primary"></span>
              <p className="text-base-content/70 text-sm">Cargando secciones...</p>
            </div>
          ) : filteredSecciones.length === 0 ? (
            <div className="flex flex-col justify-center items-center gap-3 h-48 text-center">
              <div className="p-4 bg-base-200/50 rounded-full">
                <School size={28} className="text-base-content/30" />
              </div>
              <h4 className="font-medium text-base-content/70">No se encontraron secciones</h4>
              <p className="text-sm text-base-content/50 max-w-xs">
                {searchQuery 
                  ? "No hay secciones que coincidan con tu búsqueda." 
                  : "No hay secciones disponibles para asignar."}
              </p>
              {searchQuery && (
                <button 
                  className="btn btn-sm btn-ghost mt-2"
                  onClick={() => setSearchQuery("")}
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {displayedSecciones.map((seccion) => (
                  <div
                    key={seccion.id.toString()}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md
                      ${selectedSecciones.includes(seccion.id) 
                        ? "bg-primary/10 border-primary/40 shadow-sm" 
                        : "border-base-200 hover:border-primary/30"}
                    `}
                    onClick={() => handleToggleSeccion(seccion.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                          selectedSecciones.includes(seccion.id) 
                            ? "bg-primary border-primary" 
                            : "border-base-300"
                        }`}>
                          {selectedSecciones.includes(seccion.id) && (
                            <Check size={12} className="text-primary-content" />
                          )}
                        </div>
                        <span className="font-medium">{seccion.nombre}</span>
                      </div>
                      
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Botón de "Ver más" si hay más de 4 secciones */}
              {!searchQuery && filteredSecciones.length > 6 && !showAll && (
                <div className="text-center mt-5">
                  <button 
                    className="btn btn-sm btn-ghost btn-wide"
                    onClick={() => setShowAll(true)}
                  >
                    Ver todas las {filteredSecciones.length} secciones
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Resumen y contador */}
        {filteredSecciones.length > 0 && (
          <div className="bg-base-100 px-6 py-3 border-t border-base-200 text-sm flex justify-between items-center text-base-content/70">
            <span>
              {selectedSecciones.length > 0 ? (
                <span>
                  <span className="font-medium text-primary">{selectedSecciones.length}</span> secciones seleccionadas
                </span>
              ) : (
                <span>Selecciona las secciones para asignar</span>
              )}
            </span>
            
            <div className="flex items-center gap-1">
              <span>Mostrando</span>
              <span className="font-medium">{displayedSecciones.length}</span>
              <span>de</span>
              <span className="font-medium">{filteredSecciones.length}</span>
            </div>
          </div>
        )}

        {/* Pie del modal con botones de acción */}
        <div className="bg-base-200/50 p-4 border-t border-base-200 rounded-b-xl flex justify-between items-center">
          <button 
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          
          <button
            className="btn btn-primary btn-sm"
            disabled={selectedSecciones.length === 0 || isLoading}
            onClick={handleAsignar}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Procesando...
              </>
            ) : (
              <>
                <Check size={16} />
                Asignar {selectedSecciones.length} {selectedSecciones.length === 1 ? "sección" : "secciones"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}