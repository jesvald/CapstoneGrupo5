import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Components
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import KPICard from '../components/ui/KPICard';
import DateFilter from '../components/ui/DateFilter';
import PerformanceChart from '../components/charts/PerformanceChart';
import SentimentChart from '../components/charts/SentimentChart';
import HistoricalChart from '../components/charts/HistoricalChart';
import ProvidersTable from '../components/ui/ProvidersTable';
import AlertsPanel from '../components/ui/AlertsPanel';

// Services
import {
  getKPIs,
  getPerformanceMetrics,
  getSentimentAnalysis,
  getHistoricalPerformance,
  getTopProviders,
  getSystemAlerts
} from '../services/api_service';

// Hooks
import useDateRange from '../hooks/useDateRange';

function DashboardPage({ currentUser, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Datos del dashboard
  const [kpis, setKpis] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [historical, setHistorical] = useState([]);
  const [providers, setProviders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // Filtros de fecha
  const { startDate, endDate, setDateRange, getDefaultRange } = useDateRange(30); // Últimos 30 días

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardData();
  }, [startDate, endDate]);

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  const loadDashboardData = async (isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const start = startDate?.toISOString();
      const end = endDate?.toISOString();

      // Cargar todos los datos en paralelo
      const [
        kpisData,
        performanceData,
        sentimentData,
        historicalData,
        providersData,
        alertsData
      ] = await Promise.all([
        getKPIs(start, end),
        getPerformanceMetrics(start, end),
        getSentimentAnalysis(start, end),
        getHistoricalPerformance(start, end, 'day'),
        getTopProviders(start, end, 10),
        getSystemAlerts(start, end)
      ]);

      setKpis(kpisData);
      setPerformance(performanceData);
      setSentiment(sentimentData);
      setHistorical(historicalData);
      setProviders(providersData);
      setAlerts(alertsData);

      if (isAutoRefresh) {
        toast.info('Datos actualizados');
      }
    } catch (error) {
      toast.error(`Error al cargar datos: ${error.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDateChange = (newStartDate, newEndDate) => {
    setDateRange(newStartDate, newEndDate);
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header
        currentUser={currentUser}
        onLogout={onLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} currentUser={currentUser} />

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="max-w-7xl mx-auto">
            {/* Título y Filtros */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard de Monitoreo</h1>
                <p className="text-gray-600 mt-1">
                  Visualización en tiempo real del sistema de licitaciones
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <DateFilter
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateChange}
                />
              </div>
            </div>

            {/* Alertas */}
            {alerts && alerts.length > 0 && (
              <div className="mb-6">
                <AlertsPanel alerts={alerts} />
              </div>
            )}

            {/* KPIs Principales */}
            {kpis && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <KPICard
                  title="Total de Llamadas"
                  value={kpis.totalLlamadas}
                  icon="phone"
                  color="blue"
                />
                <KPICard
                  title="Contacto Exitoso"
                  value={`${kpis.contactoExitoso.percentage}%`}
                  subtitle={`${kpis.contactoExitoso.count} llamadas`}
                  icon="check-circle"
                  color="green"
                  trend={parseFloat(kpis.contactoExitoso.percentage) >= 50 ? 'up' : 'down'}
                />
                <KPICard
                  title="Duración Promedio"
                  value={`${Math.floor(kpis.duracionPromedio / 60)}:${(kpis.duracionPromedio % 60).toString().padStart(2, '0')}`}
                  subtitle="min:seg"
                  icon="clock"
                  color="purple"
                />
                <KPICard
                  title="Conversión a Oferta"
                  value={`${kpis.conversionOferta.percentage}%`}
                  subtitle={`${kpis.conversionOferta.count} ofertas`}
                  icon="trending-up"
                  color="orange"
                  trend={parseFloat(kpis.conversionOferta.percentage) >= 20 ? 'up' : 'down'}
                />
              </div>
            )}

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Desempeño Operativo */}
              {performance && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Desempeño Operativo
                  </h3>
                  <PerformanceChart data={performance} />
                </div>
              )}

              {/* Análisis de Sentimiento */}
              {sentiment && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Análisis de Sentimiento e Interés
                  </h3>
                  <SentimentChart data={sentiment} />
                </div>
              )}
            </div>

            {/* Rendimiento Histórico */}
            {historical && historical.length > 0 && (
              <div className="card mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Rendimiento Histórico
                </h3>
                <HistoricalChart data={historical} />
              </div>
            )}

            {/* Top Proveedores */}
            {providers && providers.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Proveedores
                </h3>
                <ProvidersTable providers={providers} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;

