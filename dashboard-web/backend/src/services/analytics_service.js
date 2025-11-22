const { query } = require('../config/database');
const logger = require('../config/logger');

/**
 * Servicio de Analytics
 * Responsable de realizar cálculos complejos de métricas y KPIs
 */

/**
 * Obtener KPIs principales del sistema
 */
async function getMainKPIs(startDate, endDate) {
  try {
    const sql = `
      SELECT 
        COUNT(*) as total_llamadas,
        SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as llamadas_completadas,
        SUM(CASE WHEN contacto_exitoso = 1 THEN 1 ELSE 0 END) as contactos_exitosos,
        AVG(duracion_segundos) as duracion_promedio,
        SUM(CASE WHEN conversion_oferta = 1 THEN 1 ELSE 0 END) as conversiones_oferta,
        SUM(CASE WHEN proveedor_interesado = 1 THEN 1 ELSE 0 END) as proveedores_interesados
      FROM llamadas
      WHERE fecha_llamada BETWEEN ? AND ?
    `;

    const results = await query(sql, [startDate, endDate]);
    const data = results[0];

    // Calcular porcentajes
    const kpis = {
      totalLlamadas: data.total_llamadas || 0,
      llamadasCompletadas: data.llamadas_completadas || 0,
      contactoExitoso: {
        count: data.contactos_exitosos || 0,
        percentage: data.total_llamadas > 0
          ? ((data.contactos_exitosos / data.total_llamadas) * 100).toFixed(2)
          : 0
      },
      duracionPromedio: data.duracion_promedio
        ? Math.round(data.duracion_promedio)
        : 0,
      conversionOferta: {
        count: data.conversiones_oferta || 0,
        percentage: data.contactos_exitosos > 0
          ? ((data.conversiones_oferta / data.contactos_exitosos) * 100).toFixed(2)
          : 0
      },
      proveedoresInteresados: data.proveedores_interesados || 0
    };

    logger.info('KPIs principales calculados', { periodo: { startDate, endDate } });
    return kpis;
  } catch (error) {
    logger.error('Error al calcular KPIs principales', { error: error.message });
    throw error;
  }
}

/**
 * Obtener métricas de desempeño operativo
 */
async function getPerformanceMetrics(startDate, endDate) {
  try {
    const sql = `
      SELECT 
        estado,
        COUNT(*) as cantidad,
        AVG(duracion_segundos) as duracion_promedio
      FROM llamadas
      WHERE fecha_llamada BETWEEN ? AND ?
      GROUP BY estado
    `;

    const results = await query(sql, [startDate, endDate]);

    // Estructurar los resultados
    const metrics = {
      completadas: 0,
      ocupadas: 0,
      fallidas: 0,
      sinRespuesta: 0,
      total: 0
    };

    results.forEach(row => {
      metrics.total += row.cantidad;
      switch (row.estado) {
        case 'completada':
          metrics.completadas = row.cantidad;
          break;
        case 'ocupada':
          metrics.ocupadas = row.cantidad;
          break;
        case 'fallida':
          metrics.fallidas = row.cantidad;
          break;
        case 'sin_respuesta':
          metrics.sinRespuesta = row.cantidad;
          break;
      }
    });

    logger.info('Métricas de desempeño calculadas');
    return metrics;
  } catch (error) {
    logger.error('Error al calcular métricas de desempeño', { error: error.message });
    throw error;
  }
}

/**
 * Obtener análisis de interés y sentimiento
 */
async function getSentimentAnalysis(startDate, endDate) {
  try {
    const sql = `
      SELECT 
        sentimiento,
        proveedor_interesado,
        COUNT(*) as cantidad
      FROM llamadas
      WHERE fecha_llamada BETWEEN ? AND ?
        AND estado = 'completada'
      GROUP BY sentimiento, proveedor_interesado
    `;

    const results = await query(sql, [startDate, endDate]);

    const analysis = {
      sentimiento: {
        positivo: 0,
        neutro: 0,
        negativo: 0
      },
      interes: {
        interesados: 0,
        noInteresados: 0,
        indeciso: 0
      }
    };

    results.forEach(row => {
      // Análisis de sentimiento
      if (row.sentimiento === 'positivo') analysis.sentimiento.positivo += row.cantidad;
      else if (row.sentimiento === 'neutro') analysis.sentimiento.neutro += row.cantidad;
      else if (row.sentimiento === 'negativo') analysis.sentimiento.negativo += row.cantidad;

      // Análisis de interés
      if (row.proveedor_interesado === 1) analysis.interes.interesados += row.cantidad;
      else if (row.proveedor_interesado === 0) analysis.interes.noInteresados += row.cantidad;
      else analysis.interes.indeciso += row.cantidad;
    });

    logger.info('Análisis de sentimiento e interés calculado');
    return analysis;
  } catch (error) {
    logger.error('Error al analizar sentimiento', { error: error.message });
    throw error;
  }
}

/**
 * Obtener rendimiento histórico (series temporales)
 */
async function getHistoricalPerformance(startDate, endDate, groupBy = 'day') {
  try {
    let dateFormat;
    switch (groupBy) {
      case 'hour':
        dateFormat = '%Y-%m-%d %H:00:00';
        break;
      case 'week':
        dateFormat = '%Y-%U';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
      default: // day
        dateFormat = '%Y-%m-%d';
    }

    const sql = `
      SELECT 
        DATE_FORMAT(fecha_llamada, '${dateFormat}') as periodo,
        COUNT(*) as total_llamadas,
        SUM(CASE WHEN contacto_exitoso = 1 THEN 1 ELSE 0 END) as contactos_exitosos,
        SUM(CASE WHEN conversion_oferta = 1 THEN 1 ELSE 0 END) as conversiones,
        AVG(duracion_segundos) as duracion_promedio
      FROM llamadas
      WHERE fecha_llamada BETWEEN ? AND ?
      GROUP BY periodo
      ORDER BY periodo ASC
    `;

    const results = await query(sql, [startDate, endDate]);

    const historicalData = results.map(row => ({
      periodo: row.periodo,
      totalLlamadas: row.total_llamadas,
      contactosExitosos: row.contactos_exitosos,
      conversiones: row.conversiones,
      duracionPromedio: row.duracion_promedio ? Math.round(row.duracion_promedio) : 0,
      tasaContacto: row.total_llamadas > 0
        ? ((row.contactos_exitosos / row.total_llamadas) * 100).toFixed(2)
        : 0,
      tasaConversion: row.contactos_exitosos > 0
        ? ((row.conversiones / row.contactos_exitosos) * 100).toFixed(2)
        : 0
    }));

    logger.info('Rendimiento histórico calculado', { groupBy, records: historicalData.length });
    return historicalData;
  } catch (error) {
    logger.error('Error al calcular rendimiento histórico', { error: error.message });
    throw error;
  }
}

/**
 * Obtener top proveedores por diferentes criterios
 */
async function getTopProviders(startDate, endDate, limit = 10) {
  try {
    const sql = `
      SELECT 
        p.id,
        p.nombre,
        p.rubro,
        COUNT(l.id) as total_llamadas,
        SUM(CASE WHEN l.contacto_exitoso = 1 THEN 1 ELSE 0 END) as contactos_exitosos,
        SUM(CASE WHEN l.conversion_oferta = 1 THEN 1 ELSE 0 END) as ofertas_generadas,
        CASE WHEN COUNT(l.id) > 0 THEN COALESCE(AVG(l.duracion_segundos), 0) ELSE 0 END as duracion_promedio
      FROM proveedores p
      LEFT JOIN llamadas l ON p.id = l.proveedor_id AND l.fecha_llamada BETWEEN ? AND ?
      GROUP BY p.id, p.nombre, p.rubro
      ORDER BY ofertas_generadas DESC, contactos_exitosos DESC
    `;

    // Ensure all parameters are properly formatted
    // Format dates to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
    const mysqlFormattedStart = new Date(startDate).toISOString().slice(0, 19).replace('T', ' ');
    const mysqlFormattedEnd = new Date(endDate).toISOString().slice(0, 19).replace('T', ' ');

    const results = await query(sql, [mysqlFormattedStart, mysqlFormattedEnd]);

    // Limit results in JavaScript instead of using MySQL LIMIT to avoid parameter issues
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Ensure limit is within 1-100 range
    const limitedResults = results.slice(0, parsedLimit);

    logger.info('Top proveedores calculados', { count: limitedResults.length });
    return limitedResults;
  } catch (error) {
    logger.error('Error al obtener top proveedores', { error: error.message });
    throw error;
  }
}

/**
 * Obtener alertas del sistema basadas en umbrales
 */
async function getSystemAlerts(startDate, endDate) {
  try {
    const kpis = await getMainKPIs(startDate, endDate);
    const alerts = [];

    // Alerta: Tasa de contacto exitoso baja
    if (parseFloat(kpis.contactoExitoso.percentage) < 50) {
      alerts.push({
        type: 'warning',
        severity: 'high',
        title: 'Tasa de Contacto Exitoso Baja',
        message: `La tasa de contacto exitoso es del ${kpis.contactoExitoso.percentage}%, por debajo del objetivo del 50%`,
        timestamp: new Date()
      });
    }

    // Alerta: Tasa de conversión baja
    if (parseFloat(kpis.conversionOferta.percentage) < 20) {
      alerts.push({
        type: 'critical',
        severity: 'critical',
        title: 'Tasa de Conversión Crítica',
        message: `La tasa de conversión a oferta es del ${kpis.conversionOferta.percentage}%, muy por debajo del objetivo del 20%`,
        timestamp: new Date()
      });
    }

    // Alerta: Volumen de llamadas bajo
    if (kpis.totalLlamadas < 100) {
      alerts.push({
        type: 'info',
        severity: 'medium',
        title: 'Volumen de Llamadas Bajo',
        message: `Solo se han realizado ${kpis.totalLlamadas} llamadas en el periodo seleccionado`,
        timestamp: new Date()
      });
    }

    logger.info('Alertas del sistema generadas', { alertCount: alerts.length });
    return alerts;
  } catch (error) {
    logger.error('Error al generar alertas del sistema', { error: error.message });
    throw error;
  }
}

/**
 * Obtener listado detallado de llamadas
 */
async function getCalls(startDate, endDate, limit = 100) {
  try {
    const sql = `
      SELECT 
        l.id,
        l.fecha_llamada,
        p.nombre as proveedor,
        l.duracion_segundos,
        l.estado,
        l.sentimiento,
        l.proveedor_interesado,
        l.conversion_oferta,
        l.transcripcion
      FROM llamadas l
      JOIN proveedores p ON l.proveedor_id = p.id
      WHERE l.fecha_llamada BETWEEN ? AND ?
      ORDER BY l.fecha_llamada DESC
      LIMIT ?
    `;

    // Format dates
    const mysqlFormattedStart = new Date(startDate).toISOString().slice(0, 19).replace('T', ' ');
    const mysqlFormattedEnd = new Date(endDate).toISOString().slice(0, 19).replace('T', ' ');
    const parsedLimit = Math.max(1, Math.min(500, parseInt(limit) || 100));

    const results = await query(sql, [mysqlFormattedStart, mysqlFormattedEnd, parsedLimit]);

    // Format results for frontend
    const calls = results.map(row => ({
      id: row.id,
      date: row.fecha_llamada,
      provider: row.proveedor,
      duration: formatDuration(row.duracion_segundos),
      status: mapStatus(row.estado),
      sentiment: capitalize(row.sentimiento || '-'),
      result: mapResult(row)
    }));

    logger.info('Listado de llamadas obtenido', { count: calls.length });
    return calls;
  } catch (error) {
    logger.error('Error al obtener llamadas', { error: error.message });
    throw error;
  }
}

/**
 * Obtener actividad reciente (timeline)
 */
async function getRecentActivity(limit = 10) {
  try {
    // Fetch recent calls
    const callsSql = `
      SELECT 
        'call' as type,
        l.id,
        l.fecha_llamada as created_at,
        p.nombre as entity_name,
        l.estado,
        l.proveedor_interesado,
        l.conversion_oferta
      FROM llamadas l
      JOIN proveedores p ON l.proveedor_id = p.id
      ORDER BY l.fecha_llamada DESC
      LIMIT ?
    `;

    // Fetch recent offers
    const offersSql = `
      SELECT 
        'offer' as type,
        o.id,
        o.fecha_oferta as created_at,
        p.nombre as entity_name,
        o.monto_ofertado,
        l.codigo as tender_code
      FROM ofertas o
      JOIN proveedores p ON o.proveedor_id = p.id
      JOIN licitaciones l ON o.licitacion_id = l.id
      ORDER BY o.fecha_oferta DESC
      LIMIT ?
    `;

    const parsedLimit = parseInt(limit) || 10;
    const [calls, offers] = await Promise.all([
      query(callsSql, [parsedLimit]),
      query(offersSql, [parsedLimit])
    ]);

    // Combine and sort
    const combined = [...calls, ...offers]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, parsedLimit);

    // Format for frontend
    const activity = combined.map(item => {
      if (item.type === 'call') {
        return {
          id: `call-${item.id}`,
          type: 'call',
          title: item.estado === 'completada' ? `Llamada con ${item.entity_name}` : `Intento de llamada a ${item.entity_name}`,
          description: item.conversion_oferta ? 'Generó una oferta' : (item.proveedor_interesado ? 'Interesado' : 'No interesado/Ocupado'),
          time: item.created_at,
          status: item.estado
        };
      } else {
        return {
          id: `offer-${item.id}`,
          type: 'offer',
          title: 'Nueva oferta recibida',
          description: `${item.entity_name} ofertó en ${item.tender_code}`,
          time: item.created_at,
          amount: item.monto_ofertado
        };
      }
    });

    logger.info('Actividad reciente obtenida', { count: activity.length });
    return activity;
  } catch (error) {
    logger.error('Error al obtener actividad reciente', { error: error.message });
    throw error;
  }
}

// Helpers
function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function mapStatus(status) {
  const map = {
    'completada': 'Completada',
    'ocupada': 'Ocupada',
    'fallida': 'Fallida',
    'sin_respuesta': 'Sin Respuesta'
  };
  return map[status] || status;
}

function mapResult(row) {
  if (row.conversion_oferta) return 'Oferta';
  if (row.proveedor_interesado) return 'Interesado';
  if (row.estado === 'completada') return 'No Interesado';
  return 'Reintentar';
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  getMainKPIs,
  getPerformanceMetrics,
  getSentimentAnalysis,
  getHistoricalPerformance,
  getTopProviders,
  getSystemAlerts,
  getCalls,
  getRecentActivity
};

