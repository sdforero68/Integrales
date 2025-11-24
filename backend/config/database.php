<?php
/**
 * Configuración de conexión a la base de datos
 * Lee las variables de entorno para la conexión
 */

// Cargar variables de entorno desde database.env si existe
$envFile = __DIR__ . '/database.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue; // Saltar comentarios
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

// Obtener configuración de variables de entorno (Vercel o local)
$dbHost = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?? 'localhost';
$dbPort = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?? '3306';
$dbName = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?? 'integrales_db';
$dbUser = $_ENV['DB_USER'] ?? getenv('DB_USER') ?? 'root';
$dbPassword = $_ENV['DB_PASSWORD'] ?? getenv('DB_PASSWORD') ?? '';

// Determinar el tipo de base de datos SQL
// Opciones: mysql, postgresql, sqlsrv, sqlite
$dbClient = $_ENV['DB_CLIENT'] ?? getenv('DB_CLIENT') ?? 'mysql';

/**
 * Crear conexión a la base de datos SQL
 * Soporta: MySQL, PostgreSQL, SQL Server, SQLite
 */
function getDatabaseConnection() {
    global $dbHost, $dbPort, $dbName, $dbUser, $dbPassword, $dbClient;
    
    try {
        $pdo = null;
        
        switch (strtolower($dbClient)) {
            case 'postgres':
            case 'postgresql':
                // Conexión PostgreSQL
                $dsn = "pgsql:host={$dbHost};port={$dbPort};dbname={$dbName}";
                $pdo = new PDO($dsn, $dbUser, $dbPassword, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]);
                break;
                
            case 'sqlsrv':
            case 'sqlserver':
                // Conexión SQL Server
                $dsn = "sqlsrv:Server={$dbHost},{$dbPort};Database={$dbName}";
                $pdo = new PDO($dsn, $dbUser, $dbPassword, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]);
                break;
                
            case 'sqlite':
                // Conexión SQLite
                $dsn = "sqlite:{$dbName}";
                $pdo = new PDO($dsn, null, null, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]);
                break;
                
            case 'mysql':
            case 'mariadb':
            default:
                // Conexión MySQL/MariaDB (por defecto)
                $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
                $pdo = new PDO($dsn, $dbUser, $dbPassword, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]);
                break;
        }
        
        return $pdo;
    } catch (PDOException $e) {
        error_log("Error de conexión a la base de datos: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error de conexión a la base de datos'
        ]);
        exit;
    }
}

