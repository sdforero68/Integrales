-- Script de inicialización para SQL Server
-- Base de datos para Anita Integrales E-commerce

-- Crear base de datos (ejecutar como administrador)
-- CREATE DATABASE integrales_db;
-- USE integrales_db;

-- Tabla de usuarios
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'usuarios') AND type in (N'U'))
BEGIN
    CREATE TABLE usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
    
    CREATE INDEX idx_usuarios_email ON usuarios(email);
END;

-- Tabla de pedidos
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'pedidos') AND type in (N'U'))
BEGIN
    CREATE TABLE pedidos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
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
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        CONSTRAINT check_delivery_method CHECK (delivery_method IN ('delivery', 'pickup')),
        CONSTRAINT check_status CHECK (status IN ('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'))
    );
    
    CREATE INDEX idx_pedidos_user_id ON pedidos(user_id);
    CREATE INDEX idx_pedidos_status ON pedidos(status);
    CREATE INDEX idx_pedidos_created_at ON pedidos(created_at);
END;

-- Tabla de items de pedido
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'pedido_items') AND type in (N'U'))
BEGIN
    CREATE TABLE pedido_items (
        id INT IDENTITY(1,1) PRIMARY KEY,
        order_id INT NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10, 2) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (order_id) REFERENCES pedidos(id) ON DELETE CASCADE
    );
    
    CREATE INDEX idx_pedido_items_order_id ON pedido_items(order_id);
END;

-- Trigger para actualizar updated_at automáticamente
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_usuarios_updated_at')
    DROP TRIGGER trg_usuarios_updated_at;
GO

CREATE TRIGGER trg_usuarios_updated_at
ON usuarios
AFTER UPDATE
AS
BEGIN
    UPDATE usuarios
    SET updated_at = GETDATE()
    FROM usuarios u
    INNER JOIN inserted i ON u.id = i.id;
END;
GO

IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_pedidos_updated_at')
    DROP TRIGGER trg_pedidos_updated_at;
GO

CREATE TRIGGER trg_pedidos_updated_at
ON pedidos
AFTER UPDATE
AS
BEGIN
    UPDATE pedidos
    SET updated_at = GETDATE()
    FROM pedidos p
    INNER JOIN inserted i ON p.id = i.id;
END;
GO

