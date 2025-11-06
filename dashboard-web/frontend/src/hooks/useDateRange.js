import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar rangos de fechas
 * @param {number|null} defaultDays - Número de días por defecto (desde hoy hacia atrás), null for all time
 */
function useDateRange(defaultDays = 30) {
  const getDefaultRange = useCallback((days) => {
    if (days === null || days === 'all') {
      // Para "todo el tiempo", usamos un rango muy amplio
      const start = new Date('2020-01-01'); // Fecha de inicio del sistema
      const end = new Date('2030-12-31'); // Fecha futura lejana
      return { start, end };
    } else {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - days);
      return { start, end };
    }
  }, []);

  const { start, end } = getDefaultRange(defaultDays);
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  const setDateRange = useCallback((newStart, newEnd) => {
    setStartDate(newStart);
    setEndDate(newEnd);
  }, []);

  const reset = useCallback(() => {
    const { start, end } = getDefaultRange(defaultDays);
    setStartDate(start);
    setEndDate(end);
  }, [defaultDays, getDefaultRange]);

  const setPreset = useCallback((preset) => {
    const end = new Date();
    const start = new Date();

    switch (preset) {
      case 'today':
        // Hoy
        break;
      case 'yesterday':
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
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
        break;
      case 'lastMonth':
        start.setMonth(start.getMonth() - 1);
        start.setDate(1);
        end.setDate(0);
        break;
      default:
        break;
    }

    setStartDate(start);
    setEndDate(end);
  }, []);

  return {
    startDate,
    endDate,
    setDateRange,
    setPreset,
    reset,
    getDefaultRange
  };
}

export default useDateRange;

