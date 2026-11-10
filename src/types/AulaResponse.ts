import type { UUID } from "node:crypto";

export type Aula = {
    id: UUID;
    nombre: string;
    capacidad: number;
    tipo: string;
}