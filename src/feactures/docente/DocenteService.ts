import apiClient from "@/lib/axios";
import { DocenteResponse } from "@/types/response/DocenteResponse";
import { RestriccionRequest } from "@/types/request/RestriccionRequest";
import { RegistroRestriccionResponse } from "@/types/response/RegistroRestriccionResponse";
import { UUID } from "crypto";
import { DocenteRequest } from "@/types/request/DocenteRequest";

export async function fetchDocentes() : Promise<DocenteResponse[]> {
  try {
    const response = await apiClient.get<DocenteResponse[]>("/docente");
    return response.data;
  } catch (error) {
    console.error("Error fetching docentes:", error);
    throw error;
  }
}

export async function createDocente(docente: DocenteRequest) : Promise<DocenteResponse> {
  try {
    const response = await apiClient.post<DocenteResponse>("/docente", docente);
    return response.data;
  } catch (error) {
    console.error("Error creating docente:", error);
    throw error;
  }
}

export async function createRestriccionDocente(
  restriccion: RestriccionRequest, 
  onSuccess?: () => void
): Promise<RegistroRestriccionResponse> {
  try {
    const formattedRestriccion = {
      ...restriccion,
      horaInicio: restriccion.horaInicio.substring(0, 5),
      horaFin: restriccion.horaFin.substring(0, 5),
    };

    const response = await apiClient.post<RegistroRestriccionResponse>("/restriccion-docente", formattedRestriccion);
    
    // Ejecutar callback si existe
    if (onSuccess) {
      onSuccess();
    }
    
    return response.data;
  } catch (error) {
    console.error("Error creating docente restriccion:", error);
    throw error;
  }
}

// Interfaz para actualización parcial
export interface DocenteUpdateRequest {
  nombre?: string;
  horasContratadas?: number;
  horasMaximasPorDia?: number;
}

// Método modificado para actualización parcial sin unidades
export async function updateDocente(id: UUID, docenteUpdate: DocenteUpdateRequest) : Promise<DocenteResponse> {
  try {
    const response = await apiClient.patch<DocenteResponse>(`/docente/${id}`, docenteUpdate);
    return response.data;
  } catch (error) {
    console.error("Error updating docente:", error);
    throw error;
  }
}

export async function deleteDocente(id: UUID): Promise<{ success: boolean; message?: string; data?: any; status?: number }> {
  try {
    const response = await apiClient.delete(`/docente/${id}`);
    return {
      success: true,
      data: response.data,
      message: 'Docente eliminado correctamente',
      status: response.status
    };
  } catch (error: any) {
    console.error("Error deleting docente:", error);
    
    // Extraer información detallada del error de la API
    const status = error.response?.status;
    const errorData = error.response?.data || {};
    
    // Construir mensaje de error según el tipo de error
    let errorMessage = errorData.message || errorData.error || error.message || 'Error desconocido al eliminar el docente';
    
    // Mensajes más amigables según el tipo de error
    if (status === 409) {
      errorMessage = "No se puede eliminar el docente porque tiene restricciones o asignaciones asociadas.";
      
      // Si la API proporciona un mensaje específico, usarlo
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } else if (status === 404) {
      errorMessage = "El docente que intenta eliminar no existe o ya fue eliminado.";
    } else if (status === 403) {
      errorMessage = "No tiene permisos para eliminar este docente.";
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

//metodo para registrar una restriccion del docente en batch
export async function createRestriccionDocenteBatch(
  restricciones: RestriccionRequest[]
): Promise<{success: boolean; message: string}>  {
  try {
    const formattedRestricciones = restricciones.map(restriccion => ({
      ...restriccion,
      horaInicio: restriccion.horaInicio.substring(0, 5),
      horaFin: restriccion.horaFin.substring(0, 5),
    }));

    // Ajustamos el tipo de respuesta para que coincida con RegistroResponse
    const response = await apiClient.post<{success: boolean; message: string}>("/restriccion-docente/batch", formattedRestricciones);
    
    // Devolvemos directamente el objeto de la respuesta
    return {
      success: response.data.success, // Corregido "succes" a "success"
      message: response.data.message || "Restricciones creadas correctamente",
    };
  } catch (error: any) {
    console.error("Error creating docente restriccion batch:", error);
    // Capturamos los mensajes de error del backend si existen
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || "Error al crear las restricciones"
      };
    }
    // Error genérico si no podemos obtener detalles
    throw error;
  }
}

