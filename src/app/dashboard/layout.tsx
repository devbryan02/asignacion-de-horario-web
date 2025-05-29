"use client";

import React, { useState } from "react";
import {
  School,
  Users,
  CalendarClock,
  Layers,
  Clock4,
  Settings,
  LayoutDashboard,
  Menu,
  X,
  Brain,
  CalendarRange
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-base-200 text-base-content">
      {/* Overlay para cerrar el sidebar en móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar adaptable */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-full z-40 transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } w-64 bg-base-100 border-r border-base-300 shadow-sm flex flex-col`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header del sidebar con botón de cerrar en móvil */}
          <div className="px-4 pt-5 pb-4 border-b border-base-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold tracking-wide">PONTIFICIA</div>
                <div className="text-xs text-base-content/60">
                  Sistema de Horarios
                </div>
              </div>
            </div>
            <button 
              className="p-1 rounded-md text-base-content/60 hover:text-base-content lg:hidden"
              onClick={toggleSidebar}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navegación */}
          <nav className="px-3 py-4 flex-1">
            <div className="text-xs font-medium uppercase tracking-wider text-base-content/50 px-2 mb-2">
              Principal
            </div>
            <ul className="space-y-0.5">
              {[
                { href: "/dashboard", icon: <LayoutDashboard className="w-4.5 h-4.5" />, label: "Dashboard" },
                { href: "/dashboard/periodo-academico", icon: <CalendarRange className="w-4.5 h-4.5" />, label: "Periodos" },
                { href: "/dashboard/aulas", icon: <School className="w-4.5 h-4.5" />, label: "Aulas" },
                { href: "/dashboard/docentes", icon: <Users className="w-4.5 h-4.5" />, label: "Docentes" },
                { href: "/dashboard/restricciones", icon: <Settings className="w-4.5 h-4.5" />, label: "Restricciones" },
                { href: "/dashboard/secciones", icon: <CalendarClock className="w-4.5 h-4.5" />, label: "Secciones" },
                { href: "/dashboard/cursos", icon: <Layers className="w-4.5 h-4.5" />, label: "Cursos" },
                { href: "/dashboard/bloques-de-horario", icon: <Clock4 className="w-4.5 h-4.5" />, label: "Bloques" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-primary/5 text-base-content/80 hover:text-primary"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className={`w-5 h-5 flex items-center justify-center ${
                      isActive(item.href) ? "text-primary" : "text-base-content/60"
                    }`}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-sm flex-1">{item.label}</span>
                    {isActive(item.href) && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="text-xs font-medium uppercase tracking-wider text-base-content/50 px-2 mb-2 mt-6">
              Horarios
            </div>
            <ul className="space-y-0.5">
              {[
                { href: "/dashboard/generar-horario", icon: <Brain className="w-4.5 h-4.5" />, label: "Generar Horario" },
                { href: "/dashboard/visualizar", icon: <CalendarClock className="w-4.5 h-4.5" />, label: "Ver Horario " },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-primary/5 text-base-content/80 hover:text-primary"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className={`w-5 h-5 flex items-center justify-center ${
                      isActive(item.href) ? "text-primary" : "text-base-content/60"
                    }`}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive(item.href) && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="px-4 pb-4 pt-2 border-t border-base-200">
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
        </div>
      </aside>

      {/* Contenedor para header móvil y contenido principal */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header móvil */}
        <header className="lg:hidden bg-base-100 border-b border-base-300 p-3 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold tracking-wide">PONTIFICIA</div>
                <div className="text-xs text-base-content/60">
                  Sistema de Horarios
                </div>
              </div>
            </div>
            <button 
              className="p-1.5 rounded-md bg-base-200 hover:bg-base-300 text-base-content"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-4 overflow-auto">
          {children}
        </main>
      </div>

      {/* Botón flotante para abrir sidebar (solo visible en móvil cuando está cerrado) */}
      {!sidebarOpen && (
        <button 
          className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-primary text-white shadow-lg z-20 flex items-center justify-center lg:hidden"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}