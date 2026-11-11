import type { UUID } from "node:crypto";

export interface DocenteRequest {
    id: UUID;
    nombre: string;
    horasContratadas: number;
    horasMaximasPorDia: number;
    unidadesIds: string[];
  }