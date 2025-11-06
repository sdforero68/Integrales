/**
 * Button Component - Vanilla JS Implementation
 * Adaptación del componente Button de React/Radix UI
 */

/**
 * Inicializa todos los botones en la página
 */
export function initButtons() {
  const buttons = document.querySelectorAll('.button');
  
  buttons.forEach((button) => {
    // Detectar si tiene un ícono SVG y agregar clase
    const hasIcon = button.querySelector('svg');
    if (hasIcon) {
      button.classList.add('button-with-icon');
    }
    
    // Asegurar que tenga type="button" si es un botón sin type
    if (button.tagName === 'BUTTON' && !button.getAttribute('type')) {
      button.setAttribute('type', 'button');
    }
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initButtons);
} else {
  initButtons();
}

