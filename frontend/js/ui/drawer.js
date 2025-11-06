/**
 * Drawer Component - Vanilla JS Implementation
 * Adaptación del componente Drawer de React (vaul)
 */

/**
 * Inicializa un drawer individual
 * @param {HTMLElement} drawerElement - Elemento contenedor del drawer
 */
export function initDrawer(drawerElement) {
  const trigger = drawerElement.querySelector('[data-slot="drawer-trigger"], .drawer-trigger');
  const overlay = drawerElement.querySelector('[data-slot="drawer-overlay"], .drawer-overlay');
  const content = drawerElement.querySelector('[data-slot="drawer-content"], .drawer-content');
  const closeButton = content?.querySelector('[data-slot="drawer-close"], .drawer-close');
  
  if (!trigger || !overlay || !content) {
    console.warn('Drawer: trigger, overlay or content not found');
    return;
  }
  
  // Obtener dirección del drawer (default: bottom)
  const direction = drawerElement.getAttribute('data-direction') || 
                   content.getAttribute('data-direction') || 
                   'bottom';
  content.setAttribute('data-direction', direction);
  
  // Crear handle si no existe y la dirección es bottom
  if (direction === 'bottom' && !content.querySelector('.drawer-handle')) {
    const handle = document.createElement('div');
    handle.className = 'drawer-handle';
    content.insertBefore(handle, content.firstChild);
  }
  
  let isOpen = false;
  let overlayInBody = false;
  let contentInBody = false;
  
  // Función para mover overlay y content al body (portal)
  function moveToBody() {
    if (!overlayInBody) {
      document.body.appendChild(overlay);
      overlayInBody = true;
    }
    if (!contentInBody) {
      document.body.appendChild(content);
      contentInBody = true;
    }
  }
  
  // Función para mover de vuelta al contenedor original
  function moveBack() {
    if (overlayInBody && drawerElement) {
      drawerElement.appendChild(overlay);
      overlayInBody = false;
    }
    if (contentInBody && drawerElement) {
      drawerElement.appendChild(content);
      contentInBody = false;
    }
  }
  
  // Función para abrir el drawer
  function openDrawer() {
    isOpen = true;
    moveToBody();
    overlay.setAttribute('data-state', 'open');
    content.setAttribute('data-state', 'open');
    drawerElement.setAttribute('data-state', 'open');
    document.body.style.overflow = 'hidden';
    
    // Focus en el contenido
    content.setAttribute('tabindex', '-1');
    setTimeout(() => {
      content.focus();
    }, 0);
    
    // Dispatch event
    drawerElement.dispatchEvent(new CustomEvent('drawer-open', {
      detail: { open: true, direction },
      bubbles: true
    }));
  }
  
  // Función para cerrar el drawer
  function closeDrawer() {
    isOpen = false;
    overlay.setAttribute('data-state', 'closed');
    content.setAttribute('data-state', 'closed');
    drawerElement.setAttribute('data-state', 'closed');
    document.body.style.overflow = '';
    
    // Mover de vuelta después de la animación
    setTimeout(() => {
      if (!isOpen) {
        moveBack();
      }
    }, 300);
    
    // Dispatch event
    drawerElement.dispatchEvent(new CustomEvent('drawer-close', {
      detail: { open: false, direction },
      bubbles: true
    }));
  }
  
  // Función para toggle
  function toggleDrawer() {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }
  
  // Event listeners
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  });
  
  // Cerrar con el botón X
  if (closeButton) {
    closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeDrawer();
    });
  }
  
  // Cerrar al hacer clic en el overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeDrawer();
    }
  });
  
  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeDrawer();
    }
  });
  
  // Swipe para cerrar (solo en móvil)
  let touchStartY = 0;
  let touchStartX = 0;
  let isDragging = false;
  
  content.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    isDragging = false;
  });
  
  content.addEventListener('touchmove', (e) => {
    if (!isOpen) return;
    
    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - touchStartY;
    const deltaX = currentX - touchStartX;
    
    // Solo permitir swipe en la dirección del drawer
    if (direction === 'bottom' && deltaY > 0) {
      isDragging = true;
      const translateY = Math.max(0, deltaY);
      content.style.transform = `translateY(${translateY}px)`;
    } else if (direction === 'top' && deltaY < 0) {
      isDragging = true;
      const translateY = Math.min(0, deltaY);
      content.style.transform = `translateY(${translateY}px)`;
    } else if (direction === 'right' && deltaX < 0) {
      isDragging = true;
      const translateX = Math.min(0, deltaX);
      content.style.transform = `translateX(${translateX}px)`;
    } else if (direction === 'left' && deltaX > 0) {
      isDragging = true;
      const translateX = Math.max(0, deltaX);
      content.style.transform = `translateX(${translateX}px)`;
    }
  });
  
  content.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    
    const currentY = e.changedTouches[0].clientY;
    const currentX = e.changedTouches[0].clientX;
    const deltaY = currentY - touchStartY;
    const deltaX = currentX - touchStartX;
    const threshold = 100; // Píxeles necesarios para cerrar
    
    // Resetear transform
    content.style.transform = '';
    
    // Cerrar si se superó el threshold
    if (direction === 'bottom' && deltaY > threshold) {
      closeDrawer();
    } else if (direction === 'top' && deltaY < -threshold) {
      closeDrawer();
    } else if (direction === 'right' && deltaX < -threshold) {
      closeDrawer();
    } else if (direction === 'left' && deltaX > threshold) {
      closeDrawer();
    }
    
    isDragging = false;
  });
  
  // Trap focus dentro del drawer
  function trapFocus(e) {
    if (!isOpen) return;
    
    const focusableElements = content.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }
  }
  
  content.addEventListener('keydown', trapFocus);
  
  // Guardar métodos
  drawerElement._drawerApi = {
    open: openDrawer,
    close: closeDrawer,
    toggle: toggleDrawer,
    isOpen: () => isOpen,
    direction
  };
}

/**
 * Inicializa todos los drawers en la página
 */
export function initDrawers() {
  const drawers = document.querySelectorAll('[data-slot="drawer"], .drawer');
  
  drawers.forEach((drawer) => {
    initDrawer(drawer);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDrawers);
} else {
  initDrawers();
}

