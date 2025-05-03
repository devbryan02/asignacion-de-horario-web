import CursoDataTable from "@/feactures/curso/CursoDataTable";
import { fetchCursos } from "@/feactures/curso/CursoService";

async function CursoPage() {
    let cursos = [];

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
        <div className="w-full">
            <CursoDataTable cursos={cursos} />
        </div>
    );
}

export default CursoPage;