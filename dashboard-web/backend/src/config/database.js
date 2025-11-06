const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Configuración del pool de conexiones a MySQL
 * Utiliza un pool para mejorar el rendimiento y gestionar múltiples conexiones
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * Función para verificar la conexión a la base de datos
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Conexión a MySQL establecida correctamente');
    connection.release();
    return true;
  } catch (error) {
    console.error('✗ Error al conectar con MySQL:', error.message);
    return false;
  }
}

/**
 * Función para ejecutar consultas con manejo de errores
 */
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error ejecutando consulta:', error);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  query
};

