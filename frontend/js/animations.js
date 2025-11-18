// Animaciones globales para todas las páginas
// Basado en las animaciones de la sección "Nosotros"

document.addEventListener('DOMContentLoaded', () => {
  // Configurar Intersection Observer para animaciones al hacer scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Una vez animado, dejar de observar para mejor rendimiento
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar elementos con animación
  const animatedElements = document.querySelectorAll('.animate-on-scroll, .slide-in-left, .slide-in-right, .fade-in-scale, .float-up');
  animatedElements.forEach(el => {
    observer.observe(el);
  });

  // Agregar efectos de hover mejorados a las tarjetas
  const cards = document.querySelectorAll('.card, .product-card, .market-card, .value-card, .ingredient-card');
  cards.forEach(card => {
    // Efecto de brillo al pasar el mouse
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });

  // Agregar efecto de "ripple" a las tarjetas al hacer click
  const clickableCards = document.querySelectorAll('.card, .product-card, .market-card, .value-card, .ingredient-card');
  clickableCards.forEach(card => {
    if (card.style.cursor === 'pointer' || card.onclick) {
      card.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          border-radius: 50%;
          background: rgba(212, 165, 116, 0.3);
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
          z-index: 1;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    }
  });
});

// Agregar estilos para el efecto ripple
if (!document.getElementById('ripple-styles')) {
  const style = document.createElement('style');
  style.id = 'ripple-styles';
  style.textContent = `
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

