/**
 * ToggleGroup Component - Vanilla JS Implementation
 * Adaptación del componente ToggleGroup de React/Radix UI
 */

/**
 * Inicializa un toggle group individual
 * @param {HTMLElement} toggleGroupElement - Elemento contenedor del toggle group
 */
export function initToggleGroup(toggleGroupElement) {
  const items = toggleGroupElement.querySelectorAll('[data-slot="toggle-group-item"], .toggle-group-item');
  
  if (items.length === 0) {
    console.warn('ToggleGroup: No items found');
    return;
  }
  
  // Obtener tipo (single o multiple)
  const type = toggleGroupElement.getAttribute('data-type') || 
               toggleGroupElement.getAttribute('type') || 
               'single';
  toggleGroupElement.setAttribute('data-type', type);
  
  // Obtener variantes del grupo
  const groupVariant = toggleGroupElement.getAttribute('data-variant') || 'default';
  const groupSize = toggleGroupElement.getAttribute('data-size') || 'default';
  
  toggleGroupElement.setAttribute('data-variant', groupVariant);
  toggleGroupElement.setAttribute('data-size', groupSize);
  
  // Aplicar clase si no existe
  if (!toggleGroupElement.classList.contains('toggle-group')) {
    toggleGroupElement.classList.add('toggle-group');
  }
  
  // Valores seleccionados
  let selectedValues = [];
  
  // Función para obtener el valor de un item
  function getItemValue(item) {
    return item.getAttribute('data-value') || 
           item.getAttribute('value') || 
           item.getAttribute('id') ||
           `item-${Array.from(items).indexOf(item)}`;
  }
  
  // Función para obtener valores iniciales
  function getInitialValues() {
    const values = [];
    items.forEach(item => {
      const isPressed = item.hasAttribute('pressed') || 
                       item.getAttribute('data-pressed') === 'true' ||
                       item.getAttribute('data-state') === 'on';
      if (isPressed) {
        values.push(getItemValue(item));
      }
    });
    return type === 'single' && values.length > 0 ? [values[0]] : values;
  }
  
  selectedValues = getInitialValues();
  
  // Función para actualizar estado
  function updateState() {
    items.forEach(item => {
      const itemValue = getItemValue(item);
      const isSelected = selectedValues.includes(itemValue);
      
      if (isSelected) {
        item.setAttribute('data-state', 'on');
        item.setAttribute('data-pressed', 'true');
        item.setAttribute('aria-pressed', 'true');
      } else {
        item.setAttribute('data-state', 'off');
        item.setAttribute('data-pressed', 'false');
        item.setAttribute('aria-pressed', 'false');
      }
    });
    
    // Dispatch event
    toggleGroupElement.dispatchEvent(new CustomEvent('toggle-group-change', {
      detail: { 
        values: type === 'single' ? (selectedValues[0] || null) : selectedValues,
        type
      },
      bubbles: true
    }));
  }
  
  // Inicializar items
  items.forEach((item, index) => {
    const itemValue = getItemValue(item);
    
    // Aplicar variantes del grupo si no tiene propias
    if (!item.hasAttribute('data-variant')) {
      item.setAttribute('data-variant', groupVariant);
    }
    if (!item.hasAttribute('data-size')) {
      item.setAttribute('data-size', groupSize);
    }
    
    // Aplicar clase si no existe
    if (!item.classList.contains('toggle-group-item')) {
      item.classList.add('toggle-group-item');
    }
    
    // Asegurar atributos ARIA
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', 
      (item.getAttribute('disabled') === 'true' || item.hasAttribute('disabled')) 
        ? '-1' : '0');
    
    // Event listeners
    item.addEventListener('click', (e) => {
      e.preventDefault();
      if (item.getAttribute('disabled') === 'true' || item.hasAttribute('disabled')) {
        return;
      }
      
      if (type === 'single') {
        // Solo un item seleccionado
        selectedValues = [itemValue];
      } else {
        // Múltiples items seleccionados
        const index = selectedValues.indexOf(itemValue);
        if (index > -1) {
          selectedValues.splice(index, 1);
        } else {
          selectedValues.push(itemValue);
        }
      }
      
      updateState();
    });
    
    item.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (item.getAttribute('disabled') !== 'true' && !item.hasAttribute('disabled')) {
          item.click();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const currentIndex = Array.from(items).indexOf(item);
        let nextIndex;
        
        if (e.key === 'ArrowLeft') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        } else {
          nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        }
        
        const nextItem = items[nextIndex];
        if (nextItem && nextItem.getAttribute('disabled') !== 'true' && !nextItem.hasAttribute('disabled')) {
          nextItem.focus();
        }
      }
    });
  });
  
  // Inicializar estado
  updateState();
  
  // Guardar métodos
  toggleGroupElement._toggleGroupApi = {
    getValue: () => type === 'single' ? (selectedValues[0] || null) : selectedValues,
    setValue: (value) => {
      if (type === 'single') {
        selectedValues = value ? [value] : [];
      } else {
        selectedValues = Array.isArray(value) ? value : [value];
      }
      updateState();
    },
    getValues: () => [...selectedValues],
    setValues: (values) => {
      if (type === 'single') {
        selectedValues = values && values.length > 0 ? [values[0]] : [];
      } else {
        selectedValues = Array.isArray(values) ? values : [];
      }
      updateState();
    }
  };
}

/**
 * Inicializa todos los toggle groups en la página
 */
export function initToggleGroups() {
  const toggleGroups = document.querySelectorAll('[data-slot="toggle-group"], .toggle-group');
  
  toggleGroups.forEach((toggleGroup) => {
    initToggleGroup(toggleGroup);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initToggleGroups);
} else {
  initToggleGroups();
}

