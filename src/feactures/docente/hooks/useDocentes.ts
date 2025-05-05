import { useState, useEffect, useMemo } from 'react';
import { Docente } from '@/types/response/DocenteResponse';
import { fetchDocentes } from '../DocenteService';
import toast from 'react-hot-toast';

export type FilterHours = {
  menos15: boolean;
  mas15: boolean;
};

export function useDocentes() {
  // Estados
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHours, setFilterHours] = useState<FilterHours>({
    menos15: false,
    mas15: false,
  });
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Cargar datos
  const loadDocentes = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDocentes();
      setDocentes(data);
    } catch (error) {
      console.error('Error fetching docentes:', error);
      toast.error('Error al cargar los docentes.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar al montar
  useEffect(() => {
    loadDocentes();
  }, []);

  // Filtrar docentes
  const filteredDocentes = useMemo(() => {
    return docentes.filter((docente) => {
      // Filtrado por texto de búsqueda
      const matchesSearch = docente.nombre.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtrado por horas contratadas
      const noHoursFiltersActive = !filterHours.menos15 && !filterHours.mas15;

      const matchesHours = noHoursFiltersActive ||
          (filterHours.menos15 && docente.horasContratadas < 15) ||
          (filterHours.mas15 && docente.horasContratadas >= 15);

      // El docente debe cumplir ambas condiciones
      return matchesSearch && matchesHours;
    });
  }, [docentes, searchQuery, filterHours]);

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocentes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocentes.length / itemsPerPage);

  // Manejadores
  const handleFilterChange = (type: keyof FilterHours) => {
    setFilterHours((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilterHours({ menos15: false, mas15: false });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return {
    docentes,
    filteredDocentes,
    currentItems,
    isLoading,
    searchQuery,
    filterHours,
    currentPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    loadDocentes,
    handleFilterChange,
    handleSearchChange,
    clearFilters,
    paginate,
  };
}