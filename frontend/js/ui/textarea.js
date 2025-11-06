/**
 * Textarea Component - Vanilla JS Implementation
 * Adaptación del componente Textarea de React
 */

/**
 * Inicializa un textarea individual
 * @param {HTMLElement} textareaElement - Elemento textarea
 */
export function initTextarea(textareaElement) {
  // Aplicar clase si no existe
  if (!textareaElement.classList.contains('textarea')) {
    textareaElement.classList.add('textarea');
  }
  
  // Asegurar data-slot
  if (!textareaElement.hasAttribute('data-slot')) {
    textareaElement.setAttribute('data-slot', 'textarea');
  }
  
  // Auto-resize si está configurado
  const autoResize = textareaElement.getAttribute('data-auto-resize') === 'true' ||
                     textareaElement.hasAttribute('auto-resize');
  
  if (autoResize) {
    // Función para ajustar altura
    function adjustHeight() {
      textareaElement.style.height = 'auto';
      textareaElement.style.height = `${textareaElement.scrollHeight}px`;
    }
    
    // Ajustar altura inicial
    adjustHeight();
    
    // Ajustar en input
    textareaElement.addEventListener('input', adjustHeight);
    
    // Ajustar en resize del contenedor
    const resizeObserver = new ResizeObserver(() => {
      adjustHeight();
    });
    resizeObserver.observe(textareaElement);
  }
  
  // Manejo de caracteres restantes si tiene maxlength
  const maxLength = textareaElement.getAttribute('maxlength');
  if (maxLength) {
    const counter = document.createElement('div');
    counter.className = 'textarea-counter';
    counter.setAttribute('data-slot', 'textarea-counter');
    counter.style.cssText = 'text-align: right; font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;';
    
    function updateCounter() {
      const remaining = maxLength - textareaElement.value.length;
      counter.textContent = `${textareaElement.value.length}/${maxLength}`;
      counter.style.color = remaining < 10 ? '#dc2626' : '#6b7280';
    }
    
    updateCounter();
    textareaElement.addEventListener('input', updateCounter);
    
    // Insertar counter después del textarea
    if (textareaElement.parentElement) {
      textareaElement.parentElement.insertBefore(counter, textareaElement.nextSibling);
    }
  }
}

/**
 * Inicializa todos los textareas en la página
 */
export function initTextareas() {
  const textareas = document.querySelectorAll('[data-slot="textarea"], .textarea, textarea');
  
  textareas.forEach((textarea) => {
    initTextarea(textarea);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTextareas);
} else {
  initTextareas();
}

