/**
 * cart-drawer.js - Carrito flotante (drawer)
 * Maneja la visualización y funcionalidad del carrito flotante
 */

import { getCart, saveCart, getCartItemsCount, resolveProductImage } from './main.js';
import { updateCartBadge, removeFromCart, updateCartQuantity } from './sync.js';

// Función para formatear precio
function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(price);
}

// Función para obtener la ruta relativa correcta
function getRelativePath(targetPage) {
  const currentPath = window.location.pathname;
  if (currentPath.includes('/pages/')) {
    return `../${targetPage}/index.html`;
  } else {
    return `./pages/${targetPage}/index.html`;
  }
}

// Usar resolveProductImage de main.js (ya está importado)

// Función para renderizar el contenido del drawer
function renderCartDrawer() {
  const drawerBody = document.getElementById('cart-drawer-body');
  const drawerFooter = document.getElementById('cart-drawer-footer');
  
  if (!drawerBody || !drawerFooter) return;
  
  const cart = getCart();
  
  if (cart.length === 0) {
    // Mostrar estado vacío
    drawerBody.innerHTML = `
      <div class="cart-drawer-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <p class="cart-drawer-empty-text">Tu carrito está vacío</p>
      </div>
    `;
    
    drawerFooter.innerHTML = `
      <div class="cart-drawer-buttons">
        <button class="cart-drawer-btn cart-drawer-btn-secondary" onclick="window.location.href='${getRelativePath('catalog')}'">
          Ver Catálogo
        </button>
      </div>
    `;
    return;
  }
  
  // Renderizar items del carrito
  let itemsHTML = '';
  cart.forEach((item) => {
    // Usar resolveProductImage de main.js para obtener la ruta correcta
    const productImage = resolveProductImage(item);
    
    itemsHTML += `
      <div class="cart-drawer-item">
        <img src="${productImage}" alt="${item.name}" class="cart-drawer-item-image" onerror="this.onerror=null;this.src='${productImage}'" />
        <div class="cart-drawer-item-details">
          <h3 class="cart-drawer-item-name">${item.name}</h3>
          <p class="cart-drawer-item-price">${formatPrice(item.price)} c/u</p>
          <div class="cart-drawer-item-actions">
            <div class="cart-drawer-quantity">
              <button class="cart-drawer-quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
              <span class="cart-drawer-quantity-value">${item.quantity}</span>
              <button class="cart-drawer-quantity-btn" data-action="increase" data-id="${item.id}">+</button>
            </div>
            <button class="cart-drawer-remove" data-action="remove" data-id="${item.id}">Eliminar</button>
          </div>
        </div>
      </div>
    `;
  });
  
  drawerBody.innerHTML = itemsHTML;
  
  // Calcular totales
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;
  
  // Renderizar footer con resumen y botones
  drawerFooter.innerHTML = `
    <div class="cart-drawer-summary">
      <div class="cart-drawer-summary-row">
        <span>Subtotal</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      <div class="cart-drawer-summary-row cart-drawer-summary-total">
        <span>Total</span>
        <span>${formatPrice(total)}</span>
      </div>
    </div>
    <div class="cart-drawer-buttons">
      <button class="cart-drawer-btn cart-drawer-btn-primary" onclick="window.location.href='${getRelativePath('checkout')}'">
        Proceder al pago
      </button>
      <button class="cart-drawer-btn cart-drawer-btn-secondary" onclick="window.location.href='${getRelativePath('cart')}'">
        Ver Carrito Completo
      </button>
    </div>
  `;
  
  // Agregar event listeners a los botones
  drawerBody.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const itemId = btn.dataset.id;
      
      if (action === 'remove') {
        removeFromCart(itemId);
      } else if (action === 'increase') {
        const item = cart.find(item => item.id === itemId);
        if (item) {
          updateCartQuantity(itemId, item.quantity + 1);
        }
      } else if (action === 'decrease') {
        const item = cart.find(item => item.id === itemId);
        if (item) {
          updateCartQuantity(itemId, item.quantity - 1);
        }
      }
      
      renderCartDrawer();
    });
  });
}

// Función para abrir el drawer
export function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.hidden = false;
    document.body.style.overflow = 'hidden';
    renderCartDrawer();
  }
}

// Función para cerrar el drawer
export function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.hidden = true;
    document.body.style.overflow = '';
  }
}

// Inicializar el drawer
export function initCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  const closeBtn = document.getElementById('cart-drawer-close');
  
  if (!drawer) return;
  
  // Cerrar al hacer click en el overlay
  if (overlay) {
    overlay.addEventListener('click', closeCartDrawer);
  }
  
  // Cerrar con el botón de cerrar
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCartDrawer);
  }
  
  // Cerrar con la tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hidden) {
      closeCartDrawer();
    }
  });
  
  // Escuchar cambios en el carrito para actualizar el drawer si está abierto
  window.addEventListener('cartUpdated', () => {
    if (!drawer.hidden) {
      renderCartDrawer();
    }
  });
}

// Inicializar cuando el DOM esté listo
function initializeDrawer() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartDrawer);
  } else {
    initCartDrawer();
  }
}

initializeDrawer();

// También exportar para uso externo
export { initializeDrawer };

