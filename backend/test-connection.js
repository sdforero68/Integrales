/**
 * Script de prueba de conexión a MySQL
 */

import { testConnection } from './config/database.js';

console.log('🔍 Probando conexión a MySQL...\n');

const connected = await testConnection();

if (connected) {
  console.log('\n✅ ¡Conexión exitosa! La base de datos está lista.');
  process.exit(0);
} else {
  console.log('\n❌ Error de conexión. Verifica la configuración en config/database.env');
  process.exit(1);
}

