"use client";
import { useState, useEffect } from 'react';

function PersonalizacionPage() {
    const [tema, setTema] = useState('light');

    // Temas disponibles en Daisy UI
    const temas = [
        "light",
        "dark",
        "bumblebee",
        "emerald",
        "corporate",
        "forest",
        "dracula",
        "business",
        "dim"
    ];

    // Información de cada tema para mostrar colores de previsualización
    const temasInfo = {
        light: { nombre: "Light", descripcion: "Tema claro clásico" },
        dark: { nombre: "Dark", descripcion: "Modo oscuro elegante" },
        bumblebee: { nombre: "Bumblebee", descripcion: "Amarillo y negro" },
        emerald: { nombre: "Emerald", descripcion: "Tonos verdes frescos" },
        corporate: { nombre: "Corporate", descripcion: "Profesional y limpio" },
        forest: { nombre: "Forest", descripcion: "Tonos naturales verdes" },
        dracula: { nombre: "Dracula", descripcion: "Oscuro con acentos morados" },
        business: { nombre: "Business", descripcion: "Formal y sobrio" },
        dim: { nombre: "Dim", descripcion: "Oscuro con bajo contraste" }
    };

    // Maneja el cambio de tema
    const cambiarTema = (nuevoTema: string) => {
        setTema(nuevoTema);
        document.documentElement.setAttribute('data-theme', nuevoTema);
        localStorage.setItem('tema', nuevoTema);
    };

    // Al cargar, verificar si hay un tema guardado
    useEffect(() => {
        const temaGuardado = localStorage.getItem('tema');
        if (temaGuardado) {
            setTema(temaGuardado);
            document.documentElement.setAttribute('data-theme', temaGuardado);
        } else {
            const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefiereOscuro) {
                cambiarTema('dark');
            }
        }
    }, []);

    return (
        <div className="container mx-auto bg-base-100 p-3 rounded-box">
            
            <div className="card overflow-hidden">
                <div className="card-body">
                    <h2 className="card-title font-medium">Selecciona un tema</h2>
                    <p className="text-base-content/70 text-sm mb-4">Personaliza la apariencia de la aplicación</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                        {temas.map((nombreTema) => (
                            <div 
                                key={nombreTema} 
                                onClick={() => cambiarTema(nombreTema)}
                                data-theme={nombreTema}
                                className={`card cursor-pointer transition-all hover:scale-105 bg-base-100 border ${tema === nombreTema ? 'border-primary ring-2 ring-primary/30' : 'border-base-300'}`}
                            >
                                <div className="card-body p-4">
                                    <h3 className="font-medium capitalize">{temasInfo[nombreTema as keyof typeof temasInfo]?.nombre || nombreTema}</h3>
                                    <p className="text-xs opacity-70">{temasInfo[nombreTema as keyof typeof temasInfo]?.descripcion}</p>
                                    <div className="flex gap-1 mt-2">
                                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                                        <div className="w-4 h-4 rounded-full bg-secondary"></div>
                                        <div className="w-4 h-4 rounded-full bg-accent"></div>
                                        <div className="w-4 h-4 rounded-full bg-neutral"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="divider my-8">Vista previa</div>

            <div className="card bg-base-100">
                <div className="card-body">
                    <h2 className="text-xl font-medium mb-4">Componentes con el tema actual</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium uppercase opacity-70">Botones</h3>
                            <div className="flex flex-wrap gap-2">
                                <button className="btn btn-primary">Primario</button>
                                <button className="btn btn-secondary">Secundario</button>
                                <button className="btn btn-accent">Acento</button>
                                <button className="btn btn-neutral">Neutral</button>
                                <button className="btn btn-ghost">Ghost</button>
                                <button className="btn btn-link">Link</button>
                            </div>
                            
                            <h3 className="text-sm font-medium uppercase opacity-70 mt-4">Variantes</h3>
                            <div className="flex flex-wrap gap-2">
                                <button className="btn btn-primary btn-outline">Outline</button>
                                <button className="btn btn-secondary btn-sm">Small</button>
                                <button className="btn btn-accent btn-lg">Large</button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium uppercase opacity-70">Elementos</h3>
                            
                            <div className="form-control">
                                <input type="text" placeholder="Escribe aquí" className="input input-bordered" />
                            </div>
                            
                            <div className="flex gap-2">
                                <span className="badge">Default</span>
                                <span className="badge badge-primary">Primary</span>
                                <span className="badge badge-secondary">Secondary</span>
                                <span className="badge badge-accent">Accent</span>
                            </div>
                            
                            <progress className="progress progress-primary w-full" value="40" max="100"></progress>
                            
                            <div className="flex gap-2 items-center">
                                <input type="checkbox" className="checkbox checkbox-primary" checked readOnly />
                                <input type="radio" className="radio radio-primary" checked readOnly />
                                <input type="checkbox" className="toggle toggle-primary" checked readOnly />
                            </div>
                            
                            <div className="alert alert-info">
                                <span>Información en alerta</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center text-sm opacity-70 mt-8">
                Tema actual: <span className="font-medium capitalize">{tema}</span>
            </div>
        </div>
    );
}

export default PersonalizacionPage;