/**
 * Toggle Component - Vanilla JS Implementation
 * Adaptación del componente Toggle de React/Radix UI
 */

/**
 * Inicializa un toggle individual
 * @param {HTMLElement} toggleElement - Elemento toggle
 */
export function initToggle(toggleElement) {
  let isPressed = toggleElement.hasAttribute('pressed') || 
                  toggleElement.getAttribute('data-pressed') === 'true' ||
                  toggleElement.getAttribute('data-state') === 'on';
  
  // Obtener variantes
  const variant = toggleElement.getAttribute('data-variant') || 'default';
  const size = toggleElement.getAttribute('data-size') || 'default';
  
  toggleElement.setAttribute('data-variant', variant);
  toggleElement.setAttribute('data-size', size);
  
  // Aplicar clase si no existe
  if (!toggleElement.classList.contains('toggle')) {
    toggleElement.classList.add('toggle');
  }
  
  // Función para actualizar estado
  function updateState() {
    if (isPressed) {
      toggleElement.setAttribute('data-state', 'on');
      toggleElement.setAttribute('data-pressed', 'true');
      toggleElement.setAttribute('aria-pressed', 'true');
    } else {
      toggleElement.setAttribute('data-state', 'off');
      toggleElement.setAttribute('data-pressed', 'false');
      toggleElement.setAttribute('aria-pressed', 'false');
    }
    
    // Dispatch event
    toggleElement.dispatchEvent(new CustomEvent('toggle-change', {
      detail: { pressed: isPressed },
      bubbles: true
    }));
  }
  
  // Función para toggle
  function toggle() {
    if (toggleElement.getAttribute('disabled') === 'true' || 
        toggleElement.hasAttribute('disabled')) {
      return;
    }
    
    isPressed = !isPressed;
    updateState();
  }
  
  // Event listeners
  toggleElement.addEventListener('click', (e) => {
    e.preventDefault();
    toggle();
  });
  
  toggleElement.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  });
  
  // Asegurar atributos ARIA
  toggleElement.setAttribute('role', 'button');
  toggleElement.setAttribute('tabindex', 
    (toggleElement.getAttribute('disabled') === 'true' || toggleElement.hasAttribute('disabled')) 
      ? '-1' : '0');
  
  // Inicializar estado
  updateState();
  
  // Guardar métodos
  toggleElement._toggleApi = {
    toggle,
    setPressed: (pressed) => {
      isPressed = pressed;
      updateState();
    },
    getPressed: () => isPressed
  };
}

/**
 * Inicializa todos los toggles en la página
 */
export function initToggles() {
  const toggles = document.querySelectorAll('[data-slot="toggle"], .toggle');
  
  toggles.forEach((toggle) => {
    initToggle(toggle);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initToggles);
} else {
  initToggles();
}

