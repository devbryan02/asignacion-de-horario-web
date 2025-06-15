import { UUID } from "crypto";

export type CursoRequest = {
    nombre: string;
    horasSemanales: number;
    tipo: string;
    unidadesIds: string[];
}