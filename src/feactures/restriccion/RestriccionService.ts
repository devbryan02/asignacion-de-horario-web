import apiClient from "@/lib/axios";
import { RestriccionResponse } from "@/types/RestriccionResponse";
import { UUID } from "crypto";

export async function fetchRestriccionByDocente(docenteId: UUID): Promise<RestriccionResponse[]> {
    try {
        const response = await apiClient.get<RestriccionResponse[]>(`/restriccion-docente/docente/${docenteId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching restriccion by docente:", error);
        throw error;
    }
}