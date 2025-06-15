import { useState, useEffect } from "react";
import { Check, X, Search, Users, CheckCircle, AlertTriangle, FileText, School, Layers } from "lucide-react";
import { UUID } from "crypto";
import { SeccionResponse } from "@/feactures/seccion-academica/types";
import { RegistroResponse } from "../CursoService";
import { DocenteResponse } from "@/types/response/DocenteResponse";

interface AsignarSeccionModalProps {
  isOpen: boolean;
  onClose: () => void;
  cursoId: UUID;
  cursoNombre: string;
  secciones: SeccionResponse[];
  docentes: DocenteResponse[];
  onAsignar: (cursoId: UUID, seccionesIds: UUID[], docenteId: UUID | null, modo: string) => Promise<RegistroResponse>;
  isLoading?: boolean;
}

export default function AsignarSeccionesModal({
  isOpen,
  onClose,
  cursoId,
  cursoNombre,
  secciones,
  docentes = [],
  onAsignar,
  isLoading = false,
}: AsignarSeccionModalProps) {
  // Estados principales
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [selectedSecciones, setSelectedSecciones] = useState<UUID[]>([]);
  const [selectedDocente, setSelectedDocente] = useState<UUID | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [docenteSearchQuery, setDocenteSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [modo, setModo] = useState<"PRESENCIAL" | "VIRTUAL">("PRESENCIAL");

  // Reseteo de estados
  useEffect(() => {
    if (!isOpen) {
      setMessage(null);
      setMessageType(null);
      setSelectedSecciones([]);
      setSelectedDocente(null);
      setSearchQuery("");
      setDocenteSearchQuery("");
      setShowAll(false);
      setModo("PRESENCIAL");
    }
  }, [isOpen]);

  // Filtros
  const filteredSecciones = secciones.filter(seccion => 
    seccion.nombre.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredDocentes = docentes.filter(docente => 
    docente.nombre && docente.nombre.toLowerCase().includes(docenteSearchQuery.toLowerCase()));

  const displayedSecciones = searchQuery ? filteredSecciones : 
    (showAll ? filteredSecciones : filteredSecciones.slice(0, 6));

  // Handlers
  const handleToggleSeccion = (seccionId: UUID) => {
    setSelectedSecciones(prev => 
      prev.includes(seccionId) ? prev.filter(id => id !== seccionId) : [...prev, seccionId]);
  };

  const handleSelectDocente = (docenteId: UUID) => {
    setSelectedDocente(prev => prev === docenteId ? null : docenteId);
  };

  const handleSelectAllSecciones = () => {
    setSelectedSecciones(prev => 
      prev.length === filteredSecciones.length ? [] : filteredSecciones.map(s => s.id));
  };

  const handleAsignar = async () => {
    try {
      setMessage("Procesando...");
      setMessageType(null);
      const response = await onAsignar(cursoId, selectedSecciones, selectedDocente, modo);
      
      if (response.success) {
        setMessage(response.message || "¡Operación completada!");
        setMessageType("success");
        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
          onClose();
        }, 2000);
      } else {
        setMessage(response.message || "Error al procesar la solicitud");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error inesperado al procesar la solicitud");
      setMessageType("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="card bg-base-100 w-full max-w-3xl max-h-[85vh] flex flex-col shadow-lg animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="card-title gap-2 p-4 bg-base-200/50">
          <Users size={20} className="text-primary" />
          <span>{cursoNombre}</span>
          <div className="flex-1"></div>
          <div className="badge badge-primary">{modo}</div>
          <button className="btn btn-sm btn-circle" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        
        {/* Notificación */}
        {message && (
          <div className={`mx-4 my-2 alert ${
            messageType === "success" ? "alert-success" : 
            messageType === "error" ? "alert-error" : "alert-info"
          } shadow-sm`}>
            {messageType === "success" ? <CheckCircle size={16} /> : 
             messageType === "error" ? <AlertTriangle size={16} /> : 
             <span className="loading loading-spinner loading-sm"></span>}
            <span>{message}</span>
          </div>
        )}
        
        <div className="divider my-0"></div>
        
        {/* Tabs para modo */}
        <div className="px-4 pt-2 flex gap-2">
          <button 
            className={`tab tab-bordered ${modo === "PRESENCIAL" ? "tab-active" : ""}`}
            onClick={() => setModo("PRESENCIAL")}
          >
            Presencial
          </button>
          <button 
            className={`tab tab-bordered ${modo === "VIRTUAL" ? "tab-active" : ""}`}
            onClick={() => setModo("VIRTUAL")}
          >
            Virtual
          </button>
        </div>
        
        {/* Contenido en dos columnas */}
        <div className="card-body p-4 gap-4 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* Secciones */}
          <div className="col-span-2 bg-base-200/20 rounded-lg flex flex-col overflow-hidden">
            <div className="p-3 flex items-center justify-between bg-base-200/30">
              <div className="flex items-center gap-2">
                <Layers size={18} />
                <h3 className="font-medium">Secciones</h3>
                <span className="badge badge-sm">{filteredSecciones.length}</span>
              </div>
              <button 
                className="btn btn-xs btn-ghost"
                onClick={handleSelectAllSecciones}
                disabled={filteredSecciones.length === 0}
              >
                {selectedSecciones.length === filteredSecciones.length && filteredSecciones.length > 0 
                  ? "Deseleccionar" 
                  : "Seleccionar todo"}
              </button>
            </div>
            
            {/* Buscador */}
            <div className="relative px-3 py-2 bg-base-100">
              <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Buscar secciones..."
                className="input input-sm w-full pl-8 bg-transparent focus:outline-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Lista de secciones */}
            <div className="flex-1 overflow-auto p-3">
              {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <span className="loading loading-spinner text-primary"></span>
                </div>
              ) : filteredSecciones.length === 0 ? (
                <div className="text-center py-10 text-base-content/60">
                  <School size={24} className="mx-auto mb-2 opacity-60" />
                  <p>No se encontraron secciones</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {displayedSecciones.map((seccion) => (
                    <div 
                      key={seccion.id.toString()}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-base-200/40 ${
                        selectedSecciones.includes(seccion.id) ? "bg-primary/10" : ""
                      }`}
                      onClick={() => handleToggleSeccion(seccion.id)}
                    >
                      <input 
                        type="checkbox"
                        className="checkbox checkbox-sm checkbox-primary"
                        checked={selectedSecciones.includes(seccion.id)}
                        readOnly
                      />
                      <span>{seccion.nombre}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Ver más */}
              {!searchQuery && filteredSecciones.length > 6 && !showAll && (
                <button
                  className="btn btn-ghost btn-sm w-full mt-2"
                  onClick={() => setShowAll(true)}
                >
                  Ver todas ({filteredSecciones.length})
                </button>
              )}
            </div>
          </div>
          
          {/* Docentes */}
          <div className="bg-base-200/20 rounded-lg flex flex-col overflow-hidden">
            <div className="p-3 bg-base-200/30">
              <div className="flex items-center gap-2">
                <Users size={18} />
                <h3 className="font-medium">Docente</h3>
                <span className="badge badge-sm">{filteredDocentes.length}</span>
              </div>
            </div>
            
            {/* Buscador */}
            <div className="relative px-3 py-2 bg-base-100">
              <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Buscar docente..."
                className="input input-sm w-full pl-8 bg-transparent focus:outline-none"
                value={docenteSearchQuery}
                onChange={e => setDocenteSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Lista de docentes */}
            <div className="flex-1 overflow-auto p-3">
              {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <span className="loading loading-spinner text-primary"></span>
                </div>
              ) : filteredDocentes.length === 0 ? (
                <div className="text-center py-10 text-base-content/60">
                  <Users size={24} className="mx-auto mb-2 opacity-60" />
                  <p>No se encontraron docentes</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredDocentes.map((docente) => (
                    <div
                      key={docente.id.toString()}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-base-200/40 ${
                        selectedDocente === docente.id ? "bg-primary/10" : ""
                      }`}
                      onClick={() => handleSelectDocente(docente.id)}
                    >
                      <input
                        type="radio"
                        className="radio radio-sm radio-primary"
                        name="docente-select"
                        checked={selectedDocente === docente.id}
                        readOnly
                      />
                      <div>
                        <div>{docente.nombre}</div>
                        <div className="text-xs opacity-70">{docente.horasContratadas}h contratadas</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="card-actions justify-between items-center p-4 bg-base-200/30">
          <span className="text-sm">{selectedSecciones.length} secciones seleccionadas</span>
          <div className="flex gap-2">
            <button className="btn btn-sm btn-ghost" onClick={onClose} disabled={isLoading}>
              Cancelar
            </button>
            <button
              className="btn btn-sm btn-primary"
              disabled={selectedSecciones.length === 0 || isLoading}
              onClick={handleAsignar}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Procesando
                </>
              ) : (
                <>
                  <Check size={14} />
                  Asignar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}