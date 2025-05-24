import apiClient from "@/lib/axios";
import { SeccionRequest, SeccionResponse } from "./types";
import { UUID } from "crypto";

// Interfaz de respuesta para operaciones
export interface ServiceResponse {
  success: boolean;
  message?: string;
  data?: any;
  status?: number;
}

// Obtener todas las secciones
export async function fetchSeccionAcademica(): Promise<SeccionResponse[]> {
  try {
    const response = await apiClient.get<SeccionResponse[]>("/seccion-academica");
    return response.data;
  } catch (error) {
    console.error("Error fetching secciones academicas:", error);
    throw error;
  }
}

// Crear nueva sección
export async function createSeccionAcademica(seccion: SeccionRequest): Promise<SeccionResponse> {
  try {
    const response = await apiClient.post<SeccionResponse>("/seccion-academica", seccion);
    return response.data;
  } catch (error) {
    console.error("Error creating seccion academica:", error);
    throw error;
  }
}

// Actualizar sección
export async function updateSeccionAcademica(id: UUID, seccion: SeccionRequest): Promise<SeccionResponse> {
  try {
    const response = await apiClient.patch<SeccionResponse>(`/seccion-academica/${id}`, seccion);
    return response.data;
  } catch (error) {
    console.error("Error updating seccion academica:", error);
    throw error;
  }
}

// Eliminar sección
export async function deleteSeccionAcademica(id: UUID): Promise<ServiceResponse> {
  try {
    const response = await apiClient.delete(`/seccion-academica/${id}`);
    return {
      success: true,
      data: response.data,
      message: 'Sección académica eliminada correctamente',
      status: response.status
    };
  } catch (error: any) {
    console.error("Error deleting seccion academica:", error);
    
    // Extraer información detallada del error de la API
    const status = error.response?.status;
    const errorData = error.response?.data || {};
    
    // Construir mensaje de error según el tipo de error
    let errorMessage = errorData.message || 
                       errorData.error || 
                       error.message || 
                       'Error desconocido al eliminar la sección académica';
    
    // Mensajes más amigables según el tipo de error
    if (status === 409) {
      errorMessage = "No se puede eliminar la sección porque tiene grupos o asignaturas asociadas.";
      
      // Si la API proporciona un mensaje específico, usarlo
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } else if (status === 404) {
      errorMessage = "La sección que intenta eliminar no existe o ya fue eliminada.";
    } else if (status === 403) {
      errorMessage = "No tiene permisos para eliminar esta sección.";
    }
    
    // Devolver objeto con información detallada del error
    return {
      success: false,
      message: errorMessage,
      data: errorData,
      status: status
    };
  }
}