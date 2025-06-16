"use client";

import React, { useState } from "react";
import {
  CalendarClock,
  Clock4,
  Settings,
  LayoutDashboard,
  Menu,
  X,
  Brain,
  CalendarRange,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Boxes,
  GraduationCap,
  Building2,
  Palette
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Estructura de los menús organizados por grupos
const menuGroups = [
  {
    title: "General",
    items: [
      { href: "/dashboard", icon: <LayoutDashboard size={16} />, label: "Dashboard" },
      { href: "/dashboard/periodo-academico", icon: <CalendarRange size={16} />, label: "Periodos" },
      { href: "/dashboard/unidades-academicas", icon: <Building2 size={16} />, label: "Unidades" },
    ]
  },
  {
    title: "Académico",
    items: [
      { href: "/dashboard/secciones", icon: <Boxes size={16} />, label: "Secciones" },
      { href: "/dashboard/cursos", icon: <BookOpen size={16} />, label: "Cursos" },
      { href: "/dashboard/docentes", icon: <GraduationCap size={16} />, label: "Docentes" },
    ]
  },
  {
    title: "Infraestructura",
    items: [
      { href: "/dashboard/aulas", icon: <Building2 size={16} />, label: "Aulas" },
      { href: "/dashboard/bloques-de-horario", icon: <Clock4 size={16} />, label: "Bloques" },
    ]
  },
  {
    title: "Gestión",
    items: [
      { href: "/dashboard/generar-horario", icon: <Brain size={16} />, label: "Generar Horario" },
      { href: "/dashboard/visualizar", icon: <CalendarClock size={16} />, label: "Ver Horario" },
      { href: "/dashboard/restricciones", icon: <Settings size={16} />, label: "Restricciones" },
    ]
  },
  {
    title: "Personalización",
    items: [
      { href: "/dashboard/personalizacion", icon: <Palette size={16} />, label: "Personalizar" },
    ]
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleGroup = (groupTitle: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  };

  return (
    <div className="flex h-screen bg-base-200 text-base-content overflow-hidden">
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
        } w-60 bg-base-100 border-r border-base-300 shadow-sm flex flex-col`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header del sidebar con botón de cerrar en móvil */}
          <div className="px-3 py-3.5 border-b border-base-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary/15 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                <CalendarClock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold tracking-wide">PONTIFICIA</div>
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

          {/* Navegación organizada por grupos */}
          <nav className="px-2 py-2 flex-1 overflow-y-auto scrollbar-hide">
            {menuGroups.map((group, index) => (
              <div key={group.title} className="mb-2">
                <button 
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between text-xs font-medium uppercase tracking-wider text-base-content/60 px-2 py-1.5 hover:text-base-content/80"
                >
                  <span>{group.title}</span>
                  {collapsedGroups[group.title] ? 
                    <ChevronRight size={14} /> : 
                    <ChevronDown size={14} />
                  }
                </button>
                
                {!collapsedGroups[group.title] && (
                  <ul className="space-y-0.5 mt-1 mb-1">
                    {group.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`flex items-center gap-2.5 p-2 rounded-md transition-colors ${
                              active
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-base-200 text-base-content/80 hover:text-primary"
                            }`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <div className={`w-4 h-4 flex items-center justify-center ${
                              active ? "text-primary" : "text-base-content/60"
                            }`}>
                              {item.icon}
                            </div>
                            <span className="font-medium text-xs flex-1">{item.label}</span>
                            {active && (
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
                
                {index < menuGroups.length - 1 && (
                  <div className="h-px bg-base-200 my-2"></div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer más compacto */}
        </div>
      </aside>

      {/* Contenedor para header móvil y contenido principal */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header móvil más compacto */}
        <header className="lg:hidden bg-base-100 border-b border-base-300 py-2 px-3 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/15 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                <CalendarClock className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-sm font-bold tracking-wide">PONTIFICIA</div>
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
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-3 md:p-4 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Botón flotante para abrir sidebar (más pequeño) */}
      {!sidebarOpen && (
        <button 
          className="fixed bottom-4 right-4 w-10 h-10 rounded-full bg-primary text-white shadow-lg z-20 flex items-center justify-center lg:hidden"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}