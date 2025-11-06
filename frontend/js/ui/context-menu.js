/**
 * ContextMenu Component - Vanilla JS Implementation
 * Adaptación del componente ContextMenu de React/Radix UI
 */

/**
 * Inicializa un context menu individual
 * @param {HTMLElement} contextMenuElement - Elemento contenedor del context menu
 */
export function initContextMenu(contextMenuElement) {
  const trigger = contextMenuElement.querySelector('[data-slot="context-menu-trigger"], .context-menu-trigger');
  const content = contextMenuElement.querySelector('[data-slot="context-menu-content"], .context-menu-content');
  
  if (!trigger || !content) {
    console.warn('ContextMenu: trigger or content not found');
    return;
  }
  
  let isOpen = false;
  
  // Función para posicionar el menú
  function positionMenu(event) {
    const rect = content.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = event.clientX;
    let top = event.clientY;
    
    // Ajustar si se sale por la derecha
    if (left + rect.width > viewportWidth) {
      left = viewportWidth - rect.width - 10;
    }
    
    // Ajustar si se sale por abajo
    if (top + rect.height > viewportHeight) {
      top = viewportHeight - rect.height - 10;
    }
    
    // Asegurar que no se salga por la izquierda o arriba
    left = Math.max(10, left);
    top = Math.max(10, top);
    
    content.style.left = `${left}px`;
    content.style.top = `${top}px`;
  }
  
  // Función para abrir el menú
  function openMenu(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    isOpen = true;
    content.setAttribute('data-state', 'open');
    contextMenuElement.setAttribute('data-state', 'open');
    
    if (event) {
      positionMenu(event);
    }
    
    // Dispatch event
    contextMenuElement.dispatchEvent(new CustomEvent('context-menu-open', {
      detail: { open: true },
      bubbles: true
    }));
    
    // Focus en el primer item
    setTimeout(() => {
      const firstItem = content.querySelector('.context-menu-item:not([data-disabled="true"]), .context-menu-checkbox-item:not([data-disabled="true"]), .context-menu-radio-item:not([data-disabled="true"]), .context-menu-sub-trigger');
      if (firstItem) {
        firstItem.focus();
      }
    }, 0);
  }
  
  // Función para cerrar el menú
  function closeMenu() {
    isOpen = false;
    content.setAttribute('data-state', 'closed');
    contextMenuElement.setAttribute('data-state', 'closed');
    
    // Cerrar submenús
    const subMenus = content.querySelectorAll('.context-menu-sub-content[data-state="open"]');
    subMenus.forEach(subMenu => {
      subMenu.setAttribute('data-state', 'closed');
    });
    
    // Dispatch event
    contextMenuElement.dispatchEvent(new CustomEvent('context-menu-close', {
      detail: { open: false },
      bubbles: true
    }));
  }
  
  // Event listener para clic derecho
  trigger.addEventListener('contextmenu', (e) => {
    openMenu(e);
  });
  
  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (isOpen && !content.contains(e.target) && !trigger.contains(e.target)) {
      closeMenu();
    }
  });
  
  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });
  
  // Inicializar submenús
  initSubMenus(content);
  
  // Inicializar items
  initMenuItems(content, closeMenu);
  
  // Inicializar checkboxes y radios
  initCheckboxItems(content);
  initRadioItems(content);
  
  // Guardar métodos
  contextMenuElement._contextMenuApi = {
    open: openMenu,
    close: closeMenu,
    isOpen: () => isOpen
  };
}

/**
 * Inicializa submenús
 */
function initSubMenus(content) {
  const subMenus = content.querySelectorAll('[data-slot="context-menu-sub"], .context-menu-sub');
  
  subMenus.forEach((subMenu) => {
    const subTrigger = subMenu.querySelector('[data-slot="context-menu-sub-trigger"], .context-menu-sub-trigger');
    const subContent = subMenu.querySelector('[data-slot="context-menu-sub-content"], .context-menu-sub-content');
    
    if (!subTrigger || !subContent) return;
    
    let isSubOpen = false;
    
    function openSub() {
      isSubOpen = true;
      subContent.setAttribute('data-state', 'open');
      subTrigger.setAttribute('data-state', 'open');
    }
    
    function closeSub() {
      isSubOpen = false;
      subContent.setAttribute('data-state', 'closed');
      subTrigger.setAttribute('data-state', 'closed');
    }
    
    subTrigger.addEventListener('mouseenter', () => {
      openSub();
    });
    
    subTrigger.addEventListener('mouseleave', () => {
      // Cerrar después de un delay si el mouse no está sobre el submenú
      setTimeout(() => {
        if (!subContent.matches(':hover')) {
          closeSub();
        }
      }, 100);
    });
    
    subContent.addEventListener('mouseenter', () => {
      openSub();
    });
    
    subContent.addEventListener('mouseleave', () => {
      closeSub();
    });
    
    // Guardar API
    subMenu._subMenuApi = {
      open: openSub,
      close: closeSub,
      isOpen: () => isSubOpen
    };
  });
}

/**
 * Inicializa items del menú
 */
function initMenuItems(content, closeMenu) {
  const items = content.querySelectorAll('[data-slot="context-menu-item"], .context-menu-item');
  
  items.forEach((item) => {
    if (item.hasAttribute('data-disabled')) return;
    
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Dispatch event antes de cerrar
      item.dispatchEvent(new CustomEvent('context-menu-item-click', {
        detail: { item },
        bubbles: true
      }));
      
      closeMenu();
    });
    
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
}

/**
 * Inicializa checkbox items
 */
function initCheckboxItems(content) {
  const checkboxItems = content.querySelectorAll('[data-slot="context-menu-checkbox-item"], .context-menu-checkbox-item');
  
  checkboxItems.forEach((item) => {
    if (item.hasAttribute('data-disabled')) return;
    
    const indicator = item.querySelector('.context-menu-item-indicator');
    let isChecked = item.hasAttribute('checked') || item.getAttribute('data-checked') === 'true';
    
    if (indicator) {
      indicator.setAttribute('data-state', isChecked ? 'checked' : 'unchecked');
    }
    
    function toggle() {
      isChecked = !isChecked;
      
      if (isChecked) {
        item.setAttribute('checked', '');
        item.setAttribute('data-checked', 'true');
      } else {
        item.removeAttribute('checked');
        item.setAttribute('data-checked', 'false');
      }
      
      if (indicator) {
        indicator.setAttribute('data-state', isChecked ? 'checked' : 'unchecked');
      }
      
      item.dispatchEvent(new CustomEvent('context-menu-checkbox-change', {
        detail: { checked: isChecked, item },
        bubbles: true
      }));
    }
    
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });
    
    item._checkboxApi = {
      toggle,
      setChecked: (checked) => {
        if (checked !== isChecked) toggle();
      },
      isChecked: () => isChecked
    };
  });
}

/**
 * Inicializa radio items
 */
function initRadioItems(content) {
  const radioGroups = content.querySelectorAll('[data-slot="context-menu-radio-group"], .context-menu-radio-group');
  
  radioGroups.forEach((group) => {
    const radioItems = group.querySelectorAll('[data-slot="context-menu-radio-item"], .context-menu-radio-item');
    let selectedValue = null;
    
    radioItems.forEach((item) => {
      if (item.hasAttribute('data-disabled')) return;
      
      const indicator = item.querySelector('.context-menu-item-indicator');
      const value = item.getAttribute('data-value') || item.getAttribute('value');
      const isChecked = item.hasAttribute('data-checked') || item.getAttribute('checked') !== null;
      
      if (isChecked) {
        selectedValue = value;
        if (indicator) {
          indicator.setAttribute('data-state', 'checked');
        }
      } else if (indicator) {
        indicator.setAttribute('data-state', 'unchecked');
      }
      
      function select() {
        // Deseleccionar otros items del grupo
        radioItems.forEach(otherItem => {
          const otherIndicator = otherItem.querySelector('.context-menu-item-indicator');
          otherItem.removeAttribute('checked');
          otherItem.setAttribute('data-checked', 'false');
          if (otherIndicator) {
            otherIndicator.setAttribute('data-state', 'unchecked');
          }
        });
        
        // Seleccionar este item
        item.setAttribute('checked', '');
        item.setAttribute('data-checked', 'true');
        selectedValue = value;
        if (indicator) {
          indicator.setAttribute('data-state', 'checked');
        }
        
        group.dispatchEvent(new CustomEvent('context-menu-radio-change', {
          detail: { value, item },
          bubbles: true
        }));
      }
      
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        select();
      });
    });
    
    group._radioGroupApi = {
      getValue: () => selectedValue,
      setValue: (value) => {
        const item = Array.from(radioItems).find(i => 
          (i.getAttribute('data-value') || i.getAttribute('value')) === value
        );
        if (item) item.click();
      }
    };
  });
}

/**
 * Inicializa todos los context menus en la página
 */
export function initContextMenus() {
  const contextMenus = document.querySelectorAll('[data-slot="context-menu"], .context-menu');
  
  contextMenus.forEach((contextMenu) => {
    initContextMenu(contextMenu);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContextMenus);
} else {
  initContextMenus();
}

