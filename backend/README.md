# Backend API - Anita Integrales

Backend PHP con base de datos SQL para el sistema de autenticación y gestión de pedidos.

## 📋 Estructura

```
backend/
├── api/
│   ├── auth/
│   │   ├── login.php       # Endpoint de inicio de sesión
│   │   └── register.php    # Endpoint de registro
│   └── orders.php          # Endpoint de pedidos (GET y POST)
├── config/
│   ├── database.php         # Configuración de conexión a BD
│   ├── database.env         # Variables de entorno (crear desde database.example.env)
│   └── database.example.env # Ejemplo de configuración
└── sql/
    └── init.sql            # Script de inicialización de la base de datos
```

## 🗄️ Base de Datos SQL

Este backend es compatible con cualquier base de datos relacional SQL estándar:
- **PostgreSQL**
- **MySQL/MariaDB**
- **SQL Server**
- **SQLite**
- Cualquier otra base de datos SQL compatible con PDO

### Tablas

1. **usuarios**: Almacena información de usuarios registrados
   - `id`: ID único del usuario (SERIAL/INT AUTO_INCREMENT/IDENTITY según SGBD)
   - `email`: Correo electrónico (único)
   - `password_hash`: Hash de la contraseña
   - `name`: Nombre completo
   - `phone`: Teléfono (opcional)
   - `created_at`, `updated_at`: Timestamps

2. **pedidos**: Almacena información de pedidos
   - `id`: ID único del pedido
   - `user_id`: ID del usuario que realizó el pedido (FOREIGN KEY)
   - `total`, `subtotal`, `delivery_fee`: Montos del pedido
   - `delivery_method`: Método de entrega (delivery/pickup)
   - `delivery_address`: Dirección de entrega (si aplica)
   - `payment_method`: Método de pago
   - `status`: Estado del pedido (pendiente, confirmado, enviado, entregado, cancelado)
   - `customer_name`, `customer_email`, `customer_phone`: Información del cliente
   - `notes`: Notas adicionales
   - `created_at`, `updated_at`: Timestamps

3. **pedido_items**: Almacena los items de cada pedido
   - `id`: ID único del item
   - `order_id`: ID del pedido al que pertenece (FOREIGN KEY)
   - `product_id`: ID del producto
   - `product_name`: Nombre del producto
   - `quantity`: Cantidad
   - `price`: Precio unitario
   - `created_at`: Timestamp

### Inicialización

Ejecuta el script SQL correspondiente a tu base de datos:

**PostgreSQL:**
```bash
psql -U postgres -d integrales_db -f backend/sql/init_postgresql.sql
```

**MySQL/MariaDB:**
```bash
mysql -u root -p integrales_db < backend/sql/init_mysql.sql
```

**SQL Server:**
```bash
sqlcmd -S localhost -d integrales_db -i backend/sql/init_sqlserver.sql
```

**SQL Genérico (compatible con la mayoría):**
```sql
-- Ejecuta el contenido de backend/sql/init.sql en tu cliente SQL
```

O crea la base de datos manualmente y luego ejecuta el contenido del archivo correspondiente.

## 🔌 Endpoints API

### Autenticación

#### POST `/api/auth/register.php`
Registra un nuevo usuario.

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123",
  "name": "Nombre Usuario",
  "phone": "3001234567"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@example.com",
      "user_metadata": {
        "name": "Nombre Usuario",
        "phone": "3001234567"
      }
    },
    "accessToken": "session_1234567890_abc123..."
  }
}
```

#### POST `/api/auth/login.php`
Inicia sesión con un usuario existente.

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": 1,
      "email": "usuario@example.com",
      "user_metadata": {
        "name": "Nombre Usuario",
        "phone": "3001234567"
      }
    },
    "accessToken": "session_1234567890_abc123..."
  }
}
```

### Pedidos

#### GET `/api/orders.php?userId=1`
Obtiene todos los pedidos de un usuario.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "total": 50000,
      "subtotal": 45000,
      "delivery_fee": 5000,
      "delivery_method": "delivery",
      "delivery_address": "Calle 123, Zipaquirá",
      "payment_method": "cash",
      "status": "pendiente",
      "customer_name": "Nombre Usuario",
      "customer_email": "usuario@example.com",
      "customer_phone": "3001234567",
      "notes": null,
      "created_at": "2024-12-01 10:30:00",
      "items": [
        {
          "id": 1,
          "product_id": "prod_1",
          "product_name": "Producto 1",
          "quantity": 2,
          "price": 22500
        }
      ]
    }
  ]
}
```

#### POST `/api/orders.php`
Crea un nuevo pedido.

**Request:**
```json
{
  "userId": 1,
  "items": [
    {
      "id": "prod_1",
      "name": "Producto 1",
      "quantity": 2,
      "price": 22500
    }
  ],
  "total": 50000,
  "subtotal": 45000,
  "deliveryFee": 5000,
  "deliveryMethod": "delivery",
  "deliveryAddress": "Calle 123, Zipaquirá",
  "paymentMethod": "cash",
  "customerInfo": {
    "name": "Nombre Usuario",
    "email": "usuario@example.com",
    "phone": "3001234567"
  },
  "notes": "Entregar en la mañana"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Pedido creado exitosamente",
  "data": {
    "id": 1,
    "user_id": 1,
    "total": 50000,
    "subtotal": 45000,
    "delivery_fee": 5000,
    "delivery_method": "delivery",
    "delivery_address": "Calle 123, Zipaquirá",
    "payment_method": "cash",
    "status": "pendiente",
    "customer_name": "Nombre Usuario",
    "customer_email": "usuario@example.com",
    "customer_phone": "3001234567",
    "notes": "Entregar en la mañana",
    "created_at": "2024-12-01 10:30:00",
    "items": [...]
  }
}
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `backend/config/database.env` basado en `database.example.env`:

**Para MySQL:**
```env
DB_CLIENT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=integrales_db
DB_USER=root
DB_PASSWORD=tu_contraseña
```

**Para PostgreSQL:**
```env
DB_CLIENT=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=integrales_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

**Para SQL Server:**
```env
DB_CLIENT=sqlsrv
DB_HOST=localhost
DB_PORT=1433
DB_NAME=integrales_db
DB_USER=sa
DB_PASSWORD=tu_contraseña
```

### Vercel

En Vercel, configura las variables de entorno en el dashboard:
- `DB_CLIENT`: Tipo de BD (mysql, postgresql, sqlsrv, sqlite)
- `DB_HOST`: Host de tu base de datos
- `DB_PORT`: Puerto (3306 MySQL, 5432 PostgreSQL, 1433 SQL Server)
- `DB_NAME`: Nombre de la base de datos
- `DB_USER`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos

## 🔒 Seguridad

**Nota importante**: Este backend es una implementación básica. Para producción, considera:

1. **Autenticación JWT**: Implementar tokens JWT en lugar de tokens simples
2. **Validación de tokens**: Validar tokens en cada request
3. **Rate limiting**: Limitar requests por IP/usuario
4. **HTTPS**: Usar siempre HTTPS en producción
5. **Sanitización**: Validar y sanitizar todas las entradas
6. **Prepared statements**: Ya implementado, mantener siempre
7. **CORS**: Configurar CORS apropiadamente para tu dominio

## 🚀 Deploy en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Asegúrate de que tu base de datos sea accesible desde Vercel
4. El archivo `vercel.json` ya está configurado para enrutar las peticiones correctamente

## 📝 Notas

- Los tokens de sesión son simples y no se validan actualmente. En producción, implementa JWT.
- La validación de tokens está simplificada. Mejora esto para producción.
- Asegúrate de que tu base de datos SQL sea accesible desde Vercel (puede requerir configuración de firewall).
- El código PHP usa PDO, que es compatible con múltiples bases de datos SQL.
- Los scripts SQL están optimizados para cada SGBD, pero el código PHP es genérico y funciona con cualquiera.

