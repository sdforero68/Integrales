# 🗄️ Guía de Configuración con Supabase

Guía completa para configurar tu proyecto con Supabase como base de datos.

## 📋 Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) e inicia sesión
2. Haz clic en **"New Project"**
3. Completa la información:
   - **Name**: Anita Integrales (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (¡GUÁRDALA!)
   - **Region**: Elige la región más cercana a tus usuarios
4. Haz clic en **"Create new project"**
5. Espera 2-3 minutos mientras se crea el proyecto

## 🔍 Paso 2: Obtener Credenciales de Conexión

### 2.1 Obtener Host y Puerto

1. En tu proyecto de Supabase, ve a **Settings** (⚙️) > **Database**
2. Busca la sección **"Connection string"** o **"Connection info"**
3. Verás algo como:

```
Host: db.ylrhkmzqylwqbjpxlllk.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: [tu contraseña que creaste]
```

**O también puedes obtenerlo del Project URL:**
- Si tu Project URL es: `https://ylrhkmzqylwqbjpxlllk.supabase.co`
- Entonces tu DB_HOST es: `db.ylrhkmzqylwqbjpxlllk.supabase.co`
- (Nota: agrega `db.` al inicio del subdominio)

### 2.2 Obtener Contraseña

La contraseña es la que creaste al crear el proyecto. Si la olvidaste:
1. Ve a **Settings** > **Database**
2. Busca **"Database password"** o **"Reset database password"**
3. Puedes resetearla si es necesario

## 📝 Paso 3: Crear las Tablas en Supabase

### Opción A: Usando el SQL Editor (Recomendado)

1. En Supabase, ve a **SQL Editor** (en el menú lateral)
2. Haz clic en **"New query"**
3. Copia y pega el contenido del archivo `backend/sql/init_postgresql.sql`
4. Haz clic en **"Run"** o presiona `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
5. Verifica que las tablas se crearon correctamente:
   - Ve a **Table Editor** en el menú lateral
   - Deberías ver las tablas: `usuarios`, `pedidos`, `pedido_items`

### Opción B: Usando psql (Línea de comandos)

```bash
# Conectar a Supabase
psql "postgresql://postgres:[TU_PASSWORD]@db.ylrhkmzqylwqbjpxlllk.supabase.co:5432/postgres"

# Luego ejecutar el script
\i backend/sql/init_postgresql.sql
```

## 🔐 Paso 4: Configurar Variables de Entorno en Vercel

Basándote en tu Project URL: `https://ylrhkmzqylwqbjpxlllk.supabase.co`

Configura estas variables en Vercel:

```
DB_CLIENT = postgresql
DB_HOST = db.ylrhkmzqylwqbjpxlllk.supabase.co
DB_PORT = 5432
DB_NAME = postgres
DB_USER = postgres
DB_PASSWORD = [la contraseña que creaste al crear el proyecto]
```

### Instrucciones Detalladas:

1. En Vercel, ve a tu proyecto
2. Ve a **Settings** > **Environment Variables**
3. Agrega cada variable:

**Variable 1:**
- Key: `DB_CLIENT`
- Value: `postgresql`
- ✅ Marca: Production, Preview, Development

**Variable 2:**
- Key: `DB_HOST`
- Value: `db.ylrhkmzqylwqbjpxlllk.supabase.co`
- ✅ Marca: Production, Preview, Development

**Variable 3:**
- Key: `DB_PORT`
- Value: `5432`
- ✅ Marca: Production, Preview, Development

**Variable 4:**
- Key: `DB_NAME`
- Value: `postgres`
- ✅ Marca: Production, Preview, Development

**Variable 5:**
- Key: `DB_USER`
- Value: `postgres`
- ✅ Marca: Production, Preview, Development

**Variable 6:**
- Key: `DB_PASSWORD`
- Value: `[tu contraseña de Supabase]`
- ✅ Marca: Production, Preview, Development

## ✅ Paso 5: Verificar la Conexión

### 5.1 Verificar en Supabase

1. Ve a **Table Editor** en Supabase
2. Deberías ver las tablas creadas:
   - `usuarios`
   - `pedidos`
   - `pedido_items`

### 5.2 Probar la API

Después del deploy en Vercel, prueba el endpoint de registro:

```bash
curl -X POST https://tu-proyecto.vercel.app/api/auth/register.php \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

Si funciona, deberías recibir una respuesta con el usuario creado.

## 🔒 Paso 6: Configurar Seguridad (Opcional pero Recomendado)

### 6.1 Row Level Security (RLS)

Supabase tiene Row Level Security habilitado por defecto. Para este proyecto, puedes:

1. Ve a **Authentication** > **Policies** en Supabase
2. O deshabilita RLS temporalmente para las tablas (solo si es necesario):
   ```sql
   ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
   ALTER TABLE pedidos DISABLE ROW LEVEL SECURITY;
   ALTER TABLE pedido_items DISABLE ROW LEVEL SECURITY;
   ```

**Nota**: Como estás usando PHP directamente con PDO, RLS puede no ser necesario, pero es buena práctica mantenerlo habilitado y configurar políticas apropiadas.

### 6.2 Connection Pooling (Opcional)

Para mejor rendimiento, Supabase ofrece connection pooling:
- Ve a **Settings** > **Database**
- Busca **"Connection pooling"**
- Usa el puerto `6543` en lugar de `5432` para connection pooling

**Si usas connection pooling, cambia en Vercel:**
```
DB_PORT = 6543
```

## 📊 Paso 7: Monitorear tu Base de Datos

En Supabase puedes:
- Ver logs de queries en **Logs** > **Postgres Logs**
- Ver métricas en **Database** > **Reports**
- Ver el uso de almacenamiento en el dashboard

## 🔍 Solución de Problemas

### Error: "password authentication failed"

**Solución:**
- Verifica que la contraseña en Vercel sea exactamente la misma que creaste en Supabase
- Asegúrate de no tener espacios extra
- Prueba resetear la contraseña en Supabase

### Error: "could not connect to server"

**Solución:**
- Verifica que el DB_HOST sea correcto (debe empezar con `db.`)
- Verifica que el puerto sea `5432` (o `6543` si usas pooling)
- Asegúrate de que tu proyecto de Supabase esté activo

### Error: "relation does not exist"

**Solución:**
- Verifica que ejecutaste el script SQL correctamente
- Ve a **Table Editor** en Supabase y confirma que las tablas existen
- Verifica que el DB_NAME sea `postgres`

### Las tablas no aparecen

**Solución:**
1. Ve a **SQL Editor** en Supabase
2. Ejecuta: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
3. Si no aparecen, ejecuta nuevamente el script `init_postgresql.sql`

## 📝 Notas Importantes

1. **Project URL vs Database Host:**
   - Project URL: `https://ylrhkmzqylwqbjpxlllk.supabase.co` (para API REST)
   - Database Host: `db.ylrhkmzqylwqbjpxlllk.supabase.co` (para conexión directa)

2. **Puerto:**
   - Puerto directo: `5432`
   - Puerto con pooling: `6543` (mejor para producción)

3. **Base de datos:**
   - El nombre por defecto es `postgres`
   - No necesitas crear una base de datos nueva

4. **Usuario:**
   - El usuario por defecto es `postgres`
   - No puedes cambiar este usuario

## ✅ Checklist Final

- [ ] Proyecto creado en Supabase
- [ ] Contraseña guardada de forma segura
- [ ] Script SQL ejecutado correctamente
- [ ] Tablas creadas (usuarios, pedidos, pedido_items)
- [ ] Variables de entorno configuradas en Vercel
- [ ] Deploy completado en Vercel
- [ ] Endpoint de registro probado y funcionando
- [ ] Logs revisados sin errores

---

¡Listo! Tu proyecto está configurado con Supabase. 🚀

