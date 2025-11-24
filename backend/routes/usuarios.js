/**
 * Rutas de usuarios
 */

import express from 'express';
import { query } from '../config/database.js';
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

// Obtener perfil del usuario autenticado
router.get('/profile', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ error: 'Se requiere autenticación' });
    }

    const [usuarios] = await query(
      'SELECT id, nombre, apellido, email, telefono, created_at FROM usuarios WHERE id = ?',
      [userId]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener direcciones del usuario
    const [direcciones] = await query(
      'SELECT * FROM direcciones WHERE usuario_id = ? ORDER BY predeterminada DESC, created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      data: {
        ...usuarios[0],
        direcciones
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// Actualizar perfil del usuario
router.put('/profile', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ error: 'Se requiere autenticación' });
    }

    const { nombre, apellido, telefono } = req.body;

    await query(
      'UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ? WHERE id = ?',
      [nombre, apellido || null, telefono || null, userId]
    );

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

// Obtener favoritos del usuario
router.get('/favoritos', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ error: 'Se requiere autenticación' });
    }

    const [favoritos] = await query(
      `SELECT 
        f.id as favorito_id,
        p.*,
        c.nombre as categoria_nombre,
        c.slug as categoria_slug
      FROM favoritos f
      INNER JOIN productos p ON f.producto_id = p.id
      INNER JOIN categorias c ON p.categoria_id = c.id
      WHERE f.usuario_id = ? AND p.activo = 1
      ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: favoritos.length,
      data: favoritos
    });
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
});

// Agregar producto a favoritos
router.post('/favoritos/:producto_id', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { producto_id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Se requiere autenticación' });
    }

    // Verificar que el producto existe
    const [productos] = await query(
      'SELECT id FROM productos WHERE id = ? AND activo = 1',
      [producto_id]
    );

    if (productos.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar si ya está en favoritos
    const [existing] = await query(
      'SELECT id FROM favoritos WHERE usuario_id = ? AND producto_id = ?',
      [userId, producto_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'El producto ya está en favoritos' });
    }

    await query(
      'INSERT INTO favoritos (usuario_id, producto_id) VALUES (?, ?)',
      [userId, producto_id]
    );

    res.json({
      success: true,
      message: 'Producto agregado a favoritos'
    });
  } catch (error) {
    console.error('Error al agregar a favoritos:', error);
    res.status(500).json({ error: 'Error al agregar a favoritos' });
  }
});

// Eliminar producto de favoritos
router.delete('/favoritos/:producto_id', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { producto_id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Se requiere autenticación' });
    }

    await query(
      'DELETE FROM favoritos WHERE usuario_id = ? AND producto_id = ?',
      [userId, producto_id]
    );

    res.json({
      success: true,
      message: 'Producto eliminado de favoritos'
    });
  } catch (error) {
    console.error('Error al eliminar de favoritos:', error);
    res.status(500).json({ error: 'Error al eliminar de favoritos' });
  }
});

export default router;

