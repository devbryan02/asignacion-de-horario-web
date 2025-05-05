import apiClient from "@/lib/axios";
import { SeccionResponse } from "@/types/response/SeccionResponse";

export async function fetchSeccionAcademica() : Promise<SeccionResponse[]>{
  try {
    const response = await apiClient.get<SeccionResponse[]>("/seccion-academica");
    return response.data;
  } catch (error) {
    console.error("Error fetching periodo academico:", error);
    throw error;
  }
}