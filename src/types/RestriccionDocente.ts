import { DiaSemana } from "./DiaSemana";
import { TipoRestriccion } from "./TipoRestriccion";
import type { UUID } from "node:crypto";

export interface RestriccionDocente {
    id: UUID;
    diaSemana: DiaSemana;
    horaInicio: string; // Formato HH:MM:SS
    horaFin: string;    // Formato HH:MM:SS
    tipoRestriccion: TipoRestriccion;
  }