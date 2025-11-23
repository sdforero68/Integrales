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
    // Si no hay sesión, mostrar estado de no sesión en lugar de redirigir
    return null;
  }
  
  try {
    const user = JSON.parse(userStr);
    return { user, accessToken };
  } catch (error) {
    console.error('Error parsing user data:', error);
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
  const infoNote = document.querySelector('.order-info-note');
  
  try {
    if (loadingState) loadingState.hidden = false;
    if (emptyState) emptyState.hidden = true;
    if (ordersList) {
      ordersList.hidden = true;
      ordersList.innerHTML = ''; // Limpiar contenido
    }
    if (infoNote) infoNote.hidden = true;
    
    // Simular delay de carga
    setTimeout(() => {
      const orders = getOrdersByUserId(userId);
      
      if (loadingState) loadingState.hidden = true;
      
      if (orders.length === 0) {
        // No hay pedidos - mostrar estado vacío
        if (emptyState) emptyState.hidden = false;
        if (ordersList) {
          ordersList.hidden = true;
          ordersList.innerHTML = ''; // Asegurar que esté vacío
        }
        if (infoNote) infoNote.hidden = true;
      } else {
        // Hay pedidos - renderizar lista
        renderOrders(orders);
        if (emptyState) emptyState.hidden = true;
        if (ordersList) ordersList.hidden = false;
        if (infoNote) infoNote.hidden = false;
      }
    }, 500);
  } catch (error) {
    console.error('Error fetching orders:', error);
    if (loadingState) loadingState.hidden = true;
    if (emptyState) emptyState.hidden = false;
    if (ordersList) {
      ordersList.hidden = true;
      ordersList.innerHTML = '';
    }
    if (infoNote) infoNote.hidden = true;
  }
}

// Función para eliminar un pedido
function deleteOrder(orderId) {
  const ordersStr = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!ordersStr) return false;
  
  const orders = JSON.parse(ordersStr);
  const filteredOrders = orders.filter(order => order.id !== orderId);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filteredOrders));
  
  return true;
}

// Renderizar pedidos
function renderOrders(orders) {
  const ordersList = document.getElementById('orders-list');
  if (!ordersList) return;
  
  // Obtener userId para recargar los pedidos del usuario después de eliminar
  const userInfo = getUserInfo();
  const user = userInfo?.user;
  const userId = user?.id || user?.email || 'guest';
  
  // Limpiar la lista antes de renderizar
  ordersList.innerHTML = '';
  
  // Asegurarse de que el estado vacío esté oculto cuando hay pedidos
  const emptyStateEl = document.getElementById('empty-state');
  if (emptyStateEl && orders.length > 0) {
    emptyStateEl.hidden = true;
  }
  
  orders.forEach((order) => {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    
    const orderId = order.id.slice(-8);
    const fullOrderId = order.id;
    const status = order.status || 'pendiente';
    const statusClass = getStatusColor(status);
    
    orderCard.innerHTML = `
      <div class="order-header">
        <div class="order-info">
          <p class="order-id">Pedido #${orderId}</p>
          <p class="order-date">${formatDate(order.createdAt || order.date)}</p>
        </div>
        <div class="order-header-actions">
          <span class="status-badge ${statusClass}">
            ${status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <button class="order-delete-btn" data-order-id="${fullOrderId}" aria-label="Eliminar pedido" title="Eliminar pedido">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
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
    
    // Event listener para botón de eliminar
    const deleteBtn = orderCard.querySelector('.order-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
          // Eliminar el pedido del localStorage primero
          if (deleteOrder(fullOrderId)) {
            // Obtener elementos del DOM
            const ordersListEl = document.getElementById('orders-list');
            const infoNoteEl = document.querySelector('.order-info-note');
            const emptyStateEl = document.getElementById('empty-state');
            const loadingStateEl = document.getElementById('loading-state');
            
            // Ocultar inmediatamente la lista y la nota informativa
            if (ordersListEl) {
              ordersListEl.hidden = true;
              ordersListEl.innerHTML = ''; // Limpiar el contenido también
            }
            if (infoNoteEl) infoNoteEl.hidden = true;
            if (loadingStateEl) loadingStateEl.hidden = true;
            
            // Verificar si quedan pedidos después de eliminar (después de que se elimine del localStorage)
            const remainingOrders = getOrdersByUserId(userId);
            
            if (remainingOrders.length === 0) {
              // No hay pedidos - mostrar estado vacío inmediatamente y asegurarse de que la lista esté oculta
              if (emptyStateEl) emptyStateEl.hidden = false;
              if (ordersListEl) ordersListEl.hidden = true;
              if (infoNoteEl) infoNoteEl.hidden = true;
            } else {
              // Hay pedidos - recargar la lista
              fetchOrders(userId);
            }
            
            if (window.toast) {
              window.toast.success('Pedido eliminado del historial');
            } else {
              alert('Pedido eliminado');
            }
          }
        }
      });
    }
    
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

// Cargar favoritos
async function fetchFavorites() {
  const loadingState = document.getElementById('favorites-loading-state');
  const emptyState = document.getElementById('favorites-empty-state');
  const favoritesList = document.getElementById('favorites-list');
  
  try {
    if (loadingState) loadingState.hidden = false;
    if (emptyState) emptyState.hidden = true;
    if (favoritesList) favoritesList.hidden = true;
    
    // Simular delay de carga
    setTimeout(async () => {
      const { getFavorites } = await import('../../favorites.js');
      const favorites = getFavorites();
      
      if (loadingState) loadingState.hidden = true;
      
      if (favorites.length === 0) {
        if (emptyState) emptyState.hidden = false;
      } else {
        renderFavorites(favorites);
        if (emptyState) emptyState.hidden = true;
        if (favoritesList) favoritesList.hidden = false;
      }
    }, 500);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    if (loadingState) loadingState.hidden = true;
    if (emptyState) emptyState.hidden = false;
  }
}

// Renderizar favoritos
async function renderFavorites(favorites) {
  const favoritesList = document.getElementById('favorites-list');
  if (!favoritesList) return;
  
  favoritesList.innerHTML = '';
  
  const { products } = await import('../../products.js');
  const { removeFromFavorites } = await import('../../favorites.js');
  const { addToCart } = await import('../../sync.js');
  const { resolveProductImage } = await import('../../main.js');
  
  favorites.forEach((favorite) => {
    // Buscar el producto completo en la lista de productos
    const fullProduct = products.find(p => p.id === favorite.id) || favorite;
    
    const favoriteCard = document.createElement('div');
    favoriteCard.className = 'favorite-item';
    
    // Usar resolveProductImage para obtener la ruta correcta de la imagen
    const productImage = resolveProductImage(fullProduct);
    const placeholderPath = window.location.pathname.includes('/pages/') 
      ? '../../assets/images/placeholder.svg'
      : './assets/images/placeholder.svg';
    
    favoriteCard.innerHTML = `
      <img src="${productImage}" alt="${favorite.name}" class="favorite-item-image" onerror="this.onerror=null;this.src='${placeholderPath}'" />
      <div class="favorite-item-details">
        <h3 class="favorite-item-name">${favorite.name}</h3>
        <p class="favorite-item-description">${favorite.description || ''}</p>
        <div class="favorite-item-price">${formatPrice(favorite.price)}</div>
      </div>
      <div class="favorite-item-actions">
        <button class="favorite-remove-btn active" data-product-id="${favorite.id}" aria-label="Eliminar de favoritos">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button class="favorite-add-cart-btn" data-product-id="${favorite.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span>Agregar al carrito</span>
        </button>
      </div>
    `;
    
    // Event listeners
    const removeBtn = favoriteCard.querySelector('.favorite-remove-btn');
    const addCartBtn = favoriteCard.querySelector('.favorite-add-cart-btn');
    
    if (removeBtn) {
      removeBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); // Evitar cualquier otro evento
        removeFromFavorites(favorite.id);
        fetchFavorites(); // Recargar lista
        if (window.toast) {
          window.toast.success('Producto eliminado de favoritos');
        }
      });
    }
    
    if (addCartBtn) {
      addCartBtn.addEventListener('click', () => {
        addToCart(fullProduct);
        if (window.toast) {
          window.toast.success(`${favorite.name} agregado al carrito`);
        }
      });
    }
    
    favoritesList.appendChild(favoriteCard);
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Obtener elementos del DOM
  const noSessionState = document.getElementById('no-session-state');
  const userInfoCard = document.getElementById('user-info-card');
  const favoritesCard = document.getElementById('favorites-card');
  const orderHistoryCard = document.getElementById('order-history-card');
  
  // Cargar información del usuario
  const userInfo = loadUserInfo();
  
  if (userInfo && userInfo.user) {
    // Usuario autenticado - Mostrar contenido del perfil
    if (noSessionState) noSessionState.style.display = 'none';
    if (userInfoCard) userInfoCard.hidden = false;
    if (favoritesCard) favoritesCard.hidden = false;
    if (orderHistoryCard) orderHistoryCard.hidden = false;
    
    // Cargar favoritos
    fetchFavorites();
    
    // Cargar pedidos
    fetchOrders(userInfo.user.id);
    
    // Manejar botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  } else {
    // No hay sesión - Mostrar estado de no sesión
    if (noSessionState) noSessionState.style.display = 'block';
    if (userInfoCard) userInfoCard.hidden = true;
    if (favoritesCard) favoritesCard.hidden = true;
    if (orderHistoryCard) orderHistoryCard.hidden = true;
  }
});
