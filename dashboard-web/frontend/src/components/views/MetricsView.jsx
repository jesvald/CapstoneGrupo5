import React, { useEffect, useState } from 'react';
import PerformanceChart from '../charts/PerformanceChart';
import HistoricalChart from '../charts/HistoricalChart';
import KPICard from '../ui/KPICard';
import { BarChart3, TrendingUp, Users, Phone, CheckCircle } from 'lucide-react';
import { getKPIs } from '../../services/api_service';

const MetricsView = () => {
    const [kpis, setKpis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await getKPIs();
                setKpis(response.data);
            } catch (error) {
                console.error('Error fetching metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-ink-secondary">Cargando métricas...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-ink-primary">Métricas Detalladas</h2>
                <div className="flex gap-2">
                    <select className="form-control text-sm">
                        <option>Últimos 30 días</option>
                        <option>Últimos 7 días</option>
                        <option>Este mes</option>
                    </select>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total Llamadas"
                    value={kpis?.totalLlamadas.toString()}
                    trend={0}
                    icon={Phone}
                    color="primary"
                />
                <KPICard
                    title="Tasa de Éxito"
                    value={`${kpis?.contactoExitoso.percentage}%`}
                    trend={0}
                    icon={CheckCircle}
                    color="success"
                />
                <KPICard
                    title="Conversión"
                    value={`${kpis?.conversionOferta.percentage}%`}
                    trend={0}
                    icon={TrendingUp}
                    color="warning"
                />
                <KPICard
                    title="Interesados"
                    value={kpis?.proveedoresInteresados.toString()}
                    trend={0}
                    icon={Users}
                    color="info"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-canvas-card rounded-xl shadow-sm border border-border-DEFAULT p-6">
                    <h3 className="text-lg font-semibold text-ink-primary mb-4">Volumen de Llamadas</h3>
                    <div className="h-80">
                        <PerformanceChart />
                    </div>
                </div>
                <div className="bg-canvas-card rounded-xl shadow-sm border border-border-DEFAULT p-6">
                    <h3 className="text-lg font-semibold text-ink-primary mb-4">Tendencia de Conversión</h3>
                    <div className="h-80">
                        <HistoricalChart />
                    </div>
                </div>
            </div>

            {/* Detailed Table Placeholder */}
            <div className="bg-canvas-card rounded-xl shadow-sm border border-border-DEFAULT p-6">
                <h3 className="text-lg font-semibold text-ink-primary mb-4">Desglose por Categoría</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border-DEFAULT">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider">Categoría</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider">Llamadas</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider">Éxito</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink-tertiary uppercase tracking-wider">Conversión</th>
                            </tr>
                        </thead>
                        <tbody className="bg-canvas-card divide-y divide-border-DEFAULT">
                            {[
                                { cat: 'Construcción', calls: 450, success: '70%', conv: '18%' },
                                { cat: 'Tecnología', calls: 320, success: '65%', conv: '12%' },
                                { cat: 'Logística', calls: 280, success: '75%', conv: '20%' },
                                { cat: 'Servicios', calls: 184, success: '60%', conv: '10%' },
                            ].map((row, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ink-primary">{row.cat}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-secondary">{row.calls}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-secondary">{row.success}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-secondary">{row.conv}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MetricsView;
