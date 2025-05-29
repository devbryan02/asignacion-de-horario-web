"use client";

import { usePeriodoAcademico } from "../hooks/usePeriodo";
import { PeriodoAcademicoSearchBar } from "./SearchBar";
import { PeriodoPagination } from "./Pagination"; // Importar el componente de paginación
import { useState, useEffect } from "react";
import { PeriodoAcademico } from "../types";
import { Calendar, Edit, Trash2, Plus, Loader2, AlertCircle, CalendarRange } from "lucide-react";
import { AgregarPeriodoAcademicoModal } from "./AgregarModal";
import { EditarPeriodoAcademicoModal } from "./EditarModal";

export const PeriodoAcademicoDataTable = () => {
  const {
    // Datos y estados
    fetchPeriodos,
    loading,
    error,
    
    // Paginación
    currentPage,
    totalPages,
    currentItems,
    indexOfFirstItem,
    indexOfLastItem,
    filteredPeriodos,
    onPageChange,
    
    // Búsqueda
    
    // Operaciones
    deletePeriodo
  } = usePeriodoAcademico();
  
  // Estado para modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState<PeriodoAcademico | null>(null);

  // Actualizar resultados de búsqueda
  const handleSearchResults = (results: PeriodoAcademico[]) => {
    // Ya no necesitamos mantener estado local ya que usePeriodo gestiona filtrado
    // Pero mantenemos esta función por compatibilidad con la interfaz de SearchBar
  };

  // Handlers para modales
  const handleOpenEditModal = (periodo: PeriodoAcademico) => {
    setSelectedPeriodo(periodo);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => setSelectedPeriodo(null), 300);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Handler para eliminar periodo
  const handleDeletePeriodo = (periodo: PeriodoAcademico) => {
    deletePeriodo(periodo.id, periodo.nombre);
  };
  
  // Formatea la fecha en formato legible y con estilo
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }).format(date);
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header con título y botón de agregar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <CalendarRange size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Periodos Académicos</h1>
            <p className="text-sm text-gray-500">Gestión de periodos académicos del sistema</p>
          </div>
        </div>
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} className="mr-1" /> Agregar Periodo
        </button>
      </div>

      {/* SearchBar con callback para recibir resultados */}
      <PeriodoAcademicoSearchBar onSearch={handleSearchResults} />
      
      {/* Tabla de periodos con estilo mejorado */}
      <div className="overflow-hidden border border-base-300 rounded-lg">
        <div className="overflow-x-auto">
          <div className="max-h-[450px] overflow-y-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-base-200/70 border-b border-base-300">
                  <th className="text-left py-3 px-4 font-medium text-base-content/80">Nombre</th>
                  <th className="text-left py-3 px-4 font-medium text-base-content/80">Fecha Inicio</th>
                  <th className="text-left py-3 px-4 font-medium text-base-content/80">Fecha Fin</th>
                  <th className="text-right py-3 px-4 font-medium text-base-content/80">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 size={24} className="text-primary animate-spin" />
                        <p className="text-sm text-base-content/60">Cargando periodos académicos...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                          <AlertCircle size={24} className="text-error" />
                        </div>
                        <p className="text-sm font-medium text-error">Error al cargar periodos</p>
                        <p className="text-xs text-base-content/60">{error}</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredPeriodos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-base-200/80 flex items-center justify-center text-base-content/40">
                          <Calendar size={24} />
                        </div>
                        <p className="text-sm text-base-content/60 font-medium">No se encontraron periodos académicos</p>
                        <p className="text-xs text-base-content/50">Intente cambiar los filtros o agregar un nuevo periodo</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((periodo) => {
                    return (
                      <tr 
                        key={periodo.id} 
                        className="border-b border-base-200 hover:bg-base-100/80 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-base-content">{periodo.nombre}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                              <Calendar size={14} className="text-primary" />
                            </div>
                            <span>{formatDate(periodo.fechaInicio)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center">
                              <Calendar size={14} className="text-secondary" />
                            </div>
                            <span>{formatDate(periodo.fechaFin)}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              className="p-1.5 rounded-md bg-info/10 text-info hover:bg-info/20 transition-colors"
                              title="Editar periodo"
                              onClick={() => handleOpenEditModal(periodo)}
                            >
                              <Edit size={15} />
                            </button>
                            <button 
                              className="p-1.5 rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors"
                              title="Eliminar periodo"
                              onClick={() => handleDeletePeriodo(periodo)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Sección de información de paginación y controlador */}
      {filteredPeriodos.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 border-t border-base-200">
          {/* Información de elementos mostrados */}
          <div className="text-xs text-base-content/60">
            Mostrando {indexOfFirstItem + 1}-{indexOfLastItem} de {filteredPeriodos.length} periodos
          </div>
          
          {/* Componente de paginación */}
          <PeriodoPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* Modales */}
      <AgregarPeriodoAcademicoModal 
        isOpen={isAddModalOpen} 
        onClose={handleCloseAddModal} 
      />
      
      {selectedPeriodo && (
        <EditarPeriodoAcademicoModal 
          isOpen={isEditModalOpen} 
          periodo={selectedPeriodo} 
          onClose={handleCloseEditModal} 
          onUpdate={fetchPeriodos}
        />
      )}
    </div>
  );
};