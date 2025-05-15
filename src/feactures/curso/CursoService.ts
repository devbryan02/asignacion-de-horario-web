import apiClient from "@/lib/axios";
import { CursoRequest } from "@/types/request/CursoRequest";
import { CursoResponse } from "@/types/response/CursoResponse";
import { UUID } from "crypto";
import axios, { AxiosError } from "axios";
import { ApiError } from "../aula/AulaService";

export const fetchCursos = async (): Promise<CursoResponse[]> => {
  try {
    const response = await apiClient.get<CursoResponse[]>("/curso");
    return response.data;
  } catch (error) {
    console.error("Error fetching cursos:", error);
    throw error;
  }
};

export const fetchCursoById = async (id: UUID): Promise<CursoResponse> => {
  try {
    const response = await apiClient.get<CursoResponse>(`/curso/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching curso with ID ${id}:`, error);
    throw error;
  }
};

export const createCurso = async (curso: CursoRequest): Promise<CursoResponse> => {
  try {
    const response = await apiClient.post<CursoResponse>("/curso", curso);
    return response.data;
  } catch (error) {
    console.error("Error creating curso:", error);
    throw error;
  }
};

export const updateCurso = async (id: UUID, curso: CursoRequest): Promise<CursoResponse> => {
  try {
    const response = await apiClient.patch<CursoResponse>(`/curso/${id}`, curso);
    return response.data;
  } catch (error) {
    console.error(`Error updating curso with ID ${id}:`, error);
    throw error;
  }
};

export const deleteCurso = async (id: UUID): Promise<void> => {
  try {
    await apiClient.delete(`/curso/${id}`);
  } catch (error) {
    console.error(`Error deleting curso with ID ${id}:`, error);
    
    // Manejo específico de errores desde la API
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
