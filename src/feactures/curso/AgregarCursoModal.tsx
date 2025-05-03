"use client";

import { PlusCircle } from "lucide-react";

function AgregarCursoModal() {
    return (
        <>
            {/* Botón para abrir el modal */}
            <button
                className="btn btn-primary btn-sm"
                onClick={(e) => {
                    e.preventDefault(); // Prevenir comportamiento por defecto
                    const modal = document.getElementById('agregar_curso_modal') as HTMLDialogElement | null;
                    if (modal) {
                        modal.showModal();
                    }
                    // Asegurarnos de que el body no cambie sus dimensiones
                    document.body.style.overflow = 'hidden';
                    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
                }}
            >
                <PlusCircle size={16} className="mr-1" />
                Agregar Curso
            </button>

            {/* Modal de DaisyUI */}
            <dialog id="agregar_curso_modal" className="modal"
                onClose={() => {
                    // Restaurar el scroll cuando el modal se cierra
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                }}
            >
                <div className="modal-box w-11/12 max-w-3xl">
                    <h3 className="font-bold text-lg">Agregar Nuevo Curso</h3>
                    <p className="py-4">Complete la información del nuevo curso</p>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {/* Nombre del curso */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Nombre del curso</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ingrese el nombre"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        {/* Horas semanales */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Horas semanales</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Ingrese las horas"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        {/* Tipo */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Tipo</span>
                            </label>
                            <select className="select select-bordered w-full" required defaultValue="">
                                <option value="" disabled>Seleccione tipo</option>
                                <option value="TEORIA">Teórico</option>
                                <option value="LABORATORIO">Práctico</option>
                                <option value="TEORICO-PRACTICO">Teórico-Práctico</option>
                            </select>
                        </div>

                        {/* Unidad Académica */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Unidad Académica</span>
                            </label>
                            <select className="select select-bordered w-full"
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>Seleccione tipo</option>
                                <option value="Ingenieria">Ingeniería</option>
                                <option value="Ciencias">Ciencias</option>
                                <option value="Humanidades">Humanidades</option>
                            </select>
                        </div>
                    </form>

                    <div className="modal-action">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                // Aquí iría la lógica para guardar el curso
                                console.log("Guardando curso...");
                                const modal = document.getElementById('agregar_curso_modal') as HTMLDialogElement | null;
                                if (modal) {
                                    modal.close();
                                }
                            }}
                        >
                            Guardar
                        </button>
                        <form method="dialog">
                            <button
                                className="btn"
                                onClick={() => {
                                    // Restaurar el scroll al cerrar
                                    document.body.style.overflow = '';
                                    document.body.style.paddingRight = '';
                                }}
                            >
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>

                {/* Backdrop para cerrar el modal al hacer clic fuera */}
                <form method="dialog" className="modal-backdrop">
                    <button
                        onClick={() => {
                            // Restaurar el scroll al cerrar con clic fuera
                            document.body.style.overflow = '';
                            document.body.style.paddingRight = '';
                        }}
                    >
                        cerrar
                    </button>
                </form>
            </dialog>
        </>
    );
}

export default AgregarCursoModal;