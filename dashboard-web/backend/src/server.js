const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const logger = require('./config/logger');
const { testConnection } = require('./config/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');

// Importar rutas
const metricsApi = require('./api/metrics_api');
const authApi = require('./api/auth_api');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3001;

/**
 * CONFIGURACIÓN DE MIDDLEWARES
 */

// Seguridad con Helmet
app.use(helmet());

// Compresión de respuestas
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Parser de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

/**
 * RUTAS
 */

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rutas de autenticación (con rate limiting más estricto)
app.use('/api/auth', authLimiter, authApi);

// Rutas de métricas (protegidas con autenticación y rate limiting)
app.use('/api/metrics', 
  apiLimiter,
  authenticateToken,
  metricsApi
);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Dashboard Backend API - Sistema de Licitaciones B2B',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      metrics: '/api/metrics'
    }
  });
});

/**
 * MANEJO DE ERRORES
 */

// Manejar rutas no encontradas
app.use(notFoundHandler);

// Manejador global de errores
app.use(errorHandler);

/**
 * INICIAR SERVIDOR
 */
async function startServer() {
  try {
    // Verificar conexión a la base de datos
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      logger.error('No se pudo conectar a la base de datos. Saliendo...');
      process.exit(1);
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor iniciado en puerto ${PORT}`);
      logger.info(`📊 Dashboard Backend API corriendo en http://localhost:${PORT}`);
      logger.info(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`✓ Sistema listo para recibir peticiones`);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor', { error: error.message });
    process.exit(1);
  }
}

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  logger.error('Excepción no capturada', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promesa rechazada no manejada', { reason });
  process.exit(1);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  logger.info('SIGTERM recibido. Cerrando servidor gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT recibido. Cerrando servidor gracefully...');
  process.exit(0);
});

// Iniciar servidor
startServer();

module.exports = app;

