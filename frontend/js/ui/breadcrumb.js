/**
 * Breadcrumb Component - Vanilla JS Implementation
 * Adaptación del componente Breadcrumb de React/Radix UI
 * 
 * Nota: Este componente es principalmente presentacional y funciona
 * con HTML y CSS. No requiere funcionalidad JavaScript adicional.
 */

/**
 * Inicializa todos los breadcrumbs en la página
 * (Actualmente no requiere inicialización, pero se mantiene para consistencia)
 */
export function initBreadcrumbs() {
  // El breadcrumb es puramente presentacional
  // No requiere inicialización JavaScript
  const breadcrumbs = document.querySelectorAll('.breadcrumb');
  
  breadcrumbs.forEach((breadcrumb) => {
    // Asegurar que tenga aria-label si no lo tiene
    if (!breadcrumb.getAttribute('aria-label')) {
      breadcrumb.setAttribute('aria-label', 'breadcrumb');
    }
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBreadcrumbs);
} else {
  initBreadcrumbs();
}

