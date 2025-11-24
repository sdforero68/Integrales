# 🔐 Configuración de Variables de Entorno para Supabase

Basándote en tu cadena de conexión de Supabase, aquí están los valores exactos que debes usar.

## 📋 Tu Cadena de Conexión

```
postgresql://postgres:AnitaIntegrales369@db.ylrhkmzqylwqbjpxlllk.supabase.co:5432/postgres
```

## 🔍 Valores Extraídos

De tu cadena de conexión, estos son los valores:

| Variable        | Valor                                 |
| --------------- | ------------------------------------- |
| **DB_CLIENT**   | `postgresql`                          |
| **DB_HOST**     | `db.ylrhkmzqylwqbjpxlllk.supabase.co` |
| **DB_PORT**     | `5432`                                |
| **DB_NAME**     | `postgres`                            |
| **DB_USER**     | `postgres`                            |
| **DB_PASSWORD** | `AnitaIntegrales369`                  |

## 🚀 Configuración en Render

### Paso 1: Ir a tu Servicio en Render

1. Ve a tu dashboard de Render
2. Selecciona tu servicio (anita-integrales-api)
3. Ve a la pestaña **"Environment"**

### Paso 2: Agregar Variables de Entorno

Haz clic en **"Add Environment Variable"** y agrega cada una:

**Variable 1:**

- **Key**: `DB_CLIENT`
- **Value**: `postgresql`
- ✅ Marca: Production, Preview, Development

**Variable 2:**

- **Key**: `DB_HOST`
- **Value**: `db.ylrhkmzqylwqbjpxlllk.supabase.co`
- ✅ Marca: Production, Preview, Development

**Variable 3:**

- **Key**: `DB_PORT`
- **Value**: `5432`
- ✅ Marca: Production, Preview, Development

**Variable 4:**

- **Key**: `DB_NAME`
- **Value**: `postgres`
- ✅ Marca: Production, Preview, Development

**Variable 5:**

- **Key**: `DB_USER`
- **Value**: `postgres`
- ✅ Marca: Production, Preview, Development

**Variable 6:**

- **Key**: `DB_PASSWORD`
- **Value**: `AnitaIntegrales369`
- ✅ Marca: Production, Preview, Development

### Paso 3: Guardar y Redesplegar

Después de agregar todas las variables:

1. Haz clic en **"Save Changes"**
2. Render automáticamente hará un nuevo deploy
3. Espera a que termine el deploy

## 📝 Configuración Local (Opcional)

Si quieres probar localmente, actualiza `backend/config/database.env`:

```env
DB_CLIENT=postgresql
DB_HOST=db.ylrhkmzqylwqbjpxlllk.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=AnitaIntegrales369
```

**⚠️ IMPORTANTE**:

- Este archivo está en `.gitignore`, así que NO se subirá a Git
- Solo úsalo para desarrollo local
- Nunca subas credenciales a Git

## ✅ Verificar la Conexión

Después de configurar las variables, prueba el endpoint:

```bash
curl -X POST https://tu-servicio.onrender.com/auth/register.php \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

Si funciona, deberías recibir una respuesta con el usuario creado.

## 🔒 Seguridad

- ✅ Las variables de entorno en Render están encriptadas
- ✅ No se muestran en los logs
- ✅ Solo tú puedes verlas en el dashboard
- ❌ NO las compartas públicamente
- ❌ NO las subas a Git

## 🆘 Si hay Problemas

### Error: "password authentication failed"

- Verifica que la contraseña sea exactamente `AnitaIntegrales369`
- Asegúrate de no tener espacios extra
- Verifica que el usuario sea `postgres`

### Error: "could not connect to server"

- Verifica que el host sea exactamente `db.ylrhkmzqylwqbjpxlllk.supabase.co`
- Verifica que el puerto sea `5432`
- Asegúrate de que tu proyecto de Supabase esté activo

---

¡Listo! Con estos valores tu aplicación debería conectarse correctamente a Supabase. 🚀
