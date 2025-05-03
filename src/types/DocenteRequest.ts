import { UUID } from "crypto";

export interface DocenteRequest {
    id: UUID;
    nombre: string;
    horasContratadas: number;
    horasMaximasPorDia: number;
    unidadesIds: string[];
  }