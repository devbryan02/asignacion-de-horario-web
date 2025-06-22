"use client";

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { AlertCircle, Upload, X, Info, CheckCircle, Loader2 } from 'lucide-react';
import { createRestriccionDocenteBatch } from "../DocenteService";
import { RestriccionRequest } from '@/types/request/RestriccionRequest';
import { DiaSemana } from '@/types/DiaSemana';
import { TipoRestriccion } from '@/types/TipoRestriccion';
import toast from 'react-hot-toast';
import { UUID } from 'crypto';

interface RestriccionUploaderProps {
  docenteId: UUID;
  onSuccess?: () => void;
}

export default function RestriccionUploader({ docenteId, onSuccess }: RestriccionUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<RestriccionRequest[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constantes para validación
  const diasSemana: DiaSemana[] = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];
  const tiposRestriccion: TipoRestriccion[] = ["DISPONIBLE", "BLOQUEADO"];

  // Procesar archivo Excel
  const processFile = async (selectedFile: File) => {
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Por favor, sube un archivo Excel válido (.xlsx o .xls)');
      return;
    }

    setFile(selectedFile);
    setError(null);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      
      if (workbook.SheetNames.length === 0) {
        setError('El archivo Excel no contiene hojas');
        return;
      }
      
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const restricciones = validateAndTransformData(jsonData);
      setPreview(restricciones);
      setShowPreview(restricciones.length > 0);
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      setError('Error al procesar el archivo Excel. Verifica el formato.');
    }
  };

  // Validar y transformar datos
  const validateAndTransformData = (data: any[]): RestriccionRequest[] => {
    if (!Array.isArray(data) || data.length === 0) {
      setError('El archivo no contiene datos válidos');
      return [];
    }

    const restricciones: RestriccionRequest[] = [];
    const errors: string[] = [];

    data.forEach((row, index) => {
      // Verificar campos requeridos (sin incluir docenteId, que se toma del props)
      if (!row.diaSemana || !row.horaInicio || !row.horaFin || !row.tipoRestriccion) {
        errors.push(`Fila ${index + 1}: Faltan campos obligatorios`);
        return;
      }

      // Validar día de semana
      const diaSemana = String(row.diaSemana).toUpperCase();
      if (!diasSemana.includes(diaSemana as DiaSemana)) {
        errors.push(`Fila ${index + 1}: Día de semana inválido (${diaSemana})`);
        return;
      }

      // Validar tipo de restricción
      const tipoRestriccion = String(row.tipoRestriccion).toUpperCase();
      if (!tiposRestriccion.includes(tipoRestriccion as TipoRestriccion)) {
        errors.push(`Fila ${index + 1}: Tipo de restricción inválido (${tipoRestriccion})`);
        return;
      }

      // Formatear horas
      let horaInicio = formatearHora(row.horaInicio);
      let horaFin = formatearHora(row.horaFin);

      if (!horaInicio || !horaFin) {
        errors.push(`Fila ${index + 1}: Formato de hora incorrecto`);
        return;
      }

      if (horaInicio >= horaFin) {
        errors.push(`Fila ${index + 1}: La hora de inicio debe ser anterior a la hora de fin`);
        return;
      }

      // Crear restricción con el docenteId del prop
      restricciones.push({
        docenteId, // Usar el ID del docente pasado como prop
        diaSemana: diaSemana as DiaSemana,
        horaInicio,
        horaFin,
        tipoRestriccion: tipoRestriccion as TipoRestriccion
      });
    });

    if (errors.length > 0) {
      setError(`Se encontraron ${errors.length} errores. Revisa la consola para más detalles.`);
      console.error('Errores de validación:', errors);
      return [];
    }

    return restricciones;
  };

  // Formatear valor de hora
  const formatearHora = (valor: any): string => {
    if (typeof valor === 'number') {
      // Excel guarda horas como fracción del día
      const totalMinutos = Math.round(valor * 24 * 60);
      const horas = Math.floor(totalMinutos / 60);
      const minutos = totalMinutos % 60;
      return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`;
    } else if (typeof valor === 'string') {
      const match = valor.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
      if (match) {
        const horas = match[1].padStart(2, '0');
        const minutos = match[2].padStart(2, '0');
        const segundos = match[3] ? match[3].padStart(2, '0') : '00';
        return `${horas}:${minutos}:${segundos}`;
      }
    }
    return '';
  };

  // Subir restricciones
  const handleUpload = async () => {
    if (preview.length === 0) {
      setError('No hay restricciones válidas para cargar');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const toastId = toast.loading('Subiendo restricciones...');
      
      const response = await createRestriccionDocenteBatch(preview);

      if(!response.success) {
        setError(response.message || 'Error al subir las restricciones');
        return;

      }
      
      toast.success(`¡${response.message} !`, {
        id: toastId,
        duration: 4000,
      });
      
      resetForm();
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al subir las restricciones';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFile(null);
    setPreview([]);
    setShowPreview(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Manejadores de eventos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) processFile(droppedFile);
  };

  return (
    <div className="space-y-3">
      {/* Instrucción breve */}
      <div className="p-3 bg-amber-50 border border-amber-100 rounded flex gap-2 items-start">
        <Info size={16} className="text-amber-600 mt-0.5" />
        <div className="text-sm text-amber-700 text-start">
          <p>El archivo Excel debe contener: <b>diaSemana</b>, <b>horaInicio</b>, <b>horaFin</b> y <b>tipoRestriccion</b>. 
            <a href="/plantilla_excel.xlsx" download className="ml-1 text-amber-600 underline hover:text-amber-800">Descargar plantilla</a>
          </p>
        </div>
      </div>

      {/* Área de carga de archivo */}
      <div 
        className={`border-2 border-dashed rounded-md p-5 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-amber-400 bg-amber-50' : 'border-base-300 hover:border-amber-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          accept=".xlsx, .xls" 
          onChange={handleFileChange} 
          className="hidden" 
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Upload size={20} />
          </div>
          <div>
            <p className="font-medium text-base-content text-sm">
              {file ? file.name : 'Arrastra un archivo Excel o haz clic aquí'}
            </p>
            {file && (
              <p className="text-xs text-base-content/70 mt-0.5">
                {`${(file.size / 1024).toFixed(1)} KB`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-2 bg-error/10 border border-error/30 rounded-md flex items-center gap-2">
          <AlertCircle size={16} className="text-error" />
          <p className="text-xs text-error">{error}</p>
          <button 
            className="ml-auto p-1 rounded-full hover:bg-error/20 text-error"
            onClick={() => setError(null)}
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Vista previa */}
      {showPreview && preview.length > 0 && (
        <div className="border border-base-200 rounded-md overflow-hidden">
          <div className="p-2 bg-base-100 border-b border-base-200 flex items-center justify-between">
            <span className="text-sm flex items-center gap-1.5">
              <CheckCircle size={14} className="text-success" />
              <span className="font-medium">{preview.length}</span> restricciones listas
            </span>
            <button 
              className="text-xs text-base-content/70 hover:text-base-content"
              onClick={() => setShowPreview(false)}
            >
              Ocultar
            </button>
          </div>
          <div className="overflow-x-auto max-h-48">
            <table className="table table-xs table-zebra w-full">
              <thead>
                <tr className="text-xs">
                  <th>Día</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {preview.slice(0, 5).map((item, index) => (
                  <tr key={index}>
                    <td>{item.diaSemana.substring(0, 3)}</td>
                    <td>{item.horaInicio.substring(0, 5)}</td>
                    <td>{item.horaFin.substring(0, 5)}</td>
                    <td>
                      <span className={`px-1.5 py-0.5 rounded-sm text-[10px] ${
                        item.tipoRestriccion === 'DISPONIBLE' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-error/10 text-error'
                      }`}>
                        {item.tipoRestriccion === 'DISPONIBLE' ? 'DISP' : 'BLOQ'}
                      </span>
                    </td>
                  </tr>
                ))}
                {preview.length > 5 && (
                  <tr>
                    <td colSpan={4} className="text-center text-xs text-base-content/70">
                      ... y {preview.length - 5} más
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end gap-2 mt-3">
        <button 
          className="px-3 py-1.5 rounded text-sm text-base-content/70 hover:bg-base-200"
          onClick={resetForm}
          disabled={isLoading || (!file && !showPreview)}
        >
          Cancelar
        </button>
        <button 
          className="px-3 py-1.5 rounded text-sm bg-amber-500 text-white hover:bg-amber-600 disabled:bg-amber-300 flex items-center gap-1.5"
          onClick={handleUpload}
          disabled={isLoading || preview.length === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={14} />
              <span>Subiendo...</span>
            </>
          ) : (
            <>
              <Upload size={14} />
              <span>Cargar ({preview.length})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}