const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

/**
 * Configuración del limitador de tasa de peticiones
 * Previene ataques de fuerza bruta y abuso de la API
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // límite de peticiones
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde'
  },
  standardHeaders: true, // Retornar información de rate limit en headers `RateLimit-*`
  legacyHeaders: false, // Deshabilitar headers `X-RateLimit-*`
  handler: (req, res) => {
    logger.warn('Rate limit excedido', {
      ip: req.ip,
      path: req.path
    });
    res.status(429).json({
      success: false,
      message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde'
    });
  }
});

/**
 * Limitador más estricto para rutas de autenticación
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión, por favor intente más tarde'
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};

