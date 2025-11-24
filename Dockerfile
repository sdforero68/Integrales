FROM php:8.2-cli

# Copiar TODO tu proyecto
COPY . /var/www/html/

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Exponer el puerto (Render usa la variable $PORT)
EXPOSE $PORT

# Iniciar servidor PHP embebido desde backend/api
# Render inyecta $PORT automáticamente
CMD php -S 0.0.0.0:${PORT} -t backend/api
