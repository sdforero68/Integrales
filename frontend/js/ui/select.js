/**
 * Select Component - Vanilla JS Implementation
 * Adaptación del componente Select de React/Radix UI
 */

/**
 * Inicializa un select individual
 * @param {HTMLElement} selectElement - Elemento contenedor del select
 */
export function initSelect(selectElement) {
  const trigger = selectElement.querySelector('[data-slot="select-trigger"], .select-trigger');
  const value = selectElement.querySelector('[data-slot="select-value"], .select-value');
  const content = selectElement.querySelector('[data-slot="select-content"], .select-content');
  
  if (!trigger || !content) {
    console.warn('Select: Trigger or Content not found');
    return;
  }
  
  let isOpen = false;
  let originalParent = content.parentElement;
  let isInBody = false;
  let selectedItem = null;
  let selectedValue = null;
  
  const items = content.querySelectorAll('[data-slot="select-item"], .select-item');
  const viewport = content.querySelector('[data-slot="select-viewport"], .select-viewport') || content;
  const scrollUpButton = content.querySelector('[data-slot="select-scroll-up-button"], .select-scroll-up-button');
  const scrollDownButton = content.querySelector('[data-slot="select-scroll-down-button"], .select-scroll-down-button');
  
  // Crear icono chevron si no existe
  if (!trigger.querySelector('svg')) {
    const chevronIcon = document.createElement('svg');
    chevronIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    chevronIcon.setAttribute('width', '16');
    chevronIcon.setAttribute('height', '16');
    chevronIcon.setAttribute('viewBox', '0 0 24 24');
    chevronIcon.setAttribute('fill', 'none');
    chevronIcon.setAttribute('stroke', 'currentColor');
    chevronIcon.setAttribute('stroke-width', '2');
    chevronIcon.setAttribute('stroke-linecap', 'round');
    chevronIcon.setAttribute('stroke-linejoin', 'round');
    chevronIcon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    chevronIcon.style.opacity = '0.5';
    trigger.appendChild(chevronIcon);
  }
  
  // Inicializar placeholder si no hay valor
  if (!value || !value.textContent.trim()) {
    if (trigger.hasAttribute('data-placeholder') || trigger.hasAttribute('placeholder')) {
      const placeholder = trigger.getAttribute('data-placeholder') || trigger.getAttribute('placeholder');
      if (value) {
        value.textContent = placeholder;
        value.setAttribute('data-placeholder', 'true');
      }
      trigger.setAttribute('data-placeholder', 'true');
    }
  }
  
  // Función para obtener el valor de un item
  function getItemValue(item) {
    return item.getAttribute('data-value') || 
           item.getAttribute('value') || 
           item.textContent.trim();
  }
  
  // Función para obtener el texto de un item
  function getItemText(item) {
    const textElement = item.querySelector('[data-slot="select-item-text"], .select-item-text');
    return textElement ? textElement.textContent.trim() : item.textContent.trim();
  }
  
  // Función para posicionar el content
  function positionContent() {
    if (!isInBody) return;
    
    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    let top = triggerRect.bottom + 4;
    let left = triggerRect.left;
    let side = 'bottom';
    
    // Verificar si cabe abajo
    if (triggerRect.bottom + contentRect.height > viewportHeight && triggerRect.top > contentRect.height) {
      top = triggerRect.top - contentRect.height - 4;
      side = 'top';
    }
    
    // Verificar si cabe a la derecha
    if (triggerRect.left + contentRect.width > viewportWidth) {
      left = viewportWidth - contentRect.width - 8;
    }
    
    // Asegurar que no se salga por la izquierda
    if (left < 8) {
      left = 8;
    }
    
    content.style.top = `${top}px`;
    content.style.left = `${left}px`;
    content.setAttribute('data-side', side);
  }
  
  // Función para abrir el select
  function open() {
    if (isOpen) return;
    
    isOpen = true;
    trigger.setAttribute('data-state', 'open');
    content.setAttribute('data-state', 'open');
    
    // Mover content a body
    if (!isInBody) {
      originalParent = content.parentElement;
      document.body.appendChild(content);
      content.style.position = 'fixed';
      isInBody = true;
    }
    
    positionContent();
    
    // Focus en el primer item o el item seleccionado
    const itemToFocus = selectedItem || items[0];
    if (itemToFocus) {
      itemToFocus.focus();
    }
    
    // Dispatch event
    selectElement.dispatchEvent(new CustomEvent('select-open', {
      detail: { trigger, content },
      bubbles: true
    }));
  }
  
  // Función para cerrar el select
  function close() {
    if (!isOpen) return;
    
    isOpen = false;
    trigger.setAttribute('data-state', 'closed');
    content.setAttribute('data-state', 'closed');
    
    // Mover content de vuelta al original parent después de la animación
    setTimeout(() => {
      if (isInBody && originalParent) {
        originalParent.appendChild(content);
        content.style.position = '';
        content.style.top = '';
        content.style.left = '';
        isInBody = false;
      }
    }, 150);
    
    // Dispatch event
    selectElement.dispatchEvent(new CustomEvent('select-close', {
      detail: { trigger, content },
      bubbles: true
    }));
  }
  
  // Función para seleccionar un item
  function selectItem(item) {
    // Remover selección anterior
    items.forEach(i => {
      i.removeAttribute('data-selected');
      i.setAttribute('data-state', 'unchecked');
    });
    
    // Seleccionar nuevo item
    item.setAttribute('data-selected', 'true');
    item.setAttribute('data-state', 'checked');
    selectedItem = item;
    selectedValue = getItemValue(item);
    
    // Actualizar value display
    if (value) {
      const itemText = getItemText(item);
      value.textContent = itemText;
      value.setAttribute('data-placeholder', 'false');
    }
    
    trigger.removeAttribute('data-placeholder');
    
    // Cerrar el select
    close();
    
    // Dispatch event
    selectElement.dispatchEvent(new CustomEvent('select-change', {
      detail: { 
        value: selectedValue,
        item: selectedItem,
        text: getItemText(item)
      },
      bubbles: true
    }));
  }
  
  // Inicializar items
  items.forEach((item, index) => {
    const itemValue = getItemValue(item);
    const itemText = getItemText(item);
    
    // Crear indicador si no existe
    if (!item.querySelector('.select-item-indicator')) {
      const indicator = document.createElement('span');
      indicator.className = 'select-item-indicator';
      indicator.setAttribute('data-slot', 'select-item-indicator');
      indicator.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      item.appendChild(indicator);
    }
    
    // Crear item text si no existe
    if (!item.querySelector('[data-slot="select-item-text"], .select-item-text')) {
      const textElement = document.createElement('span');
      textElement.className = 'select-item-text';
      textElement.setAttribute('data-slot', 'select-item-text');
      textElement.textContent = itemText;
      // Mover el contenido de texto al elemento text
      const existingText = Array.from(item.childNodes).filter(n => 
        n.nodeType === Node.TEXT_NODE && n.textContent.trim()
      );
      existingText.forEach(n => n.remove());
      item.insertBefore(textElement, item.firstChild);
    }
    
    // Event listeners
    item.addEventListener('click', (e) => {
      e.preventDefault();
      if (item.getAttribute('data-disabled') !== 'true') {
        selectItem(item);
      }
    });
    
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (item.getAttribute('data-disabled') !== 'true') {
          selectItem(item);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextItem = items[index + 1] || items[0];
        if (nextItem) nextItem.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevItem = items[index - 1] || items[items.length - 1];
        if (prevItem) prevItem.focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
        trigger.focus();
      }
    });
    
    // Asegurar atributos ARIA
    item.setAttribute('role', 'option');
    item.setAttribute('tabindex', item.getAttribute('data-disabled') === 'true' ? '-1' : '0');
    
    // Verificar si está seleccionado inicialmente
    if (item.hasAttribute('selected') || item.getAttribute('data-selected') === 'true') {
      selectItem(item);
    }
  });
  
  // Event listeners del trigger
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    if (trigger.getAttribute('disabled') !== 'true') {
      if (isOpen) {
        close();
      } else {
        open();
      }
    }
  });
  
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        open();
      }
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      close();
    }
  });
  
  // Cerrar al hacer click fuera
  function handleClickOutside(e) {
    if (isOpen && !selectElement.contains(e.target) && !content.contains(e.target)) {
      close();
    }
  }
  
  document.addEventListener('click', handleClickOutside);
  
  // Scroll buttons
  if (scrollUpButton) {
    scrollUpButton.addEventListener('click', () => {
      viewport.scrollTop -= 50;
    });
  }
  
  if (scrollDownButton) {
    scrollDownButton.addEventListener('click', () => {
      viewport.scrollTop += 50;
    });
  }
  
  // Actualizar visibilidad de scroll buttons
  function updateScrollButtons() {
    if (scrollUpButton) {
      scrollUpButton.style.display = viewport.scrollTop > 0 ? 'flex' : 'none';
    }
    if (scrollDownButton) {
      const isAtBottom = viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 1;
      scrollDownButton.style.display = !isAtBottom ? 'flex' : 'none';
    }
  }
  
  viewport.addEventListener('scroll', updateScrollButtons);
  
  // Re-posicionar en resize
  window.addEventListener('resize', () => {
    if (isOpen) {
      positionContent();
    }
  });
  
  // Guardar métodos
  selectElement._selectApi = {
    open,
    close,
    toggle: () => isOpen ? close() : open(),
    getValue: () => selectedValue,
    setValue: (val) => {
      const item = Array.from(items).find(i => getItemValue(i) === val);
      if (item) {
        selectItem(item);
      }
    },
    getSelectedItem: () => selectedItem,
    isOpen: () => isOpen
  };
}

/**
 * Inicializa todos los selects en la página
 */
export function initSelects() {
  const selects = document.querySelectorAll('[data-slot="select"], .select');
  
  selects.forEach((select) => {
    initSelect(select);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSelects);
} else {
  initSelects();
}

