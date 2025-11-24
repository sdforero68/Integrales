# 🔧 Solución al Error 404 en Render

## Problema

Render muestra "Not Found - The requested resource / was not found on this server" porque no hay una ruta raíz definida.

## ✅ Solución

He creado el archivo `backend/api/index.php` que maneja la ruta raíz. Ahora necesitas verificar tu configuración en Render.

## 📋 Verificar Configuración en Render

### Opción 1: Usando Servidor PHP Embebido (Recomendado)

Si estás usando el servidor PHP embebido, verifica que tu **Start Command** sea:

```
php -S 0.0.0.0:$PORT -t backend/api
```

**Pasos:**

1. Ve a tu servicio en Render
2. Ve a **Settings**
3. Busca **"Start Command"**
4. Asegúrate de que sea exactamente: `php -S 0.0.0.0:$PORT -t backend/api`
5. Guarda los cambios
6. Render hará un nuevo deploy automáticamente

### Opción 2: Usando Docker

Si estás usando Docker (tienes un `dockerFile`), necesitas ajustar la configuración:

**En tu dockerFile:**

```dockerfile
FROM php:8.2-apache

# Copiar TODO tu proyecto
COPY . /var/www/html/

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Exponer el puerto
EXPOSE $PORT

# Iniciar Apache
CMD apache2-foreground
```

**O usar servidor PHP embebido:**

```dockerfile
FROM php:8.2-cli

# Copiar proyecto
COPY . /var/www/html/

# Exponer puerto
EXPOSE $PORT

# Iniciar servidor PHP
CMD php -S 0.0.0.0:$PORT -t /var/www/html/backend/api
```

**En Render:**

1. Ve a **Settings** > **Build & Deploy**
2. **Dockerfile Path**: `dockerFile` (o el nombre de tu archivo)
3. **Start Command**: Déjalo vacío (se usa el CMD del Dockerfile)

## ✅ Verificar que Funciona

Después del deploy, prueba:

1. **Ruta raíz**: `https://tu-servicio.onrender.com/`

   - Debería mostrar información de la API en JSON

2. **Endpoint de registro**: `https://tu-servicio.onrender.com/auth/register.php`
   - Debería funcionar correctamente

## 🔍 Si Sigue Sin Funcionar

### Verificar Logs en Render

1. Ve a tu servicio en Render
2. Haz clic en **"Logs"**
3. Busca errores relacionados con:
   - "Cannot bind to address"
   - "Port already in use"
   - "File not found"

### Verificar Estructura de Archivos

Asegúrate de que tengas:

```
backend/
  api/
    index.php          ← Debe existir (recién creado)
    auth/
      login.php
      register.php
    orders.php
```

### Verificar Variables de Entorno

Asegúrate de tener configuradas:

- `DB_CLIENT`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

## 📝 Notas Importantes

- El archivo `index.php` ahora maneja la ruta raíz `/`
- Los endpoints siguen funcionando: `/auth/login.php`, `/orders.php`, etc.
- Si usas Docker, asegúrate de que el Dockerfile esté correctamente configurado
- Render usa la variable `$PORT` automáticamente, no necesitas cambiarla

---

¡Con estos cambios, el error 404 debería desaparecer! 🚀
