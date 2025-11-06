/**
 * Alert Component - Vanilla JS Implementation
 * Adaptación del componente Alert de React
 * No requiere funcionalidad especial, solo detecta íconos automáticamente
 */

/**
 * Inicializa todos los alerts en la página
 */
export function initAlerts() {
  const alerts = document.querySelectorAll('.alert');
  
  alerts.forEach((alert) => {
    // Detectar si tiene un ícono SVG y agregar clase
    const hasIcon = alert.querySelector('svg');
    if (hasIcon) {
      alert.classList.add('alert-with-icon');
    }
    
    // Asegurar que tenga role="alert" para accesibilidad
    if (!alert.getAttribute('role')) {
      alert.setAttribute('role', 'alert');
    }
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAlerts);
} else {
  initAlerts();
}

