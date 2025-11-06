-- =========================================
-- Schema para Dashboard de Monitoreo
-- Sistema de Licitaciones B2B
-- =========================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS licitaciones_b2b
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE licitaciones_b2b;

-- =========================================
-- Tabla: usuarios
-- Gestión de usuarios del dashboard
-- =========================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Manager', 'Analyst') NOT NULL DEFAULT 'Analyst',
  activo BOOLEAN DEFAULT TRUE,
  ultimo_login DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- Tabla: proveedores
-- Información de proveedores
-- =========================================
CREATE TABLE IF NOT EXISTS proveedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  rubro VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(255),
  direccion VARCHAR(500),
  ciudad VARCHAR(100),
  region VARCHAR(100),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nombre (nombre),
  INDEX idx_rubro (rubro),
  INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- Tabla: licitaciones
-- Información de licitaciones
-- =========================================
CREATE TABLE IF NOT EXISTS licitaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(100) NOT NULL UNIQUE,
  titulo VARCHAR(500) NOT NULL,
  descripcion TEXT,
  monto_estimado DECIMAL(15,2),
  fecha_publicacion DATE,
  fecha_cierre DATE,
  estado ENUM('abierta', 'cerrada', 'adjudicada', 'desierta') DEFAULT 'abierta',
  categoria VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_codigo (codigo),
  INDEX idx_estado (estado),
  INDEX idx_fecha_cierre (fecha_cierre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- Tabla: llamadas
-- Registro de llamadas realizadas por el agente de IA
-- =========================================
CREATE TABLE IF NOT EXISTS llamadas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proveedor_id INT NOT NULL,
  licitacion_id INT NULL,
  fecha_llamada DATETIME NOT NULL,
  estado ENUM('completada', 'ocupada', 'fallida', 'sin_respuesta', 'en_progreso') NOT NULL,
  duracion_segundos INT DEFAULT 0,
  contacto_exitoso BOOLEAN DEFAULT FALSE,
  proveedor_interesado BOOLEAN NULL,
  conversion_oferta BOOLEAN DEFAULT FALSE,
  sentimiento ENUM('positivo', 'neutro', 'negativo') NULL,
  transcripcion TEXT NULL,
  notas TEXT NULL,
  motivo_rechazo VARCHAR(255) NULL,
  siguiente_contacto DATE NULL,
  agente_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
  FOREIGN KEY (licitacion_id) REFERENCES licitaciones(id) ON DELETE SET NULL,
  INDEX idx_proveedor (proveedor_id),
  INDEX idx_fecha (fecha_llamada),
  INDEX idx_estado (estado),
  INDEX idx_contacto_exitoso (contacto_exitoso),
  INDEX idx_conversion (conversion_oferta),
  INDEX idx_sentimiento (sentimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- Tabla: ofertas
-- Ofertas generadas por proveedores
-- =========================================
CREATE TABLE IF NOT EXISTS ofertas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  licitacion_id INT NOT NULL,
  proveedor_id INT NOT NULL,
  llamada_id INT NULL,
  monto_ofertado DECIMAL(15,2) NOT NULL,
  fecha_oferta DATE NOT NULL,
  estado ENUM('pendiente', 'aceptada', 'rechazada') DEFAULT 'pendiente',
  tiempo_entrega_dias INT,
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (licitacion_id) REFERENCES licitaciones(id) ON DELETE CASCADE,
  FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
  FOREIGN KEY (llamada_id) REFERENCES llamadas(id) ON DELETE SET NULL,
  INDEX idx_licitacion (licitacion_id),
  INDEX idx_proveedor (proveedor_id),
  INDEX idx_estado (estado),
  INDEX idx_fecha (fecha_oferta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- Tabla: metricas_diarias
-- Agregaciones precomputadas para optimizar consultas
-- =========================================
CREATE TABLE IF NOT EXISTS metricas_diarias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL UNIQUE,
  total_llamadas INT DEFAULT 0,
  llamadas_completadas INT DEFAULT 0,
  contactos_exitosos INT DEFAULT 0,
  conversiones_oferta INT DEFAULT 0,
  duracion_promedio_segundos INT DEFAULT 0,
  tasa_contacto_porcentaje DECIMAL(5,2) DEFAULT 0,
  tasa_conversion_porcentaje DECIMAL(5,2) DEFAULT 0,
  sentimiento_positivo INT DEFAULT 0,
  sentimiento_neutro INT DEFAULT 0,
  sentimiento_negativo INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- Insertar usuario administrador por defecto
-- Usuario: admin@dashboard.com
-- Password: Admin123! (debe cambiarse en producción)
-- =========================================
INSERT INTO usuarios (email, password_hash, nombre, role, activo) 
VALUES (
  'admin@dashboard.com',
  '$2a$10$h/zvy/vTxnUdMReas6e.R.fzEdLx/fvf.JAhvLwCPjEj26zXwQdxS', -- Hash de 'Admin123!'
  'Administrador',
  'Admin',
  TRUE
) ON DUPLICATE KEY UPDATE email=email;

-- =========================================
-- Datos de ejemplo para desarrollo
-- =========================================

-- Insertar proveedores de ejemplo
INSERT INTO proveedores (nombre, rubro, telefono, email, ciudad, region) VALUES
('Constructora ABC', 'Construcción', '+56912345678', 'contacto@abc.cl', 'Santiago', 'Metropolitana'),
('Suministros XYZ', 'Materiales', '+56987654321', 'ventas@xyz.cl', 'Valparaíso', 'Valparaíso'),
('Servicios Tech', 'Tecnología', '+56911111111', 'info@tech.cl', 'Concepción', 'Biobío'),
('Logística Express', 'Transporte', '+56922222222', 'contacto@express.cl', 'Santiago', 'Metropolitana'),
('Alimentos Sur', 'Alimentación', '+56933333333', 'ventas@sur.cl', 'Temuco', 'Araucanía')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Insertar licitaciones de ejemplo
INSERT INTO licitaciones (codigo, titulo, descripcion, monto_estimado, fecha_publicacion, fecha_cierre, estado, categoria) VALUES
('LIC-2024-001', 'Construcción de puente', 'Proyecto de construcción de infraestructura vial', 5000000.00, '2024-01-15', '2024-02-15', 'abierta', 'Infraestructura'),
('LIC-2024-002', 'Suministro de equipos tecnológicos', 'Adquisición de hardware y software', 2500000.00, '2024-01-20', '2024-02-20', 'abierta', 'Tecnología'),
('LIC-2024-003', 'Servicio de transporte', 'Transporte de materiales', 800000.00, '2024-01-25', '2024-02-25', 'abierta', 'Logística')
ON DUPLICATE KEY UPDATE codigo=codigo;

-- Insertar llamadas de ejemplo
INSERT INTO llamadas (proveedor_id, licitacion_id, fecha_llamada, estado, duracion_segundos, contacto_exitoso, proveedor_interesado, conversion_oferta, sentimiento, transcripcion) VALUES
(1, 1, NOW() - INTERVAL 5 DAY, 'completada', 180, TRUE, TRUE, TRUE, 'positivo', 'Conversación exitosa sobre proyecto de construcción'),
(2, 2, NOW() - INTERVAL 4 DAY, 'completada', 150, TRUE, TRUE, FALSE, 'neutro', 'Proveedor muestra interés, requiere más información'),
(3, 2, NOW() - INTERVAL 3 DAY, 'completada', 120, TRUE, FALSE, FALSE, 'negativo', 'Proveedor no está interesado en esta licitación'),
(4, 3, NOW() - INTERVAL 2 DAY, 'ocupada', 0, FALSE, NULL, FALSE, NULL, NULL),
(5, 3, NOW() - INTERVAL 1 DAY, 'completada', 200, TRUE, TRUE, TRUE, 'positivo', 'Proveedor muy interesado, enviará oferta')
ON DUPLICATE KEY UPDATE id=id;

-- =========================================
-- Vistas útiles
-- =========================================

-- Vista: Resumen de KPIs actuales
CREATE OR REPLACE VIEW v_kpis_actuales AS
SELECT 
  COUNT(*) as total_llamadas,
  SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as llamadas_completadas,
  SUM(CASE WHEN contacto_exitoso = 1 THEN 1 ELSE 0 END) as contactos_exitosos,
  AVG(duracion_segundos) as duracion_promedio,
  SUM(CASE WHEN conversion_oferta = 1 THEN 1 ELSE 0 END) as conversiones_oferta,
  ROUND((SUM(CASE WHEN contacto_exitoso = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as tasa_contacto,
  ROUND((SUM(CASE WHEN conversion_oferta = 1 THEN 1 ELSE 0 END) / NULLIF(SUM(CASE WHEN contacto_exitoso = 1 THEN 1 ELSE 0 END), 0)) * 100, 2) as tasa_conversion
FROM llamadas
WHERE fecha_llamada >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Vista: Top proveedores
CREATE OR REPLACE VIEW v_top_proveedores AS
SELECT 
  p.id,
  p.nombre,
  p.rubro,
  COUNT(l.id) as total_llamadas,
  SUM(CASE WHEN l.contacto_exitoso = 1 THEN 1 ELSE 0 END) as contactos_exitosos,
  SUM(CASE WHEN l.conversion_oferta = 1 THEN 1 ELSE 0 END) as ofertas_generadas
FROM proveedores p
LEFT JOIN llamadas l ON p.id = l.proveedor_id
WHERE l.fecha_llamada >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY p.id, p.nombre, p.rubro
ORDER BY ofertas_generadas DESC, contactos_exitosos DESC
LIMIT 10;

-- =========================================
-- Procedimientos almacenados
-- =========================================

DELIMITER //

-- Procedimiento: Actualizar métricas diarias
CREATE PROCEDURE sp_actualizar_metricas_diarias(IN p_fecha DATE)
BEGIN
  INSERT INTO metricas_diarias (
    fecha,
    total_llamadas,
    llamadas_completadas,
    contactos_exitosos,
    conversiones_oferta,
    duracion_promedio_segundos,
    tasa_contacto_porcentaje,
    tasa_conversion_porcentaje,
    sentimiento_positivo,
    sentimiento_neutro,
    sentimiento_negativo
  )
  SELECT 
    DATE(fecha_llamada) as fecha,
    COUNT(*) as total_llamadas,
    SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as llamadas_completadas,
    SUM(CASE WHEN contacto_exitoso = 1 THEN 1 ELSE 0 END) as contactos_exitosos,
    SUM(CASE WHEN conversion_oferta = 1 THEN 1 ELSE 0 END) as conversiones_oferta,
    AVG(duracion_segundos) as duracion_promedio_segundos,
    ROUND((SUM(CASE WHEN contacto_exitoso = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as tasa_contacto,
    ROUND((SUM(CASE WHEN conversion_oferta = 1 THEN 1 ELSE 0 END) / NULLIF(SUM(CASE WHEN contacto_exitoso = 1 THEN 1 ELSE 0 END), 0)) * 100, 2) as tasa_conversion,
    SUM(CASE WHEN sentimiento = 'positivo' THEN 1 ELSE 0 END) as sentimiento_positivo,
    SUM(CASE WHEN sentimiento = 'neutro' THEN 1 ELSE 0 END) as sentimiento_neutro,
    SUM(CASE WHEN sentimiento = 'negativo' THEN 1 ELSE 0 END) as sentimiento_negativo
  FROM llamadas
  WHERE DATE(fecha_llamada) = p_fecha
  GROUP BY DATE(fecha_llamada)
  ON DUPLICATE KEY UPDATE
    total_llamadas = VALUES(total_llamadas),
    llamadas_completadas = VALUES(llamadas_completadas),
    contactos_exitosos = VALUES(contactos_exitosos),
    conversiones_oferta = VALUES(conversiones_oferta),
    duracion_promedio_segundos = VALUES(duracion_promedio_segundos),
    tasa_contacto_porcentaje = VALUES(tasa_contacto_porcentaje),
    tasa_conversion_porcentaje = VALUES(tasa_conversion_porcentaje),
    sentimiento_positivo = VALUES(sentimiento_positivo),
    sentimiento_neutro = VALUES(sentimiento_neutro),
    sentimiento_negativo = VALUES(sentimiento_negativo);
END //

DELIMITER ;

-- =========================================
-- Índices adicionales para optimización
-- =========================================

-- Índice compuesto para consultas frecuentes
CREATE INDEX idx_llamadas_fecha_estado ON llamadas(fecha_llamada, estado);
CREATE INDEX idx_llamadas_conversion ON llamadas(proveedor_id, conversion_oferta);

COMMIT;

