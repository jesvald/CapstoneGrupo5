import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function HistoricalChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay datos históricos disponibles</div>;
  }

  // Preparar datos para el gráfico
  const labels = data.map(item => {
    const date = new Date(item.periodo);
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total Llamadas',
        data: data.map(item => item.totalLlamadas),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y'
      },
      {
        label: 'Contactos Exitosos',
        data: data.map(item => item.contactosExitosos),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y'
      },
      {
        label: 'Conversiones',
        data: data.map(item => item.conversiones),
        borderColor: 'rgba(251, 146, 60, 1)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y'
      },
      {
        label: 'Tasa Conversión (%)',
        data: data.map(item => parseFloat(item.tasaConversion)),
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        borderDash: [5, 5],
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 8,
          font: {
            size: 9
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 8,
        titleFont: {
          size: 11
        },
        bodyFont: {
          size: 10
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: false, // Hide title to save space
        },
        ticks: {
          font: {
            size: 9
          }
        },
        beginAtZero: true
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: false, // Hide title to save space
        },
        ticks: {
          font: {
            size: 9
          }
        },
        beginAtZero: true,
        max: 100,
        grid: {
          drawOnChartArea: false
        }
      },
      x: {
        ticks: {
          font: {
            size: 9
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default HistoricalChart;

