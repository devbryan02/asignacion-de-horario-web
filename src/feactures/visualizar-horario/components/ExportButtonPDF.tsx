import React from 'react';
import { File } from 'lucide-react';
import { HorarioDto } from '../VisualizarHorarioService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { indexToDiaSemana } from '../VisualizarHorarioService';
import Swal from 'sweetalert2';

interface ExportButtonPDFProps {
  horarios: HorarioDto[];
  tipo: 'seccion' | 'docente' | 'periodo';
  nombre: string;
  className?: string;
}

const ExportButtonPDF: React.FC<ExportButtonPDFProps> = ({
  horarios,
  tipo,
  nombre,
  className = ''
}) => {
  const exportarHorarioAPDF = async () => {
    if (!horarios || horarios.length === 0) {
      alert('No hay horarios para exportar');
      return;
    }

    try {
      // Crear el documento PDF
      const doc = new jsPDF();
      
      // Configurar título
      doc.setFontSize(18);
      doc.setTextColor(33, 33, 33);
      
      const titulo = `Horario de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: ${nombre}`;
      doc.text(titulo, 14, 22);
      
      // Fecha de generación
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Preparar datos para la tabla
      const tableData = horarios.map(h => [
        h.curso,
        h.docente,
        h.aula,
        h.seccion,
        indexToDiaSemana[Object.values(indexToDiaSemana).indexOf(h.diaSemana)] || h.diaSemana,
        h.horaInicio.substring(0, 5),
        h.horaFin.substring(0, 5)
      ]);
      
      // Crear tabla en el PDF
      autoTable(doc, {
        head: [['Curso', 'Docente', 'Aula', 'Sección', 'Día', 'Hora Inicio', 'Hora Fin']],
        body: tableData,
        startY: 40,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });
      
      // Guardar el PDF
      const fechaActual = new Date().toISOString().split('T')[0];
      const fileName = `Horario_${tipo}_${nombre}_${fechaActual}.pdf`;
      doc.save(fileName);
      Swal.fire({
        icon: 'success',
        title: 'Horario Exportado',
        text: `El horario ha sido exportado exitosamente.`,
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 2000});
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al Exportar',
        text: `Ocurrió un error al exportar el horario. Por favor, verifica que los datos sean correctos.`,
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 2000});
    }
  };

  return (
    <button
      onClick={exportarHorarioAPDF}
      className={`btn btn-sm btn-secondary gap-2 ${className}`}
      title="Exportar horario a PDF"
    >
      <File size={16} />
      <span className="hidden sm:inline">PDF</span>
    </button>
  );
};

export default ExportButtonPDF;