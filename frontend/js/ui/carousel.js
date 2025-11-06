/**
 * Carousel Component - Vanilla JS Implementation
 * Adaptación del componente Carousel de React (embla-carousel)
 */

/**
 * Inicializa un carousel individual
 * @param {HTMLElement} carouselElement - Elemento contenedor del carousel
 */
export function initCarousel(carouselElement) {
  const content = carouselElement.querySelector('[data-carousel-content]');
  const inner = content?.querySelector('.carousel-content-inner');
  const items = inner?.querySelectorAll('[data-carousel-item]');
  const prevButton = carouselElement.querySelector('[data-carousel-previous]');
  const nextButton = carouselElement.querySelector('[data-carousel-next]');
  
  if (!content || !inner || !items || items.length === 0) return;
  
  const orientation = carouselElement.getAttribute('data-carousel-orientation') || 'horizontal';
  const isVertical = orientation === 'vertical';
  
  // Agregar clases según orientación
  if (isVertical) {
    inner.classList.add('carousel-vertical');
    items.forEach(item => {
      item.classList.add('carousel-item-vertical');
      item.classList.remove('carousel-item-horizontal');
    });
  } else {
    inner.classList.add('carousel-horizontal');
    items.forEach(item => {
      item.classList.add('carousel-item-horizontal');
      item.classList.remove('carousel-item-vertical');
    });
  }
  
  let currentIndex = 0;
  
  // Calcular dimensiones del item (tamaño del contenedor)
  function getItemSize() {
    if (isVertical) {
      return content.offsetHeight;
    } else {
      return content.offsetWidth;
    }
  }
  
  function updateTransform() {
    const itemSize = getItemSize();
    const offset = currentIndex * itemSize;
    
    if (isVertical) {
      inner.style.transform = `translateY(-${offset}px)`;
    } else {
      inner.style.transform = `translateX(-${offset}px)`;
    }
    
    updateButtons();
  }
  
  function updateButtons() {
    const canScrollPrev = currentIndex > 0;
    const canScrollNext = currentIndex < items.length - 1;
    
    if (prevButton) {
      prevButton.disabled = !canScrollPrev;
    }
    
    if (nextButton) {
      nextButton.disabled = !canScrollNext;
    }
  }
  
  function scrollPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      updateTransform();
      
      // Dispatch event
      carouselElement.dispatchEvent(new CustomEvent('carousel-scroll', {
        detail: { index: currentIndex, direction: 'prev' }
      }));
    }
  }
  
  function scrollNext() {
    if (currentIndex < items.length - 1) {
      currentIndex++;
      updateTransform();
      
      // Dispatch event
      carouselElement.dispatchEvent(new CustomEvent('carousel-scroll', {
        detail: { index: currentIndex, direction: 'next' }
      }));
    }
  }
  
  function scrollTo(index) {
    if (index >= 0 && index < items.length) {
      currentIndex = index;
      updateTransform();
      
      carouselElement.dispatchEvent(new CustomEvent('carousel-scroll', {
        detail: { index: currentIndex, direction: 'to' }
      }));
    }
  }
  
  // Event listeners
  if (prevButton) {
    prevButton.addEventListener('click', scrollPrev);
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', scrollNext);
  }
  
  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (document.activeElement !== carouselElement && !carouselElement.contains(document.activeElement)) {
      return;
    }
    
    if (isVertical) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollNext();
      }
    } else {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollNext();
      }
    }
  };
  
  carouselElement.addEventListener('keydown', handleKeyDown);
  carouselElement.setAttribute('tabindex', '0');
  carouselElement.setAttribute('role', 'region');
  carouselElement.setAttribute('aria-roledescription', 'carousel');
  
  // Inicializar
  updateTransform();
  
  // Observar cambios de tamaño
  const resizeObserver = new ResizeObserver(() => {
    updateTransform();
  });
  
  resizeObserver.observe(content);
  resizeObserver.observe(inner);
  
  // Guardar métodos en el elemento para acceso externo
  carouselElement._carouselApi = {
    scrollPrev,
    scrollNext,
    scrollTo,
    getCurrentIndex: () => currentIndex,
    getItemsCount: () => items.length
  };
}

/**
 * Inicializa todos los carousels en la página
 */
export function initCarousels() {
  const carousels = document.querySelectorAll('[data-carousel]');
  
  carousels.forEach((carousel) => {
    initCarousel(carousel);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousels);
} else {
  initCarousels();
}

