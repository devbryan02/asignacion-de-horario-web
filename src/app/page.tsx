import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-white to-red-600 flex flex-col items-center justify-center p-8">
        <div className="backdrop-blur-lg bg-white/30 p-10 rounded-2xl shadow-xl border border-white/20 max-w-3xl w-full transition-all hover:shadow-2xl">
          <div className="flex flex-col items-center gap-8">
            {/* Logo y Nombre */}
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-blue-600 to-red-500 mb-2">
                ELP
              </h1>
              <p className="text-xl text-slate-800 font-medium">
                Escuela Superior La Pontificia
              </p>
            </div>
            
            {/* Línea decorativa */}
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 via-blue-500 to-red-400 rounded-full"></div>
            
            {/* Mensaje de bienvenida */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">Sistema de Asignación de Horarios</h2>
              <p className="text-slate-700 mt-2">
                Bienvenido a la plataforma de administración y consulta de horarios académicos
              </p>
            </div>
            
            {/* Botón */}
            <Link 
              href="/dashboard" 
              className="btn btn-lg bg-gradient-to-r from-yellow-400 via-blue-500 to-red-400 border-none text-white hover:brightness-110 hover:scale-105 transition-all shadow-md"
            >
              Acceder al Dashboard
            </Link>
          </div>
        </div>
        
        {/* Círculos decorativos */}
        <div className="fixed top-20 left-20 w-36 h-36 rounded-full bg-yellow-400/30 blur-3xl -z-10"></div>
        <div className="fixed bottom-20 right-20 w-48 h-48 rounded-full bg-blue-600/20 blur-3xl -z-10"></div>
        <div className="fixed bottom-40 left-40 w-24 h-24 rounded-full bg-red-500/20 blur-3xl -z-10"></div>
        
        {/* Footer */}
        <div className="absolute bottom-4 text-xs text-slate-600">
          © 2025 Escuela Superior La Pontificia
        </div>
      </div>
    </>
  );
}