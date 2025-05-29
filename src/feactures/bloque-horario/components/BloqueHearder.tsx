import { useState } from 'react';
import { PlusCircle, Clock, Calendar } from 'lucide-react';
import AgregarBloqueModal from './AgregarBloqueModal';

function BloqueHeader() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <div className="relative overflow-hidden rounded-box">
                {/* Fondo con gradiente sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-base-100 shadow-sm relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                            <div className="flex items-center gap-2">
                                <Clock className="w-6 h-6 text-primary" />
                                <Calendar className="w-6 h-6 text-secondary" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Bloques Horarios
                            </h1>
                            <p className="text-sm text-base-content/70">
                                Gestiona los horarios de clases
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setModalOpen(true)}
                        className="btn btn-primary btn-md md:btn-sm flex items-center gap-2 self-end md:self-auto shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-primary-focus border-none"
                    >
                        <PlusCircle className="w-5 h-5" /> 
                        <span>Agregar Bloque</span>
                    </button>
                </div>
            </div>

            <AgregarBloqueModal 
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    );
}

export default BloqueHeader;