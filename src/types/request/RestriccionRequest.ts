import { DiaSemana } from "../DiaSemana";
import { TipoRestriccion } from "../TipoRestriccion";
import type { UUID } from "node:crypto";

export type RestriccionRequest = {
    diaSemana: DiaSemana; // Formato "LUNES", "MARTES", etc.
    horaInicio: string; // Formato HH:MM:SS
    horaFin: string;    // Formato HH:MM:SS
    tipoRestriccion: TipoRestriccion;
    docenteId: UUID 
}