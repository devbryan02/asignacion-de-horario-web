import apiClient from "@/lib/axios";
import { UnidadAcademica } from "@/types/UnidadAcademica";

export async function fetchUnidadAcademica() : Promise<UnidadAcademica[]>{
  try {
    const response = await apiClient.get<UnidadAcademica[]>("/unidad-academica");
    return response.data;
  } catch (error) {
    console.error("Error fetching Unidad Academica:", error);
    throw error;
  }
}