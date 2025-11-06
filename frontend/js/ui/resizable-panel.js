/**
 * ResizablePanelGroup Component - Vanilla JS Implementation
 * Adaptación del componente ResizablePanelGroup de React (react-resizable-panels)
 */

/**
 * Inicializa un resizable panel group individual
 * @param {HTMLElement} panelGroupElement - Elemento contenedor del panel group
 */
export function initResizablePanelGroup(panelGroupElement) {
  const panels = panelGroupElement.querySelectorAll('[data-slot="resizable-panel"], .resizable-panel');
  const handles = panelGroupElement.querySelectorAll('[data-slot="resizable-handle"], .resizable-handle');
  
  if (panels.length === 0) {
    console.warn('ResizablePanelGroup: No panels found');
    return;
  }
  
  // Obtener dirección
  const direction = panelGroupElement.getAttribute('data-panel-group-direction') || 
                   panelGroupElement.getAttribute('direction') || 
                   'horizontal';
  panelGroupElement.setAttribute('data-panel-group-direction', direction);
  
  // Aplicar dirección a los handles
  handles.forEach(handle => {
    handle.setAttribute('data-panel-group-direction', direction);
  });
  
  const isVertical = direction === 'vertical';
  
  // Función para obtener el tamaño del grupo
  function getGroupSize() {
    if (isVertical) {
      return panelGroupElement.offsetHeight;
    }
    return panelGroupElement.offsetWidth;
  }
  
  // Función para obtener la posición del mouse en el grupo
  function getMousePosition(e) {
    const rect = panelGroupElement.getBoundingClientRect();
    if (isVertical) {
      return e.clientY - rect.top;
    }
    return e.clientX - rect.left;
  }
  
  // Inicializar cada handle
  handles.forEach((handle, handleIndex) => {
    const panelBefore = panels[handleIndex];
    const panelAfter = panels[handleIndex + 1];
    
    if (!panelBefore || !panelAfter) return;
    
    let isDragging = false;
    let startPosition = 0;
    let startSizeBefore = 0;
    let startSizeAfter = 0;
    
    // Función para obtener el tamaño de un panel
    function getPanelSize(panel) {
      if (isVertical) {
        return panel.offsetHeight;
      }
      return panel.offsetWidth;
    }
    
    // Función para establecer el tamaño de un panel
    function setPanelSize(panel, size) {
      if (isVertical) {
        panel.style.height = `${size}px`;
        panel.style.flexShrink = '0';
      } else {
        panel.style.width = `${size}px`;
        panel.style.flexShrink = '0';
      }
    }
    
    // Función para obtener el tamaño mínimo
    function getMinSize(panel) {
      const minSize = parseFloat(panel.getAttribute('data-min-size') || '0');
      return minSize > 0 ? minSize : (isVertical ? 50 : 100); // Default mínimo
    }
    
    // Función para obtener el tamaño máximo
    function getMaxSize(panel) {
      const maxSize = parseFloat(panel.getAttribute('data-max-size') || '0');
      return maxSize > 0 ? maxSize : Infinity;
    }
    
    // Función para iniciar el arrastre
    function startDrag(e) {
      e.preventDefault();
      isDragging = true;
      startPosition = getMousePosition(e);
      startSizeBefore = getPanelSize(panelBefore);
      startSizeAfter = getPanelSize(panelAfter);
      
      handle.setAttribute('data-dragging', 'true');
      document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize';
      document.body.style.userSelect = 'none';
      
      // Dispatch event
      panelGroupElement.dispatchEvent(new CustomEvent('resizable-start', {
        detail: { handle, panelBefore, panelAfter },
        bubbles: true
      }));
    }
    
    // Función para arrastrar
    function drag(e) {
      if (!isDragging) return;
      
      const currentPosition = getMousePosition(e);
      const delta = currentPosition - startPosition;
      
      let newSizeBefore = startSizeBefore + delta;
      let newSizeAfter = startSizeAfter - delta;
      
      // Aplicar límites mínimos y máximos
      const minSizeBefore = getMinSize(panelBefore);
      const maxSizeBefore = getMaxSize(panelBefore);
      const minSizeAfter = getMinSize(panelAfter);
      const maxSizeAfter = getMaxSize(panelAfter);
      
      // Ajustar si excede los límites
      if (newSizeBefore < minSizeBefore) {
        newSizeBefore = minSizeBefore;
        newSizeAfter = startSizeBefore + startSizeAfter - minSizeBefore;
      }
      
      if (newSizeBefore > maxSizeBefore) {
        newSizeBefore = maxSizeBefore;
        newSizeAfter = startSizeBefore + startSizeAfter - maxSizeBefore;
      }
      
      if (newSizeAfter < minSizeAfter) {
        newSizeAfter = minSizeAfter;
        newSizeBefore = startSizeBefore + startSizeAfter - minSizeAfter;
      }
      
      if (newSizeAfter > maxSizeAfter) {
        newSizeAfter = maxSizeAfter;
        newSizeBefore = startSizeBefore + startSizeAfter - maxSizeAfter;
      }
      
      // Aplicar nuevos tamaños
      setPanelSize(panelBefore, newSizeBefore);
      setPanelSize(panelAfter, newSizeAfter);
      
      // Dispatch event
      panelGroupElement.dispatchEvent(new CustomEvent('resizable-resize', {
        detail: { 
          handle, 
          panelBefore, 
          panelAfter,
          sizeBefore: newSizeBefore,
          sizeAfter: newSizeAfter
        },
        bubbles: true
      }));
    }
    
    // Función para terminar el arrastre
    function endDrag() {
      if (!isDragging) return;
      
      isDragging = false;
      handle.removeAttribute('data-dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // Dispatch event
      panelGroupElement.dispatchEvent(new CustomEvent('resizable-end', {
        detail: { handle, panelBefore, panelAfter },
        bubbles: true
      }));
    }
    
    // Event listeners
    handle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    // Prevenir que el texto se seleccione durante el arrastre
    handle.addEventListener('selectstart', (e) => {
      if (isDragging) {
        e.preventDefault();
      }
    });
  });
  
  // Función auxiliar para obtener el tamaño de un panel
  function getPanelSize(panel) {
    if (isVertical) {
      return panel.offsetHeight;
    }
    return panel.offsetWidth;
  }
  
  // Inicializar tamaños si no están establecidos
  if (panels.length > 0) {
    const groupSize = getGroupSize();
    const defaultSize = groupSize / panels.length;
    
    panels.forEach((panel, index) => {
      const hasExplicitSize = isVertical 
        ? panel.style.height && panel.style.height !== 'auto'
        : panel.style.width && panel.style.width !== 'auto';
      
      if (!hasExplicitSize) {
        if (isVertical) {
          panel.style.height = `${defaultSize}px`;
        } else {
          panel.style.width = `${defaultSize}px`;
        }
        panel.style.flexShrink = '0';
      }
    });
  }
  
  // Guardar métodos
  panelGroupElement._resizablePanelGroupApi = {
    direction,
    getPanels: () => Array.from(panels),
    getHandles: () => Array.from(handles),
    reset: () => {
      const groupSize = getGroupSize();
      const defaultSize = groupSize / panels.length;
      panels.forEach(panel => {
        if (isVertical) {
          panel.style.height = `${defaultSize}px`;
        } else {
          panel.style.width = `${defaultSize}px`;
        }
      });
    }
  };
}

/**
 * Inicializa todos los resizable panel groups en la página
 */
export function initResizablePanelGroups() {
  const panelGroups = document.querySelectorAll('[data-slot="resizable-panel-group"], .resizable-panel-group');
  
  panelGroups.forEach((panelGroup) => {
    initResizablePanelGroup(panelGroup);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initResizablePanelGroups);
} else {
  initResizablePanelGroups();
}

