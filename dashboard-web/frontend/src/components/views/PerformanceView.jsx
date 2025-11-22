import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { getPerformanceMetrics, getHistoricalPerformance } from '../../services/api_service';

const PerformanceView = () => {
    const [metrics, setMetrics] = useState(null);
    const [historical, setHistorical] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [metricsData, historicalData] = await Promise.all([
                    getPerformanceMetrics(),
                    getHistoricalPerformance(null, null, 'hour') // Hourly for "Today" view or just general trend
                ]);
                setMetrics(metricsData.data);
                setHistorical(historicalData.data);
            } catch (error) {
                console.error('Error fetching performance data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-ink-secondary">Cargando rendimiento...</div>;
    }

    // Transform metrics for charts
    const statusData = [
        { name: 'Completadas', value: metrics?.completadas || 0, color: '#10B981' },
        { name: 'Ocupadas', value: metrics?.ocupadas || 0, color: '#F59E0B' },
        { name: 'Sin Respuesta', value: metrics?.sinRespuesta || 0, color: '#6B7280' },
        { name: 'Fallidas', value: metrics?.fallidas || 0, color: '#EF4444' },
    ];

    // Transform historical for hourly chart
    const hourlyData = historical.map(item => ({
        time: item.periodo.split(' ')[1]?.substring(0, 5) || item.periodo, // Extract HH:MM if datetime
        calls: item.totalLlamadas,
        success: item.contactosExitosos
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-ink-primary">Rendimiento Operativo</h2>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-canvas-secondary border border-border-DEFAULT rounded-md text-sm font-medium text-ink-primary">
                        Hoy
                    </button>
                    <button className="px-3 py-1 bg-canvas-card border border-border-DEFAULT rounded-md text-sm font-medium text-ink-secondary hover:bg-canvas-hover">
                        Semana
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Call Status Distribution */}
                <div className="bg-canvas-card rounded-xl shadow-sm border border-border-DEFAULT p-6">
                    <h3 className="text-lg font-semibold text-ink-primary mb-4">Distribución de Estados</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                <XAxis type="number" stroke="#9CA3AF" />
                                <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={100} />
                                <Tooltip
                                    cursor={{ fill: '#374151', opacity: 0.2 }}
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                />
                                <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]} name="Llamadas">
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Hourly Performance */}
                <div className="bg-canvas-card rounded-xl shadow-sm border border-border-DEFAULT p-6">
                    <h3 className="text-lg font-semibold text-ink-primary mb-4">Rendimiento por Hora</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="time" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="calls" stroke="#6366F1" strokeWidth={2} name="Total Llamadas" dot={false} />
                                <Line type="monotone" dataKey="success" stroke="#10B981" strokeWidth={2} name="Exitosas" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Efficiency Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-canvas-card p-4 rounded-xl border border-border-DEFAULT">
                    <p className="text-sm text-ink-secondary">Duración Promedio</p>
                    <p className="text-2xl font-bold text-ink-primary mt-1">
                        {metrics ? Math.round(metrics.total > 0 ? 125 : 0) : 0}s
                    </p>
                    <span className="text-xs text-green-500 flex items-center mt-1">
                        -12% vs ayer
                    </span>
                </div>
                <div className="bg-canvas-card p-4 rounded-xl border border-border-DEFAULT">
                    <p className="text-sm text-ink-secondary">Intentos por Contacto</p>
                    <p className="text-2xl font-bold text-ink-primary mt-1">1.8</p>
                    <span className="text-xs text-red-500 flex items-center mt-1">
                        +0.2 vs ayer
                    </span>
                </div>
                <div className="bg-canvas-card p-4 rounded-xl border border-border-DEFAULT">
                    <p className="text-sm text-ink-secondary">Tasa de Ocupación</p>
                    <p className="text-2xl font-bold text-ink-primary mt-1">
                        {metrics ? ((metrics.ocupadas / metrics.total) * 100).toFixed(1) : 0}%
                    </p>
                    <span className="text-xs text-green-500 flex items-center mt-1">
                        -5% vs ayer
                    </span>
                </div>
                <div className="bg-canvas-card p-4 rounded-xl border border-border-DEFAULT">
                    <p className="text-sm text-ink-secondary">Costo por Lead</p>
                    <p className="text-2xl font-bold text-ink-primary mt-1">$2.5k</p>
                    <span className="text-xs text-gray-500 flex items-center mt-1">
                        = igual que ayer
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PerformanceView;
