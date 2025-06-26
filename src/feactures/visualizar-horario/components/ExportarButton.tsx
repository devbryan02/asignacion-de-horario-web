  import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { VisualizarHorarioService, HorarioDto } from '../VisualizarHorarioService';

interface ExportarButtonProps {
  horarios: HorarioDto[];
  tipo: 'seccion' | 'docente' | 'periodo';
  nombre: string;
}

export const ExportarButton: React.FC<ExportarButtonProps> = ({ 
  horarios, 
  tipo, 
  nombre 
}) => {
  const handleExportarExcel = () => {
    if (horarios.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    VisualizarHorarioService.exportarHorarioAExcel(horarios, tipo, nombre);
  };

  return (
    <button 
      onClick={handleExportarExcel}
      className="btn btn-sm btn-primary gap-2"
      title="Exportar horario a Excel"
    >
      <FileSpreadsheet size={16} />
      <span className="hidden sm:inline">Exportar</span>
    </button>
  );
};