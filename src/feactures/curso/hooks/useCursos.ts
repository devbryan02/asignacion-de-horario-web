import { useState, useEffect, useMemo } from 'react';
import { CursoResponse } from '@/types/response/CursoResponse';
import { fetchCursos } from '../CursoService';
import toast from 'react-hot-toast';

export type FilterTipo = {
  teorico: boolean;
  laboratorio: boolean;
};

export function useCursos() {
  // Estados
  const [cursos, setCursos] = useState<CursoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTipo, setFilterTipo] = useState<FilterTipo>({
    teorico: false,
    laboratorio: false,
  });
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Cargar datos
  const loadCursos = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCursos();
      setCursos(data);
    } catch (error) {
      console.error('Error fetching cursos:', error);
      toast.error('Error al cargar los cursos.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar al montar
  useEffect(() => {
    loadCursos();
  }, []);

  // Filtrar cursos
  const filteredCursos = useMemo(() => {
    return cursos.filter((curso) => {
      // Filtrado por texto de búsqueda
      const matchesSearch = curso.nombre.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtrado por tipo de curso
      const noTipoFiltersActive = !filterTipo.teorico && !filterTipo.laboratorio;

      const matchesTipo = noTipoFiltersActive ||
        (filterTipo.teorico && curso.tipo === 'TEORICO') ||
        (filterTipo.laboratorio && curso.tipo === 'LABORATORIO');

      return matchesSearch && matchesTipo;
    });
  }, [cursos, searchQuery, filterTipo]);

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCursos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);

  // Manejadores
  const handleFilterChange = (type: keyof FilterTipo) => {
    setFilterTipo((prev) => ({
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
    setFilterTipo({ teorico: false, laboratorio: false });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return {
    cursos,
    filteredCursos,
    currentItems,
    isLoading,
    searchQuery,
    filterTipo,
    currentPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    loadCursos,
    handleFilterChange,
    handleSearchChange,
    clearFilters,
    paginate,
  };
}