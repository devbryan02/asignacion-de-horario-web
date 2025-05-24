import { Book, Filter, X, Check, Plus, BookOpen, Beaker } from "lucide-react";
import AgregarCursoModal from "./AgregarCursoModal";
import { CursoRequest } from "@/types/request/CursoRequest";
import { UUID } from "crypto";
import { useState } from "react";
import CursoSearchBar from "./CursoSearchBar";
import { CursoResponse } from "@/types/response/CursoResponse";

interface CursoTableHeaderProps {
  onCursoCreated: (curso: CursoRequest) => Promise<CursoResponse | void>;
  unidadId?: UUID;
  unidadNombre?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
  totalCursos?: number;
  startIndex?: number;
  endIndex?: number;
  onFilterTipo?: (tipo: string) => void;
  onClearFilters?: () => void;
  filterActive?: boolean;
  filterTipo?: string;
}

export default function CursoTableHeader({
  onCursoCreated,
  unidadId,
  unidadNombre,
  onSearch,
  searchValue = "",
  totalCursos = 0,
  startIndex = 0,
  endIndex = 0,
  onFilterTipo,
  onClearFilters,
  filterActive = false,
  filterTipo = "",
}: CursoTableHeaderProps) {

  return (
    <div className="flex flex-col gap-4 m-2">
      {/* Header principal con título y botón - Tema corporativo */}
      <div className="card bg-base-100">
        <div className="card-body p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Book size={24} />
              </div>
              <div>
                <h2 className="card-title text-2xl">
                  Cursos
                </h2>
                <p className="text-sm opacity-70 mt-0.5">
                  {unidadNombre
                    ? `Cursos académicos de ${unidadNombre}`
                    : 'Gestión de cursos académicos'}
                </p>
              </div>
            </div>

            <div className="self-stretch sm:self-center">
              <AgregarCursoModal
                onCursoCreated={onCursoCreated}
                unidadId={unidadId}
                unidadNombre={unidadNombre}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y herramientas - Tema corporativo */}
      {onSearch && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Componente de búsqueda */}
              <CursoSearchBar
                searchQuery={searchValue}
                onSearchChange={onSearch}
                itemCount={totalCursos}
                startIndex={startIndex}
                endIndex={endIndex || totalCursos}
              />

              {/* Filtros con diseño corporativo moderno */}
              <div className="join sm:self-end">
                <div className="join-item btn btn-sm btn-disabled">
                  <Filter size={14} className="mr-1" />
                  Tipo:
                </div>

                {/* Filtro: Teórico */}
                <button
                  className={`join-item btn btn-sm ${filterActive && filterTipo === "TEORICO" ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => onFilterTipo && onFilterTipo("TEORICO")}
                >
                  <BookOpen size={14} className="mr-1" />
                  Teórico
                </button>

                {/* Filtro: Laboratorio */}
                <button
                  className={`join-item btn btn-sm ${filterActive && filterTipo === "LABORATORIO" ? 'btn-secondary' : 'btn-outline'}`}
                  onClick={() => onFilterTipo && onFilterTipo("LABORATORIO")}
                >
                  <Beaker size={14} className="mr-1" />
                  Laboratorio
                </button>

                {/* Botón limpiar filtros */}
                {filterActive && (
                  <button
                    className="join-item btn btn-sm btn-error btn-outline"
                    onClick={onClearFilters}
                  >
                    <X size={14} />
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}