/**
 * Menubar Component - Vanilla JS Implementation
 * Adaptación del componente Menubar de React/Radix UI
 */

/**
 * Inicializa un menubar individual
 * @param {HTMLElement} menubarElement - Elemento contenedor del menubar
 */
export function initMenubar(menubarElement) {
  const menus = menubarElement.querySelectorAll('[data-slot="menubar-menu"], .menubar-menu');
  
  menus.forEach((menu) => {
    initMenubarMenu(menu, menubarElement);
  });
}

/**
 * Inicializa un menú individual dentro del menubar
 * @param {HTMLElement} menuElement - Elemento del menú
 * @param {HTMLElement} menubarElement - Elemento contenedor del menubar
 */
function initMenubarMenu(menuElement, menubarElement) {
  const trigger = menuElement.querySelector('[data-slot="menubar-trigger"], .menubar-trigger');
  const content = menuElement.querySelector('[data-slot="menubar-content"], .menubar-content');
  
  if (!trigger || !content) {
    console.warn('MenubarMenu: trigger or content not found');
    return;
  }
  
  // Obtener configuración
  const align = menuElement.getAttribute('data-align') || 
                content.getAttribute('data-align') || 
                'start';
  const alignOffset = parseInt(content.getAttribute('data-align-offset') || '-4', 10);
  const sideOffset = parseInt(content.getAttribute('data-side-offset') || '8', 10);
  
  let isOpen = false;
  
  // Función para posicionar el menú
  function positionMenu() {
    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let top = triggerRect.bottom + sideOffset;
    let left = triggerRect.left;
    
    // Ajustar según align
    if (align === 'center') {
      left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
    } else if (align === 'end') {
      left = triggerRect.right - contentRect.width;
    }
    
    // Aplicar alignOffset
    if (align === 'start') {
      left += alignOffset;
    } else if (align === 'end') {
      left += alignOffset;
    }
    
    // Ajustar si se sale por la derecha
    if (left + contentRect.width > viewportWidth - 10) {
      left = viewportWidth - contentRect.width - 10;
    }
    
    // Ajustar si se sale por abajo
    if (top + contentRect.height > viewportHeight - 10) {
      top = triggerRect.top - contentRect.height - sideOffset;
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
    // Cerrar otros menús del menubar
    menubarElement.querySelectorAll('.menubar-content[data-state="open"]').forEach(otherContent => {
      if (otherContent !== content) {
        otherContent.setAttribute('data-state', 'closed');
        const otherMenu = otherContent.closest('.menubar-menu');
        if (otherMenu) {
          const otherTrigger = otherMenu.querySelector('.menubar-trigger');
          if (otherTrigger) otherTrigger.setAttribute('data-state', 'closed');
        }
      }
    });
    
    isOpen = true;
    content.setAttribute('data-state', 'open');
    trigger.setAttribute('data-state', 'open');
    menuElement.setAttribute('data-state', 'open');
    
    positionMenu();
    
    // Dispatch event
    menubarElement.dispatchEvent(new CustomEvent('menubar-menu-open', {
      detail: { menu: menuElement, open: true },
      bubbles: true
    }));
    
    // Focus en el primer item
    setTimeout(() => {
      const firstItem = content.querySelector('.menubar-item:not([data-disabled="true"]), .menubar-checkbox-item:not([data-disabled="true"]), .menubar-radio-item:not([data-disabled="true"]), .menubar-sub-trigger');
      if (firstItem) {
        firstItem.focus();
      }
    }, 0);
  }
  
  // Función para cerrar el menú
  function closeMenu() {
    isOpen = false;
    content.setAttribute('data-state', 'closed');
    trigger.setAttribute('data-state', 'closed');
    menuElement.setAttribute('data-state', 'closed');
    
    // Cerrar submenús
    const subMenus = content.querySelectorAll('.menubar-sub-content[data-state="open"]');
    subMenus.forEach(subMenu => {
      subMenu.setAttribute('data-state', 'closed');
    });
    
    // Dispatch event
    menubarElement.dispatchEvent(new CustomEvent('menubar-menu-close', {
      detail: { menu: menuElement, open: false },
      bubbles: true
    }));
  }
  
  // Event listeners
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
  menuElement._menubarMenuApi = {
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
  const subMenus = content.querySelectorAll('[data-slot="menubar-sub"], .menubar-sub');
  
  subMenus.forEach((subMenu) => {
    const subTrigger = subMenu.querySelector('[data-slot="menubar-sub-trigger"], .menubar-sub-trigger');
    const subContent = subMenu.querySelector('[data-slot="menubar-sub-content"], .menubar-sub-content');
    
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
      if (left + contentRect.width > viewportWidth - 10) {
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
  const items = content.querySelectorAll('[data-slot="menubar-item"], .menubar-item');
  
  items.forEach((item) => {
    if (item.hasAttribute('data-disabled')) return;
    
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Dispatch event antes de cerrar
      item.dispatchEvent(new CustomEvent('menubar-item-click', {
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
  const checkboxItems = content.querySelectorAll('[data-slot="menubar-checkbox-item"], .menubar-checkbox-item');
  
  checkboxItems.forEach((item) => {
    if (item.hasAttribute('data-disabled')) return;
    
    const indicator = item.querySelector('.menubar-item-indicator');
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
      
      item.dispatchEvent(new CustomEvent('menubar-checkbox-change', {
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
  const radioGroups = content.querySelectorAll('[data-slot="menubar-radio-group"], .menubar-radio-group');
  
  radioGroups.forEach((group) => {
    const radioItems = group.querySelectorAll('[data-slot="menubar-radio-item"], .menubar-radio-item');
    let selectedValue = null;
    
    radioItems.forEach((item) => {
      if (item.hasAttribute('data-disabled')) return;
      
      const indicator = item.querySelector('.menubar-item-indicator');
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
          const otherIndicator = otherItem.querySelector('.menubar-item-indicator');
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
        
        group.dispatchEvent(new CustomEvent('menubar-radio-change', {
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
 * Inicializa todos los menubars en la página
 */
export function initMenubars() {
  const menubars = document.querySelectorAll('[data-slot="menubar"], .menubar');
  
  menubars.forEach((menubar) => {
    initMenubar(menubar);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMenubars);
} else {
  initMenubars();
}

