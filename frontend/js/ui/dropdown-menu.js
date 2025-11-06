/**
 * DropdownMenu Component - Vanilla JS Implementation
 * Adaptación del componente DropdownMenu de React/Radix UI
 */

/**
 * Inicializa un dropdown menu individual
 * @param {HTMLElement} dropdownElement - Elemento contenedor del dropdown menu
 */
export function initDropdownMenu(dropdownElement) {
  const trigger = dropdownElement.querySelector('[data-slot="dropdown-menu-trigger"], .dropdown-menu-trigger');
  const content = dropdownElement.querySelector('[data-slot="dropdown-menu-content"], .dropdown-menu-content');
  
  if (!trigger || !content) {
    console.warn('DropdownMenu: trigger or content not found');
    return;
  }
  
  let isOpen = false;
  
  // Función para posicionar el menú
  function positionMenu() {
    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Obtener sideOffset
    const sideOffset = parseInt(content.getAttribute('data-side-offset') || '4', 10);
    
    // Determinar posición (default: bottom)
    let top = triggerRect.bottom + sideOffset;
    let left = triggerRect.left;
    
    // Ajustar si se sale por la derecha
    if (left + contentRect.width > viewportWidth) {
      left = viewportWidth - contentRect.width - 10;
    }
    
    // Ajustar si se sale por abajo
    if (top + contentRect.height > viewportHeight) {
      top = triggerRect.top - contentRect.height - sideOffset;
      content.setAttribute('data-side', 'top');
    } else {
      content.setAttribute('data-side', 'bottom');
    }
    
    // Ajustar si se sale por la izquierda
    if (left < 10) {
      left = 10;
    }
    
    // Ajustar si se sale por arriba
    if (top < 10) {
      top = 10;
    }
    
    content.style.left = `${left}px`;
    content.style.top = `${top}px`;
  }
  
  // Función para abrir el menú
  function openMenu() {
    isOpen = true;
    content.setAttribute('data-state', 'open');
    dropdownElement.setAttribute('data-state', 'open');
    
    positionMenu();
    
    // Dispatch event
    dropdownElement.dispatchEvent(new CustomEvent('dropdown-menu-open', {
      detail: { open: true },
      bubbles: true
    }));
    
    // Focus en el primer item
    setTimeout(() => {
      const firstItem = content.querySelector('.dropdown-menu-item:not([data-disabled="true"]), .dropdown-menu-checkbox-item:not([data-disabled="true"]), .dropdown-menu-radio-item:not([data-disabled="true"]), .dropdown-menu-sub-trigger');
      if (firstItem) {
        firstItem.focus();
      }
    }, 0);
  }
  
  // Función para cerrar el menú
  function closeMenu() {
    isOpen = false;
    content.setAttribute('data-state', 'closed');
    dropdownElement.setAttribute('data-state', 'closed');
    
    // Cerrar submenús
    const subMenus = content.querySelectorAll('.dropdown-menu-sub-content[data-state="open"]');
    subMenus.forEach(subMenu => {
      subMenu.setAttribute('data-state', 'closed');
    });
    
    // Dispatch event
    dropdownElement.dispatchEvent(new CustomEvent('dropdown-menu-close', {
      detail: { open: false },
      bubbles: true
    }));
  }
  
  // Event listener para click
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
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
  dropdownElement._dropdownMenuApi = {
    open: openMenu,
    close: closeMenu,
    toggle: () => isOpen ? closeMenu() : openMenu(),
    isOpen: () => isOpen
  };
}

/**
 * Inicializa submenús
 */
function initSubMenus(content) {
  const subMenus = content.querySelectorAll('[data-slot="dropdown-menu-sub"], .dropdown-menu-sub');
  
  subMenus.forEach((subMenu) => {
    const subTrigger = subMenu.querySelector('[data-slot="dropdown-menu-sub-trigger"], .dropdown-menu-sub-trigger');
    const subContent = subMenu.querySelector('[data-slot="dropdown-menu-sub-content"], .dropdown-menu-sub-content');
    
    if (!subTrigger || !subContent) return;
    
    let isSubOpen = false;
    
    function openSub() {
      isSubOpen = true;
      subContent.setAttribute('data-state', 'open');
      subTrigger.setAttribute('data-state', 'open');
      
      // Posicionar submenú
      const triggerRect = subTrigger.getBoundingClientRect();
      const contentRect = subContent.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      let left = triggerRect.right + 4;
      let top = triggerRect.top;
      
      // Ajustar si se sale por la derecha
      if (left + contentRect.width > viewportWidth) {
        left = triggerRect.left - contentRect.width - 4;
      }
      
      subContent.style.left = `${left}px`;
      subContent.style.top = `${top}px`;
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
  const items = content.querySelectorAll('[data-slot="dropdown-menu-item"], .dropdown-menu-item');
  
  items.forEach((item) => {
    if (item.hasAttribute('data-disabled')) return;
    
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Dispatch event antes de cerrar
      item.dispatchEvent(new CustomEvent('dropdown-menu-item-click', {
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
  const checkboxItems = content.querySelectorAll('[data-slot="dropdown-menu-checkbox-item"], .dropdown-menu-checkbox-item');
  
  checkboxItems.forEach((item) => {
    if (item.hasAttribute('data-disabled')) return;
    
    const indicator = item.querySelector('.dropdown-menu-item-indicator');
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
      
      item.dispatchEvent(new CustomEvent('dropdown-menu-checkbox-change', {
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
  const radioGroups = content.querySelectorAll('[data-slot="dropdown-menu-radio-group"], .dropdown-menu-radio-group');
  
  radioGroups.forEach((group) => {
    const radioItems = group.querySelectorAll('[data-slot="dropdown-menu-radio-item"], .dropdown-menu-radio-item');
    let selectedValue = null;
    
    radioItems.forEach((item) => {
      if (item.hasAttribute('data-disabled')) return;
      
      const indicator = item.querySelector('.dropdown-menu-item-indicator');
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
          const otherIndicator = otherItem.querySelector('.dropdown-menu-item-indicator');
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
        
        group.dispatchEvent(new CustomEvent('dropdown-menu-radio-change', {
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
 * Inicializa todos los dropdown menus en la página
 */
export function initDropdownMenus() {
  const dropdownMenus = document.querySelectorAll('[data-slot="dropdown-menu"], .dropdown-menu');
  
  dropdownMenus.forEach((dropdownMenu) => {
    initDropdownMenu(dropdownMenu);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDropdownMenus);
} else {
  initDropdownMenus();
}

