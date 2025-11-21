// Animaciones dinámicas para la página Nosotros

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
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => {
    observer.observe(el);
  });

  // Agregar efectos de parallax suave a las imágenes
  const imageWrappers = document.querySelectorAll('.about-image-wrapper');
  imageWrappers.forEach(wrapper => {
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = (x - centerX) / 20;
      const moveY = (y - centerY) / 20;
      
      const img = wrapper.querySelector('img');
      if (img) {
        img.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
      }
    });
    
    wrapper.addEventListener('mouseleave', () => {
      const img = wrapper.querySelector('img');
      if (img) {
        img.style.transform = 'scale(1)';
      }
    });
  });

  // Efecto de contador animado para números (si se agregan en el futuro)
  const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start);
      }
    }, 16);
  };

  // Agregar efecto de "ripple" a las tarjetas al hacer click
  const cards = document.querySelectorAll('.ingredient-card, .value-card');
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});

// Agregar estilos para el efecto ripple
const style = document.createElement('style');
style.textContent = `
  .ingredient-card, .value-card {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(144, 171, 68, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

