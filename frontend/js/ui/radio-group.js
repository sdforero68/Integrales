/**
 * RadioGroup Component - Vanilla JS Implementation
 * Adaptación del componente RadioGroup de React/Radix UI
 */

/**
 * Inicializa un radio group individual
 * @param {HTMLElement} radioGroupElement - Elemento contenedor del radio group
 */
export function initRadioGroup(radioGroupElement) {
  const items = radioGroupElement.querySelectorAll('[data-slot="radio-group-item"], .radio-group-item');
  
  if (items.length === 0) {
    console.warn('RadioGroup: No items found');
    return;
  }
  
  // Obtener valor inicial
  let selectedValue = null;
  
  // Inicializar cada item
  items.forEach((item) => {
    // Si es un input nativo, no necesita inicialización adicional
    if (item.tagName === 'INPUT' && item.type === 'radio') {
      // Asegurar que tenga el indicador
      if (!item.nextElementSibling?.classList.contains('radio-group-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'radio-group-indicator';
        indicator.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        `;
        item.parentElement?.insertBefore(indicator, item.nextSibling);
      }
      
      // Verificar si está seleccionado
      if (item.checked) {
        selectedValue = item.value || item.getAttribute('value');
      }
      
      // Event listener para cambios
      item.addEventListener('change', () => {
        if (item.checked) {
          selectedValue = item.value || item.getAttribute('value');
          
          // Dispatch event
          radioGroupElement.dispatchEvent(new CustomEvent('radio-group-change', {
            detail: { value: selectedValue, item },
            bubbles: true
          }));
        }
      });
      
      return;
    }
    
    // Para elementos personalizados (button, div, etc.)
    const value = item.getAttribute('data-value') || 
                  item.getAttribute('value') || 
                  item.getAttribute('id') || 
                  `radio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    let isChecked = item.hasAttribute('checked') || 
                    item.getAttribute('data-checked') === 'true' ||
                    item.getAttribute('data-state') === 'checked';
    
    // Crear indicador si no existe
    if (!item.querySelector('.radio-group-indicator')) {
      const indicator = document.createElement('span');
      indicator.className = 'radio-group-indicator';
      indicator.setAttribute('data-slot', 'radio-group-indicator');
      indicator.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      `;
      item.appendChild(indicator);
    }
    
    // Función para seleccionar este item
    function select() {
      // Deseleccionar otros items del grupo
      items.forEach(otherItem => {
        if (otherItem === item) return;
        
        if (otherItem.tagName === 'INPUT' && otherItem.type === 'radio') {
          otherItem.checked = false;
        } else {
          otherItem.removeAttribute('checked');
          otherItem.setAttribute('data-checked', 'false');
          otherItem.setAttribute('data-state', 'unchecked');
        }
      });
      
      // Seleccionar este item
      if (item.tagName === 'INPUT' && item.type === 'radio') {
        item.checked = true;
      } else {
        item.setAttribute('checked', '');
        item.setAttribute('data-checked', 'true');
        item.setAttribute('data-state', 'checked');
      }
      
      isChecked = true;
      selectedValue = value;
      
      // Dispatch event
      radioGroupElement.dispatchEvent(new CustomEvent('radio-group-change', {
        detail: { value: selectedValue, item },
        bubbles: true
      }));
    }
    
    // Event listeners
    item.addEventListener('click', (e) => {
      if (item.hasAttribute('disabled')) return;
      e.preventDefault();
      select();
    });
    
    item.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!item.hasAttribute('disabled')) {
          select();
        }
      }
    });
    
    // Asegurar atributos ARIA
    item.setAttribute('role', 'radio');
    item.setAttribute('tabindex', item.hasAttribute('disabled') ? '-1' : '0');
    item.setAttribute('aria-checked', isChecked.toString());
    
    // Inicializar estado
    if (isChecked) {
      select();
    } else {
      item.setAttribute('data-state', 'unchecked');
    }
  });
  
  // Función para obtener el valor seleccionado
  function getValue() {
    return selectedValue;
  }
  
  // Función para establecer el valor
  function setValue(value) {
    const item = Array.from(items).find(i => {
      if (i.tagName === 'INPUT' && i.type === 'radio') {
        return (i.value || i.getAttribute('value')) === value;
      }
      return (i.getAttribute('data-value') || i.getAttribute('value')) === value;
    });
    
    if (item) {
      if (item.tagName === 'INPUT' && item.type === 'radio') {
        item.click();
      } else {
        item.click();
      }
    }
  }
  
  // Guardar métodos
  radioGroupElement._radioGroupApi = {
    getValue,
    setValue,
    getSelectedItem: () => {
      return Array.from(items).find(item => {
        if (item.tagName === 'INPUT' && item.type === 'radio') {
          return item.checked;
        }
        return item.getAttribute('data-checked') === 'true' || item.getAttribute('data-state') === 'checked';
      });
    }
  };
}

/**
 * Inicializa todos los radio groups en la página
 */
export function initRadioGroups() {
  const radioGroups = document.querySelectorAll('[data-slot="radio-group"], .radio-group');
  
  radioGroups.forEach((radioGroup) => {
    initRadioGroup(radioGroup);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRadioGroups);
} else {
  initRadioGroups();
}

