/**
 * AlertDialog Component - Vanilla JS Implementation
 * Adaptación del componente AlertDialog de React/Radix UI
 */

/**
 * Inicializa todos los alert dialogs en la página
 */
export function initAlertDialogs() {
  const dialogs = document.querySelectorAll('[data-alert-dialog]');
  
  dialogs.forEach((dialog) => {
    initAlertDialog(dialog);
  });
  
  // Inicializar triggers
  const triggers = document.querySelectorAll('[data-alert-dialog-trigger]');
  triggers.forEach((trigger) => {
    initTrigger(trigger);
  });
}

/**
 * Inicializa un alert dialog individual
 * @param {HTMLElement} dialogElement - Elemento contenedor del diálogo
 */
export function initAlertDialog(dialogElement) {
  const overlay = dialogElement.querySelector('[data-alert-dialog-overlay]');
  const content = dialogElement.querySelector('[data-alert-dialog-content]');
  const cancelButtons = dialogElement.querySelectorAll('[data-alert-dialog-cancel]');
  const actionButtons = dialogElement.querySelectorAll('[data-alert-dialog-action]');
  
  if (!overlay || !content) return;
  
  // Estado inicial
  const isOpen = dialogElement.hasAttribute('data-alert-dialog-open');
  setDialogState(dialogElement, overlay, content, isOpen);
  
  // Click en overlay para cerrar (opcional)
  const closeOnOverlayClick = dialogElement.getAttribute('data-alert-dialog-close-on-overlay') !== 'false';
  if (closeOnOverlayClick) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAlertDialog(dialogElement);
      }
    });
  }
  
  // ESC key para cerrar
  const handleEscape = (e) => {
    if (e.key === 'Escape' && !dialogElement.hidden) {
      closeAlertDialog(dialogElement);
    }
  };
  document.addEventListener('keydown', handleEscape);
  
  // Guardar referencia para cleanup
  dialogElement._escapeHandler = handleEscape;
  
  // Cancel buttons
  cancelButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      closeAlertDialog(dialogElement);
    });
  });
  
  // Action buttons - pueden tener su propio handler
  actionButtons.forEach((btn) => {
    if (!btn.hasAttribute('data-alert-dialog-no-close')) {
      btn.addEventListener('click', () => {
        closeAlertDialog(dialogElement);
      });
    }
  });
}

/**
 * Inicializa un trigger button
 * @param {HTMLElement} triggerElement - Elemento trigger
 */
function initTrigger(triggerElement) {
  const dialogId = triggerElement.getAttribute('data-alert-dialog-trigger');
  if (!dialogId) return;
  
  triggerElement.addEventListener('click', () => {
    const dialog = document.querySelector(`[data-alert-dialog="${dialogId}"]`);
    if (dialog) {
      openAlertDialog(dialog);
    }
  });
}

/**
 * Abre un alert dialog
 * @param {HTMLElement} dialogElement - Elemento del diálogo
 */
export function openAlertDialog(dialogElement) {
  const overlay = dialogElement.querySelector('[data-alert-dialog-overlay]');
  const content = dialogElement.querySelector('[data-alert-dialog-content]');
  
  if (!overlay || !content) return;
  
  dialogElement.hidden = false;
  setDialogState(dialogElement, overlay, content, true);
  
  // Trap focus
  trapFocus(dialogElement);
  
  // Prevenir scroll del body
  document.body.style.overflow = 'hidden';
}

/**
 * Cierra un alert dialog
 * @param {HTMLElement} dialogElement - Elemento del diálogo
 */
export function closeAlertDialog(dialogElement) {
  const overlay = dialogElement.querySelector('[data-alert-dialog-overlay]');
  const content = dialogElement.querySelector('[data-alert-dialog-content]');
  
  if (!overlay || !content) return;
  
  setDialogState(dialogElement, overlay, content, false);
  
  // Ocultar después de la animación
  setTimeout(() => {
    dialogElement.hidden = true;
    document.body.style.overflow = '';
    releaseFocus(dialogElement);
  }, 200);
}

/**
 * Establece el estado del diálogo
 * @param {HTMLElement} dialogElement - Elemento del diálogo
 * @param {HTMLElement} overlay - Overlay
 * @param {HTMLElement} content - Contenido
 * @param {boolean} isOpen - Si está abierto
 */
function setDialogState(dialogElement, overlay, content, isOpen) {
  const state = isOpen ? 'open' : 'closed';
  
  overlay.setAttribute('data-state', state);
  content.setAttribute('data-state', state);
  dialogElement.setAttribute('data-state', state);
}

/**
 * Atrapa el focus dentro del diálogo
 * @param {HTMLElement} dialogElement - Elemento del diálogo
 */
function trapFocus(dialogElement) {
  const focusableElements = dialogElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleTab = (e) => {
    if (e.key !== 'Tab') return;
    
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
  };
  
  dialogElement.addEventListener('keydown', handleTab);
  dialogElement._tabHandler = handleTab;
  
  // Focus en el primer elemento
  setTimeout(() => {
    firstElement.focus();
  }, 100);
}

/**
 * Libera el focus trap
 * @param {HTMLElement} dialogElement - Elemento del diálogo
 */
function releaseFocus(dialogElement) {
  if (dialogElement._tabHandler) {
    dialogElement.removeEventListener('keydown', dialogElement._tabHandler);
    delete dialogElement._tabHandler;
  }
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAlertDialogs);
} else {
  initAlertDialogs();
}

