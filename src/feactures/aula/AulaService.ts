import apiClient from "@/lib/axios";
import { Aula } from "@/types/Aula";

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

export const createAula = async (aula: Aula) : Promise<Aula> => {
    try {
        const response = await apiClient.post<Aula>("/aula", aula);
        return response.data;
    } catch (error) {
        console.error("Error creating aula:", error);
        throw error;
    }
};

export const deleteAula = async (id: number) : Promise<void> => {
    try {
        await apiClient.delete(`/aula/${id}`);
    } catch (error) {
        console.error("Error deleting aula:", error);
        throw error;
    }
}