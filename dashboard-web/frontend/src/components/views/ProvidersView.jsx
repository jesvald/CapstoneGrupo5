import React, { useEffect, useState } from 'react';
import { Search, Filter, MoreVertical, Phone, Mail, MapPin } from 'lucide-react';
import { getTopProviders } from '../../services/api_service';

const ProvidersView = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await getTopProviders(null, null, 50);
                setProviders(response);
            } catch (error) {
                console.error('Error fetching providers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-ink-secondary">Cargando proveedores...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-ink-primary">Directorio de Proveedores</h2>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-tertiary" />
                        <input
                            type="text"
                            placeholder="Buscar proveedor..."
                            className="pl-9 pr-4 py-2 bg-canvas-card border border-border-DEFAULT rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
                        />
                    </div>
                    <button className="p-2 bg-canvas-card border border-border-DEFAULT rounded-lg text-ink-secondary hover:bg-canvas-hover transition-colors">
                        <Filter className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map((provider) => (
                    <div key={provider.id} className="bg-canvas-card rounded-xl shadow-sm border border-border-DEFAULT p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                    {provider.nombre.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-ink-primary">{provider.nombre}</h3>
                                    <span className="text-xs text-ink-secondary px-2 py-0.5 bg-canvas-secondary rounded-full border border-border-DEFAULT">
                                        {provider.rubro}
                                    </span>
                                </div>
                            </div>
                            <button className="text-ink-tertiary hover:text-ink-primary">
                                <MoreVertical className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-ink-secondary">
                                <Phone className="h-4 w-4 text-ink-tertiary" />
                                <span>+56 9 {Math.floor(Math.random() * 90000000 + 10000000)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-ink-secondary">
                                <Mail className="h-4 w-4 text-ink-tertiary" />
                                <span>contacto@{provider.nombre.toLowerCase().replace(/\s+/g, '')}.cl</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-ink-secondary">
                                <MapPin className="h-4 w-4 text-ink-tertiary" />
                                <span>Santiago, Chile</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border-DEFAULT">
                            <div className="text-center">
                                <p className="text-xs text-ink-tertiary uppercase">Llamadas</p>
                                <p className="font-semibold text-ink-primary">{provider.total_llamadas}</p>
                            </div>
                            <div className="text-center border-l border-border-DEFAULT">
                                <p className="text-xs text-ink-tertiary uppercase">Éxito</p>
                                <p className="font-semibold text-green-600">{provider.contactos_exitosos}</p>
                            </div>
                            <div className="text-center border-l border-border-DEFAULT">
                                <p className="text-xs text-ink-tertiary uppercase">Ofertas</p>
                                <p className="font-semibold text-blue-600">{provider.ofertas_generadas}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProvidersView;
