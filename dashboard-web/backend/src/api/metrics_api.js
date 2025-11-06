const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const analyticsService = require('../services/analytics_service');
const logger = require('../config/logger');
const NodeCache = require('node-cache');

// Configurar caché para las métricas (TTL de 5 minutos por defecto)
const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL) || 300 });

/**
 * Middleware para validar errores de validación
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

/**
 * Middleware para verificar caché
 */
const checkCache = (req, res, next) => {
  const key = req.originalUrl;
  const cachedData = cache.get(key);
  
  if (cachedData) {
    logger.info('Datos obtenidos desde caché', { endpoint: key });
    return res.json({
      success: true,
      data: cachedData,
      cached: true
    });
  }
  
  next();
};

/**
 * GET /api/metrics/kpis
 * Obtiene los KPIs principales del sistema
 */
router.get('/kpis', [
  query('startDate').optional().isISO8601().withMessage('Fecha de inicio inválida'),
  query('endDate').optional().isISO8601().withMessage('Fecha de fin inválida'),
  validate,
  checkCache
], async (req, res, next) => {
  try {
    const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = req.query.endDate || new Date().toISOString();

    const kpis = await analyticsService.getMainKPIs(startDate, endDate);
    
    // Guardar en caché
    cache.set(req.originalUrl, kpis);

    logger.info('KPIs obtenidos exitosamente', { user: req.user?.id });
    
    res.json({
      success: true,
      data: kpis,
      metadata: {
        startDate,
        endDate
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/metrics/performance
 * Obtiene métricas de desempeño operativo
 */
router.get('/performance', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  validate,
  checkCache
], async (req, res, next) => {
  try {
    const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = req.query.endDate || new Date().toISOString();

    const performance = await analyticsService.getPerformanceMetrics(startDate, endDate);
    
    cache.set(req.originalUrl, performance);

    logger.info('Métricas de desempeño obtenidas exitosamente');
    
    res.json({
      success: true,
      data: performance,
      metadata: {
        startDate,
        endDate
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/metrics/sentiment
 * Obtiene análisis de sentimiento e interés
 */
router.get('/sentiment', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  validate,
  checkCache
], async (req, res, next) => {
  try {
    const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = req.query.endDate || new Date().toISOString();

    const sentiment = await analyticsService.getSentimentAnalysis(startDate, endDate);
    
    cache.set(req.originalUrl, sentiment);

    logger.info('Análisis de sentimiento obtenido exitosamente');
    
    res.json({
      success: true,
      data: sentiment,
      metadata: {
        startDate,
        endDate
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/metrics/historical
 * Obtiene rendimiento histórico (series temporales)
 */
router.get('/historical', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('groupBy').optional().isIn(['hour', 'day', 'week', 'month']).withMessage('groupBy debe ser: hour, day, week o month'),
  validate,
  checkCache
], async (req, res, next) => {
  try {
    const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = req.query.endDate || new Date().toISOString();
    const groupBy = req.query.groupBy || 'day';

    const historical = await analyticsService.getHistoricalPerformance(startDate, endDate, groupBy);
    
    cache.set(req.originalUrl, historical);

    logger.info('Datos históricos obtenidos exitosamente', { groupBy });
    
    res.json({
      success: true,
      data: historical,
      metadata: {
        startDate,
        endDate,
        groupBy
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/metrics/providers
 * Obtiene top proveedores
 */
router.get('/providers', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe estar entre 1 y 100'),
  validate,
  checkCache
], async (req, res, next) => {
  try {
    const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = req.query.endDate || new Date().toISOString();
    const limit = parseInt(req.query.limit) || 10;

    const providers = await analyticsService.getTopProviders(startDate, endDate, limit);
    
    cache.set(req.originalUrl, providers);

    logger.info('Top proveedores obtenidos exitosamente', { limit });
    
    res.json({
      success: true,
      data: providers,
      metadata: {
        startDate,
        endDate,
        limit
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/metrics/alerts
 * Obtiene alertas del sistema
 */
router.get('/alerts', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  validate
], async (req, res, next) => {
  try {
    const startDate = req.query.startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = req.query.endDate || new Date().toISOString();

    const alerts = await analyticsService.getSystemAlerts(startDate, endDate);

    logger.info('Alertas del sistema obtenidas', { alertCount: alerts.length });
    
    res.json({
      success: true,
      data: alerts,
      metadata: {
        startDate,
        endDate,
        count: alerts.length
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/metrics/cache
 * Limpiar caché (solo para administradores)
 */
router.delete('/cache', async (req, res, next) => {
  try {
    cache.flushAll();
    
    logger.info('Caché limpiado', { user: req.user?.id });
    
    res.json({
      success: true,
      message: 'Caché limpiado exitosamente'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

