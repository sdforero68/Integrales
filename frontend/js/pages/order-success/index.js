// Importar funciones necesarias
import { getCartItemsCount } from '../../main.js';
import { api } from '../../config/api.js';

// Función para formatear precio
function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(price);
}

// Función para obtener el pedido desde la API o localStorage
async function getOrder() {
  // Intentar obtener el ID del pedido desde la URL o sessionStorage
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId') || sessionStorage.getItem('lastOrderId');
  
  if (!orderId) {
    // Fallback: buscar el último pedido en localStorage
    const ordersStr = localStorage.getItem('app_orders');
    if (ordersStr) {
      const orders = JSON.parse(ordersStr);
      if (orders.length > 0) {
        return orders[orders.length - 1];
      }
    }
    return null;
  }
  
  try {
    // Obtener pedido desde la API
    const response = await api.pedidos.getById(orderId);
    
    if (response.success && response.data) {
      const pedido = response.data;
      
      // Convertir al formato local
      return {
        id: pedido.id.toString(),
        numero_pedido: pedido.numero_pedido,
        items: pedido.items.map(item => ({
          id: item.producto_id.toString(),
          name: item.nombre,
          quantity: item.cantidad,
          price: parseFloat(item.precio_unitario)
        })),
        total: parseFloat(pedido.total),
        subtotal: parseFloat(pedido.subtotal),
        deliveryFee: parseFloat(pedido.costo_envio),
        deliveryMethod: pedido.metodo_entrega === 'domicilio' ? 'delivery' : 'pickup',
        deliveryAddress: pedido.direccion_entrega,
        paymentMethod: pedido.metodo_pago,
        status: pedido.estado,
        createdAt: pedido.created_at
      };
    }
  } catch (error) {
    console.warn('Error al obtener pedido desde API, usando localStorage:', error);
    
    // Fallback a localStorage
    const ordersStr = localStorage.getItem('app_orders');
    if (ordersStr) {
      const orders = JSON.parse(ordersStr);
      const order = orders.find(o => o.id === orderId);
      return order || null;
    }
  }
  
  return null;
}

// Función para renderizar el resumen del pedido
function renderOrderSummary(order) {
  if (!order) return;
  
  // Renderizar número de pedido
  const orderNumberEl = document.getElementById('order-number');
  if (orderNumberEl) {
    if (order.numero_pedido) {
      orderNumberEl.textContent = `#${order.numero_pedido}`;
    } else if (order.id) {
      // Fallback: mostrar los últimos 8 caracteres del ID
      const shortId = order.id.slice(-8).toUpperCase();
      orderNumberEl.textContent = `#${shortId}`;
    }
  }
  
  // Renderizar items
  const itemsListEl = document.getElementById('order-items-list');
  if (itemsListEl && order.items) {
    itemsListEl.innerHTML = '';
    order.items.forEach((item) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'order-item';
      itemEl.innerHTML = `
        <span class="order-item-name">${item.name} x${item.quantity}</span>
        <span class="order-item-price">${formatPrice(item.price * item.quantity)}</span>
      `;
      itemsListEl.appendChild(itemEl);
    });
  }
  
  // Renderizar totales
  const subtotalEl = document.getElementById('order-subtotal');
  const shippingEl = document.getElementById('order-shipping');
  const totalEl = document.getElementById('order-total');
  
  if (subtotalEl && order.subtotal !== undefined) {
    subtotalEl.textContent = formatPrice(order.subtotal);
  }
  
  if (shippingEl && order.deliveryFee !== undefined) {
    shippingEl.textContent = order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : 'Gratis';
  }
  
  if (totalEl && order.total !== undefined) {
    totalEl.textContent = formatPrice(order.total);
  }
  
  // Renderizar método de entrega
  const deliveryMethodEl = document.getElementById('delivery-method');
  const deliveryAddressEl = document.getElementById('delivery-address');
  
  if (deliveryMethodEl) {
    if (order.deliveryMethod === 'pickup') {
      deliveryMethodEl.textContent = 'Recoger en Punto de Venta';
      if (deliveryAddressEl) {
        deliveryAddressEl.hidden = true;
      }
    } else if (order.deliveryMethod === 'delivery') {
      deliveryMethodEl.textContent = 'Envío a Domicilio';
      if (deliveryAddressEl && order.deliveryAddress) {
        deliveryAddressEl.textContent = order.deliveryAddress;
        deliveryAddressEl.hidden = false;
      }
    }
  }
  
  // Renderizar método de pago
  const paymentMethodEl = document.getElementById('payment-method');
  if (paymentMethodEl) {
    const paymentMethods = {
      'cash': 'Efectivo',
      'pse': 'PSE',
      'nequi': 'Nequi',
      'daviplata': 'Daviplata'
    };
    paymentMethodEl.textContent = paymentMethods[order.paymentMethod] || order.paymentMethod || 'Efectivo';
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
  // Obtener el pedido desde la API
  const order = await getOrder();
  
  if (!order) {
    // Si no hay pedido, redirigir al catálogo
    alert('No se encontró información del pedido');
    window.location.href = '../catalog/index.html';
    return;
  }
  
  // Renderizar el resumen
  renderOrderSummary(order);
  
  // Actualizar badge del carrito (debería estar vacío después del pedido)
  const cartBadge = document.getElementById('cart-badge');
  if (cartBadge) {
    const count = getCartItemsCount();
    cartBadge.textContent = count;
    cartBadge.hidden = count === 0;
  }
});

