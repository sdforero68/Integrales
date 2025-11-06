/**
 * Collapsible Component - Vanilla JS Implementation
 * Adaptación del componente Collapsible de React/Radix UI
 */

/**
 * Inicializa un collapsible individual
 * @param {HTMLElement} collapsibleElement - Elemento contenedor del collapsible
 */
export function initCollapsible(collapsibleElement) {
  const trigger = collapsibleElement.querySelector('[data-slot="collapsible-trigger"], .collapsible-trigger');
  const content = collapsibleElement.querySelector('[data-slot="collapsible-content"], .collapsible-content');
  
  if (!trigger || !content) {
    console.warn('Collapsible: trigger or content not found');
    return;
  }
  
  // Estado inicial
  const defaultOpen = collapsibleElement.hasAttribute('data-open') ||
                      collapsibleElement.hasAttribute('open') ||
                      collapsibleElement.getAttribute('data-state') === 'open';
  
  let isOpen = defaultOpen;
  
  // Función para actualizar el estado
  function setState(open) {
    isOpen = open;
    
    if (open) {
      content.setAttribute('data-state', 'open');
      collapsibleElement.setAttribute('data-state', 'open');
      collapsibleElement.setAttribute('aria-expanded', 'true');
    } else {
      content.setAttribute('data-state', 'closed');
      collapsibleElement.setAttribute('data-state', 'closed');
      collapsibleElement.setAttribute('aria-expanded', 'false');
    }
    
    // Dispatch event
    collapsibleElement.dispatchEvent(new CustomEvent('collapsible-change', {
      detail: { open },
      bubbles: true
    }));
  }
  
  // Función para toggle
  function toggle() {
    setState(!isOpen);
  }
  
  // Función para abrir
  function open() {
    setState(true);
  }
  
  // Función para cerrar
  function close() {
    setState(false);
  }
  
  // Event listeners
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    toggle();
  });
  
  trigger.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  });
  
  // Asegurar atributos ARIA
  trigger.setAttribute('aria-expanded', isOpen.toString());
  trigger.setAttribute('aria-controls', content.id || `collapsible-content-${Date.now()}`);
  collapsibleElement.setAttribute('role', 'region');
  
  if (!content.id) {
    content.id = `collapsible-content-${Date.now()}`;
  }
  
  // Inicializar estado
  setState(isOpen);
  
  // Guardar métodos en el elemento
  collapsibleElement._collapsibleApi = {
    toggle,
    open,
    close,
    isOpen: () => isOpen
  };
}

/**
 * Inicializa todos los collapsibles en la página
 */
export function initCollapsibles() {
  const collapsibles = document.querySelectorAll('[data-slot="collapsible"], .collapsible');
  
  collapsibles.forEach((collapsible) => {
    initCollapsible(collapsible);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCollapsibles);
} else {
  initCollapsibles();
}

