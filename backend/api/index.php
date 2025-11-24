<?php
/**
 * Punto de entrada principal de la API
 * Maneja la ruta raíz y muestra información de la API
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Obtener la ruta de la petición
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remover query string
$path = parse_url($requestUri, PHP_URL_PATH);

// Si es la ruta raíz, mostrar información de la API
if ($path === '/' || $path === '' || $path === '/index.php') {
    echo json_encode([
        'name' => 'Anita Integrales API',
        'version' => '1.0.0',
        'status' => 'active',
        'endpoints' => [
            'POST /auth/register.php' => 'Registrar nuevo usuario',
            'POST /auth/login.php' => 'Iniciar sesión',
            'GET /orders.php?userId=X' => 'Obtener pedidos del usuario',
            'POST /orders.php' => 'Crear nuevo pedido'
        ],
        'documentation' => 'Consulta la documentación para más detalles'
    ], JSON_PRETTY_PRINT);
    exit;
}

// Si la ruta no es la raíz, intentar servir el archivo correspondiente
// Remover / del inicio si existe
$path = ltrim($path, '/');

// Si la ruta está vacía después de remover /, mostrar info de API
if (empty($path)) {
    echo json_encode([
        'name' => 'Anita Integrales API',
        'version' => '1.0.0',
        'status' => 'active',
        'endpoints' => [
            'POST /auth/register.php' => 'Registrar nuevo usuario',
            'POST /auth/login.php' => 'Iniciar sesión',
            'GET /orders.php?userId=X' => 'Obtener pedidos del usuario',
            'POST /orders.php' => 'Crear nuevo pedido'
        ]
    ], JSON_PRETTY_PRINT);
    exit;
}

// Construir la ruta del archivo
$filePath = __DIR__ . '/' . $path;

// Si el archivo existe y es PHP, incluirlo
if (file_exists($filePath) && is_file($filePath) && pathinfo($filePath, PATHINFO_EXTENSION) === 'php') {
    require_once $filePath;
    exit;
}

// Si no existe, intentar buscar en subdirectorios
$pathParts = explode('/', trim($path, '/'));

if (count($pathParts) >= 2) {
    $dir = $pathParts[0];
    $file = $pathParts[1];
    $filePath = __DIR__ . '/' . $dir . '/' . $file . '.php';
    
    if (file_exists($filePath) && is_file($filePath)) {
        require_once $filePath;
        exit;
    }
}

// Si llegamos aquí, el endpoint no existe
http_response_code(404);
echo json_encode([
    'success' => false,
    'message' => 'Endpoint no encontrado',
    'requested_path' => $path,
    'available_endpoints' => [
        'POST /auth/register.php',
        'POST /auth/login.php',
        'GET /orders.php',
        'POST /orders.php'
    ]
], JSON_PRETTY_PRINT);

