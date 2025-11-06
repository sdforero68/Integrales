/**
 * Separator Component - Vanilla JS Implementation
 * Adaptación del componente Separator de React/Radix UI
 */

/**
 * Inicializa un separator individual
 * @param {HTMLElement} separatorElement - Elemento separator
 */
export function initSeparator(separatorElement) {
  // Obtener orientación
  const orientation = separatorElement.getAttribute('data-orientation') || 
                     separatorElement.getAttribute('orientation') || 
                     'horizontal';
  
  // Obtener si es decorativo
  const decorative = separatorElement.getAttribute('data-decorative') !== 'false' && 
                     separatorElement.getAttribute('decorative') !== 'false';
  
  // Aplicar atributos
  separatorElement.setAttribute('data-orientation', orientation);
  separatorElement.setAttribute('role', decorative ? 'none' : 'separator');
  
  // Aplicar clase si no existe
  if (!separatorElement.classList.contains('separator-root')) {
    separatorElement.classList.add('separator-root');
  }
}

/**
 * Inicializa todos los separators en la página
 */
export function initSeparators() {
  const separators = document.querySelectorAll('[data-slot="separator-root"], .separator-root');
  
  separators.forEach((separator) => {
    initSeparator(separator);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSeparators);
} else {
  initSeparators();
}

