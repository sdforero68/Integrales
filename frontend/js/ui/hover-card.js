/**
 * HoverCard Component - Vanilla JS Implementation
 * Adaptación del componente HoverCard de React/Radix UI
 */

/**
 * Inicializa un hover card individual
 * @param {HTMLElement} hoverCardElement - Elemento contenedor del hover card
 */
export function initHoverCard(hoverCardElement) {
  const trigger = hoverCardElement.querySelector('[data-slot="hover-card-trigger"], .hover-card-trigger');
  const content = hoverCardElement.querySelector('[data-slot="hover-card-content"], .hover-card-content');
  
  if (!trigger || !content) {
    console.warn('HoverCard: trigger or content not found');
    return;
  }
  
  // Obtener configuración
  const align = hoverCardElement.getAttribute('data-align') || 
                content.getAttribute('data-align') || 
                'center';
  const sideOffset = parseInt(hoverCardElement.getAttribute('data-side-offset') || 
                             content.getAttribute('data-side-offset') || 
                             '4', 10);
  
  let isOpen = false;
  let hoverTimeout = null;
  
  // Función para posicionar el card
  function positionCard() {
    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Si el content está en el body, usar position fixed
    const isInBody = document.body.contains(content) && !hoverCardElement.contains(content);
    
    // Determinar posición inicial (default: bottom)
    let side = 'bottom';
    let top = triggerRect.bottom + sideOffset;
    let left = triggerRect.left;
    
    // Verificar si cabe abajo
    if (top + contentRect.height > viewportHeight - 10) {
      // Intentar arriba
      if (triggerRect.top - contentRect.height - sideOffset > 10) {
        side = 'top';
        top = triggerRect.top - contentRect.height - sideOffset;
      } else {
        // Si no cabe arriba, mantener abajo pero ajustar
        top = viewportHeight - contentRect.height - 10;
      }
    }
    
    // Ajustar horizontal según align
    if (align === 'center') {
      left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
    } else if (align === 'end') {
      left = triggerRect.right - contentRect.width;
    }
    // else start (default) - left ya está configurado
    
    // Ajustar si se sale por la derecha
    if (left + contentRect.width > viewportWidth - 10) {
      left = viewportWidth - contentRect.width - 10;
    }
    
    // Ajustar si se sale por la izquierda
    if (left < 10) {
      left = 10;
    }
    
    // Si está centrado pero se sale, ajustar
    if (align === 'center' && (left < 10 || left + contentRect.width > viewportWidth - 10)) {
      left = Math.max(10, Math.min(left, viewportWidth - contentRect.width - 10));
    }
    
    // Aplicar posición
    if (isInBody) {
      content.style.position = 'fixed';
      content.style.left = `${left}px`;
      content.style.top = `${top}px`;
    } else {
      content.style.position = 'absolute';
      // Calcular posición relativa al trigger
      const hoverCardRect = hoverCardElement.getBoundingClientRect();
      content.style.left = `${left - hoverCardRect.left}px`;
      content.style.top = `${top - hoverCardRect.top}px`;
    }
    
    content.setAttribute('data-side', side);
    content.setAttribute('data-align', align);
  }
  
  // Función para abrir el card
  function openCard() {
    if (isOpen) return;
    
    clearTimeout(hoverTimeout);
    
    // Mover al body si no está ahí (portal)
    const wasInBody = document.body.contains(content);
    if (!wasInBody) {
      document.body.appendChild(content);
      content.setAttribute('data-in-body', 'true');
    }
    
    isOpen = true;
    
    // Pequeño delay para asegurar que el content esté renderizado
    setTimeout(() => {
      positionCard();
      content.setAttribute('data-state', 'open');
      hoverCardElement.setAttribute('data-state', 'open');
    }, 0);
    
    // Dispatch event
    hoverCardElement.dispatchEvent(new CustomEvent('hover-card-open', {
      detail: { open: true },
      bubbles: true
    }));
  }
  
  // Función para cerrar el card
  function closeCard() {
    if (!isOpen) return;
    
    clearTimeout(hoverTimeout);
    
    hoverTimeout = setTimeout(() => {
      isOpen = false;
      content.setAttribute('data-state', 'closed');
      hoverCardElement.setAttribute('data-state', 'closed');
      
      // Mover de vuelta al contenedor después de la animación
      setTimeout(() => {
        if (!isOpen && hoverCardElement) {
          hoverCardElement.appendChild(content);
          content.removeAttribute('data-in-body');
        }
      }, 200);
      
      // Dispatch event
      hoverCardElement.dispatchEvent(new CustomEvent('hover-card-close', {
        detail: { open: false },
        bubbles: true
      }));
    }, 100); // Delay para evitar cierre accidental
  }
  
  // Event listeners
  trigger.addEventListener('mouseenter', () => {
    openCard();
  });
  
  trigger.addEventListener('mouseleave', () => {
    closeCard();
  });
  
  content.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimeout);
    if (!isOpen) {
      openCard();
    }
  });
  
  content.addEventListener('mouseleave', () => {
    closeCard();
  });
  
  // Recalcular posición en resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (isOpen) {
        positionCard();
      }
    }, 100);
  });
  
  // Guardar métodos
  hoverCardElement._hoverCardApi = {
    open: openCard,
    close: closeCard,
    isOpen: () => isOpen
  };
}

/**
 * Inicializa todos los hover cards en la página
 */
export function initHoverCards() {
  const hoverCards = document.querySelectorAll('[data-slot="hover-card"], .hover-card');
  
  hoverCards.forEach((hoverCard) => {
    initHoverCard(hoverCard);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHoverCards);
} else {
  initHoverCards();
}

