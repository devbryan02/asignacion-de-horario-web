import React from "react";
import { School, Users, CalendarClock, Book, Layers, Clock4, Settings, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-base-200 text-base-content">
      {/* Sidebar */}
      <aside className="w-64 bg-base-100 border border-gray-300 p-4 flex flex-col justify-between">
        <div>
          <div className="text-xl font-bold mb-8 flex items-center gap-2">
            <CalendarClock className="w-6 h-6" />
            PONTIFICIA
          </div>

          <nav className="space-y-2">
            <div className="text-sm font-semibold text-gray-500">Principal</div>
            <ul className="space-y-1">
              <li className="flex items-center gap-2 p-2 rounded hover:bg-base-300 cursor-pointer">
                <Link href="/dashboard" className="flex items-center gap-2 w-full">
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded hover:bg-base-300 cursor-pointer">
                <Link href="/dashboard/aulas" className="flex items-center gap-2 w-full">
                  <School className="w-5 h-5" />
                  <span>Aulas</span>
                </Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded hover:bg-base-300 cursor-pointer">
                <Link href="/dashboard/docentes" className="flex items-center gap-2 w-full">
                  <Users className="w-5 h-5" />
                  <span>Docentes</span>
                </Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded hover:bg-base-300 cursor-pointer">
                <Link href="/dashboard/restricciones" className="flex items-center gap-2 w-full">
                  <Settings className="w-5 h-5" />
                  <span>Restricciones</span>
                </Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded hover:bg-base-300 cursor-pointer">
                <Link href="/dashboard/unidades-academicas" className="flex items-center gap-2 w-full">
                  <Book className="w-5 h-5" />
                  <span>Unidades Académicas</span>
                </Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded hover:bg-base-300 cursor-pointer">
                <Link href="/dashboard/cursos" className="flex items-center gap-2 w-full">
                  <Layers className="w-5 h-5" />
                  <span>Cursos</span>
                </Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded hover:bg-base-300 cursor-pointer">
                <Link href="/dashboard/secciones" className="flex items-center gap-2 w-full">
                  <CalendarClock className="w-5 h-5" />
                  <span>Secciones</span>
                </Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded hover:bg-base-300 cursor-pointer">
                <Link href="/dashboard/bloques-de-horario" className="flex items-center gap-2 w-full">
                  <Clock4 className="w-5 h-5" />
                  <span>Bloques de Horario</span>
                </Link>
              </li>
            </ul>

            <div className="mt-6 text-sm font-semibold text-gray-500">Horarios</div>
            <ul className="space-y-1">
              <li className="flex items-center gap-2 p-2 rounded hover:bg-base-300 cursor-pointer">
                <Link href="/dashboard/generador" className="flex items-center gap-2 w-full">
                  <CalendarClock className="w-5 h-5" />
                  <span>Generador</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Footer user info */}
        <div className="flex items-center gap-2 p-2 rounded bg-base-300">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-8">
              <span>A</span>
            </div>
          </div>
          <div className="text-sm">
            <div className="font-medium">Admin</div>
            <div className="text-xs text-gray-500">Universidad</div>
          </div>
        </div>
      </aside>

      {/* Main content - children will be rendered here */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}