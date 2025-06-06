import { UUID } from "crypto";

export type SeccionRequest = {
    nombre: string;
    periodoAcademicoId: UUID
}

export type SeccionResponse = {
    id: UUID,
    nombre: string,
    periodoAcademico: string,
    fechaInicio: string,
    fechaFin: string,
}
