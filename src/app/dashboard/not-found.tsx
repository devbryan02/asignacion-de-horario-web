import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-error mb-6">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Página del Dashboard no encontrada</h2>
        <p className="text-gray-500 mb-8">La sección que estás buscando no existe o ha sido movida.</p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard" className="btn btn-primary">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}