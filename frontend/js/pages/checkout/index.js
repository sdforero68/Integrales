// Importar funciones del carrito desde main.js
import { getCart, saveCart, CART_STORAGE_KEY } from '../../main.js';

// Constantes
const ORDERS_STORAGE_KEY = 'app_orders';
const DELIVERY_FEE = 5000;

// Cache para funciones de sync.js
let syncIsLoggedIn = null;
let syncGetCurrentUser = null;
let syncModuleLoaded = false;

// Función para cargar sync.js (con cache)
async function loadSyncModule() {
  if (syncModuleLoaded) {
    return { isLoggedIn: syncIsLoggedIn, getCurrentUser: syncGetCurrentUser };
  }
  
  try {
    const syncModule = await import('../../sync.js');
    syncIsLoggedIn = syncModule.isLoggedIn;
    syncGetCurrentUser = syncModule.getCurrentUser;
    syncModuleLoaded = true;
    return { isLoggedIn: syncIsLoggedIn, getCurrentUser: syncGetCurrentUser };
  } catch (error) {
    // sync.js no está disponible, usar fallbacks locales
    console.warn('sync.js no disponible, usando fallbacks locales');
    syncIsLoggedIn = () => {
      const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('current_session');
      return !!accessToken;
    };
    syncGetCurrentUser = () => {
      const userStr = localStorage.getItem('user') || localStorage.getItem('current_user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (e) {
          return null;
        }
      }
      return null;
    };
    syncModuleLoaded = true;
    return { isLoggedIn: syncIsLoggedIn, getCurrentUser: syncGetCurrentUser };
  }
}

// Función para formatear precio
function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(price);
}

// Función para verificar si el usuario está logueado (usando sync.js si está disponible)
function checkLoginStatus() {
  if (!syncModuleLoaded) {
    // Si no se ha cargado aún, usar fallback local inmediatamente
    const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('current_session');
    return !!accessToken;
  }
  return syncIsLoggedIn ? syncIsLoggedIn() : false;
}

// Función para obtener información del usuario (usando sync.js si está disponible)
function getUserInfo() {
  if (!syncModuleLoaded) {
    // Si no se ha cargado aún, usar fallback local inmediatamente
    const userStr = localStorage.getItem('user') || localStorage.getItem('current_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
  return syncGetCurrentUser ? syncGetCurrentUser() : null;
}

// Cargar sync.js al iniciar (en background)
loadSyncModule();

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
    // Hacer el campo de dirección requerido
    if (addressInput) addressInput.required = true;
  } else {
    if (addressSection) addressSection.hidden = true;
    if (cashOption) cashOption.hidden = false;
    if (addressInput) {
      addressInput.value = '';
      addressInput.required = false;
    }
  }
  
  updateTotals();
  updateSubmitButton(); // Actualizar estado del botón
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

// Función para validar ciudad en la dirección
function validateCity(address) {
  if (!address) return false;
  const addressLower = address.toLowerCase();
  return addressLower.includes('zipaquira') || 
         addressLower.includes('zipaquirá') || 
         addressLower.includes('cogua');
}

// Función para validar todos los campos obligatorios
function validateForm() {
  const nameInput = document.getElementById('checkout-name');
  const emailInput = document.getElementById('checkout-email');
  const phoneInput = document.getElementById('checkout-phone');
  const addressInput = document.getElementById('checkout-address');
  const deliveryMethod = document.querySelector('input[name="delivery"]:checked')?.value;
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
  
  // Validar campos básicos
  const nameValid = nameInput && nameInput.value.trim() !== '';
  const emailValid = emailInput && emailInput.value.trim() !== '' && emailInput.validity.valid;
  const phoneValid = phoneInput && phoneInput.value.trim() !== '';
  
  // Validar dirección si es necesario
  let addressValid = true;
  if (deliveryMethod === 'delivery') {
    const addressValue = addressInput ? addressInput.value.trim() : '';
    addressValid = addressValue !== '' && validateCity(addressValue);
    
    // Mostrar mensaje de error si la ciudad no es válida
    if (addressInput && addressValue !== '' && !validateCity(addressValue)) {
      addressInput.setCustomValidity('Los envíos a domicilio solo están disponibles en Zipaquirá y Cogua');
    } else if (addressInput) {
      addressInput.setCustomValidity('');
    }
  }
  
  // Validar método de pago
  const paymentValid = !!paymentMethod;
  
  return nameValid && emailValid && phoneValid && addressValid && paymentValid;
}

// Función para actualizar el estado del botón de submit
function updateSubmitButton() {
  const submitBtn = document.getElementById('checkout-submit');
  if (!submitBtn) return;
  
  const isValid = validateForm();
  submitBtn.disabled = !isValid;
  
  if (!isValid) {
    submitBtn.style.opacity = '0.6';
    submitBtn.style.cursor = 'not-allowed';
  } else {
    submitBtn.style.opacity = '1';
    submitBtn.style.cursor = 'pointer';
  }
}

// Función para manejar submit del formulario
function handleSubmit(e) {
  e.preventDefault();
  
  if (!checkLoginStatus()) {
    alert('Debes iniciar sesión para realizar un pedido');
    window.location.href = '../login/index.html';
    return;
  }
  
  const cart = getCart();
  if (cart.length === 0) {
    alert('Tu carrito está vacío');
    window.location.href = '../cart/index.html';
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
  
  // Validar que la dirección sea en Zipaquirá o Cogua
  if (deliveryMethod === 'delivery' && customerInfo.address.trim()) {
    if (!validateCity(customerInfo.address)) {
      if (errorEl) {
        errorEl.textContent = 'Los envíos a domicilio solo están disponibles en Zipaquirá y Cogua';
        errorEl.hidden = false;
      }
      submitBtn.disabled = false;
      btnText.hidden = false;
      if (btnLoading) btnLoading.hidden = true;
      return;
    }
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
      
      // Guardar el ID del pedido en sessionStorage para la página de éxito
      sessionStorage.setItem('lastOrderId', savedOrder.id);
      
      // Redirigir a página de confirmación
      window.location.href = `../order-success/index.html?orderId=${savedOrder.id}`;
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
    window.location.href = '../cart/index.html';
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
      updateSubmitButton(); // Actualizar estado del botón
    });
  });
  
  // Event listeners para validación en tiempo real de campos
  const nameInput = document.getElementById('checkout-name');
  const emailInput = document.getElementById('checkout-email');
  const phoneInput = document.getElementById('checkout-phone');
  const addressInput = document.getElementById('checkout-address');
  
  if (nameInput) {
    nameInput.addEventListener('input', updateSubmitButton);
    nameInput.addEventListener('blur', updateSubmitButton);
  }
  
  if (emailInput) {
    emailInput.addEventListener('input', updateSubmitButton);
    emailInput.addEventListener('blur', updateSubmitButton);
  }
  
  if (phoneInput) {
    phoneInput.addEventListener('input', updateSubmitButton);
    phoneInput.addEventListener('blur', updateSubmitButton);
  }
  
  if (addressInput) {
    addressInput.addEventListener('input', updateSubmitButton);
    addressInput.addEventListener('blur', updateSubmitButton);
  }
  
  // Event listener para el formulario
  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
  
  // Inicializar estado del formulario
  handleDeliveryChange();
  
  // Verificar estado inicial del botón
  updateSubmitButton();
});

