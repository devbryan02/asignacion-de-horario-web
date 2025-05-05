import { useState, useEffect, useMemo } from 'react';
import { fetchRestriccionByDocente } from '../RestriccionService';
import { fetchDocentes } from '@/feactures/docente/DocenteService';
import { RestriccionResponse } from '@/types/response/RestriccionResponse';
import { Docente } from '@/types/response/DocenteResponse';
import { UUID } from 'crypto';
import { DiaSemana } from '@/types/DiaSemana';

export function useRestricciones(initialDocenteId?: UUID) {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedDocenteId, setSelectedDocenteId] = useState<UUID | undefined>(initialDocenteId);
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
  const [restricciones, setRestricciones] = useState<RestriccionResponse[]>([]);
  const [isLoadingDocentes, setIsLoadingDocentes] = useState(true);
  const [isLoadingRestricciones, setIsLoadingRestricciones] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const diasSemana: DiaSemana[] = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

  // Filtrar docentes basado en la búsqueda
  const filteredDocentes = useMemo(() => {
    // Si hay búsqueda, mostrar todos los resultados que coincidan
    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().split(" ");
      return docentes.filter(docente =>
        searchTerms.every(term =>
          docente.nombre.toLowerCase().includes(term)
        )
      );
    }
    return docentes.slice(0, 5);
  }, [docentes, searchQuery]);

  // Cargar la lista de docentes
  useEffect(() => {
    const loadDocentes = async () => {
      setIsLoadingDocentes(true);
      try {
        const data = await fetchDocentes();
        setDocentes(data);

        if (initialDocenteId) {
          const docente = data.find(d => d.id === initialDocenteId);
          if (docente) {
            setSelectedDocente(docente);
          } else if (data.length > 0) {
            setSelectedDocente(data[0]);
            setSelectedDocenteId(data[0].id);
          }
        } else if (data.length > 0) {
          setSelectedDocente(data[0]);
          setSelectedDocenteId(data[0].id);
        }
      } catch (err) {
        console.error("Error al cargar docentes:", err);
        setError("No se pudieron cargar los docentes. Intente nuevamente.");
      } finally {
        setIsLoadingDocentes(false);
      }
    };

    loadDocentes();
  }, [initialDocenteId]);

  // Cargar restricciones cuando cambia el docente seleccionado
  useEffect(() => {
    const loadRestricciones = async () => {
      if (!selectedDocenteId) return;

      setIsLoadingRestricciones(true);
      setError(null);

      try {
        const data = await fetchRestriccionByDocente(selectedDocenteId);
        setRestricciones(data);
      } catch (err) {
        console.error("Error al cargar restricciones:", err);
        setError("No se pudieron cargar las restricciones. Intente nuevamente.");
      } finally {
        setIsLoadingRestricciones(false);
      }
    };

    if (selectedDocenteId) {
      loadRestricciones();
    } else {
      setRestricciones([]);
    }
  }, [selectedDocenteId]);

  const handleSelectDocente = (docente: Docente) => {
    setSelectedDocenteId(docente.id);
    setSelectedDocente(docente);
    setSearchQuery("");
    setIsSelectOpen(false);
  };

  const sortByHora = (a: RestriccionResponse, b: RestriccionResponse) => {
    return a.horaInicio.localeCompare(b.horaInicio);
  };

  const getRestriccionesPorDia = (dia: DiaSemana) => {
    return restricciones
      .filter(r => r.diaSemana === dia)
      .sort(sortByHora);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (selectedDocente) setSelectedDocente(null);
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (selectedDocente) {
      setSelectedDocente(null);
      setSelectedDocenteId(undefined);
    }
  };

  return {
    docentes,
    filteredDocentes,
    searchQuery,
    isSelectOpen,
    selectedDocenteId,
    selectedDocente,
    restricciones,
    isLoadingDocentes,
    isLoadingRestricciones,
    error,
    diasSemana,
    setIsSelectOpen,
    handleSelectDocente,
    getRestriccionesPorDia,
    handleSearchChange,
    clearSearch,
  };
}