/**
 * Rutas del carrito de compras
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

// Obtener carrito del usuario
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return res.json({ success: true, data: [] });
    }

    let carritoId;
    
    if (userId) {
      // Buscar carrito por usuario
      const [carritos] = await query(
        'SELECT id FROM carritos WHERE usuario_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
      );
      carritoId = carritos.length > 0 ? carritos[0].id : null;
    } else if (sessionId) {
      // Buscar carrito por sesión
      const [carritos] = await query(
        'SELECT id FROM carritos WHERE sesion_id = ? ORDER BY created_at DESC LIMIT 1',
        [sessionId]
      );
      carritoId = carritos.length > 0 ? carritos[0].id : null;
    }

    if (!carritoId) {
      return res.json({ success: true, data: [] });
    }

    // Obtener items del carrito
    const [items] = await query(
      `SELECT 
        ci.*,
        p.nombre,
        p.imagen,
        p.slug,
        (ci.cantidad * ci.precio_unitario) as subtotal
      FROM carrito_items ci
      INNER JOIN productos p ON ci.producto_id = p.id
      WHERE ci.carrito_id = ?`,
      [carritoId]
    );

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

// Agregar producto al carrito
router.post('/items', async (req, res) => {
  const connection = await beginTransaction();
  try {
    const { producto_id, cantidad } = req.body;
    const userId = getUserIdFromToken(req);
    const sessionId = req.headers['x-session-id'] || null;

    if (!producto_id || !cantidad || cantidad < 1) {
      await rollback(connection);
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    // Verificar que el producto existe y está activo
    const [productos] = await connection.query(
      'SELECT id, precio FROM productos WHERE id = ? AND activo = 1',
      [producto_id]
    );

    if (productos.length === 0) {
      await rollback(connection);
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const producto = productos[0];

    // Obtener o crear carrito
    let carritoId;
    
    if (userId) {
      const [carritos] = await connection.query(
        'SELECT id FROM carritos WHERE usuario_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
      );
      
      if (carritos.length > 0) {
        carritoId = carritos[0].id;
      } else {
        const [result] = await connection.query(
          'INSERT INTO carritos (usuario_id) VALUES (?)',
          [userId]
        );
        carritoId = result.insertId;
      }
    } else if (sessionId) {
      const [carritos] = await connection.query(
        'SELECT id FROM carritos WHERE sesion_id = ? ORDER BY created_at DESC LIMIT 1',
        [sessionId]
      );
      
      if (carritos.length > 0) {
        carritoId = carritos[0].id;
      } else {
        const [result] = await connection.query(
          'INSERT INTO carritos (sesion_id) VALUES (?)',
          [sessionId]
        );
        carritoId = result.insertId;
      }
    } else {
      await rollback(connection);
      return res.status(401).json({ error: 'Se requiere autenticación o sesión' });
    }

    // Verificar si el producto ya está en el carrito
    const [existingItems] = await connection.query(
      'SELECT id, cantidad FROM carrito_items WHERE carrito_id = ? AND producto_id = ?',
      [carritoId, producto_id]
    );

    if (existingItems.length > 0) {
      // Actualizar cantidad
      const newCantidad = existingItems[0].cantidad + cantidad;
      await connection.query(
        'UPDATE carrito_items SET cantidad = ?, precio_unitario = ? WHERE id = ?',
        [newCantidad, producto.precio, existingItems[0].id]
      );
    } else {
      // Agregar nuevo item
      await connection.query(
        'INSERT INTO carrito_items (carrito_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [carritoId, producto_id, cantidad, producto.precio]
      );
    }

    await commit(connection);

    res.json({
      success: true,
      message: 'Producto agregado al carrito'
    });
  } catch (error) {
    await rollback(connection);
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
});

// Actualizar cantidad de un item
router.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || cantidad < 1) {
      return res.status(400).json({ error: 'Cantidad inválida' });
    }

    await query(
      'UPDATE carrito_items SET cantidad = ? WHERE id = ?',
      [cantidad, id]
    );

    res.json({
      success: true,
      message: 'Cantidad actualizada'
    });
  } catch (error) {
    console.error('Error al actualizar item:', error);
    res.status(500).json({ error: 'Error al actualizar item' });
  }
});

// Eliminar item del carrito
router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await query('DELETE FROM carrito_items WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Item eliminado del carrito'
    });
  } catch (error) {
    console.error('Error al eliminar item:', error);
    res.status(500).json({ error: 'Error al eliminar item' });
  }
});

// Vaciar carrito
router.delete('/', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return res.status(401).json({ error: 'Se requiere autenticación o sesión' });
    }

    let carritoId;
    
    if (userId) {
      const [carritos] = await query(
        'SELECT id FROM carritos WHERE usuario_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
      );
      carritoId = carritos.length > 0 ? carritos[0].id : null;
    } else {
      const [carritos] = await query(
        'SELECT id FROM carritos WHERE sesion_id = ? ORDER BY created_at DESC LIMIT 1',
        [sessionId]
      );
      carritoId = carritos.length > 0 ? carritos[0].id : null;
    }

    if (carritoId) {
      await query('DELETE FROM carrito_items WHERE carrito_id = ?', [carritoId]);
    }

    res.json({
      success: true,
      message: 'Carrito vaciado'
    });
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({ error: 'Error al vaciar carrito' });
  }
});

export default router;

