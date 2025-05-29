import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useBloques } from '../hooks/useBloques';

function BloqueFilters() {
    const { handleSearch, handleFilterByTurno, searchTerm, turnoFilter, availableTurnos } = useBloques();
    const [searchInput, setSearchInput] = useState(searchTerm);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Sincronizar el input local con el searchTerm del hook
    useEffect(() => {
        setSearchInput(searchTerm);
    }, [searchTerm]);

    // Manejar el cambio en el input de búsqueda
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    // Aplicar la búsqueda cuando el usuario deja de escribir
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== searchTerm) {
                handleSearch(searchInput);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput, handleSearch, searchTerm]);

    // Manejar el cambio de filtro de turno
    const handleTurnoChange = (turno: string) => {
        // Si el turno ya está seleccionado, lo deseleccionamos
        if (turnoFilter === turno) {
            handleFilterByTurno(null);
        } else {
            handleFilterByTurno(turno);
        }
    };

    return (
        <div className="bg-gradient-to-r from-base-100 to-base-200/30 p-5 rounded-lg shadow-md border border-base-300 mb-4 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Buscador */}
                <div className="form-control flex-1 relative">
                    <div className="input-group w-full">
                        <input 
                            type="text"
                            placeholder="Buscar por día o turno..."
                            className="input input-bordered w-full focus:input-primary bg-white/80 shadow-inner"
                            value={searchInput}
                            onChange={handleSearchChange}
                        />
                        {searchInput && (
                            <button 
                                className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => {
                                    setSearchInput('');
                                    handleSearch('');
                                }}
                            >
                                <X size={16} />
                            </button>
                        )}
                        <button className="btn btn-primary bg-gradient-to-r from-primary to-primary-focus border-0">
                            <Search className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Filtros por turno - Mobile */}
                <div className="md:hidden">
                    <button 
                        className="btn btn-outline w-full flex items-center justify-between gap-2 border-primary/30 hover:bg-primary/10"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <span className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-primary" />
                            Filtrar por turno
                        </span>
                        <span className="badge bg-gradient-to-r from-primary to-secondary text-white shadow-sm">
                            {turnoFilter ? '1' : '0'}
                        </span>
                    </button>
                    
                    {isFilterOpen && (
                        <div className="mt-2 p-4 border rounded-lg bg-base-100 shadow-xl animate-fadeIn">
                            <div className="space-y-3">
                                {availableTurnos.map(turno => (
                                    <div key={turno} className="form-control">
                                        <label className="label cursor-pointer justify-start gap-3">
                                            <input 
                                                type="checkbox"
                                                className="checkbox checkbox-primary checkbox-sm"
                                                checked={turnoFilter === turno}
                                                onChange={() => handleTurnoChange(turno)}
                                            />
                                            <span className="label-text font-medium">{turno}</span>
                                        </label>
                                    </div>
                                ))}
                                
                                {turnoFilter && (
                                    <button 
                                        className="btn btn-xs btn-ghost text-primary mt-3 w-full"
                                        onClick={() => handleFilterByTurno(null)}
                                    >
                                        Limpiar filtro
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Filtros por turno - Desktop */}
                <div className="hidden md:flex items-center gap-4">
                    <span className="text-sm font-medium flex items-center gap-2 text-primary">
                        <Filter className="h-4 w-4" />
                        Filtrar por:
                    </span>

                    <div className="flex gap-2 flex-wrap">
                        {availableTurnos.map(turno => (
                            <button
                                key={turno}
                                className={`btn btn-sm ${
                                    turnoFilter === turno 
                                    ? 'bg-gradient-to-r from-primary to-primary-focus text-white border-0 shadow-md' 
                                    : 'btn-outline border-primary/40 hover:bg-primary/10 text-primary'
                                }`}
                                onClick={() => handleTurnoChange(turno)}
                            >
                                {turno}
                            </button>
                        ))}

                        {turnoFilter && (
                            <button 
                                className="btn btn-sm btn-ghost text-primary hover:bg-primary/10"
                                onClick={() => handleFilterByTurno(null)}
                            >
                                <X size={16} className="mr-1" /> Limpiar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BloqueFilters;