// Animaciones sutiles para la página de catálogo
// Similar al estilo de Mercados Campesinos

document.addEventListener('DOMContentLoaded', () => {
  // Activar inmediatamente las animaciones fade-in-up sin esperar al scroll
  const fadeInElements = document.querySelectorAll('.animate-fade-in-up');
  fadeInElements.forEach((el) => {
    el.style.animationPlayState = 'running';
    el.style.opacity = '1';
  });

  // Asegurar que el grid de productos sea visible desde el inicio
  const grid = document.getElementById('catalog-grid');
  if (grid) {
    grid.style.opacity = '1';
    grid.style.visibility = 'visible';
  }
});
