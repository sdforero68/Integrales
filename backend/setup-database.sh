#!/bin/bash

# Script para configurar la base de datos MySQL
# Uso: ./setup-database.sh

echo "🗄️  Configurando base de datos MySQL para Anita Integrales"
echo ""

# Agregar MySQL al PATH
export PATH="/usr/local/mysql/bin:$PATH"

# Solicitar contraseña de MySQL
echo "Por favor, ingresa la contraseña del usuario root de MySQL:"
read -s MYSQL_PASSWORD

echo ""
echo "📝 Creando base de datos y tablas..."

# Ejecutar script de inicialización
mysql -u root -p"$MYSQL_PASSWORD" < sql/init.sql

if [ $? -eq 0 ]; then
    echo "✅ Base de datos y tablas creadas exitosamente"
else
    echo "❌ Error al crear la base de datos"
    exit 1
fi

echo ""
echo "📦 Insertando datos de ejemplo..."

# Ejecutar script de seeds
mysql -u root -p"$MYSQL_PASSWORD" < sql/seeds.sql

if [ $? -eq 0 ]; then
    echo "✅ Datos de ejemplo insertados exitosamente"
else
    echo "❌ Error al insertar datos de ejemplo"
    exit 1
fi

echo ""
echo "🔍 Verificando la base de datos..."

# Verificar que las tablas se crearon
mysql -u root -p"$MYSQL_PASSWORD" -e "USE integrales_db; SHOW TABLES;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Base de datos configurada correctamente!"
    echo ""
    echo "📊 Tablas creadas:"
    mysql -u root -p"$MYSQL_PASSWORD" -e "USE integrales_db; SHOW TABLES;" 2>/dev/null
    echo ""
    echo "📝 Próximos pasos:"
    echo "1. Edita backend/config/database.env y actualiza DB_PASSWORD con tu contraseña"
    echo "2. Ejecuta: cd backend && npm install"
    echo "3. Ejecuta: npm run dev"
else
    echo "❌ Error al verificar la base de datos"
    exit 1
fi

