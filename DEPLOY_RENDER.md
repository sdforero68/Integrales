# 🚀 Guía de Deploy a Render

Guía completa para hacer deploy del proyecto Anita Integrales a Render.

## 📋 Prerequisitos

1. **Cuenta en Render**: [https://render.com](https://render.com) (gratis con limitaciones)
2. **Base de datos SQL accesible**: Necesitas una base de datos SQL que sea accesible desde internet
3. **GitHub/GitLab/Bitbucket**: Tu código debe estar en un repositorio Git

## 🔧 Paso 1: Preparar la Base de Datos

### Opción A: Base de Datos en Render (Recomendado)

Render ofrece bases de datos PostgreSQL gratuitas:

1. Ve a [https://render.com](https://render.com)
2. Haz clic en **"New +"** > **"PostgreSQL"**
3. Completa la información:
   - **Name**: `anita-integrales-db`
   - **Database**: `integrales_db`
   - **User**: Se genera automáticamente
   - **Region**: Elige la región más cercana
   - **PostgreSQL Version**: La más reciente
   - **Plan**: Free (o el plan que prefieras)
4. Haz clic en **"Create Database"**
5. Espera 2-3 minutos mientras se crea

### Opción B: Base de Datos Externa (Supabase, etc.)

Si prefieres usar Supabase u otro servicio:

- **Supabase**: Consulta `SUPABASE_SETUP.md` para configuración
- **Otra base de datos**: Asegúrate de que sea accesible desde internet

### Configurar la Base de Datos

1. Ejecuta el script SQL correspondiente:
   - Para PostgreSQL (Render/Supabase): `backend/sql/init_postgresql.sql` o `backend/sql/init_supabase.sql`
   - Para MySQL: `backend/sql/init_mysql.sql`

2. Anota las credenciales de conexión:
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
├── render.yaml (opcional, para configuración automática)
└── ...
```

### 2.2 Crear archivo .renderignore (opcional)

Crea un archivo `.renderignore` en la raíz para excluir archivos innecesarios:

```
node_modules/
.git/
*.log
backend/config/database.env
.DS_Store
.vercel/
```

## 📤 Paso 3: Subir Código a Git

### 3.1 Inicializar repositorio (si no existe)

```bash
git init
git add .
git commit -m "Initial commit - Proyecto Anita Integrales"
```

### 3.2 Crear repositorio en GitHub/GitLab/Bitbucket

1. Crea un nuevo repositorio en tu plataforma Git
2. Conecta tu repositorio local:

```bash
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git branch -M main
git push -u origin main
```

## 🚀 Paso 4: Deploy en Render

### 4.1 Conectar proyecto a Render

1. Ve a [https://render.com](https://render.com) e inicia sesión
2. Haz clic en **"New +"** > **"Web Service"**
3. Conecta tu repositorio Git (GitHub/GitLab/Bitbucket)
4. Selecciona tu repositorio

### 4.2 Configurar el Backend (API PHP)

**Configuración básica:**

1. **Name**: `anita-integrales-api`
2. **Environment**: `PHP`
3. **Build Command**: Deja vacío
4. **Start Command**: `php -S 0.0.0.0:$PORT -t backend/api`
5. **Root Directory**: Deja vacío (raíz del proyecto)

**Variables de Entorno:**

Antes de hacer clic en "Create Web Service", haz clic en **"Advanced"** y luego en **"Add Environment Variable"** para agregar cada variable:

```
DB_CLIENT = postgresql (o mysql según tu BD)
DB_HOST = tu-host-de-base-de-datos.com
DB_PORT = 5432 (o 3306 para MySQL)
DB_NAME = integrales_db
DB_USER = tu_usuario
DB_PASSWORD = tu_contraseña
```

**Nota**: Si usas Render Database, puedes hacer clic en "Link Database" y Render configurará automáticamente las variables de entorno.

Haz clic en **"Create Web Service"**

### 4.3 Configurar el Frontend (Static Site)

1. Ve a **"New +"** > **"Static Site"**
2. Conecta el mismo repositorio
3. **Name**: `anita-integrales-frontend`
4. **Root Directory**: `frontend`
5. **Build Command**: Deja vacío
6. **Publish Directory**: `frontend`

Haz clic en **"Create Static Site"**

### 4.4 Configurar Variables de Entorno

Para cada servicio (backend y frontend si es necesario):

1. Ve a tu servicio en Render
2. Ve a **"Environment"**
3. Agrega las variables de entorno necesarias

**Para el Backend (API):**
```
DB_CLIENT = postgresql
DB_HOST = [tu-host]
DB_PORT = 5432
DB_NAME = integrales_db
DB_USER = [tu-usuario]
DB_PASSWORD = [tu-contraseña]
```

## ✅ Paso 5: Verificar el Deploy

### 5.1 Obtener URLs

Render te dará URLs para cada servicio:
- Backend API: `https://anita-integrales-api.onrender.com`
- Frontend: `https://anita-integrales-frontend.onrender.com` (si lo desplegaste)

**Importante**: 
- Las URLs de Render tienen el formato: `https://[nombre-servicio].onrender.com`
- El backend estará disponible en: `https://anita-integrales-api.onrender.com`
- Los endpoints estarán en: `https://anita-integrales-api.onrender.com/auth/login.php`, etc.

### 5.2 Probar los endpoints

Prueba el endpoint de registro (reemplaza `anita-integrales-api` con el nombre de tu servicio):

```bash
curl -X POST https://anita-integrales-api.onrender.com/auth/register.php \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

**Nota**: En Render, las rutas son relativas al directorio `backend/api`, por lo que:
- `/auth/login.php` apunta a `backend/api/auth/login.php`
- `/orders.php` apunta a `backend/api/orders.php`

### 5.3 Verificar logs

Si hay errores:
1. Ve al dashboard de Render
2. Selecciona tu servicio
3. Ve a la pestaña **"Logs"**
4. Revisa los errores y corrige según sea necesario

## 🔄 Paso 6: Actualizar Frontend

### 6.1 Crear archivo de configuración

Crea `frontend/js/config/api.js`:

```javascript
// Configuración de la API
export const API_CONFIG = {
  // URL de producción en Render (reemplaza con tu URL real)
  baseURL: 'https://anita-integrales-api.onrender.com',
  
  // Para desarrollo local
  // baseURL: 'http://localhost/backend/api'
};

export function getApiBaseUrl() {
  // Detectar si estamos en producción
  if (window.location.hostname.includes('onrender.com')) {
    return 'https://anita-integrales-api.onrender.com';
  }
  return 'http://localhost/backend/api';
}
```

**Nota**: La URL base NO incluye `/api` porque Render sirve directamente desde `backend/api`, así que los endpoints serán:
- `https://anita-integrales-api.onrender.com/auth/login.php`
- `https://anita-integrales-api.onrender.com/orders.php`

### 6.2 Actualizar archivos del frontend

Sigue la guía en `INTEGRACION.md` para conectar el frontend con la API.

## 🌐 Paso 7: Configurar Dominio Personalizado (Opcional)

### 7.1 Agregar dominio

1. En el dashboard de Render, selecciona tu servicio
2. Ve a **"Settings"** > **"Custom Domains"**
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar DNS

### 7.2 Actualizar variables de entorno

Si cambias el dominio, actualiza las URLs en el frontend si es necesario.

## 🔍 Paso 8: Solución de Problemas Comunes

### Error: "Database connection failed"

**Solución:**
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que tu base de datos permita conexiones desde las IPs de Render
- Verifica que el host, puerto, usuario y contraseña sean correctos
- Si usas Render Database, verifica que esté en la misma región

### Error: "404 Not Found" en endpoints

**Solución:**
- Verifica que el Start Command sea correcto: `php -S 0.0.0.0:$PORT -t backend/api`
- Verifica que las rutas estén configuradas correctamente
- Asegúrate de que los archivos PHP estén en `backend/api/`

### Error: "500 Internal Server Error"

**Solución:**
- Revisa los logs en Render
- Verifica que PHP esté instalado (Render lo instala automáticamente)
- Verifica que las credenciales de la base de datos sean correctas
- Verifica que la extensión PDO esté habilitada

### El servicio se duerme (Free tier)

**Solución:**
- El plan gratuito de Render duerme los servicios después de 15 minutos de inactividad
- La primera petición después de dormir puede tardar ~30 segundos
- Considera usar un servicio de "ping" para mantenerlo activo
- O actualiza a un plan de pago

### La base de datos no acepta conexiones externas

**Solución:**
- Si usas Render Database, las conexiones son automáticas
- Si usas una base de datos externa, verifica que permita conexiones desde cualquier IP (0.0.0.0/0)
- O configura el firewall para permitir las IPs de Render

## 📊 Paso 9: Monitoreo y Mantenimiento

### 9.1 Ver logs en tiempo real

1. Ve al dashboard de Render
2. Selecciona tu servicio
3. Ve a **"Logs"** para ver errores y actividad

### 9.2 Configurar alertas

1. Ve a **"Settings"** > **"Notifications"**
2. Configura alertas para errores y deployments

### 9.3 Actualizar código

Cada vez que hagas `git push` a tu repositorio, Render automáticamente:
- Detectará los cambios
- Hará un nuevo deploy
- Te notificará cuando termine

### 9.4 Auto-deploy

Render tiene auto-deploy habilitado por defecto. Cada push a la rama principal (`main` o `master`) activará un nuevo deploy.

## 💰 Planes de Render

### Free Tier (Gratis)
- ✅ Servicios web gratuitos
- ✅ Base de datos PostgreSQL gratuita (90 días, luego $7/mes)
- ⚠️ Los servicios se duermen después de 15 min de inactividad
- ⚠️ Primera petición después de dormir tarda ~30 segundos

### Paid Plans
- Servicios siempre activos
- Más recursos
- Soporte prioritario

## 🎯 Checklist Final

Antes de considerar el deploy completo, verifica:

- [ ] Base de datos creada y accesible desde internet
- [ ] Scripts SQL ejecutados correctamente
- [ ] Variables de entorno configuradas en Render
- [ ] Código subido a Git
- [ ] Backend (API) desplegado en Render
- [ ] Frontend desplegado en Render (si aplica)
- [ ] Deploy completado sin errores
- [ ] Endpoints de API funcionando
- [ ] Frontend actualizado con URLs correctas (si aplica)
- [ ] Logs revisados y sin errores críticos

## 📚 Recursos Adicionales

- [Documentación de Render](https://render.com/docs)
- [Documentación de PHP en Render](https://render.com/docs/php)
- [Guía de Integración Frontend-Backend](./INTEGRACION.md)
- [Guía de Supabase](./SUPABASE_SETUP.md) (si usas Supabase)

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Render
2. Verifica la documentación de tu proveedor de base de datos
3. Consulta los issues comunes arriba
4. Revisa la documentación de Render

---

¡Feliz deploy en Render! 🚀

