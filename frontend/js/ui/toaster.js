/**
 * Toaster Component - Vanilla JS Implementation
 * Adaptación del componente Toaster de Sonner
 */

let toasterContainer = null;
let toastIdCounter = 0;

/**
 * Crea el contenedor del toaster si no existe
 */
function ensureToasterContainer(position = 'top-right') {
  if (!toasterContainer) {
    toasterContainer = document.createElement('div');
    toasterContainer.setAttribute('data-slot', 'toaster');
    toasterContainer.className = 'toaster';
    toasterContainer.setAttribute('data-position', position);
    document.body.appendChild(toasterContainer);
  } else {
    toasterContainer.setAttribute('data-position', position);
  }
  return toasterContainer;
}

/**
 * Crea un toast
 * @param {string|Object|Promise} messageOrOptions - Mensaje, opciones o promesa
 * @param {Object} options - Opciones del toast (si el primer parámetro es string)
 * @returns {string|Promise} ID del toast o promesa
 */
export function toast(messageOrOptions = {}, options = {}) {
  // Si es una promesa, manejar loading/success/error automáticamente
  if (messageOrOptions instanceof Promise) {
    return handlePromiseToast(messageOrOptions, options);
  }
  
  // Si es un string, usarlo como mensaje
  let finalOptions;
  if (typeof messageOrOptions === 'string') {
    finalOptions = { ...options, description: messageOrOptions };
  } else {
    finalOptions = { ...messageOrOptions };
  }
  
  const {
    title,
    description,
    type = 'default',
    duration = 2000,
    position = 'top-right',
    action,
    actionLabel,
    onActionClick,
    onClose,
    jsx,
    html,
    className
  } = finalOptions;
  
  ensureToasterContainer(position);
  
  const toastId = `toast-${++toastIdCounter}`;
  const toastElement = document.createElement('div');
  toastElement.setAttribute('data-slot', 'toast');
  toastElement.className = `toast${className ? ' ' + className : ''}`;
  toastElement.setAttribute('data-type', type);
  toastElement.setAttribute('id', toastId);
  toastElement.setAttribute('data-state', 'entering');
  
  // Contenido del toast
  const content = document.createElement('div');
  content.className = 'toast-content';
  
  // Si hay HTML personalizado, usarlo
  if (html) {
    content.innerHTML = html;
  } else if (jsx || typeof jsx === 'function') {
    // Para JSX-like, podemos aceptar una función que retorne HTML
    if (typeof jsx === 'function') {
      content.innerHTML = jsx();
    } else {
      content.innerHTML = jsx;
    }
  } else {
    // Contenido estándar
    if (title) {
      const titleElement = document.createElement('div');
      titleElement.className = 'toast-title';
      titleElement.textContent = title;
      content.appendChild(titleElement);
    }
    
    if (description) {
      const descElement = document.createElement('div');
      descElement.className = 'toast-description';
      descElement.textContent = description;
      content.appendChild(descElement);
    }
  }
  
  toastElement.appendChild(content);
  
  // Icono según el tipo
  if (type !== 'default') {
    const icon = document.createElement('div');
    icon.className = 'toast-icon';
    
    if (type === 'loading') {
      icon.innerHTML = '<div class="toast-loading"></div>';
    } else {
      icon.innerHTML = getIconForType(type);
    }
    
    toastElement.insertBefore(icon, content);
  }
  
  // Botón de acción
  const actionText = actionLabel || action;
  if (actionText) {
    const actionButton = document.createElement('button');
    actionButton.className = 'toast-action';
    actionButton.textContent = actionText;
    actionButton.addEventListener('click', () => {
      if (onActionClick) {
        onActionClick();
      }
      dismissToast(toastId);
    });
    toastElement.appendChild(actionButton);
  }
  
  // Botón de cerrar (no mostrar en loading)
  if (type !== 'loading') {
    const closeButton = document.createElement('button');
    closeButton.className = 'toast-close';
    closeButton.setAttribute('aria-label', 'Cerrar');
    closeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    closeButton.addEventListener('click', () => {
      dismissToast(toastId);
      if (onClose) {
        onClose();
      }
    });
    toastElement.appendChild(closeButton);
  }
  
  // Agregar al contenedor
  toasterContainer.appendChild(toastElement);
  
  // Animar entrada
  setTimeout(() => {
    toastElement.setAttribute('data-state', 'visible');
  }, 10);
  
  // Auto-dismiss (no en loading)
  if (duration > 0 && type !== 'loading') {
    const timeoutId = setTimeout(() => {
      dismissToast(toastId);
    }, duration);
    
    // Guardar timeout para poder cancelarlo
    toastElement._timeoutId = timeoutId;
  }
  
  return toastId;
}

/**
 * Maneja un toast con promesa (loading -> success/error)
 */
function handlePromiseToast(promise, options = {}) {
  const loadingToastId = toast({
    ...options,
    type: 'loading',
    description: options.loading || 'Cargando...',
    duration: 0 // No auto-dismiss en loading
  });
  
  promise
    .then((result) => {
      dismissToast(loadingToastId);
      
      const successMessage = options.success || 
                            (typeof result === 'string' ? result : 'Operación exitosa');
      
      return toast({
        ...options,
        type: 'success',
        description: successMessage,
        duration: options.successDuration || 4000
      });
    })
    .catch((error) => {
      dismissToast(loadingToastId);
      
      const errorMessage = options.error || 
                          error?.message || 
                          'Algo salió mal';
      
      return toast({
        ...options,
        type: 'error',
        description: errorMessage,
        duration: options.errorDuration || 5000
      });
    });
  
  return promise;
}

/**
 * Obtiene el icono SVG según el tipo
 */
function getIconForType(type) {
  const icons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>`
  };
  
  return icons[type] || '';
}

/**
 * Descartar un toast
 */
export function dismissToast(toastId) {
  const toastElement = document.getElementById(toastId);
  if (!toastElement) return;
  
  // Cancelar timeout si existe
  if (toastElement._timeoutId) {
    clearTimeout(toastElement._timeoutId);
  }
  
  toastElement.setAttribute('data-state', 'exiting');
  
  setTimeout(() => {
    if (toastElement.parentElement) {
      toastElement.parentElement.removeChild(toastElement);
    }
    
    // Si no hay más toasts, limpiar el contenedor
    if (toasterContainer && toasterContainer.children.length === 0) {
      toasterContainer.remove();
      toasterContainer = null;
    }
  }, 200);
}

/**
 * Descartar todos los toasts
 */
export function dismissAllToasts() {
  if (!toasterContainer) return;
  
  const toasts = Array.from(toasterContainer.children);
  toasts.forEach(toast => {
    const toastId = toast.id;
    if (toastId) {
      dismissToast(toastId);
    }
  });
}

/**
 * Métodos de conveniencia para diferentes tipos de toast
 * Similar a la API de Sonner
 */
export const toastApi = {
  success: (message, options = {}) => {
    if (typeof message === 'string') {
      return toast({ ...options, description: message, type: 'success' });
    }
    return toast({ ...message, type: 'success' });
  },
  
  error: (message, options = {}) => {
    if (typeof message === 'string') {
      return toast({ ...options, description: message, type: 'error' });
    }
    return toast({ ...message, type: 'error' });
  },
  
  warning: (message, options = {}) => {
    if (typeof message === 'string') {
      return toast({ ...options, description: message, type: 'warning' });
    }
    return toast({ ...message, type: 'warning' });
  },
  
  info: (message, options = {}) => {
    if (typeof message === 'string') {
      return toast({ ...options, description: message, type: 'info' });
    }
    return toast({ ...message, type: 'info' });
  },
  
  loading: (message = 'Cargando...', options = {}) => {
    if (typeof message === 'string') {
      return toast({ ...options, description: message, type: 'loading', duration: 0 });
    }
    return toast({ ...message, type: 'loading', duration: 0 });
  },
  
  promise: (promise, options = {}) => {
    return handlePromiseToast(promise, options);
  },
  
  message: (message, options = {}) => {
    return toast(message, options);
  },
  
  custom: (html, options = {}) => {
    return toast({ ...options, html });
  },
  
  dismiss: dismissToast,
  dismissAll: dismissAllToasts
};

/**
 * Inicializa el toaster
 */
export function initToaster() {
  // El toaster se crea automáticamente cuando se llama a toast()
  // Solo necesitamos asegurarnos de que esté disponible globalmente
  if (typeof window !== 'undefined') {
    window.toast = toast;
    window.toastApi = toastApi;
    window.dismissToast = dismissToast;
    window.dismissAllToasts = dismissAllToasts;
    
    // Alias para compatibilidad con Sonner
    window.toast.success = toastApi.success;
    window.toast.error = toastApi.error;
    window.toast.warning = toastApi.warning;
    window.toast.info = toastApi.info;
    window.toast.loading = toastApi.loading;
    window.toast.promise = toastApi.promise;
    window.toast.custom = toastApi.custom;
    window.toast.dismiss = dismissToast;
    window.toast.dismissAll = dismissAllToasts;
  }
}

// Inicializar automáticamente cuando el DOM esté listo
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToaster);
  } else {
    initToaster();
  }
}

