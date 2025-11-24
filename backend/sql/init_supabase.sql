-- Script de inicialización específico para Supabase (PostgreSQL)
-- Base de datos para Anita Integrales E-commerce
-- 
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto en Supabase
-- 2. Abre el SQL Editor
-- 3. Copia y pega este script completo
-- 4. Haz clic en "Run" o presiona Ctrl+Enter
-- 5. Verifica en Table Editor que las tablas se crearon

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para email
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    delivery_method VARCHAR(20) NOT NULL DEFAULT 'pickup',
    delivery_address TEXT,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendiente',
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT check_delivery_method CHECK (delivery_method IN ('delivery', 'pickup')),
    CONSTRAINT check_status CHECK (status IN ('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'))
);

-- Índices para pedidos
CREATE INDEX IF NOT EXISTS idx_pedidos_user_id ON pedidos(user_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at);

-- Tabla de items de pedido
CREATE TABLE IF NOT EXISTS pedido_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

-- Índice para items de pedido
CREATE INDEX IF NOT EXISTS idx_pedido_items_order_id ON pedido_items(order_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a usuarios
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Aplicar trigger a pedidos
DROP TRIGGER IF EXISTS update_pedidos_updated_at ON pedidos;
CREATE TRIGGER update_pedidos_updated_at 
    BEFORE UPDATE ON pedidos
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Tablas creadas exitosamente: usuarios, pedidos, pedido_items';
END $$;

