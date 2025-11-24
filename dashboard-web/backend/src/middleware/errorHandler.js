const logger = require('../config/logger');

/**
 * Middleware global para manejo de errores
 * Captura todos los errores no manejados y los procesa de manera centralizada
 */
const errorHandler = (err, req, res, next) => {
  // Log del error
  logger.error('Error en la aplicación', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Determinar el código de estado
  const statusCode = err.statusCode || 500;

  // Preparar la respuesta de error
  const errorResponse = {
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware para manejar rutas no encontradas (404)
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
};

