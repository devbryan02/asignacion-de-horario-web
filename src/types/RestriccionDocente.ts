import { UUID } from "crypto";
import { DiaSemana } from "./DiaSemana";
import { TipoRestriccion } from "./TipoRestriccion";

export interface RestriccionDocente {
    id: UUID;
    diaSemana: DiaSemana;
    horaInicio: string; // Formato HH:MM:SS
    horaFin: string;    // Formato HH:MM:SS
    tipoRestriccion: TipoRestriccion;
  }