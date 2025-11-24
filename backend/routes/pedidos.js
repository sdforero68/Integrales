/**
 * Rutas de pedidos
 */

import express from 'express';
import { query, beginTransaction, commit, rollback } from '../config/database.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware para obtener usuario del token
const getUserIdFromToken = (req) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return decoded.userId;
  } catch {
    return null;
  }
};

// Obtener pedidos del usuario
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ error: 'Se requiere autenticación' });
    }

    const [pedidos] = await query(
      `SELECT 
        p.*,
        COUNT(pi.id) as items_count
      FROM pedidos p
      LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
      WHERE p.usuario_id = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: pedidos.length,
      data: pedidos
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// Obtener un pedido por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserIdFromToken(req);

    const [pedidos] = await query(
      'SELECT * FROM pedidos WHERE id = ? AND usuario_id = ?',
      [id, userId]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const pedido = pedidos[0];

    // Obtener items del pedido
    const [items] = await query(
      `SELECT 
        pi.*,
        p.nombre,
        p.imagen,
        p.slug
      FROM pedido_items pi
      INNER JOIN productos p ON pi.producto_id = p.id
      WHERE pi.pedido_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...pedido,
        items
      }
    });
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
});

// Crear un nuevo pedido
router.post('/', async (req, res) => {
  const connection = await beginTransaction();
  try {
    const userId = getUserIdFromToken(req);
    const {
      metodo_entrega,
      metodo_pago,
      direccion_entrega,
      telefono_contacto,
      notas,
      fecha_entrega,
      items
    } = req.body;

    if (!userId) {
      await rollback(connection);
      return res.status(401).json({ error: 'Se requiere autenticación' });
    }

    if (!items || items.length === 0) {
      await rollback(connection);
      return res.status(400).json({ error: 'El pedido debe tener al menos un item' });
    }

    // Calcular totales
    let subtotal = 0;
    for (const item of items) {
      const [productos] = await connection.query(
        'SELECT precio FROM productos WHERE id = ? AND activo = 1',
        [item.producto_id]
      );

      if (productos.length === 0) {
        await rollback(connection);
        return res.status(400).json({ error: `Producto ${item.producto_id} no encontrado` });
      }

      subtotal += productos[0].precio * item.cantidad;
    }

    const costo_envio = metodo_entrega === 'domicilio' ? 5000 : 0;
    const total = subtotal + costo_envio;

    // Generar número de pedido único
    const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
    const numeroPedido = `PED-${Date.now()}-${randomStr}`;

    // Crear pedido
    const [result] = await connection.query(
      `INSERT INTO pedidos (
        usuario_id, numero_pedido, metodo_entrega, metodo_pago,
        subtotal, costo_envio, total, direccion_entrega,
        telefono_contacto, notas, fecha_entrega
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, numeroPedido, metodo_entrega, metodo_pago,
        subtotal, costo_envio, total, direccion_entrega,
        telefono_contacto, notas || null, fecha_entrega || null
      ]
    );

    const pedidoId = result.insertId;

    // Crear items del pedido
    for (const item of items) {
      const [productos] = await connection.query(
        'SELECT precio FROM productos WHERE id = ?',
        [item.producto_id]
      );

      const precioUnitario = productos[0].precio;
      const itemSubtotal = precioUnitario * item.cantidad;

      await connection.query(
        `INSERT INTO pedido_items (
          pedido_id, producto_id, cantidad, precio_unitario, subtotal
        ) VALUES (?, ?, ?, ?, ?)`,
        [pedidoId, item.producto_id, item.cantidad, precioUnitario, itemSubtotal]
      );
    }

    // Vaciar carrito del usuario
    const [carritos] = await connection.query(
      'SELECT id FROM carritos WHERE usuario_id = ?',
      [userId]
    );

    if (carritos.length > 0) {
      await connection.query(
        'DELETE FROM carrito_items WHERE carrito_id IN (?)',
        [carritos.map(c => c.id)]
      );
    }

    await commit(connection);

    // Obtener pedido completo
    const [pedidos] = await query(
      'SELECT * FROM pedidos WHERE id = ?',
      [pedidoId]
    );

    const [pedidoItems] = await query(
      `SELECT 
        pi.*,
        p.nombre,
        p.imagen,
        p.slug
      FROM pedido_items pi
      INNER JOIN productos p ON pi.producto_id = p.id
      WHERE pi.pedido_id = ?`,
      [pedidoId]
    );

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: {
        ...pedidos[0],
        items: pedidoItems
      }
    });
  } catch (error) {
    await rollback(connection);
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});

export default router;

