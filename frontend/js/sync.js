/**
 * sync.js - Sistema de sincronización global
 * Sincroniza carrito, login y estado entre todas las páginas
 */

import { getCart, saveCart, getCartItemsCount, CART_STORAGE_KEY } from './main.js';
import { api } from './config/api.js';

// =====================
// Sincronización del Carrito
// =====================

/**
 * Actualiza el badge del carrito en todas las páginas
 */
export async function updateCartBadge() {
  // Intentar sincronizar desde la API primero
  try {
    await syncCartFromAPI();
  } catch (error) {
    console.warn('No se pudo sincronizar carrito, usando localStorage:', error);
  }
  
  const count = getCartItemsCount();
  const badges = Array.from(document.querySelectorAll('.cart-badge, #cart-badge'));
  
  badges.forEach((badge) => {
    if (count > 0) {
      badge.textContent = String(count);
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  });
  
  // Disparar evento personalizado para que otras partes del código se actualicen
  window.dispatchEvent(new CustomEvent('cartUpdated', { 
    detail: { count, items: getCart() } 
  }));
}

/**
 * Agrega un producto al carrito y actualiza el badge
 */
export async function addToCart(product) {
  try {
    // Intentar agregar a la API del backend
    await api.carrito.addItem({
      producto_id: parseInt(product.id),
      cantidad: 1
    });
    
    // Actualizar carrito local desde la API
    await syncCartFromAPI();
    
    // Actualizar badge
    updateCartBadge();
    
    // Mostrar notificación si está disponible
    if (window.toast) {
      window.toast.success(`${product.name} agregado al carrito`);
    }
    
    return getCart();
  } catch (error) {
    console.error('Error al agregar al carrito en API, usando localStorage:', error);
    
    // Fallback a localStorage si la API falla
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        category: product.category,
        description: product.description
      });
    }
    
    saveCart(cart);
    updateCartBadge();
    
    if (window.toast) {
      window.toast.success(`${product.name} agregado al carrito`);
    }
    
    return cart;
  }
}

/**
 * Actualiza la cantidad de un producto en el carrito
 */
export async function updateCartQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    return removeFromCart(productId);
  }
  
  try {
    // Buscar el item en el carrito para obtener su ID de la API
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    
    if (item && item.carrito_item_id) {
      // Actualizar en la API usando el ID del item del carrito
      await api.carrito.updateItem(item.carrito_item_id, newQuantity);
      await syncCartFromAPI();
    } else {
      // Fallback a localStorage
      const updatedCart = cart.map(i =>
        i.id === productId ? { ...i, quantity: newQuantity } : i
      );
      saveCart(updatedCart);
    }
    
    updateCartBadge();
    return getCart();
  } catch (error) {
    console.error('Error al actualizar cantidad en API, usando localStorage:', error);
    
    // Fallback a localStorage
    const cart = getCart();
    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    saveCart(updatedCart);
    updateCartBadge();
    
    return updatedCart;
  }
}

/**
 * Elimina un producto del carrito
 */
export async function removeFromCart(productId) {
  try {
    // Buscar el item en el carrito para obtener su ID de la API
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    
    if (item && item.carrito_item_id) {
      // Eliminar de la API usando el ID del item del carrito
      await api.carrito.removeItem(item.carrito_item_id);
      await syncCartFromAPI();
    } else {
      // Fallback a localStorage
      const updatedCart = cart.filter(i => i.id !== productId);
      saveCart(updatedCart);
    }
    
    updateCartBadge();
    
    // Mostrar notificación si está disponible
    if (window.toast) {
      window.toast.success('Producto eliminado del carrito');
    }
    
    return getCart();
  } catch (error) {
    console.error('Error al eliminar del carrito en API, usando localStorage:', error);
    
    // Fallback a localStorage
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    
    saveCart(updatedCart);
    updateCartBadge();
    
    if (window.toast) {
      window.toast.success('Producto eliminado del carrito');
    }
    
    return updatedCart;
  }
}

/**
 * Sincroniza el carrito desde la API del backend
 */
export async function syncCartFromAPI() {
  try {
    const response = await api.carrito.get();
    
    if (response.success && response.data) {
      // Convertir los items de la API al formato local
      const cart = response.data.map(item => ({
        id: item.producto_id.toString(),
        carrito_item_id: item.id, // Guardar ID del item del carrito para futuras operaciones
        name: item.nombre,
        price: parseFloat(item.precio_unitario),
        quantity: item.cantidad,
        image: item.imagen || '',
        subtotal: parseFloat(item.subtotal) || (item.cantidad * parseFloat(item.precio_unitario))
      }));
      
      // Guardar en localStorage para compatibilidad
      saveCart(cart);
      
      // Disparar evento de actualización
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { count: cart.reduce((sum, item) => sum + item.quantity, 0), items: cart } 
      }));
      
      return cart;
    }
  } catch (error) {
    console.warn('No se pudo sincronizar carrito desde API:', error);
    return getCart();
  }
}

// =====================
// Sincronización del Login
// =====================

/**
 * Verifica si el usuario está logueado
 */
export function isLoggedIn() {
  const accessToken = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  return !!(accessToken && user);
}

/**
 * Obtiene la información del usuario actual
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

/**
 * Actualiza el menú de usuario en el navbar
 */
export function updateUserMenu() {
  const userMenu = document.getElementById('user-menu');
  const userMenuName = document.getElementById('user-menu-name');
  const userMenuEmail = document.getElementById('user-menu-email');
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userMenuHeader = userMenu?.querySelector('.user-menu-header');
  const userMenuDivider = userMenu?.querySelector('.user-menu-divider');
  const userMenuItems = userMenu?.querySelectorAll('.user-menu-item');
  const loginMenuItem = document.getElementById('user-menu-login');
  const registerMenuItem = document.getElementById('user-menu-register');
  const profileMenuItem = document.getElementById('user-menu-profile');
  const logoutMenuItem = document.getElementById('logout-btn-navbar');
  
  if (isLoggedIn()) {
    const user = getCurrentUser();
    
    // Mostrar información del usuario
    if (userMenuName && user) {
      userMenuName.textContent = user?.user_metadata?.name || 'Usuario';
    }
    
    if (userMenuEmail && user) {
      userMenuEmail.textContent = user?.email || '-';
    }
    
    // Mostrar elementos de usuario logueado
    if (userMenuHeader) userMenuHeader.hidden = false;
    if (userMenuDivider) userMenuDivider.hidden = false;
    if (profileMenuItem) profileMenuItem.hidden = false;
    if (logoutMenuItem) logoutMenuItem.hidden = false;
    
    // Ocultar opciones de login/registro
    if (loginMenuItem) loginMenuItem.hidden = true;
    if (registerMenuItem) registerMenuItem.hidden = true;
    
    if (userMenu) {
      userMenu.hidden = false;
    }
  } else {
    // Ocultar información del usuario
    if (userMenuHeader) userMenuHeader.hidden = true;
    if (userMenuDivider) userMenuDivider.hidden = true;
    if (profileMenuItem) profileMenuItem.hidden = true;
    if (logoutMenuItem) logoutMenuItem.hidden = true;
    
    // Mostrar opciones de login/registro
    if (loginMenuItem) loginMenuItem.hidden = false;
    if (registerMenuItem) registerMenuItem.hidden = false;
    
    if (userMenu) {
      userMenu.hidden = false;
    }
  }
}

/**
 * Maneja el logout
 */
export function handleLogout() {
  // Limpiar localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  localStorage.removeItem('current_user');
  localStorage.removeItem('current_session');
  
  // Actualizar menú
  updateUserMenu();
  
  // Disparar evento personalizado
  window.dispatchEvent(new CustomEvent('userLoggedOut'));
  
  // Redirigir según la página actual
  const currentPage = window.location.pathname.split('/').pop();
  
  if (currentPage === 'profile.html' || currentPage === 'checkout.html') {
    window.location.href = './pages/login/index.html';
  } else {
    window.location.reload();
  }
}

// =====================
// Inicialización
// =====================

/**
 * Inicializa la sincronización en todas las páginas
 */
export async function initSync() {
  // Sincronizar carrito desde la API al cargar
  await syncCartFromAPI();
  
  // Actualizar badge del carrito al cargar
  await updateCartBadge();
  
  // Actualizar menú de usuario al cargar
  updateUserMenu();
  
  // Escuchar cambios en localStorage (para sincronización entre pestañas)
  window.addEventListener('storage', (e) => {
    if (e.key === CART_STORAGE_KEY) {
      updateCartBadge();
    } else if (e.key === 'accessToken' || e.key === 'user') {
      updateUserMenu();
    }
  });
  
  // Escuchar eventos personalizados de actualización de carrito
  window.addEventListener('cartUpdated', () => {
    updateCartBadge();
  });
  
  // Configurar botón de usuario
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userMenu = document.getElementById('user-menu');
  const userMenuWrapper = document.querySelector('.user-menu-wrapper');
  
  if (userMenuBtn) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Toggle del menú desplegable
      if (userMenu) {
        userMenu.hidden = !userMenu.hidden;
      }
    });
  }
  
  // Cerrar el menú al hacer clic fuera de él
  document.addEventListener('click', (e) => {
    if (userMenu && userMenuWrapper && !userMenuWrapper.contains(e.target)) {
      userMenu.hidden = true;
    }
  });
  
  // Mantener el menú desplegable oculto por defecto
  if (userMenu) {
    userMenu.hidden = true;
  }
  
  // Configurar botón de logout
  const logoutBtn = document.getElementById('logout-btn-navbar');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Configurar botón de carrito para abrir el drawer
  // Esperar un momento para que cart-drawer.js se cargue primero
  setTimeout(async () => {
    try {
      const cartDrawerModule = await import('./cart-drawer.js');
      const openCartDrawer = cartDrawerModule.openCartDrawer;
      
      if (openCartDrawer) {
        document.querySelectorAll('[data-action="cart"]').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openCartDrawer();
          });
        });
      }
    } catch (error) {
      console.error('Error loading cart drawer:', error);
      // Fallback: redirigir a la página del carrito
      document.querySelectorAll('[data-action="cart"]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const getRelativePath = (targetPage) => {
            const currentPath = window.location.pathname;
            if (currentPath.includes('/pages/')) {
              return `../${targetPage}/index.html`;
            } else {
              return `./pages/${targetPage}/index.html`;
            }
          };
          window.location.href = getRelativePath('cart');
        });
      });
    }
  }, 100);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSync);
} else {
  initSync();
}

