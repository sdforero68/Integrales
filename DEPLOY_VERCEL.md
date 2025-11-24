# 🚀 Guía de Deploy a Vercel

Guía completa para hacer deploy del proyecto Anita Integrales a Vercel.

## 📋 Prerequisitos

1. **Cuenta en Vercel**: [https://vercel.com](https://vercel.com) (gratis)
2. **Base de datos SQL accesible**: Necesitas una base de datos SQL que sea accesible desde internet
3. **GitHub/GitLab/Bitbucket**: Tu código debe estar en un repositorio Git

## 🔧 Paso 1: Preparar la Base de Datos

### Opción A: Base de Datos en la Nube (Recomendado)

Puedes usar servicios como:

- **PlanetScale** (MySQL compatible) - [https://planetscale.com](https://planetscale.com)
- **Supabase** (PostgreSQL) - [https://supabase.com](https://supabase.com)
- **Railway** (MySQL/PostgreSQL) - [https://railway.app](https://railway.app)
- **Neon** (PostgreSQL) - [https://neon.tech](https://neon.tech)
- **Aiven** (MySQL/PostgreSQL) - [https://aiven.io](https://aiven.io)

### Opción B: Base de Datos Local (Solo para pruebas)

Si tienes una base de datos local, necesitarás:

- Configurar un túnel (usando ngrok, Cloudflare Tunnel, etc.)
- O configurar tu firewall para permitir conexiones externas (NO recomendado para producción)

### Configurar la Base de Datos

1. Crea tu base de datos en el servicio elegido
2. Ejecuta el script SQL correspondiente:

   - Para MySQL: `backend/sql/init_mysql.sql`
   - Para PostgreSQL: `backend/sql/init_postgresql.sql`
   - Para SQL Server: `backend/sql/init_sqlserver.sql`

3. Anota las credenciales de conexión:
   - Host
   - Puerto
   - Nombre de la base de datos
   - Usuario
   - Contraseña

## 📝 Paso 2: Preparar el Proyecto Localmente

### 2.1 Verificar estructura del proyecto

Asegúrate de que tu proyecto tenga esta estructura:

```
Integrales/
├── backend/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.php
│   │   │   └── register.php
│   │   └── orders.php
│   ├── config/
│   │   └── database.php
│   └── sql/
├── frontend/
│   ├── index.html
│   └── ...
├── vercel.json
└── ...
```

### 2.2 Verificar vercel.json

El archivo `vercel.json` ya está configurado, pero verifica que esté correcto:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/**/*.php",
      "use": "@vercel/php"
    },
    {
      "src": "frontend/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

### 2.3 Crear archivo .vercelignore (opcional)

Crea un archivo `.vercelignore` en la raíz para excluir archivos innecesarios:

```
node_modules/
.git/
*.log
backend/config/database.env
.DS_Store
```

## 🔐 Paso 3: Configurar Variables de Entorno

### 3.1 Variables necesarias

Necesitarás configurar estas variables en Vercel:

- `DB_CLIENT`: Tipo de base de datos (mysql, postgresql, sqlsrv)
- `DB_HOST`: Host de tu base de datos
- `DB_PORT`: Puerto (3306 para MySQL, 5432 para PostgreSQL, 1433 para SQL Server)
- `DB_NAME`: Nombre de la base de datos
- `DB_USER`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos

### 3.2 Preparar para Vercel

**NO** subas el archivo `backend/config/database.env` a Git. El código PHP leerá las variables de entorno directamente de Vercel.

## 📤 Paso 4: Subir Código a Git

### 4.1 Inicializar repositorio (si no existe)

```bash
git init
git add .
git commit -m "Initial commit - Proyecto Anita Integrales"
```

### 4.2 Crear repositorio en GitHub/GitLab/Bitbucket

1. Crea un nuevo repositorio en tu plataforma Git
2. Conecta tu repositorio local:

```bash
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git branch -M main
git push -u origin main
```

## 🚀 Paso 5: Deploy en Vercel

### 5.1 Conectar proyecto a Vercel

1. Ve a [https://vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New Project"** o **"Import Project"**
3. Selecciona tu repositorio Git (GitHub/GitLab/Bitbucket)
4. Vercel detectará automáticamente el proyecto

### 5.2 Configurar el proyecto

En la pantalla de configuración:

1. **Framework Preset**: Deja en blanco o selecciona "Other"
2. **Root Directory**: Deja vacío (raíz del proyecto)
3. **Build Command**: Deja vacío (no hay build necesario)
4. **Output Directory**: Deja vacío

### 5.3 Configurar Variables de Entorno

Antes de hacer deploy, configura las variables de entorno:

1. En la pantalla de configuración, busca la sección **"Environment Variables"**
2. Agrega cada variable:

```
DB_CLIENT = mysql (o postgresql, sqlsrv según tu BD)
DB_HOST = tu-host-de-base-de-datos.com
DB_PORT = 3306 (o 5432 para PostgreSQL)
DB_NAME = integrales_db
DB_USER = tu_usuario
DB_PASSWORD = tu_contraseña_segura
```

**Importante**:

- Marca estas variables para **Production**, **Preview** y **Development**
- No uses espacios alrededor del `=` al agregar variables

### 5.4 Hacer Deploy

1. Haz clic en **"Deploy"**
2. Espera a que Vercel termine el proceso (2-5 minutos)
3. Una vez completado, verás una URL como: `https://tu-proyecto.vercel.app`

## ✅ Paso 6: Verificar el Deploy

### 6.1 Probar los endpoints

Prueba los endpoints de la API:

**Registro:**

```bash
curl -X POST https://tu-proyecto.vercel.app/api/auth/register.php \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Login:**

```bash
curl -X POST https://tu-proyecto.vercel.app/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 6.2 Verificar logs

Si hay errores:

1. Ve al dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a la pestaña **"Logs"**
4. Revisa los errores y corrige según sea necesario

## 🔄 Paso 7: Actualizar Frontend (Opcional)

Si tu frontend necesita conectarse a la API, actualiza la URL base:

### 7.1 Crear archivo de configuración

Crea `frontend/js/config/api.js`:

```javascript
// Configuración de la API
export const API_CONFIG = {
  // URL de producción en Vercel
  baseURL: "https://tu-proyecto.vercel.app/api",

  // Para desarrollo local
  // baseURL: 'http://localhost/backend/api'
};

export function getApiBaseUrl() {
  // Detectar si estamos en producción
  if (
    window.location.hostname.includes("vercel.app") ||
    window.location.hostname.includes("tu-dominio.com")
  ) {
    return "https://tu-proyecto.vercel.app/api";
  }
  return "http://localhost/backend/api";
}
```

### 7.2 Actualizar archivos del frontend

Sigue la guía en `INTEGRACION.md` para conectar el frontend con la API.

## 🌐 Paso 8: Configurar Dominio Personalizado (Opcional)

### 8.1 Agregar dominio

1. En el dashboard de Vercel, ve a **Settings** > **Domains**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

### 8.2 Actualizar variables de entorno

Si cambias el dominio, actualiza las URLs en el frontend si es necesario.

## 🔍 Paso 9: Solución de Problemas Comunes

### Error: "Database connection failed"

**Solución:**

- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que tu base de datos permita conexiones desde las IPs de Vercel
- Verifica que el host, puerto, usuario y contraseña sean correctos

### Error: "404 Not Found" en endpoints

**Solución:**

- Verifica que `vercel.json` esté en la raíz del proyecto
- Verifica que las rutas en `vercel.json` sean correctas
- Asegúrate de que los archivos PHP estén en `backend/api/`

### Error: "500 Internal Server Error"

**Solución:**

- Revisa los logs en Vercel
- Verifica que la extensión PHP esté habilitada
- Verifica que las credenciales de la base de datos sean correctas

### La base de datos no acepta conexiones externas

**Solución:**

- Usa un servicio de base de datos en la nube (PlanetScale, Supabase, etc.)
- O configura un túnel (ngrok, Cloudflare Tunnel) para desarrollo

## 📊 Paso 10: Monitoreo y Mantenimiento

### 10.1 Ver logs en tiempo real

1. Ve al dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a **Logs** para ver errores y actividad

### 10.2 Configurar alertas

1. Ve a **Settings** > **Notifications**
2. Configura alertas para errores y deployments

### 10.3 Actualizar código

Cada vez que hagas `git push` a tu repositorio, Vercel automáticamente:

- Detectará los cambios
- Hará un nuevo deploy
- Te notificará cuando termine

## 🎯 Checklist Final

Antes de considerar el deploy completo, verifica:

- [ ] Base de datos creada y accesible desde internet
- [ ] Scripts SQL ejecutados correctamente
- [ ] Variables de entorno configuradas en Vercel
- [ ] Código subido a Git
- [ ] Proyecto conectado a Vercel
- [ ] Deploy completado sin errores
- [ ] Endpoints de API funcionando
- [ ] Frontend actualizado con URLs correctas (si aplica)
- [ ] Logs revisados y sin errores críticos

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de PHP en Vercel](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/php)
- [Guía de Integración Frontend-Backend](./INTEGRACION.md)

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs en Vercel
2. Verifica la documentación de tu proveedor de base de datos
3. Consulta los issues comunes arriba
4. Revisa la documentación de Vercel

---

¡Feliz deploy! 🚀
