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
      {/* Sidebar con estilo corporativo moderno */}
      <aside className="w-64 bg-base-100 border-r border-base-300 shadow-sm flex flex-col justify-between">
        <div>
          {/* Logo mejorado */}
          <div className="px-4 pt-5 pb-4 border-b border-base-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold tracking-wide">PONTIFICIA</div>
                <div className="text-xs text-base-content/60">Sistema de Horarios</div>
              </div>
            </div>
          </div>

          {/* Navegación mejorada */}
          <nav className="px-3 py-4">
            <div className="text-xs font-medium uppercase tracking-wider text-base-content/50 px-2 mb-2">Principal</div>
            <ul className="space-y-0.5">
              <li>
                <Link href="/dashboard" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 text-base-content/80 hover:text-primary transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center text-base-content/60">
                    <LayoutDashboard className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-medium text-sm">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/aulas" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 text-base-content/80 hover:text-primary transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center text-base-content/60">
                    <School className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-medium text-sm">Aulas</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/docentes" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 text-base-content/80 hover:text-primary transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center text-base-content/60">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-medium text-sm">Docentes</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/restricciones" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 text-base-content/80 hover:text-primary transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center text-base-content/60">
                    <Settings className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-medium text-sm">Restricciones</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/unidades-academicas" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 text-base-content/80 hover:text-primary transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center text-base-content/60">
                    <Book className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-medium text-sm">Unidades Académicas</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/cursos" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 text-base-content/80 hover:text-primary transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center text-base-content/60">
                    <Layers className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-medium text-sm">Cursos</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/secciones" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 text-base-content/80 hover:text-primary transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center text-base-content/60">
                    <CalendarClock className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-medium text-sm">Secciones</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/bloques-de-horario" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 text-base-content/80 hover:text-primary transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center text-base-content/60">
                    <Clock4 className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-medium text-sm">Bloques de Horario</span>
                </Link>
              </li>
            </ul>

            <div className="text-xs font-medium uppercase tracking-wider text-base-content/50 px-2 mb-2 mt-6">Horarios</div>
            <ul className="space-y-0.5">
              <li>
                <Link href="/dashboard/generador" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 text-base-content/80 hover:text-primary transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center text-base-content/60">
                    <CalendarClock className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-medium text-sm">Generador</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Footer user info mejorado */}
        <div className="px-4 pb-4 pt-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-base-200 hover:bg-base-300/70 transition-colors">
            <div className="avatar">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-medium border border-primary/20">
                <span>A</span>
              </div>
            </div>
            <div>
              <div className="font-medium text-sm">Admin</div>
              <div className="text-xs text-base-content/60">Universidad</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content - children will be rendered here */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}