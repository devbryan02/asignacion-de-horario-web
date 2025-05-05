import apiClient from "@/lib/axios";
import { Docente } from "@/types/response/DocenteResponse";
import { RestriccionRequest } from "@/types/request/RestriccionRequest";
import { RegistroRestriccionResponse } from "@/types/response/RegistroRestriccionResponse";
import { UUID } from "crypto";

export async function fetchDocentes() : Promise<Docente[]> {
  try {
    const response = await apiClient.get<Docente[]>("/docente");
    return response.data;
  } catch (error) {
    console.error("Error fetching docentes:", error);
    throw error;
  }
}

export async function createDocente(docente: Docente) : Promise<Docente> {
  try {
    const response = await apiClient.post<Docente>("/docente", docente);
    return response.data;
  } catch (error) {
    console.error("Error creating docente:", error);
    throw error;
  }
}

export async function createRestriccionDocente(restriccion: RestriccionRequest): Promise<RegistroRestriccionResponse> {
  try {
    const formattedRestriccion = {
      ...restriccion,
      horaInicio: restriccion.horaInicio.substring(0, 5),
      horaFin: restriccion.horaFin.substring(0, 5),
    };

    const response = await apiClient.post<RegistroRestriccionResponse>("/restriccion-docente", formattedRestriccion);

    // Ya no lanzamos error aquí
    return response.data;
  } catch (error) {
    console.error("Error creating docente restriccion:", error);
    throw error; // Este sí sigue por si falla la request completamente
  }
}

