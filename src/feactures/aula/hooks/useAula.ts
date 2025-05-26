import { useState, useEffect, useMemo } from 'react';
import { Aula } from '@/types/AulaResponse';
import { fetchAulas } from '../AulaService';
import toast from 'react-hot-toast';

export type FilterTypes = {
  teorico: boolean;
  laboratorio: boolean;
};

export function useAulas() {
  // Estados
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTypes, setFilterTypes] = useState<FilterTypes>({
    teorico: false,
    laboratorio: false,
  });
  
  // Paginación - solo mantenemos lo básico
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Cargar datos
  const loadAulas = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAulas();
      setAulas(data);
    } catch (error) {
      console.error('Error fetching aulas:', error);
      toast.error('Error al cargar las aulas');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar al montar
  useEffect(() => {
    loadAulas();
  }, []);

  // Filtrar aulas
  const filteredAulas = useMemo(() => {
    return aulas.filter((aula) => {
      // Primero filtramos por texto de búsqueda
      const matchesSearch = aula.nombre.toLowerCase().includes(searchQuery.toLowerCase());

      // Si no hay filtros de tipo activos, solo consideramos el texto
      const noTypeFiltersActive = !filterTypes.teorico && !filterTypes.laboratorio;

      // Si hay filtros de tipo, comprobamos si el aula coincide con alguno de los tipos seleccionados
      const matchesType = noTypeFiltersActive ||
          (filterTypes.teorico && aula.tipo === "TEORICO") ||
          (filterTypes.laboratorio && aula.tipo === "LABORATORIO");

      // El aula debe cumplir ambas condiciones
      return matchesSearch && matchesType;
    });
  }, [aulas, searchQuery, filterTypes]);

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAulas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAulas.length / itemsPerPage);

  // Manejadores
  const handleFilterChange = (type: keyof FilterTypes) => {
    setFilterTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
    setCurrentPage(1); // Reiniciar a primera página al filtrar
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reiniciar a primera página al buscar
  };

  const clearFilters = () => {
    setFilterTypes({ teorico: false, laboratorio: false });
    setCurrentPage(1);
  };

  return {
    aulas,
    filteredAulas,
    currentItems,
    isLoading,
    searchQuery,
    filterTypes,
    
    // Paginación - solo lo esencial para usar con AulaPagination
    currentPage,
    totalPages,
    onPageChange: setCurrentPage, // Renombrado para ser más claro
    
    indexOfFirstItem,
    indexOfLastItem,
    loadAulas,
    handleFilterChange,
    handleSearchChange,
    clearFilters,
  };
}