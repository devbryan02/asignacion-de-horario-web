import type { UUID } from "node:crypto";

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
