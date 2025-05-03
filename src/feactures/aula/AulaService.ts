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