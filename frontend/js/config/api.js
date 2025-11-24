/**
 * Configuración de la API
 * Configuración centralizada para las llamadas al backend
 */

// URL base de la API
export const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Realizar una petición HTTP
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones de fetch
 * @returns {Promise} Respuesta de la API
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    }
  };

  // Generar session ID si no existe
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }

  defaultOptions.headers['X-Session-ID'] = sessionId;

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error en petición API:', error);
    throw error;
  }
}

/**
 * Obtener token de autenticación
 * @returns {string|null} Token de autenticación
 */
export function getAuthToken() {
  return localStorage.getItem('token') || localStorage.getItem('accessToken');
}

/**
 * Guardar token de autenticación
 * @param {string} token - Token a guardar
 */
export function setAuthToken(token) {
  localStorage.setItem('token', token);
  localStorage.setItem('accessToken', token); // Compatibilidad
}

/**
 * Eliminar token de autenticación
 */
export function removeAuthToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('accessToken');
}

/**
 * Verificar si el usuario está autenticado
 * @returns {Promise<boolean>} true si está autenticado
 */
export async function isAuthenticated() {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const response = await apiRequest('/auth/verify');
    return response.user !== undefined;
  } catch {
    removeAuthToken();
    return false;
  }
}

// Exportar funciones de API específicas
export const api = {
  // Autenticación
  auth: {
    register: (data) => apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    login: (data) => apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    logout: () => apiRequest('/auth/logout', {
      method: 'POST'
    }),
    verify: () => apiRequest('/auth/verify')
  },

  // Productos
  productos: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/productos${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id) => apiRequest(`/productos/${id}`),
    getBySlug: (slug) => apiRequest(`/productos/slug/${slug}`)
  },

  // Categorías
  categorias: {
    getAll: () => apiRequest('/categorias'),
    getById: (id) => apiRequest(`/categorias/${id}`),
    getProductos: (id) => apiRequest(`/categorias/${id}/productos`)
  },

  // Carrito
  carrito: {
    get: () => apiRequest('/carrito'),
    addItem: (data) => apiRequest('/carrito/items', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    updateItem: (id, cantidad) => apiRequest(`/carrito/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ cantidad })
    }),
    removeItem: (id) => apiRequest(`/carrito/items/${id}`, {
      method: 'DELETE'
    }),
    clear: () => apiRequest('/carrito', {
      method: 'DELETE'
    })
  },

  // Pedidos
  pedidos: {
    getAll: () => apiRequest('/pedidos'),
    getById: (id) => apiRequest(`/pedidos/${id}`),
    create: (data) => apiRequest('/pedidos', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Usuarios
  usuarios: {
    getProfile: () => apiRequest('/usuarios/profile'),
    updateProfile: (data) => apiRequest('/usuarios/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    getFavoritos: () => apiRequest('/usuarios/favoritos'),
    addFavorito: (productoId) => apiRequest(`/usuarios/favoritos/${productoId}`, {
      method: 'POST'
    }),
    removeFavorito: (productoId) => apiRequest(`/usuarios/favoritos/${productoId}`, {
      method: 'DELETE'
    })
  }
};

export default api;

