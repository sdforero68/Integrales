# Backend - Anita Integrales

Backend API REST para el e-commerce de Anita Integrales, desarrollado con Node.js, Express y MySQL.

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar base de datos:**
   - Copia el archivo de configuración:
   ```bash
   cp config/database.example.env config/database.env
   ```
   
   - Edita `config/database.env` con tus credenciales de MySQL:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=integrales_db
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   ```

3. **Crear la base de datos:**
   - Opción 1: Usando MySQL CLI:
   ```bash
   mysql -u root -p < sql/init.sql
   mysql -u root -p < sql/seeds.sql
   ```
   
   - Opción 2: Ejecutar manualmente los scripts SQL en tu cliente MySQL favorito

4. **Iniciar el servidor:**
   ```bash
   # Modo desarrollo (con nodemon)
   npm run dev
   
   # Modo producción
   npm start
   ```

El servidor estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   ├── database.js          # Configuración de conexión MySQL
│   ├── database.example.env  # Plantilla de configuración
│   └── database.env          # Configuración real (no versionar)
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── productos.js         # Rutas de productos
│   ├── categorias.js        # Rutas de categorías
│   ├── carrito.js           # Rutas del carrito
│   ├── pedidos.js           # Rutas de pedidos
│   └── usuarios.js          # Rutas de usuarios
├── sql/
│   ├── init.sql             # Script de creación de tablas
│   └── seeds.sql            # Datos de ejemplo
├── server.js                # Servidor principal
└── package.json             # Dependencias
```

## 🔌 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/logout` - Cerrar sesión

### Productos
- `GET /api/productos` - Obtener todos los productos (con filtros)
- `GET /api/productos/:id` - Obtener producto por ID
- `GET /api/productos/slug/:slug` - Obtener producto por slug

### Categorías
- `GET /api/categorias` - Obtener todas las categorías
- `GET /api/categorias/:id` - Obtener categoría por ID
- `GET /api/categorias/:id/productos` - Obtener productos de una categoría

### Carrito
- `GET /api/carrito` - Obtener carrito del usuario
- `POST /api/carrito/items` - Agregar producto al carrito
- `PUT /api/carrito/items/:id` - Actualizar cantidad de item
- `DELETE /api/carrito/items/:id` - Eliminar item del carrito
- `DELETE /api/carrito` - Vaciar carrito

### Pedidos
- `GET /api/pedidos` - Obtener pedidos del usuario
- `GET /api/pedidos/:id` - Obtener pedido por ID
- `POST /api/pedidos` - Crear nuevo pedido

### Usuarios
- `GET /api/usuarios/profile` - Obtener perfil del usuario
- `PUT /api/usuarios/profile` - Actualizar perfil
- `GET /api/usuarios/favoritos` - Obtener favoritos
- `POST /api/usuarios/favoritos/:producto_id` - Agregar a favoritos
- `DELETE /api/usuarios/favoritos/:producto_id` - Eliminar de favoritos

## 🗄️ Base de Datos

### Tablas Principales

- **categorias**: Categorías de productos
- **productos**: Información de productos
- **usuarios**: Usuarios/clientes
- **direcciones**: Direcciones de entrega
- **carritos**: Carritos de compra
- **carrito_items**: Items del carrito
- **pedidos**: Pedidos realizados
- **pedido_items**: Items de cada pedido
- **favoritos**: Productos favoritos
- **puntos_venta**: Puntos de venta/recogida
- **sesiones**: Tokens de sesión

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. El token debe enviarse en el header:

```
Authorization: Bearer <token>
```

## 📝 Variables de Entorno

Archivo: `config/database.env`

```env
# Base de datos
DB_CLIENT=mysql2
DB_HOST=localhost
DB_PORT=3306
DB_NAME=integrales_db
DB_USER=root
DB_PASSWORD=tu_contraseña

# Servidor
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000/api

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5500,http://127.0.0.1:5500
```

## 🛠️ Desarrollo

### Scripts Disponibles

- `npm start` - Iniciar servidor en modo producción
- `npm run dev` - Iniciar servidor en modo desarrollo (con nodemon)
- `npm run init-db` - Inicializar base de datos (próximamente)

### Agregar Nuevas Rutas

1. Crear archivo en `routes/`
2. Importar y usar en `server.js`

Ejemplo:
```javascript
import nuevaRuta from './routes/nueva-ruta.js';
app.use('/api/nueva-ruta', nuevaRuta);
```

## 🔒 Seguridad

- Las contraseñas se hashean con bcrypt
- Los tokens JWT tienen expiración
- Validación de datos con express-validator
- CORS configurado para dominios específicos

## 📦 Dependencias Principales

- **express**: Framework web
- **mysql2**: Cliente MySQL
- **bcryptjs**: Hash de contraseñas
- **jsonwebtoken**: Autenticación JWT
- **cors**: Manejo de CORS
- **dotenv**: Variables de entorno
- **express-validator**: Validación de datos

## 🐛 Solución de Problemas

### Error de conexión a MySQL
- Verifica que MySQL esté corriendo
- Revisa las credenciales en `config/database.env`
- Asegúrate de que la base de datos existe

### Error de puerto en uso
- Cambia el puerto en `config/database.env`
- O termina el proceso que está usando el puerto 3000

## 📄 Licencia

ISC

