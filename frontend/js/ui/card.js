/**
 * Card Component - Vanilla JS Implementation
 * Adaptación del componente Card de React
 * 
 * Nota: Este componente es principalmente presentacional y funciona
 * con HTML y CSS. Se ajusta automáticamente cuando hay card-action.
 */

/**
 * Inicializa todos los cards en la página
 */
export function initCards() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach((card) => {
    const header = card.querySelector('.card-header');
    
    if (header) {
      // Detectar si tiene card-action y ajustar grid
      const action = header.querySelector('[data-slot="card-action"], .card-action');
      if (action) {
        header.classList.add('card-header-with-action');
      }
    }
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCards);
} else {
  initCards();
}

