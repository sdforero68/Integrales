/**
 * Pagination Component - Vanilla JS Implementation
 * Adaptación del componente Pagination de React
 * 
 * Nota: Este componente es principalmente CSS. El JavaScript
 * es mínimo y solo para asegurar accesibilidad y estados activos.
 */

/**
 * Inicializa todos los paginations en la página
 */
export function initPagination() {
  const paginations = document.querySelectorAll('[data-slot="pagination"], .pagination');
  
  paginations.forEach((pagination) => {
    const links = pagination.querySelectorAll('[data-slot="pagination-link"], .pagination-link');
    
    links.forEach((link) => {
      // Asegurar que los links activos tengan aria-current
      if (link.hasAttribute('data-active') && link.getAttribute('data-active') === 'true') {
        link.setAttribute('aria-current', 'page');
      }
      
      // Si es un link con href, manejar el click
      if (link.hasAttribute('href')) {
        link.addEventListener('click', (e) => {
          // Remover aria-current de otros links
          links.forEach(l => {
            l.removeAttribute('aria-current');
            l.setAttribute('data-active', 'false');
          });
          
          // Marcar este como activo
          link.setAttribute('aria-current', 'page');
          link.setAttribute('data-active', 'true');
          
          // Dispatch event
          pagination.dispatchEvent(new CustomEvent('pagination-change', {
            detail: { 
              page: link.getAttribute('href') || link.textContent.trim(),
              link 
            },
            bubbles: true
          }));
        });
      }
    });
    
    // Asegurar que previous/next tengan los atributos correctos
    const previous = pagination.querySelector('[data-slot="pagination-previous"], .pagination-previous, [aria-label="Go to previous page"]');
    const next = pagination.querySelector('[data-slot="pagination-next"], .pagination-next, [aria-label="Go to next page"]');
    
    if (previous && !previous.hasAttribute('aria-label')) {
      previous.setAttribute('aria-label', 'Go to previous page');
    }
    
    if (next && !next.hasAttribute('aria-label')) {
      next.setAttribute('aria-label', 'Go to next page');
    }
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPagination);
} else {
  initPagination();
}

