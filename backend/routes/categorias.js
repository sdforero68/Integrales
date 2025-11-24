/**
 * Rutas de categorías
 */

import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const { activo = 'true' } = req.query;

    const [categorias] = await query(
      'SELECT * FROM categorias WHERE activo = ? ORDER BY orden ASC, nombre ASC',
      [activo === 'true']
    );

    res.json({
      success: true,
      count: categorias.length,
      data: categorias
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// Obtener una categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [categorias] = await query(
      'SELECT * FROM categorias WHERE id = ?',
      [id]
    );

    if (categorias.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({
      success: true,
      data: categorias[0]
    });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
});

// Obtener productos de una categoría
router.get('/:id/productos', async (req, res) => {
  try {
    const { id } = req.params;

    const [productos] = await query(
      `SELECT 
        p.*,
        c.nombre as categoria_nombre,
        c.slug as categoria_slug
      FROM productos p
      INNER JOIN categorias c ON p.categoria_id = c.id
      WHERE p.categoria_id = ? AND p.activo = 1
      ORDER BY p.destacado DESC, p.nombre ASC`,
      [id]
    );

    res.json({
      success: true,
      count: productos.length,
      data: productos
    });
  } catch (error) {
    console.error('Error al obtener productos de categoría:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

export default router;

