import React, { useEffect, useState } from 'react';
import { Play, FileText, MoreVertical } from 'lucide-react';
import { getCalls } from '../../services/api_service';

const CallsView = () => {
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const data = await getCalls(null, null, 100);
                setCalls(data);
            } catch (error) {
                console.error('Error fetching calls:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCalls();
    }, []);

    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case 'Positivo': return 'text-green-500 bg-green-500/10';
            case 'Negativo': return 'text-red-500 bg-red-500/10';
            case 'Neutro': return 'text-gray-500 bg-gray-500/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completada': return 'text-blue-500';
            case 'Sin Respuesta': return 'text-orange-500';
            case 'Fallida': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-CL', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="p-8 text-center text-ink-secondary">Cargando llamadas...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-ink-primary">Registro de Llamadas</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="form-control text-sm w-64"
                    />
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                        Exportar CSV
                    </button>
                </div>
            </div>

            <div className="bg-canvas-card rounded-xl shadow-sm border border-border-DEFAULT overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border-DEFAULT">
                        <thead className="bg-canvas-secondary">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider">Fecha/Hora</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider">Proveedor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider">Duración</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider">Sentimiento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider">Resultado</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-ink-tertiary uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-canvas-card divide-y divide-border-DEFAULT">
                            {calls.map((call) => (
                                <tr key={call.id} className="hover:bg-canvas-hover transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-secondary">{formatDate(call.date)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ink-primary">{call.provider}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-secondary">{call.duration}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`font-medium ${getStatusColor(call.status)}`}>{call.status}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(call.sentiment)}`}>
                                            {call.sentiment}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-secondary">{call.result}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="text-ink-tertiary hover:text-primary-500" title="Escuchar Grabación">
                                                <Play className="h-4 w-4" />
                                            </button>
                                            <button className="text-ink-tertiary hover:text-primary-500" title="Ver Transcripción">
                                                <FileText className="h-4 w-4" />
                                            </button>
                                            <button className="text-ink-tertiary hover:text-ink-primary">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-canvas-secondary px-6 py-3 border-t border-border-DEFAULT flex items-center justify-between">
                    <div className="text-sm text-ink-tertiary">
                        Mostrando <span className="font-medium">1</span> a <span className="font-medium">{calls.length}</span> de <span className="font-medium">{calls.length}</span> resultados
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-border-DEFAULT rounded-md text-sm text-ink-secondary hover:bg-canvas-hover disabled:opacity-50" disabled>Anterior</button>
                        <button className="px-3 py-1 border border-border-DEFAULT rounded-md text-sm text-ink-secondary hover:bg-canvas-hover">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallsView;
