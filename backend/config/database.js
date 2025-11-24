/**
 * Configuración de conexión a MySQL
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, 'database.env') });

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'integrales_db',
  charset: process.env.DB_CHARSET || 'utf8mb4',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

/**
 * Ejecutar una consulta SQL
 * @param {string} query - Consulta SQL
 * @param {Array} params - Parámetros para la consulta
 * @returns {Promise} Resultado de la consulta
 */
export async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error en consulta SQL:', error);
    throw error;
  }
}

/**
 * Obtener una conexión del pool
 * @returns {Promise} Conexión de MySQL
 */
export async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Error al obtener conexión:', error);
    throw error;
  }
}

/**
 * Iniciar una transacción
 * @returns {Promise} Conexión con transacción iniciada
 */
export async function beginTransaction() {
  const connection = await getConnection();
  await connection.beginTransaction();
  return connection;
}

/**
 * Confirmar una transacción
 * @param {Object} connection - Conexión de MySQL
 */
export async function commit(connection) {
  await connection.commit();
  connection.release();
}

/**
 * Revertir una transacción
 * @param {Object} connection - Conexión de MySQL
 */
export async function rollback(connection) {
  await connection.rollback();
  connection.release();
}

/**
 * Probar la conexión a la base de datos
 * @returns {Promise<boolean>} true si la conexión es exitosa
 */
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Conexión a MySQL establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error.message);
    return false;
  }
}

/**
 * Cerrar todas las conexiones del pool
 */
export async function closePool() {
  await pool.end();
}

export default pool;

