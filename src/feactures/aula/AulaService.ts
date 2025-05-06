import apiClient from "@/lib/axios";
import { Aula } from "@/types/AulaResponse";
import { UUID } from "crypto";
import axios, { AxiosError } from "axios";

export const fetchAulas = async () : Promise<Aula[]>  => {
    try {
        const response = await apiClient.get<Aula[]>("/aula");
        return response.data;
    } catch (error) {
        console.error("Error fetching aulas:", error);
        throw error;
    }
};

export const fetchAulaById = async (id: number) : Promise<Aula> => {
    try {
        const response = await apiClient.get<Aula>(`/aula/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching aula by ID:", error);
        throw error;
    }
};

export const createAula = async (aula: Omit<Aula, "id">) : Promise<Aula> => {
    try {
        const response = await apiClient.post<Aula>("/aula", aula);
        return response.data;
    } catch (error) {
        console.error("Error creating aula:", error);
        throw error;
    }
};

export interface ApiError {
    tipo: string;
    error: string;
  }
  export const deleteAula = async (id: UUID): Promise<void> => {
    try {
        await apiClient.delete(`/aula/${id}`);
    } catch (error) {
        console.error("Error deleting aula:", error);
        
        // Verificar si es un error de axios con respuesta del servidor
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiError>;
            
            // Si tenemos datos de error de la API, los propagamos
            if (axiosError.response?.data) {
                throw {
                    tipo: axiosError.response.data.tipo,
                    mensaje: axiosError.response.data.error,
                    statusCode: axiosError.response.status
                };
            }
        }
        
        // Si no es un error específico, lanzar el error original
        throw error;
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