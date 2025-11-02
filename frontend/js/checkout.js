// Importar funciones del carrito desde main.js
import { getCart, saveCart, CART_STORAGE_KEY } from './main.js';

// Constantes
const ORDERS_STORAGE_KEY = 'app_orders';
const DELIVERY_FEE = 5000;

// Función para formatear precio
function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(price);
}

// Función para verificar si el usuario está logueado
function checkLoginStatus() {
  const accessToken = localStorage.getItem('accessToken');
  return !!accessToken;
}

// Función para obtener información del usuario
function getUserInfo() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Función para guardar pedido en localStorage
function saveOrder(order) {
  const ordersStr = localStorage.getItem(ORDERS_STORAGE_KEY);
  const orders = ordersStr ? JSON.parse(ordersStr) : [];
  
  // Generar ID único para el pedido
  const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const orderWithId = {
    ...order,
    id: orderId,
    createdAt: new Date().toISOString(),
    status: 'pendiente'
  };
  
  orders.push(orderWithId);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  
  return orderWithId;
}

// Función para renderizar items del checkout
function renderCheckoutItems() {
  const itemsList = document.getElementById('checkout-items-list');
  if (!itemsList) return;
  
  const cart = getCart();
  itemsList.innerHTML = '';
  
  cart.forEach((item) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'summary-item';
    itemEl.innerHTML = `
      <span>${item.name} x${item.quantity}</span>
      <span>${formatPrice(item.price * item.quantity)}</span>
    `;
    itemsList.appendChild(itemEl);
  });
}

// Función para actualizar totales
function updateTotals() {
  const cart = getCart();
  const deliveryMethod = document.querySelector('input[name="delivery"]:checked')?.value || 'pickup';
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryMethod === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;
  
  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const totalEl = document.getElementById('summary-total');
  
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = deliveryFee > 0 ? formatPrice(deliveryFee) : 'Gratis';
  if (totalEl) totalEl.textContent = formatPrice(total);
}

// Función para manejar cambios en método de entrega
function handleDeliveryChange() {
  const deliveryMethod = document.querySelector('input[name="delivery"]:checked')?.value;
  const addressSection = document.getElementById('delivery-address-section');
  const addressInput = document.getElementById('checkout-address');
  const cashOption = document.getElementById('cash-option');
  const deliveryRadio = document.getElementById('delivery');
  const cashRadio = document.getElementById('cash');
  
  if (deliveryMethod === 'delivery') {
    if (addressSection) addressSection.hidden = false;
    if (cashOption) cashOption.hidden = true;
    if (cashRadio && cashRadio.checked) {
      // Cambiar a otro método si estaba seleccionado cash
      const pseRadio = document.getElementById('pse');
      if (pseRadio) pseRadio.checked = true;
    }
  } else {
    if (addressSection) addressSection.hidden = true;
    if (cashOption) cashOption.hidden = false;
    if (addressInput) addressInput.value = '';
  }
  
  updateTotals();
}

// Función para llenar datos del usuario si está logueado
function fillUserData() {
  const user = getUserInfo();
  if (user) {
    const nameInput = document.getElementById('checkout-name');
    const emailInput = document.getElementById('checkout-email');
    const phoneInput = document.getElementById('checkout-phone');
    
    if (nameInput && user.user_metadata?.name) nameInput.value = user.user_metadata.name;
    if (emailInput && user.email) emailInput.value = user.email;
    if (phoneInput && user.user_metadata?.phone) phoneInput.value = user.user_metadata.phone;
  }
}

// Función para manejar submit del formulario
function handleSubmit(e) {
  e.preventDefault();
  
  if (!checkLoginStatus()) {
    alert('Debes iniciar sesión para realizar un pedido');
    window.location.href = './login.html';
    return;
  }
  
  const cart = getCart();
  if (cart.length === 0) {
    alert('Tu carrito está vacío');
    window.location.href = './cart.html';
    return;
  }
  
  const submitBtn = document.getElementById('checkout-submit');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const errorEl = document.getElementById('checkout-error');
  
  // Obtener valores del formulario
  const customerInfo = {
    name: document.getElementById('checkout-name').value,
    email: document.getElementById('checkout-email').value,
    phone: document.getElementById('checkout-phone').value,
    address: document.getElementById('checkout-address').value || '',
    notes: document.getElementById('checkout-notes').value || ''
  };
  
  const deliveryMethod = document.querySelector('input[name="delivery"]:checked')?.value || 'pickup';
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cash';
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryMethod === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;
  
  // Validaciones
  if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
    if (errorEl) {
      errorEl.textContent = 'Por favor completa todos los campos requeridos';
      errorEl.hidden = false;
    }
    return;
  }
  
  if (deliveryMethod === 'delivery' && !customerInfo.address.trim()) {
    if (errorEl) {
      errorEl.textContent = 'Por favor ingresa una dirección de entrega';
      errorEl.hidden = false;
    }
    return;
  }
  
  // Deshabilitar botón
  submitBtn.disabled = true;
  btnText.hidden = true;
  if (btnLoading) btnLoading.hidden = false;
  if (errorEl) errorEl.hidden = true;
  
  // Simular procesamiento (en una app real, harías una llamada API aquí)
  setTimeout(() => {
    try {
      // Crear orden
      const user = getUserInfo();
      // Obtener userId del usuario logueado (compatibilidad con profile.js)
      let userId = 'guest';
      if (user) {
        // user puede ser un objeto con { user, accessToken } o directamente el objeto user
        const userObj = user.user || user;
        userId = userObj?.id || userObj?.email || customerInfo.email || 'guest';
      } else {
        userId = customerInfo.email || 'guest';
      }
      
      const order = {
        items: cart,
        total,
        subtotal,
        deliveryFee,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'delivery' ? customerInfo.address : null,
        paymentMethod,
        customerInfo,
        userId: userId
      };
      
      // Guardar orden
      const savedOrder = saveOrder(order);
      
      // Limpiar carrito
      saveCart([]);
      
      // Redirigir a página de éxito o perfil
      alert(`¡Pedido confirmado! Tu número de pedido es: ${savedOrder.id.slice(-8)}`);
      window.location.href = './profile.html';
    } catch (error) {
      console.error('Error al procesar pedido:', error);
      if (errorEl) {
        errorEl.textContent = 'Error al procesar el pedido. Por favor intenta de nuevo.';
        errorEl.hidden = false;
      }
      submitBtn.disabled = false;
      btnText.hidden = false;
      if (btnLoading) btnLoading.hidden = true;
    }
  }, 1000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const cart = getCart();
  
  // Verificar si el usuario está logueado
  if (!checkLoginStatus()) {
    const loginRequired = document.getElementById('checkout-login-required');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (loginRequired) loginRequired.hidden = false;
    if (checkoutForm) checkoutForm.hidden = true;
    return;
  }
  
  // Si está logueado pero el carrito está vacío, redirigir
  if (cart.length === 0) {
    alert('Tu carrito está vacío');
    window.location.href = './cart.html';
    return;
  }
  
  // Renderizar items y actualizar totales
  renderCheckoutItems();
  updateTotals();
  
  // Llenar datos del usuario
  fillUserData();
  
  // Event listeners para cambios en método de entrega
  document.querySelectorAll('input[name="delivery"]').forEach((radio) => {
    radio.addEventListener('change', handleDeliveryChange);
  });
  
  // Event listener para cambios en método de pago
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      updateTotals();
    });
  });
  
  // Event listener para el formulario
  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
  
  // Inicializar estado del formulario
  handleDeliveryChange();
});

