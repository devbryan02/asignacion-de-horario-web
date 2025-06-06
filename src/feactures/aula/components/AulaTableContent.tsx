"use client";

import { Aula } from '@/types/AulaResponse';
import { School, Pencil, Trash2, BookOpen, Computer, Loader2, ChevronRight, ArrowUpDown, Users } from 'lucide-react';

interface AulaTableContentProps {
  isLoading: boolean;
  aulas: Aula[];
  onAulaUpdated: (aula: Aula) => void; 
  onDelete: (aula: Aula) => void;
}

export default function AulaTableContent({
  isLoading,
  aulas,
  onAulaUpdated,
  onDelete
}: AulaTableContentProps) {
  // Formato para el tipo de aula
  const formatTipoAula = (tipo: string) => {
    switch (tipo) {
      case "TEORICO":
        return "Aula teórica";
      case "LABORATORIO":
        return "Laboratorio";
      default:
        return tipo;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "TEORICO":
        return <BookOpen size={14} />;
      case "LABORATORIO":
        return <Computer size={14} />;
      default:
        return null;
    }
  };

  // Generar un color para cada aula basado en su nombre
  const getAulaColor = (nombre: string) => {
    const colors = ['#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#f39c12', '#1abc9c'];
    let sum = 0;
    for (let i = 0; i < nombre.length; i++) {
      sum += nombre.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  return (
    <div className="rounded-lg border border-base-300 overflow-hidden shadow-sm">
      <div className="max-h-[500px] overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-base-200 sticky top-0 z-10">
              <th className="py-3 px-4 text-sm font-semibold text-base-content/80 text-left">
                <div className="flex items-center gap-1">
                  Nombre <ArrowUpDown size={14} className="opacity-50" />
                </div>
              </th>
              <th className="py-3 px-4 text-sm font-semibold text-base-content/80 text-left">Capacidad</th>
              <th className="py-3 px-4 text-sm font-semibold text-base-content/80 text-left">Tipo</th>
              <th className="py-3 px-4 text-sm font-semibold text-base-content/80 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <tr key={`skeleton-${index}`} className="border-b border-base-200">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse h-8 w-8 rounded-md bg-base-300"></div>
                      <div className="animate-pulse h-4 w-24 bg-base-300 rounded"></div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="animate-pulse h-4 w-12 bg-base-300 rounded"></div>
                    <div className="animate-pulse h-3 w-20 bg-base-300 rounded mt-1"></div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="animate-pulse h-6 w-24 bg-base-300 rounded-full"></div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <div className="animate-pulse h-8 w-16 bg-base-300 rounded"></div>
                      <div className="animate-pulse h-8 w-16 bg-base-300 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : aulas.length > 0 ? (
              aulas.map((aula) => (
                <tr
                  key={aula.id}
                  className="hover:bg-base-200/50 transition-colors duration-150"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-md flex items-center justify-center text-white font-medium shadow-sm" 
                        style={{ backgroundColor: getAulaColor(aula.nombre) }}
                      >
                        {aula.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{aula.nombre}</div>
                        <div className="text-xs text-base-content/60">ID: {aula.id.substring(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-base-content">
                    <div className="font-medium flex items-center gap-1">
                      <Users size={14} className="text-base-content/60" />
                      {aula.capacidad}
                    </div>
                    <div className="text-xs text-base-content/60">Estudiantes</div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className={`
                      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
                      ${aula.tipo === 'TEORICO'
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-secondary/10 text-secondary border border-secondary/20'
                      }
                    `}>
                      {getTipoIcon(aula.tipo)}
                      {formatTipoAula(aula.tipo)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-start gap-2">
                      <button
                        className="p-1.5 text-xs inline-flex items-center gap-1 rounded-md bg-info/10 text-info hover:bg-info/20 transition-colors"
                        onClick={() => onAulaUpdated(aula)}
                        aria-label="Editar aula"
                      >
                        <Pencil size={14} /> Editar
                      </button>
                      <button
                        className="p-1.5 text-xs inline-flex items-center gap-1 rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors"
                        onClick={() => onDelete(aula)}
                        aria-label="Eliminar aula"
                      >
                        <Trash2 size={14} />Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-12">
                  <div className="flex flex-col items-center justify-center text-base-content/70">
                    <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-3">
                      <School size={24} className="text-base-content/30" />
                    </div>
                    <p className="font-medium mb-1">No se encontraron aulas</p>
                    <p className="text-sm text-base-content/60">Intenta con otra búsqueda o agrega una nueva aula</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}