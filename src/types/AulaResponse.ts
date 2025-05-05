import { UUID } from "crypto";

export type Aula = {
    id: UUID;
    nombre: string;
    capacidad: number;
    tipo: string;
}