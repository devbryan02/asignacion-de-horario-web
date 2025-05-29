import apiClient from "@/lib/axios";
import { PeriodoAcademico, PeriodoRequest, RegistroResponse } from "./types";

// Existing fetch method
export const fetchPeriodosAcademicos = async (): Promise<PeriodoAcademico[]> => {
  try {
    const response = await apiClient.get<PeriodoAcademico[]>('/periodo-academico');
    console.log('Periodos fetched:', response.data); // Añadir log para depuración
    return response.data;
  } catch (error) {
    console.error("Error fetching periodo academico:", error);
    throw error;
  }
}

// Create a new academic period
export const createPeriodoAcademico = async (periodoData: PeriodoRequest): Promise<RegistroResponse> => {
  try {
    const response = await apiClient.post<RegistroResponse>('/periodo-academico', periodoData);
    return response.data;
  } catch (error) {
    console.error("Error creating periodo academico:", error);
    throw error;
  }
}

// Update an existing academic period
export const updatePeriodoAcademico = async (id: string, periodoData: PeriodoRequest): Promise<RegistroResponse> => {
  try {
    const response = await apiClient.patch<RegistroResponse>(`/periodo-academico/${id}`, periodoData);
    return response.data;
  } catch (error) {
    console.error("Error updating periodo academico:", error);
    throw error;
  }
}

// Delete an existing academic period
export const deletePeriodoAcademico = async (id: string): Promise<string> => {
  try {
    const response = await apiClient.delete<string>(`/periodo-academico/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting periodo academico:", error);
    throw error;
  }
}