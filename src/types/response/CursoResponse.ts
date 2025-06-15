import { UUID } from "crypto"

export type CursoResponse = {
    id: UUID,
    nombre: string,
    horasSemanales: number,
    tipo: string,
    unidadesAcademicasCount: number,
}