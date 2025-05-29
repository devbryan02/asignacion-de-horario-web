"use client";

import { useEffect } from "react";
import { usePeriodoAcademico } from "../hooks/usePeriodo";
import { PeriodoAcademicoDataTable } from "./DataTable";

export const PeriodoAcademicoContent: React.FC = () => {
  const { fetchPeriodos } = usePeriodoAcademico();

  useEffect(() => {
    fetchPeriodos();
  }, [fetchPeriodos]);

  return (
    <>
      <div className="bg-base-100 border border-base-300 rounded-xl shadow-sm overflow-hidden p-6">
        <PeriodoAcademicoDataTable />
      </div>

    </>
  );
};