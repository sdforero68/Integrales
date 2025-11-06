/**
 * Checkbox Component - Vanilla JS Implementation
 * Adaptación del componente Checkbox de React/Radix UI
 */

/**
 * Inicializa un checkbox individual
 * @param {HTMLElement} checkboxElement - Elemento checkbox
 */
export function initCheckbox(checkboxElement) {
  // Si es un input nativo, no necesita inicialización adicional
  if (checkboxElement.tagName === 'INPUT' && checkboxElement.type === 'checkbox') {
    return;
  }
  
  // Para elementos personalizados (button, div, etc.)
  let isChecked = checkboxElement.getAttribute('data-state') === 'checked' ||
                  checkboxElement.hasAttribute('checked') ||
                  checkboxElement.getAttribute('aria-checked') === 'true';
  
  // Función para actualizar el estado
  function updateState(checked) {
    isChecked = checked;
    
    if (checked) {
      checkboxElement.setAttribute('data-state', 'checked');
      checkboxElement.setAttribute('aria-checked', 'true');
      checkboxElement.setAttribute('checked', '');
    } else {
      checkboxElement.setAttribute('data-state', 'unchecked');
      checkboxElement.setAttribute('aria-checked', 'false');
      checkboxElement.removeAttribute('checked');
    }
    
    // Dispatch event
    checkboxElement.dispatchEvent(new CustomEvent('checkbox-change', {
      detail: { checked },
      bubbles: true
    }));
  }
  
  // Función para toggle
  function toggle() {
    if (checkboxElement.hasAttribute('disabled')) {
      return;
    }
    updateState(!isChecked);
  }
  
  // Event listeners
  checkboxElement.addEventListener('click', (e) => {
    e.preventDefault();
    toggle();
  });
  
  checkboxElement.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  });
  
  // Asegurar atributos ARIA
  checkboxElement.setAttribute('role', 'checkbox');
  checkboxElement.setAttribute('tabindex', checkboxElement.hasAttribute('disabled') ? '-1' : '0');
  
  if (!checkboxElement.hasAttribute('aria-checked')) {
    checkboxElement.setAttribute('aria-checked', isChecked.toString());
  }
  
  // Inicializar estado
  updateState(isChecked);
  
  // Guardar métodos en el elemento
  checkboxElement._checkboxApi = {
    toggle,
    setChecked: (checked) => updateState(checked),
    isChecked: () => isChecked
  };
}

/**
 * Inicializa todos los checkboxes en la página
 */
export function initCheckboxes() {
  // Checkboxes personalizados (con data-slot="checkbox")
  const customCheckboxes = document.querySelectorAll('[data-slot="checkbox"]:not(input[type="checkbox"])');
  customCheckboxes.forEach((checkbox) => {
    initCheckbox(checkbox);
  });
  
  // Checkboxes con clase checkbox que no sean inputs nativos
  const checkboxElements = document.querySelectorAll('.checkbox:not(input[type="checkbox"])');
  checkboxElements.forEach((checkbox) => {
    if (!checkbox.hasAttribute('data-checkbox-initialized')) {
      checkbox.setAttribute('data-checkbox-initialized', 'true');
      initCheckbox(checkbox);
    }
  });
  
  // Asegurar que los inputs nativos con clase checkbox tengan indicadores
  const nativeCheckboxes = document.querySelectorAll('input[type="checkbox"].checkbox');
  nativeCheckboxes.forEach((checkbox) => {
    // Crear indicador si no existe
    if (!checkbox.nextElementSibling?.classList.contains('checkbox-indicator')) {
      const indicator = document.createElement('span');
      indicator.className = 'checkbox-indicator';
      indicator.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      `;
      checkbox.parentElement?.insertBefore(indicator, checkbox.nextSibling);
    }
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCheckboxes);
} else {
  initCheckboxes();
}

