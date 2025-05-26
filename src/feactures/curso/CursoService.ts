import apiClient from "@/lib/axios";
import { CursoRequest } from "@/types/request/CursoRequest";
import { CursoResponse } from "@/types/response/CursoResponse";
import { UUID } from "crypto";
import axios, { AxiosError } from "axios";

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

// En CursoService.ts - dentro de createCurso
export const createCurso = async (curso: CursoRequest): Promise<CursoResponse> => {
  try {
    console.log("Datos del curso a crear:", JSON.stringify(curso, null, 2));
    const response = await apiClient.post<CursoResponse>("/curso", curso);
    console.log("Respuesta del servidor:", JSON.stringify(response.data, null, 2));
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

export interface ApiErrorDelete {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
}

export const deleteCurso = async (id: UUID): Promise<ApiErrorDelete> => {
  try {
    const response = await apiClient.delete(`/curso/${id}`);
    return {
      message: response.data.message || "Curso eliminado correctamente",
      status: response.data.status || 200,
    };
  } catch (error: any) {
    console.error(`Error deleting curso with ID ${id}:`, error);

    //extraer el mensaje de error
    let errorMessage = error.response.data.message || error.response.data.error || error.message || "Error desconocido al eliminar el curso";
    let status = error.response.status || 500;

    return {
      message: errorMessage,
      status: status,
      error: error.response.data.error || "Error",
    }
  };
}
// Interfaz para la petición bulk
export interface CursoSeccionBulkRequest {
  cursoId: UUID;
  seccionesIds: UUID[];
  modo: string
}

// Interfaz para la respuesta de la operación bulk
export interface RegistroResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Método para registrar secciones en bulk
// Método para registrar secciones en bulk - CORREGIDO
export const addSeccionesBulk = async (request: CursoSeccionBulkRequest): Promise<RegistroResponse> => {
  try {
    const response = await apiClient.post<RegistroResponse>("/curso-seccion/bulk", request);
    return response.data;
  } catch (error) {
    console.error("Error registrando secciones en bulk:", error);

    // Manejo específico de errores desde la API
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;

      if (axiosError.response?.data) {
        const apiError = axiosError.response.data;

        // Retornamos un objeto RegistroResponse en lugar de lanzar un error
        return {
          success: false,
          message: apiError.message || "Error al registrar las secciones",
          data: {
            statusCode: axiosError.response.status,
            error: apiError.error || "Error",
            raw: apiError
          }
        };
      }
    }

    // Si no es un error específico de Axios, también devolvemos RegistroResponse
    return {
      success: false,
      message: "Error desconocido al registrar las secciones",
      data: { error }
    };
  }
};
