/**
 * use-mobile.js - Vanilla JS Implementation
 * Adaptación del hook useIsMobile de React
 * Detecta si el viewport es móvil basándose en un breakpoint
 */

const MOBILE_BREAKPOINT = 768;

/**
 * Detecta si el viewport actual es móvil
 * @returns {boolean} - true si el ancho es menor a MOBILE_BREAKPOINT
 */
export function isMobile() {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.innerWidth < MOBILE_BREAKPOINT;
}

/**
 * Crea un observador de cambios en el tamaño de ventana que detecta móvil
 * @param {Function} callback - Función que se ejecuta cuando cambia el estado
 * @returns {Function} - Función para limpiar el listener
 */
export function watchIsMobile(callback) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  
  const onChange = () => {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    callback(mobile);
  };
  
  // Ejecutar inmediatamente
  onChange();
  
  // Escuchar cambios
  mql.addEventListener('change', onChange);
  
  // También escuchar resize para mayor precisión
  window.addEventListener('resize', onChange);
  
  // Retornar función de limpieza
  return () => {
    mql.removeEventListener('change', onChange);
    window.removeEventListener('resize', onChange);
  };
}

/**
 * Crea un observador reactivo que actualiza elementos cuando cambia el estado móvil
 * @param {HTMLElement|string} elementOrSelector - Elemento o selector CSS
 * @param {Object} options - Opciones de configuración
 * @param {string} options.mobileClass - Clase CSS a agregar cuando es móvil (default: 'is-mobile')
 * @param {string} options.desktopClass - Clase CSS a agregar cuando es desktop (default: 'is-desktop')
 * @param {string} options.attribute - Nombre del atributo data a actualizar (default: 'data-is-mobile')
 * @returns {Function} - Función para limpiar el observer
 */
export function initMobileObserver(elementOrSelector, options = {}) {
  const {
    mobileClass = 'is-mobile',
    desktopClass = 'is-desktop',
    attribute = 'data-is-mobile'
  } = options;

  const element = typeof elementOrSelector === 'string'
    ? document.querySelector(elementOrSelector)
    : elementOrSelector;

  if (!element) {
    console.warn('use-mobile: Element not found', elementOrSelector);
    return () => {};
  }

  function updateElement(isMobileState) {
    if (isMobileState) {
      element.classList.add(mobileClass);
      element.classList.remove(desktopClass);
      element.setAttribute(attribute, 'true');
    } else {
      element.classList.remove(mobileClass);
      element.classList.add(desktopClass);
      element.setAttribute(attribute, 'false');
    }
  }

  return watchIsMobile(updateElement);
}

/**
 * Inicializa observadores móviles para todos los elementos con el atributo data-mobile-observer
 */
export function initAllMobileObservers() {
  const elements = document.querySelectorAll('[data-mobile-observer]');
  
  elements.forEach(element => {
    const options = {
      mobileClass: element.getAttribute('data-mobile-class') || 'is-mobile',
      desktopClass: element.getAttribute('data-desktop-class') || 'is-desktop',
      attribute: element.getAttribute('data-mobile-attribute') || 'data-is-mobile'
    };
    
    initMobileObserver(element, options);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllMobileObservers);
  } else {
    initAllMobileObservers();
  }
}

// Exportar como función global si se necesita
if (typeof window !== 'undefined') {
  window.isMobile = isMobile;
  window.watchIsMobile = watchIsMobile;
  window.initMobileObserver = initMobileObserver;
}

