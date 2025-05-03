import apiClient from "@/lib/axios";
import { Curso } from "@/types/Curso";

export const fetchCursos = async () : Promise<Curso[]>  => {
    try {
        const response = await apiClient.get<Curso[]>("/curso");
        return response.data;
    } catch (error) {
        console.error("Error fetching cursos:", error);
        throw error;
    }
}