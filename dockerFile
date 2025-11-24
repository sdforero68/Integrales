FROM php:8.2-apache

# Copiar TODO tu proyecto al directorio público
COPY . /var/www/html/

# Habilitar mod_rewrite (útil si usas .htaccess)
RUN a2enmod rewrite

# Exponer el puerto que Render necesita
EXPOSE 10000

# Iniciar servidor PHP embebido para servir HTML + PHP
CMD ["php", "-S", "0.0.0.0:10000", "-t", "/var/www/html"]
