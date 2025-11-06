import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function DateFilter({ startDate, endDate, onChange }) {
  const [showPresets, setShowPresets] = useState(false);

  const presets = [
    { label: 'Hoy', value: 'today' },
    { label: 'Últimos 7 días', value: 'last7days' },
    { label: 'Últimos 30 días', value: 'last30days' },
    { label: 'Últimos 90 días', value: 'last90days' },
    { label: 'Este mes', value: 'thisMonth' },
    { label: 'Mes pasado', value: 'lastMonth' }
  ];

  const handlePresetClick = (preset) => {
    const end = new Date();
    const start = new Date();

    switch (preset) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'last7days':
        start.setDate(start.getDate() - 7);
        break;
      case 'last30days':
        start.setDate(start.getDate() - 30);
        break;
      case 'last90days':
        start.setDate(start.getDate() - 90);
        break;
      case 'thisMonth':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'lastMonth':
        start.setMonth(start.getMonth() - 1);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        break;
    }

    onChange(start, end);
    setShowPresets(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(date, 'dd MMM yyyy', { locale: es });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPresets(!showPresets)}
        className="btn btn-outline flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline">
          {formatDate(startDate)} - {formatDate(endDate)}
        </span>
        <span className="sm:hidden">Filtrar</span>
      </button>

      {showPresets && (
        <>
          {/* Overlay para cerrar al hacer click fuera */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPresets(false)}
          ></div>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-2">
              <p className="text-xs font-medium text-gray-500 px-3 py-2">
                Seleccionar período
              </p>
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetClick(preset.value)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DateFilter;

