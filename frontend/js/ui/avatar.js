/**
 * Avatar Component - Vanilla JS Implementation
 * Adaptación del componente Avatar de React/Radix UI
 */

/**
 * Obtiene las iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} Iniciales (máximo 2 caracteres)
 */
function getInitials(name) {
  if (!name) return '?';
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Inicializa todos los avatares en la página
 */
export function initAvatars() {
  const avatars = document.querySelectorAll('.avatar');
  
  avatars.forEach((avatar) => {
    const image = avatar.querySelector('.avatar-image, img');
    const fallback = avatar.querySelector('.avatar-fallback');
    
    if (!image || !fallback) return;
    
    // Ocultar fallback inicialmente si hay imagen
    if (image.src && image.src !== window.location.href) {
      fallback.style.display = 'none';
    }
    
    // Manejar error de carga de imagen
    image.addEventListener('error', () => {
      image.style.display = 'none';
      fallback.style.display = 'flex';
      
      // Si el fallback no tiene contenido, generar iniciales del alt o data-name
      if (!fallback.textContent.trim()) {
        const name = image.getAttribute('alt') || 
                     image.getAttribute('data-name') || 
                     avatar.getAttribute('data-name') || 
                     '?';
        fallback.textContent = getInitials(name);
      }
    });
    
    // Manejar carga exitosa de imagen
    image.addEventListener('load', () => {
      image.style.display = 'block';
      fallback.style.display = 'none';
    });
    
    // Si la imagen ya falló (verificar si src está vacío o es inválido)
    if (!image.src || image.complete && image.naturalHeight === 0) {
      image.style.display = 'none';
      fallback.style.display = 'flex';
      
      // Generar iniciales si no hay contenido
      if (!fallback.textContent.trim()) {
        const name = image.getAttribute('alt') || 
                     image.getAttribute('data-name') || 
                     avatar.getAttribute('data-name') || 
                     '?';
        fallback.textContent = getInitials(name);
      }
    }
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAvatars);
} else {
  initAvatars();
}

