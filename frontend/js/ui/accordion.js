/**
 * Accordion Component - Vanilla JS Implementation
 * Adaptación del componente Accordion de React/Radix UI
 */

/**
 * Inicializa todos los acordeones en la página
 */
export function initAccordions() {
  const accordions = document.querySelectorAll('[data-accordion]');
  
  accordions.forEach((accordion) => {
    initAccordion(accordion);
  });
}

/**
 * Inicializa un acordeón individual
 * @param {HTMLElement} accordionElement - Elemento contenedor del acordeón
 */
export function initAccordion(accordionElement) {
  const items = accordionElement.querySelectorAll('[data-accordion-item]');
  const type = accordionElement.getAttribute('data-accordion-type') || 'single';
  const collapsible = accordionElement.getAttribute('data-accordion-collapsible') === 'true';
  
  items.forEach((item) => {
    const trigger = item.querySelector('[data-accordion-trigger]');
    const content = item.querySelector('[data-accordion-content]');
    
    if (!trigger || !content) return;
    
    // Estado inicial
    const defaultValue = item.getAttribute('data-accordion-value');
    const isOpen = defaultValue === 'open' || item.hasAttribute('data-accordion-open');
    
    setAccordionState(item, trigger, content, isOpen);
    
    // Event listener
    trigger.addEventListener('click', () => {
      const isCurrentlyOpen = trigger.getAttribute('data-state') === 'open';
      
      if (type === 'single') {
        // Cerrar otros items si está abierto
        items.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherTrigger = otherItem.querySelector('[data-accordion-trigger]');
            const otherContent = otherItem.querySelector('[data-accordion-content]');
            if (otherTrigger && otherContent) {
              setAccordionState(otherItem, otherTrigger, otherContent, false);
            }
          }
        });
      }
      
      // Toggle del item actual
      if (isCurrentlyOpen && !collapsible) {
        // No hacer nada si no es collapsible y ya está abierto
        return;
      }
      
      setAccordionState(item, trigger, content, !isCurrentlyOpen);
    });
  });
}

/**
 * Establece el estado de un item del acordeón
 * @param {HTMLElement} item - Item del acordeón
 * @param {HTMLElement} trigger - Botón trigger
 * @param {HTMLElement} content - Contenido del acordeón
 * @param {boolean} isOpen - Si está abierto o cerrado
 */
function setAccordionState(item, trigger, content, isOpen) {
  const state = isOpen ? 'open' : 'closed';
  
  // Actualizar atributos
  trigger.setAttribute('data-state', state);
  content.setAttribute('data-state', state);
  item.setAttribute('data-state', state);
  
  // La animación se maneja automáticamente con CSS usando max-height
}

/**
 * Abre un item específico del acordeón
 * @param {HTMLElement} item - Item del acordeón a abrir
 */
export function openAccordionItem(item) {
  const trigger = item.querySelector('[data-accordion-trigger]');
  const content = item.querySelector('[data-accordion-content]');
  
  if (trigger && content) {
    setAccordionState(item, trigger, content, true);
  }
}

/**
 * Cierra un item específico del acordeón
 * @param {HTMLElement} item - Item del acordeón a cerrar
 */
export function closeAccordionItem(item) {
  const trigger = item.querySelector('[data-accordion-trigger]');
  const content = item.querySelector('[data-accordion-content]');
  
  if (trigger && content) {
    setAccordionState(item, trigger, content, false);
  }
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccordions);
} else {
  initAccordions();
}

