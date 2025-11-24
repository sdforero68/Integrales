<?php
/**
 * Endpoint para registro de nuevos usuarios
 * POST /api/auth/register.php
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
    if (!isset($data['email']) || !isset($data['password']) || !isset($data['name'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Faltan campos requeridos: email, password, name'
        ]);
        exit;
    }
    
    $email = trim(strtolower($data['email']));
    $password = $data['password'];
    $name = trim($data['name']);
    $phone = isset($data['phone']) ? trim($data['phone']) : null;
    
    // Validaciones
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Correo electrónico inválido'
        ]);
        exit;
    }
    
    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'La contraseña debe tener al menos 6 caracteres'
        ]);
        exit;
    }
    
    if (empty($name)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'El nombre es requerido'
        ]);
        exit;
    }
    
    // Conectar a la base de datos
    $pdo = getDatabaseConnection();
    
    // Verificar si el usuario ya existe
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'message' => 'Este correo electrónico ya está registrado'
        ]);
        exit;
    }
    
    // Hash de la contraseña
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insertar nuevo usuario
    $stmt = $pdo->prepare("
        INSERT INTO usuarios (email, password_hash, name, phone) 
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$email, $passwordHash, $name, $phone]);
    
    $userId = $pdo->lastInsertId();
    
    // Generar token de sesión (simple, en producción usar JWT)
    $sessionToken = 'session_' . time() . '_' . bin2hex(random_bytes(16));
    
    // Respuesta exitosa
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Usuario registrado exitosamente',
        'data' => [
            'user' => [
                'id' => $userId,
                'email' => $email,
                'user_metadata' => [
                    'name' => $name,
                    'phone' => $phone
                ]
            ],
            'accessToken' => $sessionToken
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Error en registro: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al registrar usuario'
    ]);
} catch (Exception $e) {
    error_log("Error inesperado en registro: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error inesperado'
    ]);
}

