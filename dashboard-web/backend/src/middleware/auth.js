const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

/**
 * Middleware de autenticación basado en JWT
 * Verifica que el token sea válido antes de permitir el acceso a rutas protegidas
 */
const authenticateToken = (req, res, next) => {
  // Obtener el token del header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    logger.warn('Intento de acceso sin token de autenticación');
    return res.status(401).json({
      success: false,
      message: 'Token de autenticación no proporcionado'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn('Token inválido o expirado', { error: err.message });
      return res.status(403).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Agregar información del usuario al request
    req.user = user;
    next();
  });
};

/**
 * Middleware para control de acceso basado en roles (RBAC)
 * Roles: Admin, Manager, Analyst
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      logger.warn('Usuario sin rol asignado intentando acceder');
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para acceder a este recurso'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Usuario con rol ${req.user.role} intentó acceder a recurso restringido`, {
        userId: req.user.id,
        requiredRoles: allowedRoles
      });
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos suficientes para acceder a este recurso'
      });
    }

    next();
  };
};

/**
 * Middleware para generar tokens JWT
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '24h'
  });
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  generateToken
};

