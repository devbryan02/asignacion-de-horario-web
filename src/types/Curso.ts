import { UUID } from "crypto"

export type Curso = {
    id: UUID,
    nombre: string,
    horasSemanales: number,
    tipo: string,
    unidadAcademica: string,
}