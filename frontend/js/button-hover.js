// Script para aplicar efecto hover a todos los botones con fondo terracota
(function() {
  'use strict';
  
  // Color terracota en diferentes formatos
  const terracotaColors = [
    'rgba(197, 101, 53, 1)',
    'rgb(197, 101, 53)',
    '#c56535',
    'var(--color-primary)'
  ];
  
  // Función para verificar si un elemento tiene fondo terracota
  function hasTerracotaBackground(element) {
    if (!element) return false;
    
    // Verificar estilo inline
    const inlineStyle = element.getAttribute('style') || '';
    if (inlineStyle.includes('var(--color-primary)') || 
        inlineStyle.includes('c56535') ||
        inlineStyle.includes('197, 101, 53') ||
        inlineStyle.includes('background-color: var(--color-primary)') ||
        inlineStyle.includes('background: var(--color-primary)')) {
      return true;
    }
    
    // Verificar clase
    const classList = element.classList;
    if (classList.contains('btn-primary') || 
        classList.contains('btn-terracota') ||
        classList.contains('btn-accent') ||
        Array.from(classList).some(cls => cls.includes('btn-primary') || cls.includes('btn-accent'))) {
      return true;
    }
    
    // Verificar estilo computado - comparar con el valor real de la variable CSS
    const computedStyle = window.getComputedStyle(element);
    const bgColor = computedStyle.backgroundColor;
    
    // El color terracota es rgb(197, 101, 53)
    if (bgColor && (bgColor.includes('197, 101, 53') || bgColor.includes('rgb(197, 101, 53)'))) {
      return true;
    }
    
    // Verificar si tiene var(--color-primary) en background
    if (inlineStyle.includes('var(--color-primary)')) {
      return true;
    }
    
    return false;
  }
  
  // Función para aplicar el efecto hover
  function applyHoverEffect(element) {
    if (hasTerracotaBackground(element)) {
      element.classList.add('btn-terracota');
      
      // Agregar event listeners para hover
      element.addEventListener('mouseenter', function() {
        if (!this.disabled) {
          this.style.background = 'var(--color-tertiary)';
          this.style.transform = 'translateY(-4px) scale(1.05)';
          this.style.boxShadow = '0 8px 20px rgba(197, 101, 53, 0.5)';
        }
      });
      
      element.addEventListener('mouseleave', function() {
        if (!this.disabled) {
          // Restaurar el estilo original
          const originalBg = this.getAttribute('data-original-bg') || 'var(--color-primary)';
          this.style.background = originalBg;
          this.style.transform = '';
          this.style.boxShadow = '';
        }
      });
      
      element.addEventListener('mousedown', function() {
        if (!this.disabled) {
          this.style.transform = 'translateY(-2px) scale(1.02)';
        }
      });
      
      element.addEventListener('mouseup', function() {
        if (!this.disabled) {
          this.style.transform = 'translateY(-4px) scale(1.05)';
        }
      });
    }
  }
  
  // Función para procesar todos los botones
  function processAllButtons() {
    // Buscar todos los botones
    const buttons = document.querySelectorAll('button, [type="button"], [type="submit"], .btn, [class*="btn"]');
    
    buttons.forEach(button => {
      // Guardar el background original
      const computedStyle = window.getComputedStyle(button);
      const bgColor = computedStyle.backgroundColor;
      
      if (bgColor && !button.getAttribute('data-original-bg')) {
        button.setAttribute('data-original-bg', bgColor);
      }
      
      // Aplicar efecto si tiene fondo terracota
      applyHoverEffect(button);
    });
  }
  
  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processAllButtons);
  } else {
    processAllButtons();
  }
  
  // Observar cambios en el DOM para botones dinámicos
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'BUTTON' || node.classList.contains('btn') || node.getAttribute('type') === 'button' || node.getAttribute('type') === 'submit') {
            applyHoverEffect(node);
          }
          // Buscar botones dentro del nodo
          const buttons = node.querySelectorAll ? node.querySelectorAll('button, [type="button"], [type="submit"], .btn, [class*="btn"]') : [];
          buttons.forEach(applyHoverEffect);
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

