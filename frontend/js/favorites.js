/**
 * Sistema de favoritos
 * Gestiona los productos favoritos del usuario
 */

import { api } from './config/api.js';

const FAVORITES_STORAGE_KEY = 'app_favorites';

// Cache de favoritos
let favoritesCache = null;

/**
 * Sincroniza favoritos desde la API
 */
async function syncFavoritesFromAPI() {
  try {
    const response = await api.usuarios.getFavoritos();
    
    if (response.success && response.data) {
      favoritesCache = response.data.map(fav => ({
        id: fav.id.toString(),
        producto_id: fav.id,
        name: fav.nombre,
        description: fav.descripcion,
        price: parseFloat(fav.precio),
        image: fav.imagen,
        category: fav.categoria_slug
      }));
      
      // Guardar en localStorage para compatibilidad
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritesCache));
      
      return favoritesCache;
    }
  } catch (error) {
    console.warn('No se pudo sincronizar favoritos desde API:', error);
  }
  
  // Fallback a localStorage
  const favoritesStr = localStorage.getItem(FAVORITES_STORAGE_KEY);
  favoritesCache = favoritesStr ? JSON.parse(favoritesStr) : [];
  return favoritesCache;
}

/**
 * Obtiene la lista de favoritos del usuario actual
 */
export async function getFavorites() {
  if (favoritesCache === null) {
    await syncFavoritesFromAPI();
  }
  return favoritesCache || [];
}

/**
 * Guarda la lista de favoritos
 */
function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  favoritesCache = favorites;
}

/**
 * Verifica si un producto está en favoritos
 */
export async function isFavorite(productId) {
  const favorites = await getFavorites();
  return favorites.some(fav => fav.id === productId.toString() || fav.producto_id === parseInt(productId));
}

/**
 * Agrega un producto a favoritos
 */
export async function addToFavorites(product) {
  // Verificar si el usuario está logueado
  const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('current_session');
  if (!accessToken) {
    return { success: false, message: 'Debes iniciar sesión para agregar productos a favoritos' };
  }

  try {
    // Agregar a favoritos en el backend
    await api.usuarios.addFavorito(parseInt(product.id));
    
    // Sincronizar favoritos
    await syncFavoritesFromAPI();
    
    return { success: true, message: 'Producto agregado a favoritos' };
  } catch (error) {
    console.error('Error al agregar a favoritos:', error);
    
    // Fallback a localStorage
    const favorites = await getFavorites();
    
    if (await isFavorite(product.id)) {
      return { success: false, message: 'Este producto ya está en tus favoritos' };
    }

    favorites.push({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      addedAt: new Date().toISOString()
    });

    saveFavorites(favorites);
    return { success: true, message: 'Producto agregado a favoritos' };
  }
}

/**
 * Elimina un producto de favoritos
 */
export async function removeFromFavorites(productId) {
  try {
    // Eliminar de favoritos en el backend
    await api.usuarios.removeFavorito(parseInt(productId));
    
    // Sincronizar favoritos
    await syncFavoritesFromAPI();
    
    return { success: true, message: 'Producto eliminado de favoritos' };
  } catch (error) {
    console.error('Error al eliminar de favoritos:', error);
    
    // Fallback a localStorage
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== productId.toString());
    saveFavorites(updatedFavorites);
    
    return { success: true, message: 'Producto eliminado de favoritos' };
  }
}

/**
 * Toggle favorito (agrega si no está, elimina si está)
 */
export async function toggleFavorite(product) {
  const isFav = await isFavorite(product.id);
  if (isFav) {
    return await removeFromFavorites(product.id);
  } else {
    return await addToFavorites(product);
  }
}

/**
 * Verifica si el usuario está logueado
 */
export function isLoggedIn() {
  const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('current_session');
  return !!accessToken;
}


