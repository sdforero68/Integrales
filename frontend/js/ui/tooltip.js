/**
 * Tooltip Component - Vanilla JS Implementation
 * Adaptación del componente Tooltip de React/Radix UI
 */

/**
 * Calcula la posición del tooltip relativo al trigger
 * @param {HTMLElement} trigger - Elemento trigger
 * @param {HTMLElement} content - Elemento content
 * @param {string} side - Lado preferido (top, bottom, left, right)
 * @param {number} sideOffset - Offset desde el lado
 * @returns {Object} - { top, left, side, align }
 */
function calculatePosition(trigger, content, side = 'top', sideOffset = 0) {
  const triggerRect = trigger.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;
  
  let top = 0;
  let left = 0;
  let finalSide = side;
  let align = 'center';
  
  // Calcular posición según el lado
  switch (side) {
    case 'top':
      top = triggerRect.top - contentRect.height - sideOffset;
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      
      // Si no cabe arriba, mover abajo
      if (top < 0) {
        finalSide = 'bottom';
        top = triggerRect.bottom + sideOffset;
      }
      break;
      
    case 'bottom':
      top = triggerRect.bottom + sideOffset;
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      
      // Si no cabe abajo, mover arriba
      if (top + contentRect.height > viewportHeight) {
        finalSide = 'top';
        top = triggerRect.top - contentRect.height - sideOffset;
      }
      break;
      
    case 'left':
      left = triggerRect.left - contentRect.width - sideOffset;
      top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
      
      // Si no cabe a la izquierda, mover a la derecha
      if (left < 0) {
        finalSide = 'right';
        left = triggerRect.right + sideOffset;
      }
      break;
      
    case 'right':
      left = triggerRect.right + sideOffset;
      top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
      
      // Si no cabe a la derecha, mover a la izquierda
      if (left + contentRect.width > viewportWidth) {
        finalSide = 'left';
        left = triggerRect.left - contentRect.width - sideOffset;
      }
      break;
  }
  
  // Ajustar para que no se salga del viewport
  if (left < 0) {
    left = 8;
    align = 'start';
  } else if (left + contentRect.width > viewportWidth) {
    left = viewportWidth - contentRect.width - 8;
    align = 'end';
  }
  
  if (top < 0) {
    top = 8;
  } else if (top + contentRect.height > viewportHeight) {
    top = viewportHeight - contentRect.height - 8;
  }
  
  return {
    top: top + scrollY,
    left: left + scrollX,
    side: finalSide,
    align
  };
}

/**
 * Inicializa un tooltip individual
 * @param {HTMLElement} tooltipElement - Elemento contenedor del tooltip
 */
export function initTooltip(tooltipElement) {
  const trigger = tooltipElement.querySelector('[data-slot="tooltip-trigger"], .tooltip-trigger');
  const content = tooltipElement.querySelector('[data-slot="tooltip-content"], .tooltip-content');
  
  if (!trigger || !content) {
    console.warn('Tooltip: trigger or content not found');
    return;
  }
  
  // Obtener configuración
  const provider = tooltipElement.querySelector('[data-slot="tooltip-provider"], .tooltip-provider') || tooltipElement;
  const delayDuration = parseInt(provider.getAttribute('data-delay-duration') || '0', 10);
  const side = content.getAttribute('data-side') || 'top';
  const sideOffset = parseInt(content.getAttribute('data-side-offset') || '0', 10);
  
  // Aplicar clases si no existen
  if (!tooltipElement.classList.contains('tooltip')) {
    tooltipElement.classList.add('tooltip');
  }
  if (!trigger.classList.contains('tooltip-trigger')) {
    trigger.classList.add('tooltip-trigger');
  }
  if (!content.classList.contains('tooltip-content')) {
    content.classList.add('tooltip-content');
  }
  
  // Estado
  let isOpen = false;
  let hoverTimeout = null;
  let hideTimeout = null;
  
  // Crear arrow si no existe
  let arrow = content.querySelector('.tooltip-arrow');
  if (!arrow) {
    arrow = document.createElement('div');
    arrow.className = 'tooltip-arrow';
    content.appendChild(arrow);
  }
  
  // Mover content al body (portal)
  const originalParent = content.parentElement;
  let inBody = false;
  
  function moveToBody() {
    if (!inBody) {
      document.body.appendChild(content);
      content.setAttribute('data-in-body', 'true');
      inBody = true;
    }
  }
  
  function moveBack() {
    if (inBody && originalParent) {
      originalParent.appendChild(content);
      content.removeAttribute('data-in-body');
      inBody = false;
    }
  }
  
  // Función para posicionar
  function positionTooltip() {
    moveToBody();
    
    // Forzar cálculo de dimensiones
    content.style.visibility = 'hidden';
    content.style.display = 'block';
    
    const position = calculatePosition(trigger, content, side, sideOffset);
    
    content.style.top = `${position.top}px`;
    content.style.left = `${position.left}px`;
    content.setAttribute('data-side', position.side);
    content.setAttribute('data-align', position.align);
    
    content.style.visibility = 'visible';
  }
  
  // Función para abrir
  function openTooltip() {
    if (isOpen) return;
    
    clearTimeout(hideTimeout);
    
    isOpen = true;
    content.setAttribute('data-state', 'open');
    positionTooltip();
    setupListeners();
    
    // Dispatch event
    tooltipElement.dispatchEvent(new CustomEvent('tooltip-open', {
      bubbles: true
    }));
  }
  
  // Función para cerrar
  function closeTooltip() {
    if (!isOpen) return;
    
    clearTimeout(hoverTimeout);
    
    isOpen = false;
    content.setAttribute('data-state', 'closed');
    cleanupListeners();
    
    // Ocultar después de la animación
    setTimeout(() => {
      if (!isOpen) {
        content.style.display = 'none';
        moveBack();
        
        // Dispatch event
        tooltipElement.dispatchEvent(new CustomEvent('tooltip-close', {
          bubbles: true
        }));
      }
    }, 150);
  }
  
  // Reposicionar en scroll y resize
  let resizeObserver = null;
  let scrollHandler = null;
  
  function setupListeners() {
    if (isOpen && !scrollHandler) {
      scrollHandler = () => {
        if (isOpen) {
          positionTooltip();
        }
      };
      
      window.addEventListener('scroll', scrollHandler, true);
      window.addEventListener('resize', scrollHandler);
      
      // Observer para cambios en el trigger
      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          if (isOpen) {
            positionTooltip();
          }
        });
        resizeObserver.observe(trigger);
      }
    }
  }
  
  function cleanupListeners() {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler, true);
      window.removeEventListener('resize', scrollHandler);
      scrollHandler = null;
    }
    
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  }
  
  // Event listeners en trigger
  trigger.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
    
    if (delayDuration > 0) {
      hoverTimeout = setTimeout(() => {
        openTooltip();
      }, delayDuration);
    } else {
      openTooltip();
    }
  });
  
  trigger.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimeout);
    closeTooltip();
  });
  
  trigger.addEventListener('focus', () => {
    openTooltip();
  });
  
  trigger.addEventListener('blur', () => {
    closeTooltip();
  });
  
  // Event listeners en content (para hover en tooltip)
  content.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
  });
  
  content.addEventListener('mouseleave', () => {
    closeTooltip();
  });
  
  // Inicializar estado
  content.style.display = 'none';
  content.setAttribute('data-state', 'closed');
  
  // Guardar API
  tooltipElement._tooltipApi = {
    open: openTooltip,
    close: closeTooltip,
    toggle: () => isOpen ? closeTooltip() : openTooltip(),
    isOpen: () => isOpen
  };
}

/**
 * Inicializa todos los tooltips en la página
 */
export function initTooltips() {
  const tooltips = document.querySelectorAll('[data-slot="tooltip"], .tooltip');
  
  tooltips.forEach((tooltip) => {
    initTooltip(tooltip);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTooltips);
} else {
  initTooltips();
}

