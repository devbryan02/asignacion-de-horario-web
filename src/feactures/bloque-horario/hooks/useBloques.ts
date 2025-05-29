import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { UUID } from 'crypto';
import { 
    getBloquesHorario, 
    createBloqueHorario, 
    updateBloqueHorario, 
    deleteBloqueHorario 
} from '../BloqueService';
import { BloqueHorario, BloqueHorarioRequest, BloqueHorarioResponse } from '../types';

interface UseBloqueProps {
    pageSize?: number;
}

export function useBloques({ pageSize = 10 }: UseBloqueProps = {}) {
    const [bloques, setBloques] = useState<BloqueHorario[]>([]);
    const [filteredBloques, setFilteredBloques] = useState<BloqueHorario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [turnoFilter, setTurnoFilter] = useState<string | null>(null);

    // Fetch all bloques
    const fetchBloques = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBloquesHorario();
            setBloques(data);
            applyFiltersAndPagination(data, searchTerm, turnoFilter, 1);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los bloques horarios');
            setLoading(false);
        }
    }, []);

    // Apply filters and pagination to the bloques
    const applyFiltersAndPagination = useCallback((
        data: BloqueHorario[],
        search: string,
        turno: string | null,
        page: number
    ) => {
        let result = [...data];

        // Apply search filter if provided
        if (search.trim() !== '') {
            const searchLower = search.toLowerCase();
            result = result.filter(bloque => 
                bloque.diaSemana.toLowerCase().includes(searchLower) || 
                bloque.turno.toLowerCase().includes(searchLower)
            );
        }

        // Apply turno filter if provided
        if (turno) {
            result = result.filter(bloque => bloque.turno === turno);
        }

        // Calculate pagination
        setTotalPages(Math.ceil(result.length / pageSize));
        
        // Ensure current page is valid
        const validPage = Math.min(Math.max(1, page), Math.ceil(result.length / pageSize) || 1);
        setCurrentPage(validPage);

        // Apply pagination
        const start = (validPage - 1) * pageSize;
        const paginatedData = result.slice(start, start + pageSize);
        
        setFilteredBloques(paginatedData);
    }, [pageSize]);

    // Handle search
    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        applyFiltersAndPagination(bloques, term, turnoFilter, 1); // Reset to page 1 when searching
    }, [bloques, turnoFilter, applyFiltersAndPagination]);

    // Handle turno filter
    const handleFilterByTurno = useCallback((turno: string | null) => {
        setTurnoFilter(turno);
        applyFiltersAndPagination(bloques, searchTerm, turno, 1); // Reset to page 1 when filtering
    }, [bloques, searchTerm, applyFiltersAndPagination]);

    // Handle page change
    const handlePageChange = useCallback((page: number) => {
        applyFiltersAndPagination(bloques, searchTerm, turnoFilter, page);
    }, [bloques, searchTerm, turnoFilter, applyFiltersAndPagination]);

    // Create a new bloque horario
    const createBloque = useCallback(async (bloqueData: BloqueHorarioRequest): Promise<BloqueHorarioResponse> => {
        setLoading(true);
        try {
            const response = await createBloqueHorario(bloqueData);
            if (response.success) {
                await fetchBloques();
            }
            setLoading(false);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el bloque horario');
            setLoading(false);
            return {
                success: false,
                message: err instanceof Error ? err.message : 'Error al crear el bloque horario'
            };
        }
    }, [fetchBloques]);

    // Update an existing bloque horario
    const updateBloque = useCallback(async (id: UUID, bloqueData: BloqueHorarioRequest): Promise<BloqueHorarioResponse> => {
        setLoading(true);
        try {
            const response = await updateBloqueHorario(id, bloqueData);
            if (response.success) {
                await fetchBloques();
            }
            setLoading(false);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar el bloque horario');
            setLoading(false);
            return {
                success: false,
                message: err instanceof Error ? err.message : 'Error al actualizar el bloque horario'
            };
        }
    }, [fetchBloques]);

    // Delete a bloque horario
    const deleteBloque = useCallback(async (id: UUID): Promise<{success: boolean, message: string}> => {
    // Mostrar confirmación antes de eliminar
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    // Si el usuario cancela la operación
    if (!result.isConfirmed) {
        return {
            success: false,
            message: 'Operación cancelada por el usuario'
        };
    }
    
    setLoading(true);
    try {
        const response = await deleteBloqueHorario(id);
        await fetchBloques();
        setLoading(false);
        
        // Mostrar notificación de éxito
        Swal.fire({
            title: '¡Eliminado!',
            text: response.message,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        
        return {
            success: true,
            message: response.message
        };
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar el bloque horario');
        setLoading(false);
        
        // Mostrar notificación de error
        Swal.fire({
            title: 'Error',
            text: err instanceof Error ? err.message : 'Error al eliminar el bloque horario',
            icon: 'error'
        });
        
        return {
            success: false,
            message: err instanceof Error ? err.message : 'Error al eliminar el bloque horario'
        };
    }
}, [fetchBloques]);

    // Get unique turnos for filtering
    const getAvailableTurnos = useCallback(() => {
        const turnos = new Set<string>();
        bloques.forEach(bloque => {
            turnos.add(bloque.turno);
        });
        return Array.from(turnos);
    }, [bloques]);

    useEffect(() => {
        fetchBloques();
    }, [fetchBloques]);

    return {
        bloques: filteredBloques,
        loading,
        error,
        currentPage,
        totalPages,
        totalBloques: bloques.length,
        filteredCount: filteredBloques.length,
        handleSearch,
        handleFilterByTurno,
        handlePageChange,
        createBloque,
        updateBloque,
        deleteBloque,
        refreshBloques: fetchBloques,
        availableTurnos: getAvailableTurnos(),
        searchTerm,
        turnoFilter
    };
}