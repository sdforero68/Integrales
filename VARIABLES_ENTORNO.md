# 🔐 Guía de Variables de Entorno para Vercel

Esta guía te explica exactamente qué valores poner en cada variable de entorno según tu base de datos.

## 📋 Variables Requeridas

Necesitas configurar estas 6 variables en Vercel:

1. `DB_CLIENT` - Tipo de base de datos
2. `DB_HOST` - Host/servidor de la base de datos
3. `DB_PORT` - Puerto de conexión
4. `DB_NAME` - Nombre de la base de datos
5. `DB_USER` - Usuario de la base de datos
6. `DB_PASSWORD` - Contraseña de la base de datos

---

## 🗄️ Ejemplos por Tipo de Base de Datos

### MySQL/MariaDB (PlanetScale, Railway, Aiven, etc.)

**Ejemplo con PlanetScale:**

```
DB_CLIENT = mysql
DB_HOST = aws.connect.psdb.cloud
DB_PORT = 3306
DB_NAME = integrales_db
DB_USER = abc123xyz
DB_PASSWORD = pscale_pw_abc123xyz789
```

**Ejemplo con Railway:**

```
DB_CLIENT = mysql
DB_HOST = mysql.railway.app
DB_PORT = 3306
DB_NAME = railway
DB_USER = root
DB_PASSWORD = tu_contraseña_generada
```

**Ejemplo con base de datos local (NO recomendado para producción):**

```
DB_CLIENT = mysql
DB_HOST = tu-ip-publica.com
DB_PORT = 3306
DB_NAME = integrales_db
DB_USER = root
DB_PASSWORD = tu_contraseña_local
```

### PostgreSQL (Supabase, Neon, Railway, etc.)

**Ejemplo con Supabase:**

```
DB_CLIENT = postgresql
DB_HOST = db.ylrhkmzqylwqbjpxlllk.supabase.co
DB_PORT = 5432
DB_NAME = postgres
DB_USER = postgres
DB_PASSWORD = tu_contraseña_supabase
```

**⚠️ IMPORTANTE para Supabase:**

- Si tu Project URL es: `https://ylrhkmzqylwqbjpxlllk.supabase.co`
- Entonces tu DB_HOST debe ser: `db.ylrhkmzqylwqbjpxlllk.supabase.co`
- (Agrega `db.` al inicio del subdominio)
- El puerto puede ser `5432` (directo) o `6543` (connection pooling - recomendado para producción)

**Ejemplo con Neon:**

```
DB_CLIENT = postgresql
DB_HOST = ep-cool-darkness-123456.us-east-2.aws.neon.tech
DB_PORT = 5432
DB_NAME = neondb
DB_USER = usuario_neon
DB_PASSWORD = tu_contraseña_neon
```

**Ejemplo con Railway (PostgreSQL):**

```
DB_CLIENT = postgresql
DB_HOST = postgres.railway.app
DB_PORT = 5432
DB_NAME = railway
DB_USER = postgres
DB_PASSWORD = tu_contraseña_generada
```

### SQL Server (Azure SQL, etc.)

**Ejemplo con Azure SQL:**

```
DB_CLIENT = sqlsrv
DB_HOST = tu-servidor.database.windows.net
DB_PORT = 1433
DB_NAME = integrales_db
DB_USER = admin_usuario
DB_PASSWORD = tu_contraseña_azure
```

---

## 🔍 Cómo Obtener los Valores

### Si usas PlanetScale:

1. Ve a tu dashboard de PlanetScale
2. Selecciona tu base de datos
3. Haz clic en "Connect"
4. Copia los valores de la cadena de conexión:
   - **Host**: `aws.connect.psdb.cloud` (o similar)
   - **Port**: `3306`
   - **Database**: El nombre que diste
   - **User**: El usuario generado
   - **Password**: La contraseña generada

### Si usas Supabase:

1. Ve a tu proyecto en Supabase
2. Ve a **Settings** (⚙️) > **Database**
3. Busca la sección **"Connection string"** o **"Connection info"**
4. **Obtener Host desde Project URL:**
   - Ve a **Settings** > **API**
   - Si tu Project URL es: `https://ylrhkmzqylwqbjpxlllk.supabase.co`
   - Entonces tu DB_HOST es: `db.ylrhkmzqylwqbjpxlllk.supabase.co`
   - (Agrega `db.` al inicio del subdominio)
5. Extrae los valores:
   - **Host**: `db.xxxxx.supabase.co` (agrega `db.` al subdominio)
   - **Port**: `5432` (directo) o `6543` (connection pooling - mejor para producción)
   - **Database**: `postgres` (siempre)
   - **User**: `postgres` (siempre)
   - **Password**: La contraseña que creaste al crear el proyecto (si la olvidaste, puedes resetearla en Settings > Database)

### Si usas Railway:

1. Ve a tu proyecto en Railway
2. Selecciona tu servicio de base de datos
3. Ve a la pestaña **Variables**
4. Busca las variables de conexión o ve a **Connect**
5. Copia los valores:
   - **Host**: `mysql.railway.app` o `postgres.railway.app`
   - **Port**: `3306` (MySQL) o `5432` (PostgreSQL)
   - **Database**: Generalmente `railway`
   - **User**: Generalmente `root` o `postgres`
   - **Password**: La contraseña generada automáticamente

### Si usas Neon:

1. Ve a tu proyecto en Neon
2. Ve a **Connection Details**
3. Copia los valores de la cadena de conexión:
   - **Host**: `ep-xxxxx.region.aws.neon.tech`
   - **Port**: `5432`
   - **Database**: Generalmente `neondb` o el nombre que diste
   - **User**: El usuario que creaste
   - **Password**: La contraseña que configuraste

---

## ⚠️ Valores Importantes a Recordar

### DB_CLIENT - Valores Válidos:

- `mysql` - Para MySQL y MariaDB
- `postgresql` o `postgres` - Para PostgreSQL
- `sqlsrv` - Para SQL Server
- `sqlite` - Para SQLite (solo desarrollo local)

### DB_PORT - Puertos Comunes:

- **MySQL/MariaDB**: `3306`
- **PostgreSQL**: `5432`
- **SQL Server**: `1433`

### DB_NAME - Nombre de la Base de Datos:

Este es el nombre que diste cuando creaste la base de datos. Ejemplos comunes:

- `integrales_db`
- `railway` (si usas Railway)
- `postgres` (si usas Supabase)
- `neondb` (si usas Neon)

---

## ✅ Ejemplo Completo: Configuración Real

Supongamos que creaste una base de datos MySQL en PlanetScale:

**En PlanetScale obtuviste:**

- Host: `aws.connect.psdb.cloud`
- Usuario: `abc123xyz`
- Contraseña: `pscale_pw_abc123xyz789`
- Base de datos: `integrales_db`

**En Vercel, configura así:**

```
Key: DB_CLIENT
Value: mysql
✅ Production ✅ Preview ✅ Development

Key: DB_HOST
Value: aws.connect.psdb.cloud
✅ Production ✅ Preview ✅ Development

Key: DB_PORT
Value: 3306
✅ Production ✅ Preview ✅ Development

Key: DB_NAME
Value: integrales_db
✅ Production ✅ Preview ✅ Development

Key: DB_USER
Value: abc123xyz
✅ Production ✅ Preview ✅ Development

Key: DB_PASSWORD
Value: pscale_pw_abc123xyz789
✅ Production ✅ Preview ✅ Development
```

---

## 🔒 Seguridad

### ✅ HACER:

- Usa contraseñas fuertes
- Marca todas las variables para Production, Preview y Development
- Guarda las credenciales en un lugar seguro (gestor de contraseñas)
- Usa variables de entorno, nunca hardcodees credenciales

### ❌ NO HACER:

- No subas credenciales a Git
- No compartas las credenciales públicamente
- No uses la misma contraseña en desarrollo y producción
- No pongas espacios alrededor del `=` en Vercel

---

## 🧪 Verificar que Funciona

Después de configurar las variables, prueba el endpoint de registro:

```bash
curl -X POST https://tu-proyecto.vercel.app/api/auth/register.php \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

Si recibes un error de conexión, verifica:

1. Que las variables estén escritas correctamente (sin espacios)
2. Que el host sea accesible desde internet
3. Que la base de datos permita conexiones externas
4. Que el usuario y contraseña sean correctos

---

## 📝 Notas Adicionales

- **Sin espacios**: En Vercel, NO pongas espacios alrededor del `=`

  - ✅ Correcto: `DB_HOST=aws.connect.psdb.cloud`
  - ❌ Incorrecto: `DB_HOST = aws.connect.psdb.cloud`

- **Case sensitive**: Algunos valores pueden ser sensibles a mayúsculas/minúsculas

  - `mysql` (minúsculas) es correcto
  - `MySQL` o `MYSQL` puede no funcionar

- **Contraseñas especiales**: Si tu contraseña tiene caracteres especiales, cópiala exactamente como aparece en tu proveedor de base de datos

---

¿Necesitas ayuda con algún proveedor específico? ¡Dime cuál estás usando y te ayudo con los valores exactos!
