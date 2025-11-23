// Animaciones sutiles para la página Nosotros
// Similar al estilo de Mercados Campesinos

document.addEventListener('DOMContentLoaded', () => {
  // Activar inmediatamente las animaciones fade-in-up del hero section
  const heroFadeElements = document.querySelectorAll('.hero-content.animate-fade-in-up, .hero-images.animate-fade-in-up');
  heroFadeElements.forEach((el) => {
    el.style.animationPlayState = 'running';
    el.style.opacity = '1';
  });

  // Configurar Intersection Observer para animaciones al hacer scroll (solo para elementos con animate-on-scroll)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar solo elementos con animate-on-scroll (para ingredientes y valores)
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => {
    observer.observe(el);
  });
});
