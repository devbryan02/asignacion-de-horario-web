import apiClient from "@/lib/axios";
import { BloqueHorario, BloqueHorarioRequest, BloqueHorarioResponse } from "./types";
import { UUID } from "crypto";


export async function getBloquesHorario(): Promise<BloqueHorario[]> {
    try {
        const response = await apiClient.get<BloqueHorario[]>('/bloque-horario');
        return response.data;
    } catch (error: any) {
        // Handle error appropriately, possibly rethrow or log
        if (error.response && error.response.data) {
            // Capture API error message if available
            const errorMessage = error.response.data.message || "Error from API";
            console.error("API Error:", errorMessage);
            throw new Error(errorMessage);
        } else if (error instanceof Error) {
            console.error("Error fetching bloques horario:", error.message);
            throw error;
        } else {
            console.error("Unexpected error fetching bloques horario:", error);
            throw new Error("Unexpected error fetching bloques horario");
        }
    }
}

export async function getBloqueHorarioById(id: UUID): Promise<BloqueHorario> {
    try {
        const response = await apiClient.get<BloqueHorario>(`/bloque-horario/${id}`);
        return response.data;
    } catch (error: any) {
        // Handle error appropriately, possibly rethrow or log
        if (error.response && error.response.data) {
            // Capture API error message if available
            const errorMessage = error.response.data.message || "Error from API";
            console.error("API Error:", errorMessage);
            throw new Error(errorMessage);
        } else if (error instanceof Error) {
            console.error("Error fetching bloque horario by ID:", error.message);
            throw error;
        } else {
            console.error("Unexpected error fetching bloque horario by ID:", error);
            throw new Error("Unexpected error fetching bloque horario by ID");
        }
    }
}

export async function createBloqueHorario(request: BloqueHorarioRequest): Promise<BloqueHorarioResponse> {
    try {
        const response = await apiClient.post<BloqueHorarioResponse>('/bloque-horario', request);
        return {
            success: response.data.success,
            message: response.data.message
        }
    } catch (error: any) {
        // Handle error appropriately, possibly rethrow or log
        if (error.response && error.response.data) {
            // Capture API error message if available
            const errorMessage = error.response.data.message || "Error from API";
            console.error("API Error:", errorMessage);
            return {
                success: false,
                message: errorMessage
            }
        } else if (error instanceof Error) {
            console.error("Error creating bloque horario:", error.message);
            return {
                success: false,
                message: error.message
            }
        } else {
            console.error("Unexpected error creating bloque horario:", error);
            return {
                success: false,
                message: "Unexpected error creating bloque horario"
            }
        }
    }
}

export async function updateBloqueHorario(id: UUID, request: BloqueHorarioRequest): Promise<BloqueHorarioResponse> {
    try {
        const response = await apiClient.patch<BloqueHorarioResponse>(`/bloque-horario/${id}`, request);
        return {
            success: response.data.success,
            message: response.data.message
        }
    } catch (error: any) {
        // Handle error appropriately, possibly rethrow or log
        if (error.response && error.response.data) {
            // Capture API error message if available
            const errorMessage = error.response.data.message || "Error from API";
            console.error("API Error:", errorMessage);
            return {
                success: false,
                message: errorMessage
            }
        } else if (error instanceof Error) {
            console.error("Error updating bloque horario:", error.message);
            return {
                success: false,
                message: error.message
            }
        } else {
            console.error("Unexpected error updating bloque horario:", error);
            return {
                success: false,
                message: "Unexpected error updating bloque horario"
            }
        }
    }
}

export async function deleteBloqueHorario(id: UUID): Promise<{message: string}> {
    try {
        const response = await apiClient.delete<BloqueHorarioResponse>(`/bloque-horario/${id}`);
        return {
            message: response.data.message
        }
    } catch (error: any) {
        // Handle error appropriately, possibly rethrow or log
        if (error.response && error.response.data) {
            // Capture API error message if available
            const errorMessage = error.response.data.message || "Error from API";
            console.error("API Error:", errorMessage);
            return {
                message: errorMessage
            }
        } else if (error instanceof Error) {
            console.error("Error deleting bloque horario:", error.message);
            return {
                message: error.message
            }
        } else {
            console.error("Unexpected error deleting bloque horario:", error);
            return {
                message: "Unexpected error deleting bloque horario"
            }
        }
    }
}