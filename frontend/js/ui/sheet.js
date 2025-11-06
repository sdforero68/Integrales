/**
 * Sheet Component - Vanilla JS Implementation
 * Adaptación del componente Sheet de React/Radix UI
 */

/**
 * Inicializa un sheet individual
 * @param {HTMLElement} sheetElement - Elemento contenedor del sheet
 */
export function initSheet(sheetElement) {
  const trigger = sheetElement.querySelector('[data-slot="sheet-trigger"], .sheet-trigger');
  const content = sheetElement.querySelector('[data-slot="sheet-content"], .sheet-content');
  const overlay = sheetElement.querySelector('[data-slot="sheet-overlay"], .sheet-overlay');
  const closeButtons = sheetElement.querySelectorAll('[data-slot="sheet-close"], .sheet-close');
  
  if (!content) {
    console.warn('Sheet: Content not found');
    return;
  }
  
  let isOpen = false;
  let originalParent = content.parentElement;
  let isInBody = false;
  
  // Obtener side
  const side = content.getAttribute('data-side') || 
               content.getAttribute('side') || 
               'right';
  content.setAttribute('data-side', side);
  
  // Crear overlay si no existe
  let overlayElement = overlay;
  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.setAttribute('data-slot', 'sheet-overlay');
    overlayElement.className = 'sheet-overlay';
    overlayElement.setAttribute('data-state', 'closed');
  }
  
  // Función para obtener elementos focusables dentro del content
  function getFocusableElements() {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    return Array.from(content.querySelectorAll(focusableSelectors));
  }
  
  // Función para bloquear scroll del body
  function lockBodyScroll() {
    document.body.style.overflow = 'hidden';
  }
  
  function unlockBodyScroll() {
    document.body.style.overflow = '';
  }
  
  // Función para abrir el sheet
  function open() {
    if (isOpen) return;
    
    isOpen = true;
    content.setAttribute('data-state', 'open');
    overlayElement.setAttribute('data-state', 'open');
    
    // Mover content y overlay a body
    if (!isInBody) {
      originalParent = content.parentElement;
      document.body.appendChild(overlayElement);
      document.body.appendChild(content);
      content.style.position = 'fixed';
      overlayElement.style.position = 'fixed';
      isInBody = true;
    }
    
    lockBodyScroll();
    
    // Focus en el primer elemento focusable o en el content
    setTimeout(() => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        content.setAttribute('tabindex', '-1');
        content.focus();
      }
    }, 100);
    
    // Dispatch event
    sheetElement.dispatchEvent(new CustomEvent('sheet-open', {
      detail: { trigger, content, side },
      bubbles: true
    }));
  }
  
  // Función para cerrar el sheet
  function close() {
    if (!isOpen) return;
    
    isOpen = false;
    content.setAttribute('data-state', 'closed');
    overlayElement.setAttribute('data-state', 'closed');
    
    unlockBodyScroll();
    
    // Mover content y overlay de vuelta después de la animación
    setTimeout(() => {
      if (isInBody && originalParent) {
        originalParent.appendChild(overlayElement);
        originalParent.appendChild(content);
        content.style.position = '';
        content.style.top = '';
        content.style.left = '';
        content.style.right = '';
        content.style.bottom = '';
        overlayElement.style.position = '';
        isInBody = false;
      }
    }, 300);
    
    // Focus de vuelta al trigger
    if (trigger) {
      trigger.focus();
    }
    
    // Dispatch event
    sheetElement.dispatchEvent(new CustomEvent('sheet-close', {
      detail: { trigger, content, side },
      bubbles: true
    }));
  }
  
  // Event listeners del trigger
  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (trigger.getAttribute('disabled') !== 'true') {
        open();
      }
    });
    
    trigger.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isOpen) {
        e.preventDefault();
        open();
      }
    });
  }
  
  // Event listeners del overlay
  overlayElement.addEventListener('click', (e) => {
    if (e.target === overlayElement) {
      close();
    }
  });
  
  // Event listeners de los botones de cierre
  closeButtons.forEach(closeButton => {
    closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      close();
    });
  });
  
  // Crear botón de cierre si no existe
  if (closeButtons.length === 0) {
    const closeButton = document.createElement('button');
    closeButton.setAttribute('data-slot', 'sheet-close');
    closeButton.className = 'sheet-close';
    closeButton.setAttribute('aria-label', 'Cerrar');
    closeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span class="sr-only">Cerrar</span>
    `;
    closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      close();
    });
    content.appendChild(closeButton);
  }
  
  // Focus trap
  function handleKeyDown(e) {
    if (!isOpen) return;
    
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    
    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }
  
  content.addEventListener('keydown', handleKeyDown);
  
  // Cerrar al hacer click fuera (solo en overlay)
  // Ya está manejado arriba
  
  // Inicializar estado
  const defaultOpen = sheetElement.getAttribute('data-open') === 'true' || 
                     sheetElement.hasAttribute('open');
  if (defaultOpen) {
    open();
  } else {
    content.setAttribute('data-state', 'closed');
    overlayElement.setAttribute('data-state', 'closed');
  }
  
  // Guardar métodos
  sheetElement._sheetApi = {
    open,
    close,
    toggle: () => isOpen ? close() : open(),
    isOpen: () => isOpen
  };
}

/**
 * Inicializa todos los sheets en la página
 */
export function initSheets() {
  const sheets = document.querySelectorAll('[data-slot="sheet"], .sheet');
  
  sheets.forEach((sheet) => {
    initSheet(sheet);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSheets);
} else {
  initSheets();
}

