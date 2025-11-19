document.addEventListener('DOMContentLoaded', () => {
  const carouselWrapper = document.querySelector('.categories-carousel-wrapper');
  if (!carouselWrapper) return;

  const track = carouselWrapper.querySelector('.categories-carousel-track');
  const prevBtn = carouselWrapper.querySelector('.carousel-btn-prev');
  const nextBtn = carouselWrapper.querySelector('.carousel-btn-next');
  const paginationDots = carouselWrapper.querySelectorAll('.pagination-dot');
  const cards = carouselWrapper.querySelectorAll('.category-carousel-card');

  if (!track || !prevBtn || !nextBtn || cards.length === 0) return;

  let currentPage = 0;
  const itemsPerPage = 3;
  const totalPages = Math.ceil(cards.length / itemsPerPage);

  // Calcular el ancho de cada card incluyendo el gap
  const updateCarousel = () => {
    const container = carouselWrapper.querySelector('.categories-carousel-container');
    if (!container) return;
    
    // Usar un pequeño delay para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
      // Obtener el ancho real del contenedor
      const containerWidth = container.getBoundingClientRect().width;
      
      // Obtener el gap real del CSS (2rem convertido a píxeles)
      const trackStyles = window.getComputedStyle(track);
      const gapValue = trackStyles.gap;
      let gap = 32; // Fallback a 32px
      
      if (gapValue) {
        // Si el gap está en rem, convertir a píxeles
        if (gapValue.includes('rem')) {
          const remValue = parseFloat(gapValue);
          const rootFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
          gap = remValue * rootFontSize;
        } else if (gapValue.includes('px')) {
          gap = parseFloat(gapValue);
        } else {
          gap = parseFloat(gapValue) || 32;
        }
      }
      
      // Calcular el ancho de cada card para que quepan exactamente 3 en el contenedor
      const cardWidth = (containerWidth - (gap * (itemsPerPage - 1))) / itemsPerPage;
      
      // Actualizar el ancho de cada card
      cards.forEach((card, index) => {
        card.style.width = `${cardWidth}px`;
        card.style.flexBasis = `${cardWidth}px`;
        card.style.minWidth = `${cardWidth}px`;
        card.style.maxWidth = `${cardWidth}px`;
        card.style.flexShrink = '0';
      });

      // Calcular el ancho de una página visible (3 cards + 2 gaps)
      // Este es el ancho real que ocupan las 3 cards con sus gaps
      const pageWidth = (cardWidth * itemsPerPage) + (gap * (itemsPerPage - 1));

      // Asegurar que el track tenga el ancho total necesario para todas las cards
      const totalWidth = (cardWidth * cards.length) + (gap * (cards.length - 1));
      track.style.width = `${totalWidth}px`;
      track.style.minWidth = `${totalWidth}px`;
      track.style.flexShrink = '0';

      // Calcular el desplazamiento basado en la posición real de las cards
      // Esto asegura que la primera card de cada página se alinee correctamente
      const firstCardIndex = currentPage * itemsPerPage;
      const firstCardOfPage = cards[firstCardIndex];
      
      if (firstCardOfPage) {
        // Obtener la posición relativa de la primera card respecto al track
        const cardOffset = firstCardOfPage.offsetLeft;
        track.style.transform = `translateX(-${cardOffset}px)`;
      } else {
        // Fallback al cálculo tradicional si no hay card
        const translateX = -(currentPage * pageWidth);
        track.style.transform = `translateX(${translateX}px)`;
      }
    }, 10);
  };

  const goToPage = (page) => {
    if (page < 0 || page >= totalPages) return;
    
    currentPage = page;
    updateCarousel();
    updatePagination();
    updateButtons();
  };

  const updatePagination = () => {
    paginationDots.forEach((dot, index) => {
      if (index === currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const updateButtons = () => {
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;
  };

  // Event listeners
  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  });

  paginationDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToPage(index);
    });
  });

  // Inicializar
  updateCarousel();
  updatePagination();
  updateButtons();

  // Actualizar en resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCarousel();
    }, 250);
  });
});

