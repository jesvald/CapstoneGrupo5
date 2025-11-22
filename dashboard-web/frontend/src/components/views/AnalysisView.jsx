import React, { useEffect, useState } from 'react';
import { PieChart, BarChart, Cell, Pie, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getSentimentAnalysis } from '../../services/api_service';

const AnalysisView = () => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const response = await getSentimentAnalysis();
                setAnalysis(response);
            } catch (error) {
                console.error('Error fetching analysis:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-ink-secondary">Cargando análisis...</div>;
    }

    const sentimentData = [
        { name: 'Positivo', value: analysis?.sentimiento.positivo || 0, color: '#10B981' },
        { name: 'Neutro', value: analysis?.sentimiento.neutro || 0, color: '#6B7280' },
        { name: 'Negativo', value: analysis?.sentimiento.negativo || 0, color: '#EF4444' },
    ];

    const interestData = [
        { status: 'Interesados', count: analysis?.interes.interesados || 0 },
        { status: 'No Interesados', count: analysis?.interes.noInteresados || 0 },
        { status: 'Indecisos', count: analysis?.interes.indeciso || 0 },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-ink-primary">Análisis de Interacciones</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sentiment Analysis */}
                <div className="bg-canvas-card rounded-xl shadow-sm border border-border-DEFAULT p-6">
                    <h3 className="text-lg font-semibold text-ink-primary mb-4">Sentimiento de las Llamadas</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sentimentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sentimentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                    itemStyle={{ color: '#F3F4F6' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Interest Status (Replaced Rejection Reasons) */}
                <div className="bg-canvas-card rounded-xl shadow-sm border border-border-DEFAULT p-6">
                    <h3 className="text-lg font-semibold text-ink-primary mb-4">Estado de Interés</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={interestData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                <XAxis type="number" stroke="#9CA3AF" />
                                <YAxis dataKey="status" type="category" stroke="#9CA3AF" width={100} />
                                <Tooltip
                                    cursor={{ fill: '#374151', opacity: 0.2 }}
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                />
                                <Bar dataKey="count" fill="#6366F1" radius={[0, 4, 4, 0]} name="Cantidad" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Insights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                    <h4 className="text-blue-500 font-semibold mb-2">Insight Clave</h4>
                    <p className="text-ink-secondary text-sm">
                        El sentimiento positivo está correlacionado con una mayor tasa de conversión a oferta.
                    </p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
                    <h4 className="text-orange-500 font-semibold mb-2">Atención Requerida</h4>
                    <p className="text-ink-secondary text-sm">
                        Un número significativo de proveedores se muestra indeciso. Se sugiere seguimiento.
                    </p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                    <h4 className="text-green-500 font-semibold mb-2">Oportunidad</h4>
                    <p className="text-ink-secondary text-sm">
                        Enfocarse en proveedores con sentimiento 'Neutro' para convertirlos a 'Positivo'.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AnalysisView;
