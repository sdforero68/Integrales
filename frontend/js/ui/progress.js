/**
 * Progress Component - Vanilla JS Implementation
 * Adaptación del componente Progress de React/Radix UI
 */

/**
 * Inicializa un progress individual
 * @param {HTMLElement} progressElement - Elemento contenedor del progress
 */
export function initProgress(progressElement) {
  const indicator = progressElement.querySelector('[data-slot="progress-indicator"], .progress-indicator');
  
  if (!indicator) {
    console.warn('Progress: indicator not found');
    return;
  }
  
  // Obtener valor inicial
  let value = parseFloat(progressElement.getAttribute('data-value') || 
                        progressElement.getAttribute('value') || 
                        '0', 10);
  
  // Asegurar que el valor esté entre 0 y 100
  value = Math.max(0, Math.min(100, value));
  
  // Función para actualizar el valor
  function setValue(newValue) {
    value = Math.max(0, Math.min(100, parseFloat(newValue) || 0));
    progressElement.setAttribute('data-value', value.toString());
    progressElement.setAttribute('value', value.toString());
    indicator.style.transform = `translateX(-${100 - value}%)`;
    
    // Actualizar aria-valuenow
    progressElement.setAttribute('aria-valuenow', value.toString());
    
    // Dispatch event
    progressElement.dispatchEvent(new CustomEvent('progress-change', {
      detail: { value },
      bubbles: true
    }));
  }
  
  // Inicializar
  setValue(value);
  
  // Observar cambios en el atributo value
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
        const newValue = parseFloat(progressElement.getAttribute('value') || '0');
        if (newValue !== value) {
          setValue(newValue);
        }
      }
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-value') {
        const newValue = parseFloat(progressElement.getAttribute('data-value') || '0');
        if (newValue !== value) {
          setValue(newValue);
        }
      }
    });
  });
  
  observer.observe(progressElement, {
    attributes: true,
    attributeFilter: ['value', 'data-value']
  });
  
  // Asegurar atributos ARIA
  progressElement.setAttribute('role', 'progressbar');
  progressElement.setAttribute('aria-valuemin', '0');
  progressElement.setAttribute('aria-valuemax', '100');
  progressElement.setAttribute('aria-valuenow', value.toString());
  
  // Guardar métodos
  progressElement._progressApi = {
    setValue,
    getValue: () => value,
    increment: (amount = 1) => {
      setValue(value + amount);
    },
    decrement: (amount = 1) => {
      setValue(value - amount);
    }
  };
}

/**
 * Inicializa todos los progress en la página
 */
export function initProgresses() {
  const progresses = document.querySelectorAll('[data-slot="progress"], .progress');
  
  progresses.forEach((progress) => {
    initProgress(progress);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProgresses);
} else {
  initProgresses();
}

