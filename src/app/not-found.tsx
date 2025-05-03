import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-error mb-6">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
        <p className="text-gray-500 mb-8">Lo sentimos, la página que estás buscando no existe.</p>
        
        <Link href="/dashboard" className="btn btn-primary">
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}