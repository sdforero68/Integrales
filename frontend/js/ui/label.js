/**
 * Label Component - Vanilla JS Implementation
 * Adaptación del componente Label de React/Radix UI
 * 
 * Nota: Este componente es principalmente CSS. El JavaScript
 * detecta estados de disabled en elementos relacionados.
 */

/**
 * Inicializa todos los labels en la página
 */
export function initLabels() {
  const labels = document.querySelectorAll('[data-slot="label"], .label');
  
  labels.forEach((label) => {
    // Si es un elemento <label>, verificar si el elemento relacionado está deshabilitado
    if (label.tagName === 'LABEL') {
      const forId = label.getAttribute('for');
      if (forId) {
        const relatedElement = document.getElementById(forId);
        if (relatedElement && relatedElement.disabled) {
          label.setAttribute('data-peer-disabled', 'true');
        }
        
        // Observar cambios en el estado disabled
        if (relatedElement) {
          const observer = new MutationObserver(() => {
            if (relatedElement.disabled) {
              label.setAttribute('data-peer-disabled', 'true');
            } else {
              label.removeAttribute('data-peer-disabled');
            }
          });
          
          observer.observe(relatedElement, {
            attributes: true,
            attributeFilter: ['disabled']
          });
        }
      }
    }
    
    // Verificar si está dentro de un grupo deshabilitado
    const parentGroup = label.closest('[data-disabled="true"], .disabled, [aria-disabled="true"]');
    if (parentGroup) {
      label.setAttribute('data-group-disabled', 'true');
    }
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLabels);
} else {
  initLabels();
}

