/**
 * cart-menu.js - Inicialización simple del carrito drawer
 * Hace que el carrito drawer funcione en todas las páginas sin depender de sync.js
 */

// Función para inicializar el carrito drawer
function initCartMenu() {
  // Función para abrir el drawer
  async function openCartDrawer() {
    try {
      // Intentar importar cart-drawer.js
      const { openCartDrawer: openDrawer } = await import('./cart-drawer.js');
      openDrawer();
    } catch (error) {
      console.warn('Error loading cart drawer, redirecting to cart page:', error);
      // Fallback: redirigir a la página del carrito
      const currentPath = window.location.pathname;
      if (currentPath.includes('/pages/')) {
        window.location.href = '../cart/index.html';
      } else {
        window.location.href = './pages/cart/index.html';
      }
    }
  }

  // Configurar botones del carrito
  function setupCartButtons() {
    const cartButtons = document.querySelectorAll('[data-action="cart"]');
    
    cartButtons.forEach((btn) => {
      // Remover listeners existentes para evitar duplicados
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      // Agregar nuevo listener
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openCartDrawer();
      });
    });
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(setupCartButtons, 50);
      setTimeout(setupCartButtons, 200);
    });
  } else {
    setTimeout(setupCartButtons, 50);
    setTimeout(setupCartButtons, 200);
  }

  // También ejecutar después de un delay adicional
  setTimeout(setupCartButtons, 500);
}

// Inicializar
initCartMenu();

