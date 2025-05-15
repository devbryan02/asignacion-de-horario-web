import apiClient from "@/lib/axios";
import { Aula } from "@/types/AulaResponse";
import { UUID } from "crypto";
import axios, { AxiosError } from "axios";

export const fetchAulas = async (): Promise<Aula[]> => {
    try {
        const response = await apiClient.get<Aula[]>("/aula");
        return response.data;
    } catch (error) {
        console.error("Error fetching aulas:", error);
        throw error;
    }
};

export const fetchAulaById = async (id: number): Promise<Aula> => {
    try {
        const response = await apiClient.get<Aula>(`/aula/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching aula by ID:", error);
        throw error;
    }
};

export const createAula = async (aula: Omit<Aula, "id">): Promise<Aula> => {
    try {
        const response = await apiClient.post<Aula>("/aula", aula);
        return response.data;
    } catch (error) {
        console.error("Error creating aula:", error);
        throw error;
    }
};

// Interfaz de respuesta para operaciones
export interface ServiceResponse {
    success: boolean;
    message?: string;
    data?: any;
    status?: number;
}

// Interfaz para manejar los errores de la API
export interface ApiError {
    timestamp?: string;
    status?: number;
    error?: string;
    message?: string;
    path?: string;
    tipo?: string;
}

export const deleteAula = async (id: UUID): Promise<ServiceResponse> => {
    try {
        const response = await apiClient.delete(`/aula/${id}`);
        return {
            success: true,
            data: response.data,
            message: 'Aula eliminada correctamente',
            status: response.status
        };
    } catch (error) {
        console.error("Error deleting aula:", error);

        // Determinar el tipo de error y extraer información relevante
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiError>;
            const status = axiosError.response?.status;
            const errorData = axiosError.response?.data || {};

            // Construir mensaje de error basado en la respuesta de la API
            let errorMessage = errorData.message ||
                errorData.error ||
                (errorData as any).tipo ||
                error.message ||
                'Error desconocido al eliminar el aula';

            // Mensajes más amigables según el tipo de error
            if (status === 409) {
                errorMessage = errorData.message || "No se puede eliminar el aula porque está siendo utilizada en horarios o tiene otras dependencias.";
            } else if (status === 404) {
                errorMessage = errorData.message || "El aula que intenta eliminar no existe o ya fue eliminada.";
            } else if (status === 403) {
                errorMessage = errorData.message || "No tiene permisos para eliminar esta aula.";
            }

            // Devolver respuesta estructurada con detalles del error
            return {
                success: false,
                message: errorMessage,
                data: errorData,
                status: status
            };
        }

        // Si no es un error de Axios, devolver un formato genérico
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error desconocido al eliminar el aula',
            data: error
        };
    }
};

export const updateAula = async (aulaRequest: Omit<Aula, "id">, aulaId: UUID): Promise<Aula> => {
    try {
        const response = await apiClient.patch<Aula>(`/aula/${aulaId}`, aulaRequest);
        return response.data;
    } catch (error) {
        console.error("Error updating aula:", error);
        throw error;
    }
};