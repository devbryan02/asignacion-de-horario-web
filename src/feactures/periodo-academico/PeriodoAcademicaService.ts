import apiClient from "@/lib/axios";

export const fetchPeriodosAcademicos = async () => {
  try {
    const response = await apiClient.get('/periodo-academico');
    return response.data;
  } catch (error) {
    console.error("Error fetching periodo academico:", error);
    throw error;
  }
}