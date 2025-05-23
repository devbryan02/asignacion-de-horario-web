import { UUID } from "crypto";
import { RestriccionDocente } from "../RestriccionDocente";

// Interfaz principal para el docente
export interface DocenteResponse {
    id: UUID;
    nombre: string;
    horasContratadas: number;
    horasMaximasPorDia: number;
    restricciones: RestriccionDocente[];
  }