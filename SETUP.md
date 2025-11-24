# 🚀 Guía de Configuración - Anita Integrales

Esta guía te ayudará a configurar la base de datos MySQL y las conexiones entre frontend y backend.

## 📋 Requisitos Previos

1. **MySQL instalado y corriendo**
   - Descarga desde: https://dev.mysql.com/downloads/mysql/
   - O usa Homebrew en macOS: `brew install mysql`
   - Inicia MySQL: `brew services start mysql` (macOS) o el servicio correspondiente

2. **Node.js instalado** (v18 o superior)
   - Descarga desde: https://nodejs.org/

## 🗄️ Paso 1: Configurar MySQL

### 1.1 Crear la base de datos

Abre tu terminal y ejecuta:

```bash
mysql -u root -p
```

Ingresa tu contraseña de MySQL cuando se solicite.

### 1.2 Ejecutar scripts SQL

Dentro de MySQL, ejecuta:

```sql
source /ruta/completa/al/proyecto/backend/sql/init.sql
source /ruta/completa/al/proyecto/backend/sql/seeds.sql
```

**O desde la terminal:**

```bash
cd "/Users/sdforero/Desktop/copia web /Copia de WEB 2/Integrales"
mysql -u root -p < backend/sql/init.sql
mysql -u root -p < backend/sql/seeds.sql
```

### 1.3 Verificar la base de datos

```sql
USE integrales_db;
SHOW TABLES;
SELECT COUNT(*) FROM productos;
```

Deberías ver todas las tablas creadas y productos insertados.

## 🔧 Paso 2: Configurar el Backend

### 2.1 Instalar dependencias

```bash
cd backend
npm install
```

### 2.2 Configurar variables de entorno

```bash
cp config/database.example.env config/database.env
```

Edita `config/database.env` con tus credenciales:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=integrales_db
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
```

### 2.3 Iniciar el servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

Verifica que funciona visitando: `http://localhost:3000/api/health`

## 🌐 Paso 3: Configurar el Frontend

### 3.1 Verificar configuración de API

El archivo `frontend/js/config/api.js` ya está configurado para apuntar a:
- `http://localhost:3000/api`

Si tu backend corre en otro puerto, edita la constante `API_BASE_URL` en ese archivo.

### 3.2 Servir el frontend

Puedes usar cualquier servidor HTTP local:

**Opción 1: Python (si está instalado)**
```bash
cd frontend
python3 -m http.server 5500
```

**Opción 2: Node.js (http-server)**
```bash
npm install -g http-server
cd frontend
http-server -p 5500
```

**Opción 3: Live Server (VS Code)**
- Instala la extensión "Live Server" en VS Code
- Click derecho en `index.html` → "Open with Live Server"

El frontend estará disponible en: `http://localhost:5500`

## ✅ Paso 4: Verificar la Conexión

### 4.1 Verificar Backend

Abre tu navegador y visita:
- `http://localhost:3000/api/health` - Debe mostrar `{"status":"ok","database":"connected"}`

### 4.2 Verificar Productos

- `http://localhost:3000/api/productos` - Debe mostrar la lista de productos

### 4.3 Verificar Frontend

Abre la consola del navegador (F12) y verifica que no haya errores de conexión.

## 🔐 Paso 5: Probar Autenticación

### 5.1 Registrar un usuario

Puedes usar el frontend o hacer una petición directa:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "telefono": "3001234567"
  }'
```

### 5.2 Iniciar sesión

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

## 📊 Estructura de la Base de Datos

### Tablas Principales:

- **categorias**: Categorías de productos (Panadería, Amasijos, etc.)
- **productos**: Información de productos
- **usuarios**: Usuarios/clientes registrados
- **direcciones**: Direcciones de entrega
- **carritos**: Carritos de compra activos
- **carrito_items**: Items en el carrito
- **pedidos**: Pedidos realizados
- **pedido_items**: Items de cada pedido
- **favoritos**: Productos favoritos de usuarios
- **puntos_venta**: Puntos de venta/recogida
- **sesiones**: Tokens de sesión JWT

## 🔗 Conexiones

### Frontend → Backend
- El frontend hace peticiones HTTP a `http://localhost:3000/api`
- Usa el archivo `frontend/js/config/api.js` para todas las llamadas
- Autenticación mediante tokens JWT almacenados en localStorage

### Backend → MySQL
- Conexión mediante pool de conexiones MySQL2
- Configuración en `backend/config/database.js`
- Variables de entorno en `backend/config/database.env`

## 🐛 Solución de Problemas

### Error: "Cannot connect to MySQL"
- Verifica que MySQL esté corriendo: `mysql -u root -p`
- Revisa las credenciales en `config/database.env`
- Asegúrate de que la base de datos existe: `SHOW DATABASES;`

### Error: "Port 3000 already in use"
- Cambia el puerto en `config/database.env`: `PORT=3001`
- O termina el proceso: `lsof -ti:3000 | xargs kill`

### Error: CORS
- Verifica que `CORS_ORIGIN` en `config/database.env` incluya la URL de tu frontend
- Ejemplo: `CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500`

### Error: "Table doesn't exist"
- Ejecuta nuevamente los scripts SQL:
  ```bash
  mysql -u root -p < backend/sql/init.sql
  mysql -u root -p < backend/sql/seeds.sql
  ```

## 📝 Notas Importantes

1. **Seguridad**: En producción, cambia:
   - `JWT_SECRET` por un valor seguro y aleatorio
   - Las contraseñas de la base de datos
   - `CORS_ORIGIN` para limitar los orígenes permitidos

2. **Base de datos**: Los scripts SQL incluyen:
   - Estructura completa de tablas
   - Datos de ejemplo (productos, categorías)
   - Un usuario administrador de prueba

3. **Desarrollo**: El backend usa `nodemon` para auto-reload en desarrollo

## 🎯 Próximos Pasos

1. Integrar el frontend con la API (reemplazar localStorage)
2. Agregar validaciones adicionales
3. Implementar panel de administración
4. Agregar sistema de pagos
5. Implementar notificaciones por email

## 📚 Documentación Adicional

- Ver `backend/README.md` para documentación completa de la API
- Ver `README.md` para información general del proyecto

---

¡Listo! Tu base de datos MySQL está configurada y las conexiones entre frontend y backend están listas. 🎉

