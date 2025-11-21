/**
 * Sistema de favoritos
 * Gestiona los productos favoritos del usuario
 */

const FAVORITES_STORAGE_KEY = 'app_favorites';

/**
 * Obtiene la lista de favoritos del usuario actual
 */
export function getFavorites() {
  const favoritesStr = localStorage.getItem(FAVORITES_STORAGE_KEY);
  return favoritesStr ? JSON.parse(favoritesStr) : [];
}

/**
 * Guarda la lista de favoritos
 */
function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

/**
 * Verifica si un producto está en favoritos
 */
export function isFavorite(productId) {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === productId);
}

/**
 * Agrega un producto a favoritos
 */
export function addToFavorites(product) {
  // Verificar si el usuario está logueado
  const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('current_session');
  if (!accessToken) {
    return { success: false, message: 'Debes iniciar sesión para agregar productos a favoritos' };
  }

  const favorites = getFavorites();
  
  // Verificar si ya está en favoritos
  if (isFavorite(product.id)) {
    return { success: false, message: 'Este producto ya está en tus favoritos' };
  }

  // Agregar a favoritos
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

/**
 * Elimina un producto de favoritos
 */
export function removeFromFavorites(productId) {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(fav => fav.id !== productId);
  saveFavorites(updatedFavorites);
  return { success: true, message: 'Producto eliminado de favoritos' };
}

/**
 * Toggle favorito (agrega si no está, elimina si está)
 */
export function toggleFavorite(product) {
  if (isFavorite(product.id)) {
    return removeFromFavorites(product.id);
  } else {
    return addToFavorites(product);
  }
}

/**
 * Verifica si el usuario está logueado
 */
export function isLoggedIn() {
  const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('current_session');
  return !!accessToken;
}


