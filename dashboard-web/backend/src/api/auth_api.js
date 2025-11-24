const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { generateToken } = require('../middleware/auth');
const { query } = require('../config/database');
const logger = require('../config/logger');

/**
 * Middleware para validar errores
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
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Contraseña requerida'),
  validate
], async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario en la base de datos
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND activo = 1';
    const users = await query(sql, [email]);

    if (users.length === 0) {
      logger.warn('Intento de login con email no existente', { email });
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const user = users[0];

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      logger.warn('Intento de login con contraseña incorrecta', { email });
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.nombre
    });

    // Actualizar último login
    await query('UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?', [user.id]);

    logger.info('Login exitoso', { userId: user.id, email: user.email });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.nombre,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/register
 * Registrar nuevo usuario (solo para administradores)
 */
router.post('/register', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 8 }).withMessage('Contraseña debe tener al menos 8 caracteres'),
  body('name').notEmpty().withMessage('Nombre requerido'),
  body('role').isIn(['Admin', 'Manager', 'Analyst']).withMessage('Rol inválido'),
  validate
], async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    // Verificar si el email ya existe
    const existingUsers = await query('SELECT id FROM usuarios WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insertar usuario
    const sql = 'INSERT INTO usuarios (email, password_hash, nombre, role, activo) VALUES (?, ?, ?, ?, 1)';
    const result = await query(sql, [email, passwordHash, name, role]);

    logger.info('Usuario registrado exitosamente', { userId: result.insertId, email });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: result.insertId,
        email,
        name,
        role
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Obtener información del usuario actual
 */
router.get('/me', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const sql = 'SELECT id, email, nombre, role, ultimo_login FROM usuarios WHERE id = ?';
    const users = await query(sql, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

