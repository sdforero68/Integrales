/**
 * Switch Component - Vanilla JS Implementation
 * Adaptación del componente Switch de React/Radix UI
 */

/**
 * Inicializa un switch individual
 * @param {HTMLElement} switchElement - Elemento contenedor del switch
 */
export function initSwitch(switchElement) {
  let thumb = switchElement.querySelector('[data-slot="switch-thumb"], .switch-thumb');
  
  // Crear thumb si no existe
  if (!thumb) {
    thumb = document.createElement('div');
    thumb.setAttribute('data-slot', 'switch-thumb');
    thumb.className = 'switch-thumb';
    switchElement.appendChild(thumb);
  }
  
  // Obtener estado inicial
  let isChecked = switchElement.hasAttribute('checked') || 
                  switchElement.getAttribute('data-checked') === 'true' ||
                  switchElement.getAttribute('data-state') === 'checked';
  
  // Verificar si hay un input asociado
  const input = switchElement.querySelector('input[type="checkbox"]');
  if (input) {
    isChecked = input.checked;
    input.addEventListener('change', () => {
      isChecked = input.checked;
      updateState();
    });
  }
  
  // Función para actualizar el estado visual
  function updateState() {
    if (isChecked) {
      switchElement.setAttribute('data-state', 'checked');
      switchElement.setAttribute('data-checked', 'true');
      switchElement.setAttribute('aria-checked', 'true');
      switchElement.removeAttribute('data-unchecked');
      if (input) {
        input.checked = true;
      }
    } else {
      switchElement.setAttribute('data-state', 'unchecked');
      switchElement.setAttribute('data-checked', 'false');
      switchElement.setAttribute('aria-checked', 'false');
      switchElement.setAttribute('data-unchecked', 'true');
      if (input) {
        input.checked = false;
      }
    }
    
    // Dispatch event
    switchElement.dispatchEvent(new CustomEvent('switch-change', {
      detail: { checked: isChecked },
      bubbles: true
    }));
  }
  
  // Función para toggle
  function toggle() {
    if (switchElement.getAttribute('disabled') === 'true' || 
        switchElement.hasAttribute('disabled')) {
      return;
    }
    
    isChecked = !isChecked;
    updateState();
  }
  
  // Event listeners
  switchElement.addEventListener('click', (e) => {
    e.preventDefault();
    toggle();
  });
  
  switchElement.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  });
  
  // Asegurar atributos ARIA
  switchElement.setAttribute('role', 'switch');
  switchElement.setAttribute('tabindex', 
    (switchElement.getAttribute('disabled') === 'true' || switchElement.hasAttribute('disabled')) 
      ? '-1' : '0');
  
  // Aplicar clase si no existe
  if (!switchElement.classList.contains('switch')) {
    switchElement.classList.add('switch');
  }
  
  // Inicializar estado
  updateState();
  
  // Guardar métodos
  switchElement._switchApi = {
    toggle,
    setChecked: (checked) => {
      isChecked = checked;
      updateState();
    },
    getChecked: () => isChecked
  };
}

/**
 * Inicializa todos los switches en la página
 */
export function initSwitches() {
  const switches = document.querySelectorAll('[data-slot="switch"], .switch');
  
  switches.forEach((switchElement) => {
    initSwitch(switchElement);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSwitches);
} else {
  initSwitches();
}

