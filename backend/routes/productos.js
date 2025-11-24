/**
 * Rutas de productos
 */

import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// Obtener todos los productos (con filtros opcionales)
router.get('/', async (req, res) => {
  try {
    const { categoria, busqueda, destacados, activo = 'true' } = req.query;
    
    let sql = `
      SELECT 
        p.*,
        c.nombre as categoria_nombre,
        c.slug as categoria_slug
      FROM productos p
      INNER JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = ?
    `;
    const params = [activo === 'true'];

    if (categoria) {
      sql += ' AND c.slug = ?';
      params.push(categoria);
    }

    if (destacados === 'true') {
      sql += ' AND p.destacado = 1';
    }

    if (busqueda) {
      sql += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ? OR p.ingredientes LIKE ?)';
      const searchTerm = `%${busqueda}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY p.destacado DESC, p.nombre ASC';

    const [productos] = await query(sql, params);

    res.json({
      success: true,
      count: productos.length,
      data: productos
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [productos] = await query(
      `SELECT 
        p.*,
        c.nombre as categoria_nombre,
        c.slug as categoria_slug
      FROM productos p
      INNER JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ? AND p.activo = 1`,
      [id]
    );

    if (productos.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      success: true,
      data: productos[0]
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Obtener producto por slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const [productos] = await query(
      `SELECT 
        p.*,
        c.nombre as categoria_nombre,
        c.slug as categoria_slug
      FROM productos p
      INNER JOIN categorias c ON p.categoria_id = c.id
      WHERE p.slug = ? AND p.activo = 1`,
      [slug]
    );

    if (productos.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      success: true,
      data: productos[0]
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

export default router;

