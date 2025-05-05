import { UUID } from "crypto";

export type RestriccionResponse = {
    id: UUID;
    docente: string;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    tipoRestriccion: string;
    };