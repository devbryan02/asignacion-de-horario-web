import CursoDataTable from "@/feactures/curso/CursoDataTable";
import { fetchCursos } from "@/feactures/curso/CursoService";
import { Aula } from "@/types/Aula";
import { Curso } from "@/types/Curso";

async function CursoPage() {
    let cursos: Curso[] = [];

    try {
        cursos = await fetchCursos();
    } catch (error) {
        console.error("Error fetching cursos:", error);
        return <div>Error al cargar los cursos.</div>;
    }

    if (!cursos || cursos.length === 0) {
        return <div>No hay cursos disponibles.</div>;
    }

    return (
        <CursoDataTable cursos={cursos} />
    );
}

export default CursoPage;