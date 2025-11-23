// Importar funciones del carrito desde main.js
import { getCart, saveCart, getCartItemsCount, CART_STORAGE_KEY } from '../../main.js';
import { updateCartBadge } from '../../sync.js';

// Función para formatear precio
function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(price);
}

// La función updateCartBadge ahora se importa de sync.js

// Función para resolver la ruta de imagen del producto
function resolveProductImagePath(item) {
  if (!item?.image) {
    return '../../assets/images/placeholder.svg';
  }

  // Si es una URL completa, retornarla directamente
  if (typeof item.image === 'string' && item.image.startsWith('http')) {
    return item.image;
  }

  // Resolver la ruta (siempre desde pages/cart/)
  const imageBase = '../../assets/images';
  
  // Si la imagen ya tiene la ruta completa o relativa, usarla
  const imagePath = typeof item.image === 'string' ? item.image : '';
  
  // Si la ruta incluye un directorio (como Catálogo/), construir la ruta completa
  if (imagePath.includes('/')) {
    return `${imageBase}/${imagePath}`;
  }
  
  // Si no tiene directorio, asumir que está en products/
  return `${imageBase}/products/${imagePath}`;
}

// Función para renderizar items del carrito
function renderCartItems() {
  const cartItemsList = document.getElementById('cart-items-list');
  const cartEmpty = document.getElementById('cart-empty');
  const cartContent = document.getElementById('cart-content');
  
  const cart = getCart();
  
  // Actualizar contador de productos
  const productsCountEl = document.getElementById('cart-products-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (productsCountEl) {
    productsCountEl.textContent = `${totalItems} ${totalItems === 1 ? 'Producto' : 'Productos'}`;
  }
  
  if (cart.length === 0) {
    // Mostrar estado vacío y ocultar contenido
    if (cartEmpty) {
      cartEmpty.hidden = false;
      cartEmpty.style.display = 'flex';
    }
    if (cartContent) {
      cartContent.hidden = true;
      cartContent.style.display = 'none';
    }
    if (cartItemsList) cartItemsList.innerHTML = '';
    return;
  }
  
  // Ocultar estado vacío y mostrar contenido cuando hay productos
  if (cartEmpty) {
    cartEmpty.hidden = true;
    cartEmpty.style.display = 'none';
  }
  if (cartContent) {
    cartContent.hidden = false;
    cartContent.style.display = 'block';
  }
  
  if (!cartItemsList) return;
  
  cartItemsList.innerHTML = '';
  
  cart.forEach((item) => {
    // Resolver la ruta de imagen correctamente
    const productImage = resolveProductImagePath(item);
    
    const cartItemEl = document.createElement('div');
    cartItemEl.className = 'cart-item';
    cartItemEl.innerHTML = `
      <img src="${productImage}" alt="${item.name}" class="cart-item-image" onerror="this.src='../../assets/images/placeholder.svg'" />
      <div class="cart-item-details">
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-price">${formatPrice(item.price)} c/u</p>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
          </div>
          <button class="remove-btn" data-action="remove" data-id="${item.id}">Eliminar</button>
        </div>
      </div>
      <div class="cart-item-total">
        ${formatPrice(item.price * item.quantity)}
      </div>
    `;
    
    cartItemsList.appendChild(cartItemEl);
  });
  
  // Agregar event listeners
  cartItemsList.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const action = btn.dataset.action;
      const itemId = btn.dataset.id;
      handleCartAction(action, itemId);
    });
  });
  
  updateSummary();
}

// Función para manejar acciones del carrito
function handleCartAction(action, itemId) {
  const cart = getCart();
  
  if (action === 'remove') {
    const newCart = cart.filter(item => item.id !== itemId);
    saveCart(newCart);
  } else if (action === 'increase') {
    const item = cart.find(item => item.id === itemId);
    if (item) {
      item.quantity += 1;
      saveCart(cart);
    }
  } else if (action === 'decrease') {
    const item = cart.find(item => item.id === itemId);
    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        const newCart = cart.filter(i => i.id !== itemId);
        saveCart(newCart);
      } else {
        saveCart(cart);
      }
    }
  }
  
  renderCartItems();
  updateCartBadge(); // Usar función de sync.js
}

// Función para actualizar el resumen
function updateSummary() {
  const cart = getCart();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // El envío se calcula en checkout
  const total = subtotal + shipping;
  
  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const totalEl = document.getElementById('summary-total');
  
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = 'Gratis';
  if (totalEl) totalEl.textContent = formatPrice(total);
  
  // Verificar si hay items para habilitar el botón de checkout
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  renderCartItems();
  updateCartBadge();
  
  // Manejar click en botón de checkout
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const cart = getCart();
      if (cart.length === 0) {
        if (window.toast) {
          window.toast.error('Tu carrito está vacío');
        } else {
          alert('Tu carrito está vacío');
        }
        return;
      }
      
      // Verificar si el usuario está logueado
      const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('current_session');
      if (!accessToken) {
        if (window.toast) {
          window.toast.error('Debes iniciar sesión para proceder al pago');
        } else {
          alert('Debes iniciar sesión para proceder al pago');
        }
        // Redirigir a login
        window.location.href = '../login/index.html';
        return;
      }
      
      window.location.href = '../checkout/index.html';
    });
  }
});

// Exportar funciones para uso en otros archivos
export { formatPrice };

