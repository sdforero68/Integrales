/**
 * Dialog Component - Vanilla JS Implementation
 * Adaptación del componente Dialog de React/Radix UI
 */

/**
 * Inicializa un dialog individual
 * @param {HTMLElement} dialogElement - Elemento contenedor del dialog
 */
export function initDialog(dialogElement) {
  const trigger = dialogElement.querySelector('[data-slot="dialog-trigger"], .dialog-trigger');
  const overlay = dialogElement.querySelector('[data-slot="dialog-overlay"], .dialog-overlay');
  const content = dialogElement.querySelector('[data-slot="dialog-content"], .dialog-content');
  const closeButton = content?.querySelector('[data-slot="dialog-close"], .dialog-close');
  
  if (!trigger || !overlay || !content) {
    console.warn('Dialog: trigger, overlay or content not found');
    return;
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
    if (overlayInBody && dialogElement) {
      dialogElement.appendChild(overlay);
      overlayInBody = false;
    }
    if (contentInBody && dialogElement) {
      dialogElement.appendChild(content);
      contentInBody = false;
    }
  }
  
  // Función para abrir el dialog
  function openDialog() {
    isOpen = true;
    moveToBody();
    overlay.setAttribute('data-state', 'open');
    content.setAttribute('data-state', 'open');
    dialogElement.setAttribute('data-state', 'open');
    document.body.style.overflow = 'hidden';
    
    // Focus en el contenido
    content.setAttribute('tabindex', '-1');
    setTimeout(() => {
      content.focus();
    }, 0);
    
    // Dispatch event
    dialogElement.dispatchEvent(new CustomEvent('dialog-open', {
      detail: { open: true },
      bubbles: true
    }));
  }
  
  // Función para cerrar el dialog
  function closeDialog() {
    isOpen = false;
    overlay.setAttribute('data-state', 'closed');
    content.setAttribute('data-state', 'closed');
    dialogElement.setAttribute('data-state', 'closed');
    document.body.style.overflow = '';
    
    // Mover de vuelta después de la animación
    setTimeout(() => {
      if (!isOpen) {
        moveBack();
      }
    }, 200);
    
    // Dispatch event
    dialogElement.dispatchEvent(new CustomEvent('dialog-close', {
      detail: { open: false },
      bubbles: true
    }));
  }
  
  // Función para toggle
  function toggleDialog() {
    if (isOpen) {
      closeDialog();
    } else {
      openDialog();
    }
  }
  
  // Event listeners
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openDialog();
  });
  
  // Cerrar con el botón X
  if (closeButton) {
    closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeDialog();
    });
  }
  
  // Cerrar al hacer clic en el overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeDialog();
    }
  });
  
  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeDialog();
    }
  });
  
  // Trap focus dentro del dialog
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
  dialogElement._dialogApi = {
    open: openDialog,
    close: closeDialog,
    toggle: toggleDialog,
    isOpen: () => isOpen
  };
}

/**
 * Inicializa todos los dialogs en la página
 */
export function initDialogs() {
  const dialogs = document.querySelectorAll('[data-slot="dialog"], .dialog');
  
  dialogs.forEach((dialog) => {
    initDialog(dialog);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDialogs);
} else {
  initDialogs();
}

