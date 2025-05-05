import apiClient from "@/lib/axios";
import { CursoRequest } from "@/types/request/CursoRequest";
import { CursoResponse } from "@/types/response/CursoResponse";

export const fetchCursos = async () : Promise<CursoResponse[]>  => {
    try {
        const response = await apiClient.get<CursoResponse[]>("/curso");
        return response.data;
    } catch (error) {
        console.error("Error fetching cursos:", error);
        throw error;
    }
}

export const createCurso = async (curso: CursoRequest) : Promise<CursoResponse> => {
    try {
        const response = await apiClient.post<CursoResponse>("/curso", curso);
        return response.data;
    } catch (error) {
        console.error("Error creating curso:", error);
        throw error;
    }
}


