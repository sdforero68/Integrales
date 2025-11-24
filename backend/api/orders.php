<?php
/**
 * Endpoint para gestión de pedidos
 * GET /api/orders.php - Obtener pedidos del usuario
 * POST /api/orders.php - Crear nuevo pedido
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';

/**
 * Obtener el ID del usuario desde el token (simplificado)
 * En producción, deberías validar el token JWT correctamente
 */
function getUserIdFromRequest() {
    // Obtener token del header Authorization o del body
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
    
    if ($authHeader) {
        // Formato: "Bearer token" o solo "token"
        $token = str_replace('Bearer ', '', $authHeader);
    } else {
        // Intentar obtener del body si está en POST
        $data = json_decode(file_get_contents('php://input'), true);
        $token = $data['accessToken'] ?? $data['token'] ?? null;
    }
    
    // Por ahora, obtener userId directamente del body o query params
    // En producción, validar el token y extraer el userId
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $userId = $data['userId'] ?? $_GET['userId'] ?? null;
    
    return $userId;
}

try {
    $pdo = getDatabaseConnection();
    
    // GET - Obtener pedidos del usuario
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $userId = $_GET['userId'] ?? null;
        
        if (!$userId) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Se requiere userId'
            ]);
            exit;
        }
        
        // Obtener pedidos del usuario
        $stmt = $pdo->prepare("
            SELECT 
                id,
                user_id,
                total,
                subtotal,
                delivery_fee,
                delivery_method,
                delivery_address,
                payment_method,
                status,
                customer_name,
                customer_email,
                customer_phone,
                notes,
                created_at
            FROM pedidos 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        ");
        $stmt->execute([$userId]);
        $orders = $stmt->fetchAll();
        
        // Para cada pedido, obtener sus items
        foreach ($orders as &$order) {
            $itemsStmt = $pdo->prepare("
                SELECT 
                    id,
                    product_id,
                    product_name,
                    quantity,
                    price
                FROM pedido_items 
                WHERE order_id = ?
            ");
            $itemsStmt->execute([$order['id']]);
            $order['items'] = $itemsStmt->fetchAll();
            
            // Convertir tipos numéricos
            $order['id'] = (int)$order['id'];
            $order['user_id'] = (int)$order['user_id'];
            $order['total'] = (float)$order['total'];
            $order['subtotal'] = (float)$order['subtotal'];
            $order['delivery_fee'] = (float)$order['delivery_fee'];
            
            foreach ($order['items'] as &$item) {
                $item['id'] = (int)$item['id'];
                $item['quantity'] = (int)$item['quantity'];
                $item['price'] = (float)$item['price'];
            }
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $orders
        ]);
        exit;
    }
    
    // POST - Crear nuevo pedido
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validar campos requeridos
        if (!isset($data['userId']) || !isset($data['items']) || !isset($data['total'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Faltan campos requeridos: userId, items, total'
            ]);
            exit;
        }
        
        $userId = $data['userId'];
        $items = $data['items'];
        $total = (float)$data['total'];
        $subtotal = (float)($data['subtotal'] ?? $total);
        $deliveryFee = (float)($data['deliveryFee'] ?? 0);
        $deliveryMethod = $data['deliveryMethod'] ?? 'pickup';
        $deliveryAddress = $data['deliveryAddress'] ?? null;
        $paymentMethod = $data['paymentMethod'] ?? 'cash';
        $customerInfo = $data['customerInfo'] ?? [];
        $notes = $data['notes'] ?? null;
        
        // Validar que haya items
        if (empty($items) || !is_array($items)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'El pedido debe contener al menos un item'
            ]);
            exit;
        }
        
        // Validar información del cliente
        $customerName = $customerInfo['name'] ?? '';
        $customerEmail = $customerInfo['email'] ?? '';
        $customerPhone = $customerInfo['phone'] ?? null;
        
        if (empty($customerName) || empty($customerEmail)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Se requiere nombre y email del cliente'
            ]);
            exit;
        }
        
        // Iniciar transacción
        $pdo->beginTransaction();
        
        try {
            // Insertar pedido
            $stmt = $pdo->prepare("
                INSERT INTO pedidos (
                    user_id, total, subtotal, delivery_fee, 
                    delivery_method, delivery_address, payment_method,
                    customer_name, customer_email, customer_phone, notes, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')
            ");
            $stmt->execute([
                $userId,
                $total,
                $subtotal,
                $deliveryFee,
                $deliveryMethod,
                $deliveryAddress,
                $paymentMethod,
                $customerName,
                $customerEmail,
                $customerPhone,
                $notes
            ]);
            
            $orderId = $pdo->lastInsertId();
            
            // Insertar items del pedido
            $itemsStmt = $pdo->prepare("
                INSERT INTO pedido_items (order_id, product_id, product_name, quantity, price)
                VALUES (?, ?, ?, ?, ?)
            ");
            
            foreach ($items as $item) {
                $itemsStmt->execute([
                    $orderId,
                    $item['id'] ?? $item['product_id'] ?? '',
                    $item['name'] ?? $item['product_name'] ?? '',
                    $item['quantity'] ?? 1,
                    $item['price'] ?? 0
                ]);
            }
            
            // Confirmar transacción
            $pdo->commit();
            
            // Obtener el pedido completo creado
            $stmt = $pdo->prepare("
                SELECT 
                    id,
                    user_id,
                    total,
                    subtotal,
                    delivery_fee,
                    delivery_method,
                    delivery_address,
                    payment_method,
                    status,
                    customer_name,
                    customer_email,
                    customer_phone,
                    notes,
                    created_at
                FROM pedidos 
                WHERE id = ?
            ");
            $stmt->execute([$orderId]);
            $order = $stmt->fetch();
            
            // Obtener items
            $itemsStmt = $pdo->prepare("
                SELECT 
                    id,
                    product_id,
                    product_name,
                    quantity,
                    price
                FROM pedido_items 
                WHERE order_id = ?
            ");
            $itemsStmt->execute([$orderId]);
            $order['items'] = $itemsStmt->fetchAll();
            
            // Convertir tipos
            $order['id'] = (int)$order['id'];
            $order['user_id'] = (int)$order['user_id'];
            $order['total'] = (float)$order['total'];
            $order['subtotal'] = (float)$order['subtotal'];
            $order['delivery_fee'] = (float)$order['delivery_fee'];
            
            foreach ($order['items'] as &$item) {
                $item['id'] = (int)$item['id'];
                $item['quantity'] = (int)$item['quantity'];
                $item['price'] = (float)$item['price'];
            }
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Pedido creado exitosamente',
                'data' => $order
            ]);
            
        } catch (Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
        exit;
    }
    
    // Método no soportado
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
    
} catch (PDOException $e) {
    error_log("Error en orders: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al procesar la solicitud'
    ]);
} catch (Exception $e) {
    error_log("Error inesperado en orders: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error inesperado'
    ]);
}

