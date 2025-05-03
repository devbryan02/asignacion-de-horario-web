"use client";

import { useState } from "react";
import { Aula } from "@/types/Aula";
import { Pencil } from "lucide-react";
import { EditAulaDialog } from "./EditAulaDialog";

type AulaCardProps = {
    aula: Aula;
    onEdit: (aula: Aula) => void;
};

function AulaCard({ aula, onEdit }: AulaCardProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    return (
        <div className="border p-4 rounded shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-semibold">{aula.nombre}</h2>
                    <p>Capacidad: {aula.capacidad}</p>
                    <p>Tipo: {aula.tipo}</p>
                </div>
                <button 
                    onClick={() => setIsEditDialogOpen(true)}
                    className="btn btn-sm btn-info"
                >
                    <Pencil size={16} />
                </button>
            </div>
            <EditAulaDialog
                aula={aula}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onSave={onEdit}
            />
        </div>
    );
}

export default AulaCard;