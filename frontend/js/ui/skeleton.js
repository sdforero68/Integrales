/**
 * Skeleton Component - Vanilla JS Implementation
 * Adaptación del componente Skeleton de React
 */

/**
 * Inicializa un skeleton individual
 * @param {HTMLElement} skeletonElement - Elemento skeleton
 */
export function initSkeleton(skeletonElement) {
  // Aplicar clase si no existe
  if (!skeletonElement.classList.contains('skeleton')) {
    skeletonElement.classList.add('skeleton');
  }
  
  // Asegurar que tenga data-slot
  if (!skeletonElement.hasAttribute('data-slot')) {
    skeletonElement.setAttribute('data-slot', 'skeleton');
  }
}

/**
 * Inicializa todos los skeletons en la página
 */
export function initSkeletons() {
  const skeletons = document.querySelectorAll('[data-slot="skeleton"], .skeleton');
  
  skeletons.forEach((skeleton) => {
    initSkeleton(skeleton);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSkeletons);
} else {
  initSkeletons();
}

