/**
 * ScrollArea Component - Vanilla JS Implementation
 * Adaptación del componente ScrollArea de React/Radix UI
 */

/**
 * Inicializa un scroll area individual
 * @param {HTMLElement} scrollAreaElement - Elemento contenedor del scroll area
 */
export function initScrollArea(scrollAreaElement) {
  const viewport = scrollAreaElement.querySelector('[data-slot="scroll-area-viewport"], .scroll-area-viewport');
  
  if (!viewport) {
    console.warn('ScrollArea: Viewport not found');
    return;
  }
  
  // Buscar o crear scrollbars
  let verticalScrollbar = scrollAreaElement.querySelector('[data-slot="scroll-area-scrollbar"][data-orientation="vertical"], .scroll-area-scrollbar[data-orientation="vertical"]');
  let horizontalScrollbar = scrollAreaElement.querySelector('[data-slot="scroll-area-scrollbar"][data-orientation="horizontal"], .scroll-area-scrollbar[data-orientation="horizontal"]');
  
  // Crear scrollbars si no existen
  if (!verticalScrollbar) {
    verticalScrollbar = document.createElement('div');
    verticalScrollbar.setAttribute('data-slot', 'scroll-area-scrollbar');
    verticalScrollbar.setAttribute('data-orientation', 'vertical');
    verticalScrollbar.className = 'scroll-area-scrollbar';
    verticalScrollbar.style.cssText = 'position: absolute; top: 0; right: 0; bottom: 0;';
    
    const thumb = document.createElement('div');
    thumb.setAttribute('data-slot', 'scroll-area-thumb');
    thumb.className = 'scroll-area-thumb';
    verticalScrollbar.appendChild(thumb);
    
    scrollAreaElement.appendChild(verticalScrollbar);
  }
  
  if (!horizontalScrollbar) {
    horizontalScrollbar = document.createElement('div');
    horizontalScrollbar.setAttribute('data-slot', 'scroll-area-scrollbar');
    horizontalScrollbar.setAttribute('data-orientation', 'horizontal');
    horizontalScrollbar.className = 'scroll-area-scrollbar';
    horizontalScrollbar.style.cssText = 'position: absolute; bottom: 0; left: 0; right: 0;';
    
    const thumb = document.createElement('div');
    thumb.setAttribute('data-slot', 'scroll-area-thumb');
    thumb.className = 'scroll-area-thumb';
    horizontalScrollbar.appendChild(thumb);
    
    scrollAreaElement.appendChild(horizontalScrollbar);
  }
  
  const verticalThumb = verticalScrollbar.querySelector('[data-slot="scroll-area-thumb"], .scroll-area-thumb');
  const horizontalThumb = horizontalScrollbar.querySelector('[data-slot="scroll-area-thumb"], .scroll-area-thumb');
  
  // Función para actualizar las barras de scroll
  function updateScrollbars() {
    const viewportRect = viewport.getBoundingClientRect();
    const scrollWidth = viewport.scrollWidth;
    const scrollHeight = viewport.scrollHeight;
    const clientWidth = viewportRect.width;
    const clientHeight = viewportRect.height;
    
    // Vertical scrollbar
    const needsVerticalScroll = scrollHeight > clientHeight;
    if (needsVerticalScroll) {
      verticalScrollbar.style.display = 'flex';
      const scrollRatio = clientHeight / scrollHeight;
      const thumbHeight = Math.max(20, clientHeight * scrollRatio);
      verticalThumb.style.height = `${thumbHeight}px`;
      verticalThumb.style.top = '0';
      verticalThumb.style.left = '0';
      verticalThumb.style.right = '0';
      
      const maxThumbTop = clientHeight - thumbHeight;
      const scrollTop = viewport.scrollTop;
      const maxScroll = scrollHeight - clientHeight;
      const thumbTop = maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbTop : 0;
      verticalThumb.style.transform = `translateY(${thumbTop}px)`;
    } else {
      verticalScrollbar.style.display = 'none';
    }
    
    // Horizontal scrollbar
    const needsHorizontalScroll = scrollWidth > clientWidth;
    if (needsHorizontalScroll) {
      horizontalScrollbar.style.display = 'flex';
      const scrollRatio = clientWidth / scrollWidth;
      const thumbWidth = Math.max(20, clientWidth * scrollRatio);
      horizontalThumb.style.width = `${thumbWidth}px`;
      horizontalThumb.style.top = '0';
      horizontalThumb.style.left = '0';
      horizontalThumb.style.bottom = '0';
      
      const maxThumbLeft = clientWidth - thumbWidth;
      const scrollLeft = viewport.scrollLeft;
      const maxScroll = scrollWidth - clientWidth;
      const thumbLeft = maxScroll > 0 ? (scrollLeft / maxScroll) * maxThumbLeft : 0;
      horizontalThumb.style.transform = `translateX(${thumbLeft}px)`;
    } else {
      horizontalScrollbar.style.display = 'none';
    }
  }
  
  // Manejar scroll del viewport
  viewport.addEventListener('scroll', updateScrollbars);
  
  // Manejar resize del viewport
  const resizeObserver = new ResizeObserver(updateScrollbars);
  resizeObserver.observe(viewport);
  resizeObserver.observe(scrollAreaElement);
  
  // Arrastrar thumb vertical
  let isDraggingVertical = false;
  let dragStartY = 0;
  let scrollStartTop = 0;
  
  function startVerticalDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    isDraggingVertical = true;
    dragStartY = e.clientY;
    scrollStartTop = viewport.scrollTop;
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    
    verticalThumb.style.cursor = 'grabbing';
  }
  
  function doVerticalDrag(e) {
    if (!isDraggingVertical) return;
    
    const deltaY = e.clientY - dragStartY;
    const viewportRect = viewport.getBoundingClientRect();
    const scrollHeight = viewport.scrollHeight;
    const clientHeight = viewportRect.height;
    const maxScroll = scrollHeight - clientHeight;
    const thumbHeight = parseFloat(verticalThumb.style.height) || 20;
    const maxThumbTop = clientHeight - thumbHeight;
    const scrollRatio = maxScroll / maxThumbTop;
    
    const newScrollTop = scrollStartTop + (deltaY * scrollRatio);
    viewport.scrollTop = Math.max(0, Math.min(maxScroll, newScrollTop));
  }
  
  function endVerticalDrag() {
    if (!isDraggingVertical) return;
    isDraggingVertical = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    verticalThumb.style.cursor = 'pointer';
  }
  
  verticalThumb.addEventListener('mousedown', startVerticalDrag);
  document.addEventListener('mousemove', doVerticalDrag);
  document.addEventListener('mouseup', endVerticalDrag);
  
  // Arrastrar thumb horizontal
  let isDraggingHorizontal = false;
  let dragStartX = 0;
  let scrollStartLeft = 0;
  
  function startHorizontalDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    isDraggingHorizontal = true;
    dragStartX = e.clientX;
    scrollStartLeft = viewport.scrollLeft;
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    
    horizontalThumb.style.cursor = 'grabbing';
  }
  
  function doHorizontalDrag(e) {
    if (!isDraggingHorizontal) return;
    
    const deltaX = e.clientX - dragStartX;
    const viewportRect = viewport.getBoundingClientRect();
    const scrollWidth = viewport.scrollWidth;
    const clientWidth = viewportRect.width;
    const maxScroll = scrollWidth - clientWidth;
    const thumbWidth = parseFloat(horizontalThumb.style.width) || 20;
    const maxThumbLeft = clientWidth - thumbWidth;
    const scrollRatio = maxScroll / maxThumbLeft;
    
    const newScrollLeft = scrollStartLeft + (deltaX * scrollRatio);
    viewport.scrollLeft = Math.max(0, Math.min(maxScroll, newScrollLeft));
  }
  
  function endHorizontalDrag() {
    if (!isDraggingHorizontal) return;
    isDraggingHorizontal = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    horizontalThumb.style.cursor = 'pointer';
  }
  
  horizontalThumb.addEventListener('mousedown', startHorizontalDrag);
  document.addEventListener('mousemove', doHorizontalDrag);
  document.addEventListener('mouseup', endHorizontalDrag);
  
  // Click en scrollbar para saltar
  verticalScrollbar.addEventListener('click', (e) => {
    if (e.target === verticalScrollbar || e.target === verticalScrollbar) {
      const rect = verticalScrollbar.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const viewportRect = viewport.getBoundingClientRect();
      const scrollHeight = viewport.scrollHeight;
      const clientHeight = viewportRect.height;
      const scrollRatio = clickY / clientHeight;
      viewport.scrollTop = scrollRatio * (scrollHeight - clientHeight);
    }
  });
  
  horizontalScrollbar.addEventListener('click', (e) => {
    if (e.target === horizontalScrollbar || e.target === horizontalScrollbar) {
      const rect = horizontalScrollbar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const viewportRect = viewport.getBoundingClientRect();
      const scrollWidth = viewport.scrollWidth;
      const clientWidth = viewportRect.width;
      const scrollRatio = clickX / clientWidth;
      viewport.scrollLeft = scrollRatio * (scrollWidth - clientWidth);
    }
  });
  
  // Inicializar
  updateScrollbars();
  
  // Guardar métodos
  scrollAreaElement._scrollAreaApi = {
    scrollTo: (options) => {
      if (options.top !== undefined) {
        viewport.scrollTop = options.top;
      }
      if (options.left !== undefined) {
        viewport.scrollLeft = options.left;
      }
      if (options.behavior) {
        viewport.scrollTo({
          top: options.top || viewport.scrollTop,
          left: options.left || viewport.scrollLeft,
          behavior: options.behavior
        });
      }
    },
    scrollToTop: () => {
      viewport.scrollTop = 0;
    },
    scrollToBottom: () => {
      viewport.scrollTop = viewport.scrollHeight;
    },
    getScrollTop: () => viewport.scrollTop,
    getScrollLeft: () => viewport.scrollLeft,
    update: updateScrollbars
  };
}

/**
 * Inicializa todos los scroll areas en la página
 */
export function initScrollAreas() {
  const scrollAreas = document.querySelectorAll('[data-slot="scroll-area"], .scroll-area');
  
  scrollAreas.forEach((scrollArea) => {
    initScrollArea(scrollArea);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAreas);
} else {
  initScrollAreas();
}

