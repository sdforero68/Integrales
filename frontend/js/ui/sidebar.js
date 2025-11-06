/**
 * Sidebar Component - Vanilla JS Implementation
 * Adaptación del componente Sidebar de React
 */

import { isMobile as detectIsMobile } from '../utils/use-mobile.js';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 días
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

// Estado global del sidebar (similar a context)
let sidebarState = {
  isOpen: true,
  isMobile: false,
  openMobile: false,
  state: 'expanded'
};

// Listeners para cambios de estado
const stateListeners = new Set();

/**
 * Función para obtener cookie
 */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

/**
 * Función para establecer cookie
 */
function setCookie(name, value, maxAge) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

/**
 * Función para actualizar el estado y notificar listeners
 */
function updateState(newState) {
  sidebarState = { ...sidebarState, ...newState };
  stateListeners.forEach(listener => listener(sidebarState));
}

/**
 * Inicializa el SidebarProvider
 * @param {HTMLElement} wrapperElement - Elemento wrapper del sidebar
 */
export function initSidebarProvider(wrapperElement) {
  // Detectar móvil inicial
  sidebarState.isMobile = detectIsMobile();
  
  // Cargar estado desde cookie
  const savedState = getCookie(SIDEBAR_COOKIE_NAME);
  if (savedState === 'true' || savedState === 'false') {
    sidebarState.isOpen = savedState === 'true';
  }
  
  sidebarState.state = sidebarState.isOpen ? 'expanded' : 'collapsed';
  
  // Aplicar estado inicial
  wrapperElement.setAttribute('data-state', sidebarState.state);
  
  // Listener para cambios de tamaño de ventana
  function handleResize() {
    const wasMobile = sidebarState.isMobile;
    sidebarState.isMobile = detectIsMobile();
    
    if (wasMobile !== sidebarState.isMobile) {
      updateState({});
      // Actualizar todos los sidebars
      document.querySelectorAll('[data-slot="sidebar"]').forEach(sidebar => {
        initSidebar(sidebar);
      });
    }
  }
  
  window.addEventListener('resize', handleResize);
  
  // Keyboard shortcut (Cmd/Ctrl + B)
  function handleKeyDown(e) {
    if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      toggleSidebar();
    }
  }
  
  window.addEventListener('keydown', handleKeyDown);
  
  // Función para toggle del sidebar
  function toggleSidebar() {
    if (sidebarState.isMobile) {
      sidebarState.openMobile = !sidebarState.openMobile;
      updateState({});
      // Actualizar sheet móvil si existe
      const mobileSheet = wrapperElement.querySelector('[data-mobile="true"]');
      if (mobileSheet) {
        if (sidebarState.openMobile) {
          mobileSheet.closest('[data-slot="sheet"]')?._sheetApi?.open();
        } else {
          mobileSheet.closest('[data-slot="sheet"]')?._sheetApi?.close();
        }
      }
    } else {
      sidebarState.isOpen = !sidebarState.isOpen;
      sidebarState.state = sidebarState.isOpen ? 'expanded' : 'collapsed';
      setCookie(SIDEBAR_COOKIE_NAME, sidebarState.isOpen.toString(), SIDEBAR_COOKIE_MAX_AGE);
      updateState({});
      
      // Actualizar todos los sidebars
      document.querySelectorAll('[data-slot="sidebar"]').forEach(sidebar => {
        updateSidebarState(sidebar);
      });
    }
  }
  
  // Exponer API
  wrapperElement._sidebarProviderApi = {
    toggleSidebar,
    setOpen: (open) => {
      if (sidebarState.isMobile) {
        sidebarState.openMobile = open;
      } else {
        sidebarState.isOpen = open;
        sidebarState.state = open ? 'expanded' : 'collapsed';
        setCookie(SIDEBAR_COOKIE_NAME, open.toString(), SIDEBAR_COOKIE_MAX_AGE);
      }
      updateState({});
    },
    getState: () => ({ ...sidebarState }),
    subscribe: (listener) => {
      stateListeners.add(listener);
      return () => stateListeners.delete(listener);
    }
  };
}

/**
 * Actualiza el estado visual de un sidebar
 */
function updateSidebarState(sidebarElement) {
  const state = sidebarState.state;
  const collapsible = sidebarElement.getAttribute('data-collapsible') || 'offcanvas';
  
  // Actualizar atributos
  sidebarElement.setAttribute('data-state', state);
  sidebarElement.closest('[data-slot="sidebar-wrapper"]')?.setAttribute('data-state', state);
  
  // Actualizar container y gap
  const container = sidebarElement.querySelector('[data-slot="sidebar-container"], .sidebar-container');
  const gap = sidebarElement.querySelector('[data-slot="sidebar-gap"], .sidebar-gap');
  
  if (container) {
    container.setAttribute('data-state', state);
    if (collapsible === 'offcanvas') {
      container.setAttribute('data-collapsible', state === 'collapsed' ? 'offcanvas' : '');
    } else if (collapsible === 'icon') {
      container.setAttribute('data-collapsible', state === 'collapsed' ? 'icon' : '');
    }
  }
  
  if (gap) {
    gap.setAttribute('data-state', state);
    if (collapsible === 'offcanvas') {
      gap.setAttribute('data-collapsible', state === 'collapsed' ? 'offcanvas' : '');
    } else if (collapsible === 'icon') {
      gap.setAttribute('data-collapsible', state === 'collapsed' ? 'icon' : '');
    }
  }
  
  // Actualizar elementos internos
  const elements = sidebarElement.querySelectorAll('[data-collapsible], [data-state]');
  elements.forEach(el => {
    if (el.hasAttribute('data-collapsible')) {
      el.setAttribute('data-state', state);
    }
  });
}

/**
 * Inicializa un sidebar individual
 * @param {HTMLElement} sidebarElement - Elemento sidebar
 */
export function initSidebar(sidebarElement) {
  const side = sidebarElement.getAttribute('data-side') || 'left';
  const variant = sidebarElement.getAttribute('data-variant') || 'sidebar';
  const collapsible = sidebarElement.getAttribute('data-collapsible') || 'offcanvas';
  
  sidebarElement.setAttribute('data-side', side);
  sidebarElement.setAttribute('data-variant', variant);
  sidebarElement.setAttribute('data-collapsible', collapsible);
  
  // Si es móvil, usar Sheet
  if (sidebarState.isMobile) {
    const sheetElement = sidebarElement.closest('[data-slot="sheet"], .sheet');
    if (sheetElement && sheetElement._sheetApi) {
      // Sincronizar con el estado móvil
      if (sidebarState.openMobile) {
        sheetElement._sheetApi.open();
      } else {
        sheetElement._sheetApi.close();
      }
    }
    return;
  }
  
  // Desktop: crear estructura si no existe
  if (!sidebarElement.querySelector('[data-slot="sidebar-container"], .sidebar-container')) {
    const container = document.createElement('div');
    container.setAttribute('data-slot', 'sidebar-container');
    container.className = 'sidebar-container';
    container.setAttribute('data-side', side);
    container.setAttribute('data-variant', variant);
    
    const inner = document.createElement('div');
    inner.setAttribute('data-sidebar', 'sidebar');
    inner.setAttribute('data-slot', 'sidebar-inner');
    inner.className = 'sidebar-inner';
    inner.setAttribute('data-variant', variant);
    
    // Mover contenido al inner
    while (sidebarElement.firstChild) {
      inner.appendChild(sidebarElement.firstChild);
    }
    
    container.appendChild(inner);
    sidebarElement.appendChild(container);
  }
  
  // Crear gap si no existe
  if (!sidebarElement.querySelector('[data-slot="sidebar-gap"], .sidebar-gap')) {
    const gap = document.createElement('div');
    gap.setAttribute('data-slot', 'sidebar-gap');
    gap.className = 'sidebar-gap';
    gap.setAttribute('data-side', side);
    sidebarElement.insertBefore(gap, sidebarElement.firstChild);
  }
  
  // Actualizar estado
  updateSidebarState(sidebarElement);
  
  // Inicializar rail si existe
  const rail = sidebarElement.querySelector('[data-slot="sidebar-rail"], .sidebar-rail');
  if (rail) {
    rail.setAttribute('data-side', side);
    rail.setAttribute('data-collapsible', collapsible);
    rail.addEventListener('click', () => {
      const wrapper = sidebarElement.closest('[data-slot="sidebar-wrapper"], .sidebar-wrapper');
      if (wrapper?._sidebarProviderApi) {
        wrapper._sidebarProviderApi.toggleSidebar();
      }
    });
  }
}

/**
 * Inicializa todos los sidebars en la página
 */
export function initSidebars() {
  // Inicializar providers primero
  const providers = document.querySelectorAll('[data-slot="sidebar-wrapper"], .sidebar-wrapper');
  providers.forEach(provider => {
    initSidebarProvider(provider);
  });
  
  // Luego inicializar sidebars
  const sidebars = document.querySelectorAll('[data-slot="sidebar"], .sidebar');
  sidebars.forEach(sidebar => {
    initSidebar(sidebar);
  });
  
  // Inicializar triggers
  const triggers = document.querySelectorAll('[data-slot="sidebar-trigger"], .sidebar-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const wrapper = trigger.closest('[data-slot="sidebar-wrapper"], .sidebar-wrapper');
      if (wrapper?._sidebarProviderApi) {
        wrapper._sidebarProviderApi.toggleSidebar();
      }
    });
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSidebars);
} else {
  initSidebars();
}

