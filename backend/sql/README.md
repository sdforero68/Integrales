# Scripts SQL para Base de Datos

Este directorio contiene scripts de inicialización para diferentes sistemas de gestión de bases de datos SQL.

## 📁 Archivos

- **`init.sql`**: Script genérico compatible con la mayoría de bases de datos SQL estándar
- **`init_mysql.sql`**: Script optimizado para MySQL/MariaDB
- **`init_postgresql.sql`**: Script optimizado para PostgreSQL
- **`init_sqlserver.sql`**: Script optimizado para SQL Server

## 🚀 Uso

### PostgreSQL

```bash
# Crear base de datos
createdb integrales_db

# Ejecutar script
psql -U postgres -d integrales_db -f init_postgresql.sql
```

O desde psql:
```sql
CREATE DATABASE integrales_db;
\c integrales_db
\i init_postgresql.sql
```

### MySQL/MariaDB

```bash
# Crear base de datos y ejecutar script
mysql -u root -p < init_mysql.sql
```

O desde mysql:
```sql
CREATE DATABASE IF NOT EXISTS integrales_db;
USE integrales_db;
SOURCE init_mysql.sql;
```

### SQL Server

```bash
sqlcmd -S localhost -d integrales_db -i init_sqlserver.sql
```

O desde SQL Server Management Studio:
- Abre el archivo `init_sqlserver.sql`
- Ejecuta el script completo

### SQL Genérico

El archivo `init.sql` usa sintaxis SQL estándar compatible con la mayoría de SGBD. Sin embargo, algunos elementos pueden necesitar ajustes según tu base de datos específica:

- **SERIAL**: En MySQL usa `INT AUTO_INCREMENT`, en SQL Server usa `IDENTITY(1,1)`
- **IF NOT EXISTS**: Algunos SGBD pueden no soportarlo en todas las sentencias
- **Triggers para updated_at**: Cada SGBD tiene su propia sintaxis

## 📋 Estructura de Tablas

Todas las versiones crean las mismas tablas:

1. **usuarios**: Información de usuarios
2. **pedidos**: Información de pedidos
3. **pedido_items**: Items de cada pedido

Las relaciones se mantienen mediante FOREIGN KEY constraints.

## ⚙️ Diferencias entre Versiones

### MySQL/MariaDB
- Usa `AUTO_INCREMENT` para IDs
- Usa `ENUM` para campos con valores limitados
- `ON UPDATE CURRENT_TIMESTAMP` para updated_at automático
- Motor InnoDB con charset utf8mb4

### PostgreSQL
- Usa `SERIAL` para IDs
- Usa `CHECK` constraints en lugar de ENUM
- Triggers para updated_at automático
- Soporte nativo para tipos de datos avanzados

### SQL Server
- Usa `IDENTITY(1,1)` para IDs
- Usa `CHECK` constraints
- Triggers para updated_at automático
- Usa `DATETIME` en lugar de `TIMESTAMP`

## 🔧 Personalización

Si necesitas ajustar los scripts para tu base de datos específica:

1. Copia el script más cercano a tu SGBD
2. Ajusta los tipos de datos según sea necesario
3. Modifica los triggers/funciones según la sintaxis de tu SGBD
4. Prueba en un entorno de desarrollo primero

## 📝 Notas

- Todos los scripts crean índices para mejorar el rendimiento
- Las foreign keys tienen `ON DELETE CASCADE` para mantener integridad
- Los timestamps usan la zona horaria del servidor por defecto
- Ajusta los tamaños de VARCHAR según tus necesidades
