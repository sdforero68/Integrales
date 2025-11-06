/**
 * Input Component - Vanilla JS Implementation
 * Adaptación del componente Input de React
 * 
 * Nota: Este componente es principalmente CSS. La funcionalidad
 * JavaScript es mínima y solo para asegurar accesibilidad.
 */

/**
 * Inicializa todos los inputs en la página
 */
export function initInputs() {
  const inputs = document.querySelectorAll('[data-slot="input"], .input');
  
  inputs.forEach((input) => {
    // Asegurar que tenga los atributos ARIA necesarios si es invalid
    if (input.hasAttribute('aria-invalid') && input.getAttribute('aria-invalid') === 'true') {
      // Ya está configurado
    }
    
    // Para inputs de tipo file, asegurar que el texto sea visible
    if (input.type === 'file') {
      // El estilo CSS ya maneja esto
    }
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInputs);
} else {
  initInputs();
}

