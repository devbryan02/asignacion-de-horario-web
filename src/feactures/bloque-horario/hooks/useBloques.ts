import { useState, useEffect, useCallback, useMemo } from 'react';
import Swal from 'sweetalert2';
import { UUID } from 'crypto';
import {
    getBloquesHorario,
    createBloqueHorario,
    updateBloqueHorario,
    deleteBloqueHorario
} from '../BloqueService';
import { BloqueHorario, BloqueHorarioRequest, BloqueHorarioResponse } from '../types';

export function useBloques() {
    // Estados principales
    const [bloques, setBloques] = useState<BloqueHorario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados de filtrado y búsqueda
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [turnoFilter, setTurnoFilter] = useState<string | null>(null);


    // Fetch all bloques
    const fetchBloques = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBloquesHorario();
            setBloques(data);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los bloques horarios');
            setLoading(false);
        }
    }, []);

    // Filtrado de bloques - ahora usando useMemo
    const filteredBloques = useMemo(() => {
        let result = [...bloques];

        // Apply search filter if provided
        if (searchTerm.trim() !== '') {
            const searchLower = searchTerm.toLowerCase().trim();
            result = result.filter(bloque =>
                bloque.diaSemana.toLowerCase().includes(searchLower) ||
                bloque.turno.toLowerCase().includes(searchLower)
            );
        }

        // Apply turno filter if provided
        if (turnoFilter) {
            // Normalize turno comparison (case-insensitive)
            result = result.filter(bloque =>
                bloque.turno.toLowerCase() === turnoFilter.toLowerCase()
            );
        }

        return result;
    }, [bloques, searchTerm, turnoFilter]);


    // Handle search
    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setTurnoFilter(null);
    }, []);

    // Handle turno filter
    const handleTurnoFilterChange = useCallback((turno: string | null) => {
        setTurnoFilter(turno);
    }, []);

    useEffect(() => {
        fetchBloques();
    }, [fetchBloques]);


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
    const deleteBloque = useCallback(async (id: UUID): Promise<{ success: boolean, message: string }> => {
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
    const availableTurnos = useMemo(() => {
        const turnos = new Set<string>();
        bloques.forEach(bloque => {
            // Normalize turno (first letter capitalized)
            const normalizedTurno = bloque.turno.charAt(0).toUpperCase() + bloque.turno.slice(1).toLowerCase();
            turnos.add(normalizedTurno);
        });
        return Array.from(turnos).sort();
    }, [bloques]);


    return {
        // Ahora usamos los bloques paginados
        bloques,
        allBloques: bloques,

        filteredBloques, // Exportamos también los filtrados sin paginar
        loading,
        error,
        handleTurnoFilterChange,


        // Información de filtros
        searchTerm,
        turnoFilter,
        totalBloques: bloques.length,
        filteredCount: filteredBloques.length,

        // Acciones de filtrado y búsqueda
        handleSearchChange,
        clearFilters,

        // Operaciones CRUD
        createBloque,
        updateBloque,
        deleteBloque,
        refreshBloques: fetchBloques,

        // Datos para UI
        availableTurnos,
    };
}