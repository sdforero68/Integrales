// Claves de localStorage
const CURRENT_USER_KEY = 'current_user';
const CURRENT_SESSION_KEY = 'current_session';
const ORDERS_STORAGE_KEY = 'app_orders';

// Función para formatear precio
function formatPrice(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
}

// Obtener información del usuario desde localStorage
function getUserInfo() {
  const userStr = localStorage.getItem('user') || localStorage.getItem(CURRENT_USER_KEY);
  const accessToken = localStorage.getItem('accessToken') || localStorage.getItem(CURRENT_SESSION_KEY);
  
  if (!userStr || !accessToken) {
    // Si no hay sesión, redirigir al login
    window.location.href = '../login/index.html';
    return null;
  }
  
  try {
    const user = JSON.parse(userStr);
    return { user, accessToken };
  } catch (error) {
    console.error('Error parsing user data:', error);
    window.location.href = '../login/index.html';
    return null;
  }
}

// Función para obtener color del estado
function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'pendiente':
      return 'pendiente';
    case 'confirmado':
      return 'confirmado';
    case 'enviado':
      return 'enviado';
    case 'entregado':
      return 'entregado';
    default:
      return 'default';
  }
}

// Función para formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Función para formatear método de entrega
function formatDeliveryMethod(method) {
  return method === 'delivery' ? 'Envío a domicilio' : 'Recoger en tienda';
}

// Función para formatear método de pago
function formatPaymentMethod(method) {
  if (method === 'cash') {
    return 'Contra entrega';
  }
  return method.toUpperCase();
}


// Obtener pedidos del usuario desde localStorage
function getOrdersByUserId(userId) {
  const ordersStr = localStorage.getItem(ORDERS_STORAGE_KEY);
  const allOrders = ordersStr ? JSON.parse(ordersStr) : [];
  
  // Filtrar pedidos del usuario actual
  return allOrders.filter(order => order.userId === userId);
}

// Cargar información del usuario
function loadUserInfo() {
  const userInfo = getUserInfo();
  if (!userInfo) return null;
  
  const { user, accessToken } = userInfo;
  
  // Actualizar UI del usuario
  const userNameEl = document.getElementById('user-name');
  const userEmailEl = document.getElementById('user-email');
  const userPhoneEl = document.getElementById('user-phone');
  
  if (userNameEl) {
    userNameEl.textContent = user?.user_metadata?.name || 'Usuario';
  }
  
  if (userEmailEl) {
    userEmailEl.textContent = user?.email || '-';
  }
  
  if (userPhoneEl && user?.user_metadata?.phone) {
    userPhoneEl.textContent = user.user_metadata.phone;
  }
  
  return { user, accessToken };
}

// Cargar pedidos
function fetchOrders(userId) {
  const loadingState = document.getElementById('loading-state');
  const emptyState = document.getElementById('empty-state');
  const ordersList = document.getElementById('orders-list');
  
  try {
    if (loadingState) loadingState.hidden = false;
    if (emptyState) emptyState.hidden = true;
    if (ordersList) ordersList.hidden = true;
    
    // Simular delay de carga
    setTimeout(() => {
      const orders = getOrdersByUserId(userId);
      
      if (loadingState) loadingState.hidden = true;
      
      if (orders.length === 0) {
        if (emptyState) emptyState.hidden = false;
      } else {
        renderOrders(orders);
        if (emptyState) emptyState.hidden = true;
        if (ordersList) ordersList.hidden = false;
      }
    }, 500);
  } catch (error) {
    console.error('Error fetching orders:', error);
    if (loadingState) loadingState.hidden = true;
    if (emptyState) emptyState.hidden = false;
  }
}

// Renderizar pedidos
function renderOrders(orders) {
  const ordersList = document.getElementById('orders-list');
  if (!ordersList) return;
  
  ordersList.innerHTML = '';
  
  orders.forEach((order) => {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    
    const orderId = order.id.slice(-8);
    const status = order.status || 'pendiente';
    const statusClass = getStatusColor(status);
    
    orderCard.innerHTML = `
      <div class="order-header">
        <div class="order-info">
          <p class="order-id">Pedido #${orderId}</p>
          <p class="order-date">${formatDate(order.createdAt || order.date)}</p>
        </div>
        <span class="status-badge ${statusClass}">
          ${status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      <div class="order-items">
        ${(order.items || []).map((item) => `
          <div class="order-item">
            <span>${item.name} x${item.quantity}</span>
            <span>${formatPrice(item.price * item.quantity)}</span>
          </div>
        `).join('')}
      </div>
      
      <div class="order-footer">
        <div class="order-methods">
          <p class="order-method">
            ${formatDeliveryMethod(order.deliveryMethod || 'delivery')}
          </p>
          <p class="order-method">
            Pago: ${formatPaymentMethod(order.paymentMethod || 'cash')}
          </p>
        </div>
        <div class="order-total">
          <p class="order-total-label">Total</p>
          <p class="order-total-amount">${formatPrice(order.total)}</p>
        </div>
      </div>
    `;
    
    ordersList.appendChild(orderCard);
  });
}

// Función de logout (usando sync.js)
async function handleLogout() {
  try {
    const { handleLogout: handleLogoutSync } = await import('../../sync.js');
    handleLogoutSync();
  } catch (error) {
    // Fallback local
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('current_user');
    localStorage.removeItem('current_session');
    window.location.href = '../login/index.html';
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Cargar información del usuario
  const userInfo = loadUserInfo();
  
  if (userInfo) {
    // Cargar pedidos
    fetchOrders(userInfo.user.id);
  }
  
  // Manejar botón de logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
});
