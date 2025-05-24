import apiClient from "@/lib/axios";

// Tipo para la respuesta de generación de horario
export interface GenerarHorarioResponse {
  mensaje: string;
  cantidadAsignaciones: number;
  cantidadAulasUsadas: number;
  cantidadBloquesUsados: number;
  cantidadDocentesAsignados: number;
  calidadGeneracion: string;
  mensajeEvaluacion: string;
}

// Interfaz de respuesta para operaciones
export interface ServiceResponse {
  success: boolean;
  message?: string;
  data?: any;
  status?: number;
}


/**
 * Resuelve la generación de un horario utilizando el algoritmo optimizado
 * @returns Información sobre el horario generado
 */
export const resolverHorario = async (): Promise<ServiceResponse> => {
  try {
    const response = await apiClient.post<GenerarHorarioResponse>("/horario/resolver");
    
    return {
      success: true,
      message: response.data.mensaje,
      data: response.data,
      status: response.status
    };
  } catch (error: any) {
    console.error("Error solving schedule:", error);
    
    // Extraer información detallada del error de la API
    const status = error.response?.status;
    const errorData = error.response?.data || {};
    
    // Construir mensaje de error según el tipo de error
    let errorMessage = errorData.message || 
                      errorData.error || 
                      error.message || 
                      'Error desconocido al resolver el horario';
    
    // Mensajes más amigables según el tipo de error
    if (status === 409) {
      errorMessage = "Hay conflictos que impiden generar el horario. Verifique las restricciones.";
    } else if (status === 404) {
      errorMessage = "No se encontraron datos suficientes para generar el horario.";
    } else if (status === 403) {
      errorMessage = "No tiene permisos para generar horarios.";
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
