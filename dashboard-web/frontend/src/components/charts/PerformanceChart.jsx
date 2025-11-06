import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function PerformanceChart({ data }) {
  if (!data) {
    return <div className="text-center py-8 text-gray-500">No hay datos disponibles</div>;
  }

  const chartData = {
    labels: ['Completadas', 'Ocupadas', 'Fallidas', 'Sin Respuesta'],
    datasets: [
      {
        data: [
          data.completadas || 0,
          data.ocupadas || 0,
          data.fallidas || 0,
          data.sinRespuesta || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Verde
          'rgba(251, 191, 36, 0.8)',  // Amarillo
          'rgba(239, 68, 68, 0.8)',   // Rojo
          'rgba(156, 163, 175, 0.8)'  // Gris
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(156, 163, 175, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Estadísticas adicionales
  const total = data.total || 0;
  const successRate = total > 0 
    ? ((data.completadas / total) * 100).toFixed(1)
    : 0;

  return (
    <div>
      <div className="mb-6">
        <Doughnut data={chartData} options={options} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-500 mt-1">Total de Llamadas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{successRate}%</p>
          <p className="text-xs text-gray-500 mt-1">Tasa de Éxito</p>
        </div>
      </div>
    </div>
  );
}

export default PerformanceChart;

