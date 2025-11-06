/**
 * NavigationMenu Component - Vanilla JS Implementation
 * Adaptación del componente NavigationMenu de React/Radix UI
 */

/**
 * Inicializa un navigation menu individual
 * @param {HTMLElement} navigationMenuElement - Elemento contenedor del navigation menu
 */
export function initNavigationMenu(navigationMenuElement) {
  const viewport = navigationMenuElement.getAttribute('data-viewport') !== 'false';
  const list = navigationMenuElement.querySelector('[data-slot="navigation-menu-list"], .navigation-menu-list');
  const items = navigationMenuElement.querySelectorAll('[data-slot="navigation-menu-item"], .navigation-menu-item');
  const viewportElement = navigationMenuElement.querySelector('[data-slot="navigation-menu-viewport"], .navigation-menu-viewport');
  
  if (!list) {
    console.warn('NavigationMenu: list not found');
    return;
  }
  
  let activeItem = null;
  let activeContent = null;
  
  // Crear viewport si no existe y viewport está habilitado
  if (viewport && !viewportElement) {
    const viewportDiv = document.createElement('div');
    viewportDiv.className = 'navigation-menu-viewport';
    const viewportContent = document.createElement('div');
    viewportContent.className = 'navigation-menu-viewport-content';
    viewportContent.setAttribute('data-slot', 'navigation-menu-viewport');
    viewportContent.setAttribute('data-state', 'closed');
    viewportDiv.appendChild(viewportContent);
    navigationMenuElement.appendChild(viewportDiv);
  }
  
  const viewportContent = viewportElement?.querySelector('.navigation-menu-viewport-content') || 
                         navigationMenuElement.querySelector('[data-slot="navigation-menu-viewport"], .navigation-menu-viewport-content');
  
  // Inicializar cada item
  items.forEach((item) => {
    initNavigationMenuItem(item, navigationMenuElement, viewport, viewportContent);
  });
  
  // Función para cerrar todos los menús
  function closeAllMenus() {
    items.forEach((item) => {
      const trigger = item.querySelector('[data-slot="navigation-menu-trigger"], .navigation-menu-trigger');
      const content = item.querySelector('[data-slot="navigation-menu-content"], .navigation-menu-content');
      
      if (trigger) {
        trigger.setAttribute('data-state', 'closed');
      }
      if (content) {
        content.setAttribute('data-state', 'closed');
      }
    });
    
    if (viewportContent) {
      viewportContent.setAttribute('data-state', 'closed');
    }
    
    activeItem = null;
    activeContent = null;
  }
  
  // Guardar métodos
  navigationMenuElement._navigationMenuApi = {
    closeAll: closeAllMenus
  };
}

/**
 * Inicializa un navigation menu item individual
 * @param {HTMLElement} itemElement - Elemento del item
 * @param {HTMLElement} navigationMenuElement - Elemento contenedor del navigation menu
 * @param {boolean} viewport - Si se usa viewport
 * @param {HTMLElement} viewportContent - Contenedor del viewport
 */
function initNavigationMenuItem(itemElement, navigationMenuElement, viewport, viewportContent) {
  const trigger = itemElement.querySelector('[data-slot="navigation-menu-trigger"], .navigation-menu-trigger');
  const content = itemElement.querySelector('[data-slot="navigation-menu-content"], .navigation-menu-content');
  const indicator = itemElement.querySelector('[data-slot="navigation-menu-indicator"], .navigation-menu-indicator');
  
  if (!trigger) {
    return; // Puede ser solo un link sin trigger
  }
  
  if (!content) {
    // Si no hay content, es solo un trigger/link
    return;
  }
  
  let isOpen = false;
  
  // Función para abrir el menú
  function openMenu() {
    // Cerrar otros menús
    navigationMenuElement.querySelectorAll('.navigation-menu-trigger[data-state="open"]').forEach(otherTrigger => {
      if (otherTrigger !== trigger) {
        otherTrigger.setAttribute('data-state', 'closed');
      }
    });
    
    navigationMenuElement.querySelectorAll('.navigation-menu-content[data-state="open"]').forEach(otherContent => {
      if (otherContent !== content) {
        otherContent.setAttribute('data-state', 'closed');
      }
    });
    
    isOpen = true;
    trigger.setAttribute('data-state', 'open');
    content.setAttribute('data-state', 'open');
    itemElement.setAttribute('data-state', 'open');
    
    if (viewport && viewportContent) {
      // Mover content al viewport
      if (!viewportContent.contains(content)) {
        viewportContent.innerHTML = '';
        viewportContent.appendChild(content);
      }
      
      // Calcular dimensiones del content
      const contentRect = content.getBoundingClientRect();
      viewportContent.style.setProperty('--navigation-menu-viewport-width', `${contentRect.width}px`);
      viewportContent.style.setProperty('--navigation-menu-viewport-height', `${contentRect.height}px`);
      
      viewportContent.setAttribute('data-state', 'open');
    }
    
    // Mostrar indicador
    if (indicator) {
      indicator.setAttribute('data-state', 'visible');
      positionIndicator();
    }
    
    activeItem = itemElement;
    activeContent = content;
    
    // Dispatch event
    navigationMenuElement.dispatchEvent(new CustomEvent('navigation-menu-open', {
      detail: { item: itemElement, open: true },
      bubbles: true
    }));
  }
  
  // Función para cerrar el menú
  function closeMenu() {
    isOpen = false;
    trigger.setAttribute('data-state', 'closed');
    content.setAttribute('data-state', 'closed');
    itemElement.setAttribute('data-state', 'closed');
    
    if (viewportContent) {
      viewportContent.setAttribute('data-state', 'closed');
    }
    
    // Ocultar indicador
    if (indicator) {
      indicator.setAttribute('data-state', 'hidden');
    }
    
    if (activeItem === itemElement) {
      activeItem = null;
      activeContent = null;
    }
    
    // Dispatch event
    navigationMenuElement.dispatchEvent(new CustomEvent('navigation-menu-close', {
      detail: { item: itemElement, open: false },
      bubbles: true
    }));
  }
  
  // Función para posicionar el indicador
  function positionIndicator() {
    if (!indicator) return;
    
    const triggerRect = trigger.getBoundingClientRect();
    const indicatorRect = indicator.getBoundingClientRect();
    const menuRect = navigationMenuElement.getBoundingClientRect();
    
    const left = triggerRect.left - menuRect.left + (triggerRect.width / 2) - (indicatorRect.width / 2);
    indicator.style.left = `${left}px`;
  }
  
  // Event listeners
  trigger.addEventListener('mouseenter', () => {
    openMenu();
  });
  
  trigger.addEventListener('mouseleave', () => {
    // Delay para permitir mover el mouse al content
    setTimeout(() => {
      const isHoveringContent = content.matches(':hover') || content.contains(document.activeElement);
      if (!isHoveringContent) {
        closeMenu();
      }
    }, 100);
  });
  
  content.addEventListener('mouseenter', () => {
    if (!isOpen) {
      openMenu();
    }
  });
  
  content.addEventListener('mouseleave', () => {
    closeMenu();
  });
  
  // Click en trigger
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
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
  
  // Inicializar links
  const links = content.querySelectorAll('[data-slot="navigation-menu-link"], .navigation-menu-link');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      // Marcar como activo
      links.forEach(l => l.setAttribute('data-active', 'false'));
      link.setAttribute('data-active', 'true');
    });
  });
  
  // Recalcular posición del indicador en resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (isOpen && indicator) {
        positionIndicator();
      }
    }, 100);
  });
  
  // Guardar métodos
  itemElement._navigationMenuItemApi = {
    open: openMenu,
    close: closeMenu,
    toggle: () => isOpen ? closeMenu() : openMenu(),
    isOpen: () => isOpen
  };
}

/**
 * Inicializa todos los navigation menus en la página
 */
export function initNavigationMenus() {
  const navigationMenus = document.querySelectorAll('[data-slot="navigation-menu"], .navigation-menu');
  
  navigationMenus.forEach((navigationMenu) => {
    initNavigationMenu(navigationMenu);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigationMenus);
} else {
  initNavigationMenus();
}

