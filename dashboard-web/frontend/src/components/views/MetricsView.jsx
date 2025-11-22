import React, { useEffect, useState } from 'react';
import PerformanceChart from '../charts/PerformanceChart';
import HistoricalChart from '../charts/HistoricalChart';
import KPICard from '../ui/KPICard';
import { TrendingUp, Users, Phone, CheckCircle } from 'lucide-react';
import { getKPIs, getPerformanceMetrics, getHistoricalPerformance, getTopProviders } from '../../services/api_service';

const MetricsView = () => {
    const [kpis, setKpis] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [historical, setHistorical] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30d');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let startDate, endDate;
                const now = new Date();
                endDate = now.toISOString();

                if (dateRange === '7d') {
                    const start = new Date();
                    start.setDate(now.getDate() - 7);
                    startDate = start.toISOString();
                } else if (dateRange === '30d') {
                    const start = new Date();
                    start.setDate(now.getDate() - 30);
                    startDate = start.toISOString();
                } else {
                    // All time (start of 2023)
                    startDate = '2023-01-01T00:00:00.000Z';
                }

                const [kpiData, perfData, histData, provData] = await Promise.all([
                    getKPIs(startDate, endDate),
                    getPerformanceMetrics(startDate, endDate),
                    getHistoricalPerformance(startDate, endDate, dateRange === 'all' ? 'month' : 'day'),
                    getTopProviders(startDate, endDate, 100)
                ]);

                setKpis(kpiData);
                setPerformance(perfData);
                setHistorical(histData);

                // Process categories from providers
                const catMap = {};
                console.log('Provider data sample:', provData.slice(0, 3));
                provData.forEach(p => {
                    if (!catMap[p.rubro]) {
                        catMap[p.rubro] = { calls: 0, success: 0, offers: 0 };
                    }
                    // Ensure we're working with numbers, not strings
                    catMap[p.rubro].calls += parseInt(p.total_llamadas) || 0;
                    catMap[p.rubro].success += parseInt(p.contactos_exitosos) || 0;
                    catMap[p.rubro].offers += parseInt(p.ofertas_generadas) || 0;
                });

                console.log('Category map:', catMap);

                const catArray = Object.keys(catMap).map(key => ({
                    cat: key,
                    calls: catMap[key].calls,
                    success: catMap[key].calls > 0 ? Math.round((catMap[key].success / catMap[key].calls) * 100) + '%' : '0%',
                    conv: catMap[key].calls > 0 ? Math.round((catMap[key].offers / catMap[key].calls) * 100) + '%' : '0%'
                })).sort((a, b) => b.calls - a.calls);

                console.log('Category array:', catArray);
                setCategories(catArray);

            } catch (error) {
                console.error('Error fetching metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dateRange]);

    if (loading) {
        return <div className="p-8 text-center text-ink-secondary">Cargando métricas...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-ink-primary">Métricas Detalladas</h2>
                <div className="flex gap-2">
                    <select
                        className="form-control text-sm bg-canvas-card border-border-DEFAULT rounded-lg px-3 py-2"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option value="7d">Últimos 7 días</option>
                        <option value="30d">Últimos 30 días</option>
                        <option value="all">Todo el histórico</option>
                    </select>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total Llamadas"
                    value={kpis?.totalLlamadas?.toString() || '0'}
                    trend={0}
                    icon={Phone}
                    color="primary"
                />
                <KPICard
                    title="Tasa de Éxito"
                    value={`${kpis?.contactoExitoso?.percentage || 0}%`}
                    trend={0}
                    icon={CheckCircle}
                    color="success"
                />
                <KPICard
                    title="Conversión"
                    value={`${kpis?.conversionOferta?.percentage || 0}%`}
                    trend={0}
                    icon={TrendingUp}
                    color="warning"
                />
                <KPICard
                    title="Interesados"
                    value={kpis?.proveedoresInteresados?.toString() || '0'}
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
                        <PerformanceChart data={performance} />
                    </div>
                </div>
                <div className="bg-canvas-card rounded-xl shadow-sm border border-border-DEFAULT p-6">
                    <h3 className="text-lg font-semibold text-ink-primary mb-4">Tendencia de Conversión</h3>
                    <div className="h-80">
                        <HistoricalChart data={historical} />
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
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
                            {categories.map((row, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ink-primary">{row.cat}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-secondary">{row.calls}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-secondary">{row.success}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-secondary">{row.conv}</td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-ink-tertiary">No hay datos disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MetricsView;
