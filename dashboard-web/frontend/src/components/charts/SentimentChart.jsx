import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SentimentChart({ data }) {
  if (!data) {
    return <div className="text-center py-8 text-gray-500">No hay datos disponibles</div>;
  }

  const chartData = {
    labels: ['Positivo', 'Neutro', 'Negativo', 'Interesados', 'No Interesados'],
    datasets: [
      {
        label: 'Cantidad',
        data: [
          data.sentimiento?.positivo || 0,
          data.sentimiento?.neutro || 0,
          data.sentimiento?.negativo || 0,
          data.interes?.interesados || 0,
          data.interes?.noInteresados || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',   // Verde - Positivo
          'rgba(59, 130, 246, 0.7)',  // Azul - Neutro
          'rgba(239, 68, 68, 0.7)',   // Rojo - Negativo
          'rgba(16, 185, 129, 0.7)',  // Verde claro - Interesados
          'rgba(156, 163, 175, 0.7)'  // Gris - No interesados
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(156, 163, 175, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        bodyFont: {
          size: 11
        },
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 10
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 10
          }
        }
      }
    }
  };

  // Calcular porcentajes
  const totalSentiment = (data.sentimiento?.positivo || 0) + 
                         (data.sentimiento?.neutro || 0) + 
                         (data.sentimiento?.negativo || 0);
  
  const positiveRate = totalSentiment > 0
    ? ((data.sentimiento?.positivo / totalSentiment) * 100).toFixed(1)
    : 0;

  return (
    <div>
      <div className="mb-6">
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{positiveRate}%</p>
          <p className="text-xs text-gray-500 mt-1">Sentimiento Positivo</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {data.interes?.interesados || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Proveedores Interesados</p>
        </div>
      </div>
    </div>
  );
}

export default SentimentChart;

