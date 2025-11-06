/**
 * Popover Component - Vanilla JS Implementation
 * Adaptación del componente Popover de React/Radix UI
 */

/**
 * Inicializa un popover individual
 * @param {HTMLElement} popoverElement - Elemento contenedor del popover
 */
export function initPopover(popoverElement) {
  const trigger = popoverElement.querySelector('[data-slot="popover-trigger"], .popover-trigger');
  const content = popoverElement.querySelector('[data-slot="popover-content"], .popover-content');
  const anchor = popoverElement.querySelector('[data-slot="popover-anchor"], .popover-anchor');
  
  if (!trigger || !content) {
    console.warn('Popover: trigger or content not found');
    return;
  }
  
  // Obtener configuración
  const align = popoverElement.getAttribute('data-align') || 
                content.getAttribute('data-align') || 
                'center';
  const sideOffset = parseInt(popoverElement.getAttribute('data-side-offset') || 
                             content.getAttribute('data-side-offset') || 
                             '4', 10);
  
  let isOpen = false;
  let contentInBody = false;
  
  // Función para mover content al body (portal)
  function moveToBody() {
    if (!contentInBody) {
      document.body.appendChild(content);
      contentInBody = true;
    }
  }
  
  // Función para mover de vuelta al contenedor original
  function moveBack() {
    if (contentInBody && popoverElement) {
      popoverElement.appendChild(content);
      contentInBody = false;
    }
  }
  
  // Función para posicionar el popover
  function positionPopover() {
    const referenceElement = anchor || trigger;
    const referenceRect = referenceElement.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Determinar posición inicial (default: bottom)
    let side = 'bottom';
    let top = referenceRect.bottom + sideOffset;
    let left = referenceRect.left;
    
    // Verificar si cabe abajo
    if (top + contentRect.height > viewportHeight - 10) {
      // Intentar arriba
      if (referenceRect.top - contentRect.height - sideOffset > 10) {
        side = 'top';
        top = referenceRect.top - contentRect.height - sideOffset;
      } else {
        // Si no cabe arriba, mantener abajo pero ajustar
        top = viewportHeight - contentRect.height - 10;
      }
    }
    
    // Ajustar horizontal según align
    if (align === 'center') {
      left = referenceRect.left + (referenceRect.width / 2) - (contentRect.width / 2);
    } else if (align === 'end') {
      left = referenceRect.right - contentRect.width;
    } else {
      // start (default)
      left = referenceRect.left;
    }
    
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
    
    content.style.left = `${left}px`;
    content.style.top = `${top}px`;
    content.setAttribute('data-side', side);
    content.setAttribute('data-align', align);
  }
  
  // Función para abrir el popover
  function openPopover() {
    if (isOpen) return;
    
    isOpen = true;
    moveToBody();
    
    // Pequeño delay para asegurar que el content esté renderizado
    setTimeout(() => {
      positionPopover();
      content.setAttribute('data-state', 'open');
      popoverElement.setAttribute('data-state', 'open');
      
      // Focus en el contenido
      content.setAttribute('tabindex', '-1');
      content.focus();
    }, 0);
    
    // Dispatch event
    popoverElement.dispatchEvent(new CustomEvent('popover-open', {
      detail: { open: true },
      bubbles: true
    }));
  }
  
  // Función para cerrar el popover
  function closePopover() {
    if (!isOpen) return;
    
    isOpen = false;
    content.setAttribute('data-state', 'closed');
    popoverElement.setAttribute('data-state', 'closed');
    
    // Mover de vuelta después de la animación
    setTimeout(() => {
      if (!isOpen) {
        moveBack();
      }
    }, 200);
    
    // Dispatch event
    popoverElement.dispatchEvent(new CustomEvent('popover-close', {
      detail: { open: false },
      bubbles: true
    }));
  }
  
  // Función para toggle
  function togglePopover() {
    if (isOpen) {
      closePopover();
    } else {
      openPopover();
    }
  }
  
  // Event listeners
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    togglePopover();
  });
  
  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (isOpen && !content.contains(e.target) && !trigger.contains(e.target)) {
      closePopover();
    }
  });
  
  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closePopover();
    }
  });
  
  // Recalcular posición en resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (isOpen) {
        positionPopover();
      }
    }, 100);
  });
  
  // Guardar métodos
  popoverElement._popoverApi = {
    open: openPopover,
    close: closePopover,
    toggle: togglePopover,
    isOpen: () => isOpen
  };
}

/**
 * Inicializa todos los popovers en la página
 */
export function initPopovers() {
  const popovers = document.querySelectorAll('[data-slot="popover"], .popover');
  
  popovers.forEach((popover) => {
    initPopover(popover);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPopovers);
} else {
  initPopovers();
}

