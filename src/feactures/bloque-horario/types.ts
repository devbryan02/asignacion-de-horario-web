import type { UUID } from "node:crypto";

export type BloqueHorarioRequest = {
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    turno: string;
}

export type BloqueHorario = {
    id: UUID;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    turno: string;
}

export type BloqueHorarioResponse = {
    success: boolean;
    message: string;
}