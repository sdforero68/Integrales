<?php
/**
 * Endpoint para inicio de sesión
 * POST /api/auth/login.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Solo permitir método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
    exit;
}

require_once '../../config/database.php';

try {
    // Obtener datos del cuerpo de la petición
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validar campos requeridos
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Faltan campos requeridos: email, password'
        ]);
        exit;
    }
    
    $email = trim(strtolower($data['email']));
    $password = $data['password'];
    
    // Validar email
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Correo electrónico inválido'
        ]);
        exit;
    }
    
    // Conectar a la base de datos
    $pdo = getDatabaseConnection();
    
    // Buscar usuario
    $stmt = $pdo->prepare("SELECT id, email, password_hash, name, phone FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Correo o contraseña incorrectos'
        ]);
        exit;
    }
    
    // Verificar contraseña
    if (!password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Correo o contraseña incorrectos'
        ]);
        exit;
    }
    
    // Generar token de sesión (simple, en producción usar JWT)
    $sessionToken = 'session_' . time() . '_' . bin2hex(random_bytes(16));
    
    // Respuesta exitosa
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Inicio de sesión exitoso',
        'data' => [
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'user_metadata' => [
                    'name' => $user['name'],
                    'phone' => $user['phone']
                ]
            ],
            'accessToken' => $sessionToken
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Error en login: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al iniciar sesión'
    ]);
} catch (Exception $e) {
    error_log("Error inesperado en login: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error inesperado'
    ]);
}

