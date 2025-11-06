/**
 * Tabs Component - Vanilla JS Implementation
 * Adaptación del componente Tabs de React/Radix UI
 */

/**
 * Inicializa un tabs individual
 * @param {HTMLElement} tabsElement - Elemento contenedor de los tabs
 */
function initSingleTabs(tabsElement) {
  const list = tabsElement.querySelector('[data-slot="tabs-list"], .tabs-list');
  const triggers = tabsElement.querySelectorAll('[data-slot="tabs-trigger"], .tabs-trigger');
  const contents = tabsElement.querySelectorAll('[data-slot="tabs-content"], .tabs-content');
  
  if (!list || triggers.length === 0) {
    console.warn('Tabs: List or triggers not found');
    return;
  }
  
  // Obtener valor por defecto
  let defaultValue = tabsElement.getAttribute('data-default-value') || 
                     tabsElement.getAttribute('default-value') ||
                     tabsElement.getAttribute('value');
  
  // Si no hay valor por defecto, usar el primer trigger
  if (!defaultValue && triggers.length > 0) {
    defaultValue = triggers[0].getAttribute('data-value') || 
                   triggers[0].getAttribute('value') ||
                   `tab-${0}`;
  }
  
  let currentValue = defaultValue;
  
  // Función para obtener el valor de un trigger
  function getTriggerValue(trigger) {
    return trigger.getAttribute('data-value') || 
           trigger.getAttribute('value') ||
           trigger.getAttribute('id') ||
           `tab-${Array.from(triggers).indexOf(trigger)}`;
  }
  
  // Función para obtener el contenido asociado a un trigger
  function getContentForTrigger(trigger) {
    const triggerValue = getTriggerValue(trigger);
    return Array.from(contents).find(content => {
      const contentValue = content.getAttribute('data-value') || 
                          content.getAttribute('value') ||
                          content.id ||
                          `content-${Array.from(contents).indexOf(content)}`;
      return contentValue === triggerValue;
    });
  }
  
  // Función para activar una pestaña
  function setActiveTab(value) {
    currentValue = value;
    
    // Actualizar triggers
    triggers.forEach(trigger => {
      const triggerValue = getTriggerValue(trigger);
      if (triggerValue === value) {
        trigger.setAttribute('data-state', 'active');
        trigger.setAttribute('aria-selected', 'true');
        trigger.setAttribute('tabindex', '0');
      } else {
        trigger.setAttribute('data-state', 'inactive');
        trigger.setAttribute('aria-selected', 'false');
        trigger.setAttribute('tabindex', '-1');
      }
    });
    
    // Actualizar contents
    contents.forEach(content => {
      const contentValue = content.getAttribute('data-value') || 
                          content.getAttribute('value') ||
                          content.id ||
                          `content-${Array.from(contents).indexOf(content)}`;
      if (contentValue === value) {
        content.setAttribute('data-state', 'active');
        content.setAttribute('aria-hidden', 'false');
      } else {
        content.setAttribute('data-state', 'inactive');
        content.setAttribute('aria-hidden', 'true');
      }
    });
    
    // Dispatch event
    tabsElement.dispatchEvent(new CustomEvent('tabs-change', {
      detail: { value: currentValue },
      bubbles: true
    }));
  }
  
  // Inicializar triggers
  triggers.forEach((trigger, index) => {
    const triggerValue = getTriggerValue(trigger);
    const content = getContentForTrigger(trigger);
    
    // Asegurar atributos ARIA
    trigger.setAttribute('role', 'tab');
    trigger.setAttribute('aria-controls', content ? (content.id || `content-${index}`) : '');
    trigger.setAttribute('tabindex', triggerValue === currentValue ? '0' : '-1');
    
    // Event listeners
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (trigger.getAttribute('disabled') !== 'true') {
        setActiveTab(triggerValue);
      }
    });
    
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (trigger.getAttribute('disabled') !== 'true') {
          setActiveTab(triggerValue);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const currentIndex = Array.from(triggers).indexOf(trigger);
        let nextIndex;
        
        if (e.key === 'ArrowLeft') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : triggers.length - 1;
        } else {
          nextIndex = currentIndex < triggers.length - 1 ? currentIndex + 1 : 0;
        }
        
        const nextTrigger = triggers[nextIndex];
        if (nextTrigger && nextTrigger.getAttribute('disabled') !== 'true') {
          const nextValue = getTriggerValue(nextTrigger);
          setActiveTab(nextValue);
          nextTrigger.focus();
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        const firstTrigger = triggers[0];
        if (firstTrigger && firstTrigger.getAttribute('disabled') !== 'true') {
          const firstValue = getTriggerValue(firstTrigger);
          setActiveTab(firstValue);
          firstTrigger.focus();
        }
      } else if (e.key === 'End') {
        e.preventDefault();
        const lastTrigger = triggers[triggers.length - 1];
        if (lastTrigger && lastTrigger.getAttribute('disabled') !== 'true') {
          const lastValue = getTriggerValue(lastTrigger);
          setActiveTab(lastValue);
          lastTrigger.focus();
        }
      }
    });
  });
  
  // Inicializar contents
  contents.forEach((content, index) => {
    const contentValue = content.getAttribute('data-value') || 
                        content.getAttribute('value') ||
                        content.id ||
                        `content-${index}`;
    
    // Asegurar atributos ARIA
    content.setAttribute('role', 'tabpanel');
    content.setAttribute('tabindex', '0');
    
    // Ocultar contenido que no está activo inicialmente
    if (contentValue !== currentValue) {
      content.setAttribute('data-state', 'inactive');
      content.setAttribute('aria-hidden', 'true');
    } else {
      content.setAttribute('data-state', 'active');
      content.setAttribute('aria-hidden', 'false');
    }
  });
  
  // Inicializar estado
  setActiveTab(currentValue);
  
  // Guardar métodos
  tabsElement._tabsApi = {
    getValue: () => currentValue,
    setValue: (value) => {
      setActiveTab(value);
    },
    getActiveTrigger: () => {
      return Array.from(triggers).find(t => getTriggerValue(t) === currentValue);
    },
    getActiveContent: () => {
      return Array.from(contents).find(c => {
        const contentValue = c.getAttribute('data-value') || 
                            c.getAttribute('value') ||
                            c.id;
        return contentValue === currentValue;
      });
    }
  };
}

/**
 * Inicializa todos los tabs en la página
 */
export function initTabs() {
  const tabs = document.querySelectorAll('[data-slot="tabs"], .tabs');
  
  tabs.forEach((tabsElement) => {
    initSingleTabs(tabsElement);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTabs);
} else {
  initTabs();
}

