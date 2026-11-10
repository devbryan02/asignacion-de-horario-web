import { RestriccionDocente } from "../RestriccionDocente";
import type { UUID } from "node:crypto";

// Interfaz principal para el docente
export interface DocenteResponse {
    id: UUID;
    nombre: string;
    horasContratadas: number;
    horasMaximasPorDia: number;
    restricciones: RestriccionDocente[];
  }