import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const DashboardPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-md text-base-content mb-6">
        Bienvenido al Sistema de Gestión de Horarios de la 
        <span className="badge badge-info badge-sm mx-1">Pontificia</span>
        Aquí podrás gestionar y visualizar toda la información relacionada con los horarios académicos, aulas, docentes y más.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-neutral">Aulas</div>
            <div className="text-2xl font-bold">24</div>
            <div className="text-xs text-green-500">+2 desde el último periodo</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-nuetral">Docentes</div>
            <div className="text-2xl font-bold">48</div>
            <div className="text-xs text-green-500">+5 desde el último periodo</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-nuetral">Cursos</div>
            <div className="text-2xl font-bold">120</div>
            <div className="text-xs text-green-500">+12 desde el último periodo</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-nuetral">Secciones</div>
            <div className="text-2xl font-bold">210</div>
            <div className="text-xs text-green-500">+18 desde el último periodo</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardPage;