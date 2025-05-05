import { Calendar, User } from 'lucide-react';
import { Docente } from '@/types/response/DocenteResponse';
import RestriccionDocenteSelect from './RestriccionDocenteSelect';

interface RestriccionHeaderProps {
  selectedDocente: Docente | null;
  searchQuery: string;
  isSelectOpen: boolean;
  isLoadingDocentes: boolean;
  filteredDocentes: Docente[];
  docentes: Docente[];
  onSearchChange: (value: string) => void;
  onSelectDocente: (docente: Docente) => void;
  onClearSearch: () => void;
  onToggleSelect: (isOpen: boolean) => void;
}

export default function RestriccionHeader({
  selectedDocente,
  searchQuery,
  isSelectOpen,
  isLoadingDocentes,
  filteredDocentes,
  docentes,
  onSearchChange,
  onSelectDocente,
  onClearSearch,
  onToggleSelect
}: RestriccionHeaderProps) {
  return (
    <header className="bg-base-100 border border-base-300 rounded-xl shadow-sm">
      
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">
          <div className="flex flex-col gap-2">
            {/* Badge superior */}
            <div className="w-fit px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Gestión de horarios
            </div>
            
            {/* Título principal */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <Calendar size={20} />
              </div>
              <h2 className="text-2xl font-bold text-base-content">
                Restricciones Horarias
              </h2>
            </div>
            
            {/* Información del docente */}
            {selectedDocente && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={12} className="text-primary" />
                </div>
                <p className="text-base-content/70 text-sm">
                  Docente: <span className="font-medium text-primary">{selectedDocente.nombre}</span>
                </p>
              </div>
            )}
          </div>

          {/* Selector de docente */}
          <div className="w-full md:w-96 md:self-start">
            <RestriccionDocenteSelect 
              searchQuery={searchQuery}
              isSelectOpen={isSelectOpen}
              isLoadingDocentes={isLoadingDocentes}
              selectedDocente={selectedDocente}
              filteredDocentes={filteredDocentes}
              docentes={docentes}
              onSearchChange={onSearchChange}
              onSelectDocente={onSelectDocente}
              onClearSearch={onClearSearch}
              onToggleSelect={onToggleSelect}
            />
          </div>
        </div>
      </div>
    </header>
  );
}