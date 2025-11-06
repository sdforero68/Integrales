/**
 * app.js - Aplicación Principal
 * Adaptación del componente App.tsx de React
 * Maneja el estado global de la aplicación, navegación y carrito
 */

import { products } from './products.js';
import { getCart, saveCart, getCartItemsCount } from './main.js';

// Estado global de la aplicación
const appState = {
  currentSection: 'home',
  cartItems: [],
  selectedProduct: null,
  isProductModalOpen: false,
  accessToken: null,
  user: null
};

// Referencias a elementos del DOM
let sectionElements = {};
let cartBadge = null;
let productModal = null;

/**
 * Inicializa el estado de la aplicación
 */
function initAppState() {
  // Cargar carrito desde localStorage
  appState.cartItems = getCart();
  
  // Cargar sesión de usuario (sin Supabase por ahora)
  const storedToken = localStorage.getItem('accessToken');
  const storedUser = localStorage.getItem('user');
  
  if (storedToken && storedUser) {
    appState.accessToken = storedToken;
    try {
      appState.user = JSON.parse(storedUser);
    } catch (e) {
      appState.user = null;
    }
  }
  
  // Obtener sección inicial desde hash de URL o localStorage
  const hash = window.location.hash.slice(1);
  if (hash && ['home', 'catalog', 'markets', 'about', 'contact', 'login', 'cart', 'checkout', 'profile'].includes(hash)) {
    appState.currentSection = hash;
  } else {
    const storedSection = localStorage.getItem('currentSection');
    if (storedSection) {
      appState.currentSection = storedSection;
    }
  }
  
  // Obtener referencias a elementos
  sectionElements = {
    home: document.getElementById('home'),
    catalog: document.getElementById('catalog'),
    markets: document.getElementById('markets'),
    about: document.getElementById('about'),
    contact: document.getElementById('contact'),
    login: document.querySelector('.login-section') || document.getElementById('login'),
    cart: document.getElementById('cart-section'),
    checkout: document.getElementById('checkout-section'),
    profile: document.getElementById('profile-section')
  };
  
  cartBadge = document.getElementById('cart-badge');
  productModal = document.getElementById('product-modal');
}

/**
 * Actualiza el badge del carrito (usando sync.js)
 */
async function updateCartBadge() {
  try {
    const { updateCartBadge: updateCartBadgeSync } = await import('./sync.js');
    updateCartBadgeSync();
  } catch (error) {
    // Fallback local
    const count = getCartItemsCount();
    const badges = Array.from(document.querySelectorAll('.cart-badge, #cart-badge'));
    badges.forEach((badge) => {
      if (count > 0) {
        badge.textContent = count;
        badge.hidden = false;
      } else {
        badge.hidden = true;
      }
    });
  }
}

/**
 * Verifica si hay sesión activa (usando sync.js)
 */
async function checkSession() {
  const storedToken = localStorage.getItem('accessToken');
  const storedUser = localStorage.getItem('user') || localStorage.getItem('current_user');
  
  if (storedToken && storedUser) {
    appState.accessToken = storedToken;
    try {
      appState.user = JSON.parse(storedUser);
    } catch (e) {
      appState.user = null;
    }
  } else {
    appState.accessToken = null;
    appState.user = null;
  }
  
  // Actualizar menú usando sync.js
  try {
    const { updateUserMenu } = await import('./sync.js');
    updateUserMenu();
  } catch (error) {
    // Fallback local
    updateUserMenuInNavbar();
  }
}

/**
 * Maneja el login (usando sync.js)
 */
async function handleLogin(token, userData) {
  appState.accessToken = token;
  appState.user = userData;
  
  // Guardar en localStorage
  localStorage.setItem('accessToken', token);
  localStorage.setItem('user', JSON.stringify(userData));
  
  // Actualizar menú de usuario usando sync.js
  try {
    const { updateUserMenu } = await import('./sync.js');
    updateUserMenu();
  } catch (error) {
    // Fallback local
    updateUserMenuInNavbar();
  }
  
  // Navegar a home
  handleNavigate('home');
  
  // Mostrar notificación
  if (window.toast) {
    window.toast.success('¡Bienvenido!');
  }
}

/**
 * Maneja el logout (usando sync.js)
 */
async function handleLogout() {
  try {
    const { handleLogout: handleLogoutSync } = await import('./sync.js');
    handleLogoutSync();
  } catch (error) {
    // Fallback local
    appState.accessToken = null;
    appState.user = null;
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('current_user');
    localStorage.removeItem('current_session');
    
    handleNavigate('home');
    
    if (window.toast) {
      window.toast.success('Sesión cerrada');
    }
    
    window.location.reload();
  }
}

/**
 * Navega a una sección específica
 */
function handleNavigate(section) {
  if (!section || !['home', 'catalog', 'markets', 'about', 'contact', 'login', 'cart', 'checkout', 'profile'].includes(section)) {
    console.warn('Sección no válida:', section);
    return;
  }
  
  appState.currentSection = section;
  localStorage.setItem('currentSection', section);
  
  // Actualizar URL sin recargar
  window.history.pushState({ section }, '', `#${section}`);
  
  // Mostrar/ocultar secciones
  showSection(section);
  
  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Muestra una sección específica y oculta las demás
 */
function showSection(section) {
  // En el HTML actual, todas las secciones están visibles en la misma página
  // Solo necesitamos hacer scroll a la sección correspondiente
  
  const targetSection = sectionElements[section] || document.getElementById(section);
  
  if (targetSection) {
    // Scroll suave a la sección
    const navbar = document.querySelector('.navbar');
    const navHeight = navbar ? navbar.offsetHeight : 0;
    const rect = targetSection.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - navHeight;
    
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }
  
  // Actualizar links activos en navbar
  updateActiveNavLinks(section);
}

/**
 * Actualiza los links activos en el navbar
 */
function updateActiveNavLinks(activeSection) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const target = link.getAttribute('data-target');
    if (target === activeSection) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Agrega un producto al carrito (usando sync.js)
 */
async function handleAddToCart(product) {
  try {
    const { addToCart } = await import('./sync.js');
    const updatedCart = addToCart(product);
    appState.cartItems = updatedCart;
  } catch (error) {
    // Fallback local
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
    appState.cartItems = cart;
    updateCartBadge();
    
    if (window.toast) {
      window.toast.success(`${product.name} agregado al carrito`);
    }
  }
}

/**
 * Actualiza la cantidad de un producto en el carrito (usando sync.js)
 */
async function handleUpdateQuantity(productId, newQuantity) {
  if (newQuantity === 0) {
    handleRemoveItem(productId);
    return;
  }
  
  try {
    const { updateCartQuantity } = await import('./sync.js');
    const updatedCart = updateCartQuantity(productId, newQuantity);
    appState.cartItems = updatedCart;
  } catch (error) {
    // Fallback local
    const cart = getCart();
    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedCart);
    appState.cartItems = updatedCart;
    updateCartBadge();
  }
}

/**
 * Elimina un producto del carrito (usando sync.js)
 */
async function handleRemoveItem(productId) {
  try {
    const { removeFromCart } = await import('./sync.js');
    const updatedCart = removeFromCart(productId);
    appState.cartItems = updatedCart;
  } catch (error) {
    // Fallback local
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    appState.cartItems = updatedCart;
    updateCartBadge();
    
    if (window.toast) {
      window.toast.success('Producto eliminado del carrito');
    }
  }
}

/**
 * Muestra los detalles de un producto en el modal
 */
function handleViewDetails(product) {
  appState.selectedProduct = product;
  appState.isProductModalOpen = true;
  
  // Llenar información del modal
  const modal = document.getElementById('product-modal');
  if (!modal) return;
  
  const modalTitle = document.getElementById('product-modal-title');
  const modalImage = document.getElementById('product-modal-image');
  const modalDescription = document.getElementById('product-modal-description');
  const modalIngredients = document.getElementById('product-modal-ingredients');
  const modalIngredientsSection = document.getElementById('product-modal-ingredients-section');
  const modalBenefits = document.getElementById('product-modal-benefits');
  const modalBenefitsSection = document.getElementById('product-modal-benefits-section');
  const modalPrice = document.getElementById('product-modal-price');
  const modalAddBtn = document.getElementById('product-modal-add-btn');
  
  const formatCurrency = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
  
  // Función para obtener imagen por categoría
  const getCategoryImage = (category) => {
    const categoryMap = {
      'panaderia': 'https://images.unsplash.com/photo-1627308593341-d886acdc06a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwYnJlYWQlMjBiYWtlcnl8ZW58MXx8fHwxNzYxODE5MTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'amasijos': 'https://images.unsplash.com/photo-1603532551666-451a96bca5fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'galleteria': 'https://images.unsplash.com/photo-1644595425685-5769f217654a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY29va2llc3xlbnwxfHx8fDE3NjE4NTA1ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'granola': 'https://images.unsplash.com/photo-1595787572590-545171362a1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZ3Jhbm9sYSUyMG51dHN8ZW58MXx8fHwxNzYxODUwNTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'frutos-secos': 'https://images.unsplash.com/photo-1702506183897-e4869f155209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGZydWl0cyUyMHNlZWRzfGVufDF8fHx8MTc2MTg1MDU4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'envasados': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      // Compatibilidad con IDs antiguos
      'bakery': 'https://images.unsplash.com/photo-1627308593341-d886acdc06a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwYnJlYWQlMjBiYWtlcnl8ZW58MXx8fHwxNzYxODE5MTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'cookies': 'https://images.unsplash.com/photo-1644595425685-5769f217654a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY29va2llc3xlbnwxfHx8fDE3NjE4NTA1ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'nuts': 'https://images.unsplash.com/photo-1702506183897-e4869f155209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGZydWl0cyUyMHNlZWRzfGVufDF8fHx8fDE3NjE4NTA1ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'jarred': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    };
    return categoryMap[category] || categoryMap['panaderia'];
  };
  
  const productImage = product.image || getCategoryImage(product.category);
  
  if (modalTitle) modalTitle.textContent = product.name;
  if (modalImage) {
    modalImage.src = productImage;
    modalImage.alt = product.name;
    modalImage.onerror = () => {
      modalImage.src = getCategoryImage(product.category);
    };
  }
  if (modalDescription) modalDescription.textContent = product.description || '';
  
  // Ingredientes
  if (product.ingredients) {
    if (modalIngredients) modalIngredients.textContent = product.ingredients;
    if (modalIngredientsSection) modalIngredientsSection.hidden = false;
  } else {
    if (modalIngredientsSection) modalIngredientsSection.hidden = true;
  }
  
  // Beneficios
  if (product.benefits) {
    if (modalBenefits) modalBenefits.textContent = product.benefits;
    if (modalBenefitsSection) modalBenefitsSection.hidden = false;
  } else {
    if (modalBenefitsSection) modalBenefitsSection.hidden = true;
  }
  
  if (modalPrice) modalPrice.textContent = formatCurrency(product.price);
  
  // Guardar referencia al producto para el botón
  if (modalAddBtn) {
    modalAddBtn.dataset.productId = product.id;
  }
  
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal de producto
 */
function closeProductModal() {
  appState.isProductModalOpen = false;
  if (productModal) {
    productModal.hidden = true;
    document.body.style.overflow = '';
  }
}

/**
 * Maneja el checkout
 */
function handleCheckout() {
  if (!appState.accessToken) {
    handleNavigate('login');
    if (window.toast) {
      window.toast.error('Debes iniciar sesión para continuar');
    }
  } else {
    // Redirigir a checkout.html
    window.location.href = './checkout.html';
  }
}

/**
 * Maneja la finalización de una orden
 */
function handleOrderComplete() {
  // Limpiar carrito
  saveCart([]);
  appState.cartItems = [];
  updateCartBadge();
  
  // Navegar a perfil
  handleNavigate('profile');
  
  // Mostrar notificación
  if (window.toast) {
    window.toast.success('¡Pedido realizado con éxito! Pronto recibirás confirmación.');
  }
}

/**
 * Actualiza el menú de usuario en el navbar
 */
function updateUserMenuInNavbar() {
  const userMenu = document.getElementById('user-menu');
  const userMenuName = document.getElementById('user-menu-name');
  const userMenuEmail = document.getElementById('user-menu-email');
  const userMenuBtn = document.getElementById('user-menu-btn');
  
  if (appState.accessToken && appState.user) {
    // Usuario está logueado
    if (userMenuName && appState.user.user_metadata) {
      userMenuName.textContent = appState.user.user_metadata.name || 'Usuario';
    }
    if (userMenuEmail) {
      userMenuEmail.textContent = appState.user.email || '-';
    }
    if (userMenu) {
      userMenu.hidden = false;
    }
  } else {
    // Usuario no está logueado
    if (userMenu) {
      userMenu.hidden = true;
    }
  }
}

/**
 * Inicializa la aplicación
 */
export function initApp() {
  initAppState();
  checkSession();
  updateCartBadge();
  updateUserMenuInNavbar();
  
  // Mostrar sección inicial
  showSection(appState.currentSection);
  
  // Configurar navegación
  setupNavigation();
  
  // Configurar listeners del carrito
  setupCartListeners();
  
  // Configurar listeners del modal
  setupModalListeners();
  
  // Escuchar cambios en el hash de URL
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash && sectionElements[hash]) {
      handleNavigate(hash);
    }
  });
  
  // Escuchar cambios en localStorage para actualizar cuando cambie el login
  window.addEventListener('storage', (e) => {
    if (e.key === 'accessToken' || e.key === 'user') {
      checkSession();
      updateUserMenuInNavbar();
      updateCartBadge();
    }
  });
  
  // También verificar periódicamente (por si cambia en la misma pestaña)
  // Esto es útil cuando login.html redirige a index.html
  setTimeout(() => {
    checkSession();
    updateUserMenuInNavbar();
  }, 100);
}

/**
 * Configura los listeners de navegación
 */
function setupNavigation() {
  // Navegación desde botones con data-target
  document.querySelectorAll('[data-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = btn.getAttribute('data-target');
      if (target && ['home', 'catalog', 'markets', 'about', 'contact', 'login', 'cart', 'checkout', 'profile'].includes(target)) {
        e.preventDefault();
        handleNavigate(target);
      }
    });
  });
  
  // Navegación desde el botón de carrito
  const cartBtn = document.querySelector('[data-action="cart"]');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      handleNavigate('cart');
    });
  }
}

/**
 * Configura los listeners del carrito
 */
function setupCartListeners() {
  // El carrito ya está manejado en main.js y cart.js
  // Aquí solo nos aseguramos de que el badge se actualice
  // cuando cambie el carrito desde otros lugares
  window.addEventListener('storage', (e) => {
    if (e.key === 'app_cart') {
      appState.cartItems = getCart();
      updateCartBadge();
    }
  });
}

/**
 * Configura los listeners del modal
 */
function setupModalListeners() {
  if (!productModal) return;
  
  const modalOverlay = document.getElementById('product-modal-overlay');
  const modalClose = document.getElementById('product-modal-close');
  const modalAddBtn = document.getElementById('product-modal-add-btn');
  
  // Cerrar modal desde overlay
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeProductModal);
  }
  
  // Cerrar modal desde botón
  if (modalClose) {
    modalClose.addEventListener('click', closeProductModal);
  }
  
  // Agregar al carrito desde modal
  if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
      if (appState.selectedProduct) {
        handleAddToCart(appState.selectedProduct);
        closeProductModal();
      }
    });
  }
  
  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && appState.isProductModalOpen) {
      closeProductModal();
    }
  });
}

// Exportar funciones y estado para uso en otros módulos
export {
  appState,
  handleNavigate,
  handleAddToCart,
  handleUpdateQuantity,
  handleRemoveItem,
  handleViewDetails,
  handleLogin,
  handleLogout,
  handleCheckout,
  handleOrderComplete,
  updateCartBadge,
  checkSession
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

