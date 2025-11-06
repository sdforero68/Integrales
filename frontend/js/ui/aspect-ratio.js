/**
 * AspectRatio Component - Vanilla JS Implementation
 * Adaptación del componente AspectRatio de React/Radix UI
 */

/**
 * Calcula el porcentaje de padding-bottom basado en una relación de aspecto
 * @param {string} ratio - Relación de aspecto en formato "width/height" (ej: "16/9")
 * @returns {number} Porcentaje de padding-bottom
 */
function calculateAspectRatioPercent(ratio) {
  const [width, height] = ratio.split('/').map(Number);
  if (!width || !height) return 100;
  return (height / width) * 100;
}

/**
 * Inicializa todos los aspect-ratio con data-aspect-ratio personalizado
 */
export function initAspectRatios() {
  const aspectRatios = document.querySelectorAll('.aspect-ratio[data-aspect-ratio]');
  
  aspectRatios.forEach((element) => {
    const ratio = element.getAttribute('data-aspect-ratio');
    if (!ratio) return;
    
    // Validar formato (debe ser "width/height")
    if (!ratio.match(/^\d+\/\d+$/)) {
      console.warn(`Invalid aspect ratio format: ${ratio}. Expected format: "width/height"`);
      return;
    }
    
    // Calcular y establecer CSS variables
    const percent = calculateAspectRatioPercent(ratio);
    element.style.setProperty('--aspect-ratio', ratio);
    element.style.setProperty('--aspect-ratio-percent', `${percent}%`);
    
    // Para navegadores que no soportan aspect-ratio, usar padding-bottom
    if (!CSS.supports('aspect-ratio', '1')) {
      const firstChild = element.firstElementChild;
      if (firstChild && !firstChild.style.position) {
        firstChild.style.position = 'absolute';
        firstChild.style.top = '0';
        firstChild.style.left = '0';
        firstChild.style.width = '100%';
        firstChild.style.height = '100%';
        firstChild.style.objectFit = 'cover';
      }
    }
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAspectRatios);
} else {
  initAspectRatios();
}

