import React, { useEffect, useState } from 'react';
import { Phone, FileText, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { getRecentActivity } from '../../services/api_service';

const ActivityView = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const data = await getRecentActivity(20);
                setActivities(data);
            } catch (error) {
                console.error('Error fetching activity:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, []);

    const getIcon = (type, status) => {
        if (type === 'offer') return FileText;
        if (status === 'completada') return Phone;
        if (status === 'sin_respuesta') return XCircle;
        if (status === 'ocupada') return Clock;
        return AlertCircle;
    };

    const getStyles = (type, status) => {
        if (type === 'offer') return { color: 'text-green-500', bg: 'bg-green-100' };
        if (status === 'completada') return { color: 'text-blue-500', bg: 'bg-blue-100' };
        if (status === 'sin_respuesta') return { color: 'text-orange-500', bg: 'bg-orange-100' };
        if (status === 'fallida') return { color: 'text-red-500', bg: 'bg-red-100' };
        return { color: 'text-gray-500', bg: 'bg-gray-100' };
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Hace un momento';
        if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
        return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    };

    if (loading) {
        return <div className="p-8 text-center text-ink-secondary">Cargando actividad...</div>;
    }

    if (!Array.isArray(activities)) {
        return <div className="p-8 text-center text-red-500">Error al cargar la actividad reciente.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-ink-primary">Actividad Reciente</h2>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-canvas-card border border-border-DEFAULT rounded-lg text-sm font-medium text-ink-secondary hover:bg-canvas-hover transition-colors"
                >
                    Actualizar
                </button>
            </div>

            <div className="bg-canvas-card rounded-xl shadow-sm border border-border-DEFAULT p-6">
                {activities.length === 0 ? (
                    <div className="text-center text-ink-secondary py-8">No hay actividad reciente.</div>
                ) : (
                    <div className="flow-root">
                        <ul className="-mb-8">
                            {activities.map((activity, activityIdx) => {
                                const Icon = getIcon(activity.type, activity.status);
                                const styles = getStyles(activity.type, activity.status);

                                return (
                                    <li key={activity.id}>
                                        <div className="relative pb-8">
                                            {activityIdx !== activities.length - 1 ? (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border-DEFAULT" aria-hidden="true" />
                                            ) : null}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-canvas-card ${styles.bg}`}>
                                                        <Icon className={`h-5 w-5 ${styles.color}`} aria-hidden="true" />
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-ink-primary">{activity.title}</p>
                                                        <p className="text-sm text-ink-secondary mt-1">{activity.description}</p>
                                                    </div>
                                                    <div className="text-right text-sm whitespace-nowrap text-ink-tertiary">
                                                        <time dateTime={activity.time}>{formatTime(activity.time)}</time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityView;
