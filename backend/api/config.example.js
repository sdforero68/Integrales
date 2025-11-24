/**
 * Configuración de la API para el frontend
 * Copia este archivo a frontend/js/config/api.js y ajusta la URL base
 */

// URL base de la API
// Para desarrollo local: 'http://localhost/backend/api'
// Para producción en Vercel: 'https://tu-dominio.vercel.app/api'
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost/backend/api';

// Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login.php`,
    register: `${API_BASE_URL}/auth/register.php`
  },
  orders: {
    list: (userId) => `${API_BASE_URL}/orders.php?userId=${userId}`,
    create: `${API_BASE_URL}/orders.php`
  }
};

/**
 * Función helper para hacer requests a la API
 */
export async function apiRequest(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  // Agregar token de autenticación si existe
  const token = localStorage.getItem('accessToken') || localStorage.getItem('current_session');
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición');
  }

  return data;
}

