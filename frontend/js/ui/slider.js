/**
 * Slider Component - Vanilla JS Implementation
 * Adaptación del componente Slider de React/Radix UI
 */

/**
 * Inicializa un slider individual
 * @param {HTMLElement} sliderElement - Elemento contenedor del slider
 */
export function initSlider(sliderElement) {
  let track = sliderElement.querySelector('[data-slot="slider-track"], .slider-track');
  let range = sliderElement.querySelector('[data-slot="slider-range"], .slider-range');
  
  // Crear track si no existe
  if (!track) {
    track = document.createElement('div');
    track.setAttribute('data-slot', 'slider-track');
    track.className = 'slider-track';
    sliderElement.appendChild(track);
  }
  
  // Crear range si no existe
  if (!range) {
    range = document.createElement('div');
    range.setAttribute('data-slot', 'slider-range');
    range.className = 'slider-range';
    track.appendChild(range);
  }
  
  // Obtener configuración
  const min = parseFloat(sliderElement.getAttribute('data-min') || sliderElement.getAttribute('min') || '0');
  const max = parseFloat(sliderElement.getAttribute('data-max') || sliderElement.getAttribute('max') || '100');
  const step = parseFloat(sliderElement.getAttribute('data-step') || sliderElement.getAttribute('step') || '1');
  const orientation = sliderElement.getAttribute('data-orientation') || sliderElement.getAttribute('orientation') || 'horizontal';
  const disabled = sliderElement.getAttribute('data-disabled') === 'true' || sliderElement.hasAttribute('disabled');
  
  // Obtener valores iniciales
  let defaultValue = sliderElement.getAttribute('data-default-value');
  if (defaultValue) {
    try {
      defaultValue = JSON.parse(defaultValue);
    } catch {
      defaultValue = [parseFloat(defaultValue) || min];
    }
  } else {
    defaultValue = [min];
  }
  
  let values = defaultValue;
  const valueAttr = sliderElement.getAttribute('data-value');
  if (valueAttr) {
    try {
      values = JSON.parse(valueAttr);
    } catch {
      values = [parseFloat(valueAttr) || min];
    }
  }
  
  // Asegurar que values es un array
  if (!Array.isArray(values)) {
    values = [values];
  }
  
  // Normalizar valores
  values = values.map(v => Math.max(min, Math.min(max, v)));
  
  // Aplicar atributos
  sliderElement.setAttribute('data-orientation', orientation);
  sliderElement.setAttribute('data-min', min.toString());
  sliderElement.setAttribute('data-max', max.toString());
  sliderElement.setAttribute('data-step', step.toString());
  if (disabled) {
    sliderElement.setAttribute('data-disabled', 'true');
  }
  
  track.setAttribute('data-orientation', orientation);
  if (range) {
    range.setAttribute('data-orientation', orientation);
  }
  
  const isVertical = orientation === 'vertical';
  
  // Crear thumbs si no existen
  const existingThumbs = sliderElement.querySelectorAll('[data-slot="slider-thumb"], .slider-thumb');
  const thumbsToCreate = Math.max(1, values.length) - existingThumbs.length;
  
  for (let i = 0; i < thumbsToCreate; i++) {
    const thumb = document.createElement('div');
    thumb.setAttribute('data-slot', 'slider-thumb');
    thumb.className = 'slider-thumb';
    thumb.setAttribute('role', 'slider');
    thumb.setAttribute('tabindex', disabled ? '-1' : '0');
    thumb.setAttribute('aria-valuemin', min.toString());
    thumb.setAttribute('aria-valuemax', max.toString());
    if (disabled) {
      thumb.setAttribute('data-disabled', 'true');
    }
    sliderElement.appendChild(thumb);
  }
  
  const thumbs = Array.from(sliderElement.querySelectorAll('[data-slot="slider-thumb"], .slider-thumb'));
  
  // Función para obtener el tamaño del track
  function getTrackSize() {
    const rect = track.getBoundingClientRect();
    return isVertical ? rect.height : rect.width;
  }
  
  // Función para convertir valor a posición
  function valueToPosition(value) {
    const trackSize = getTrackSize();
    const thumbSize = 16; // 1rem = 16px
    const range = max - min;
    const position = ((value - min) / range) * (trackSize - thumbSize);
    return position;
  }
  
  // Función para convertir posición a valor
  function positionToValue(position) {
    const trackSize = getTrackSize();
    const thumbSize = 16;
    const range = max - min;
    const ratio = Math.max(0, Math.min(1, position / (trackSize - thumbSize)));
    const value = min + (ratio * range);
    return Math.round(value / step) * step;
  }
  
  // Función para actualizar las posiciones
  function updatePositions() {
    thumbs.forEach((thumb, index) => {
      const value = values[index] || min;
      const position = valueToPosition(value);
      
      if (isVertical) {
        thumb.style.bottom = `${position}px`;
        thumb.style.left = '50%';
        thumb.style.transform = 'translate(-50%, 50%)';
      } else {
        thumb.style.left = `${position}px`;
        thumb.style.top = '50%';
        thumb.style.transform = 'translate(-50%, -50%)';
      }
      
      thumb.setAttribute('aria-valuenow', value.toString());
      thumb.setAttribute('aria-label', `Value ${index + 1}: ${value}`);
    });
    
    // Actualizar range
    if (range && values.length > 0) {
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      const trackSize = getTrackSize();
      const thumbSize = 16;
      
      if (isVertical) {
        const minPos = valueToPosition(minValue);
        const maxPos = valueToPosition(maxValue);
        const rangeHeight = maxPos - minPos + thumbSize;
        range.style.bottom = `${minPos}px`;
        range.style.height = `${rangeHeight}px`;
        range.style.top = 'auto';
      } else {
        const minPos = valueToPosition(minValue);
        const maxPos = valueToPosition(maxValue);
        const rangeWidth = maxPos - minPos + thumbSize;
        range.style.left = `${minPos}px`;
        range.style.width = `${rangeWidth}px`;
      }
    }
  }
  
  // Inicializar posiciones
  updatePositions();
  
  // Arrastrar thumbs
  thumbs.forEach((thumb, index) => {
    let isDragging = false;
    let startPosition = 0;
    let startValue = 0;
    
    function startDrag(e) {
      if (disabled) return;
      e.preventDefault();
      isDragging = true;
      
      const rect = track.getBoundingClientRect();
      startPosition = isVertical 
        ? rect.bottom - e.clientY 
        : e.clientX - rect.left;
      startValue = values[index] || min;
      
      thumb.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      // Dispatch event
      sliderElement.dispatchEvent(new CustomEvent('slider-drag-start', {
        detail: { index, value: startValue },
        bubbles: true
      }));
    }
    
    function doDrag(e) {
      if (!isDragging) return;
      
      const rect = track.getBoundingClientRect();
      const currentPosition = isVertical 
        ? rect.bottom - e.clientY 
        : e.clientX - rect.left;
      
      const delta = currentPosition - startPosition;
      const trackSize = getTrackSize();
      const thumbSize = 16;
      const range = max - min;
      const deltaValue = (delta / (trackSize - thumbSize)) * range;
      
      let newValue = startValue + deltaValue;
      newValue = Math.max(min, Math.min(max, newValue));
      newValue = Math.round(newValue / step) * step;
      
      // Evitar que los thumbs se crucen
      if (index > 0 && newValue < values[index - 1]) {
        newValue = values[index - 1];
      }
      if (index < values.length - 1 && newValue > values[index + 1]) {
        newValue = values[index + 1];
      }
      
      values[index] = newValue;
      updatePositions();
      
      // Dispatch event
      sliderElement.dispatchEvent(new CustomEvent('slider-change', {
        detail: { values: [...values], index, value: newValue },
        bubbles: true
      }));
    }
    
    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      thumb.style.cursor = 'grab';
      document.body.style.userSelect = '';
      
      // Dispatch event
      sliderElement.dispatchEvent(new CustomEvent('slider-drag-end', {
        detail: { index, value: values[index] },
        bubbles: true
      }));
    }
    
    thumb.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', endDrag);
    
    // Navegación por teclado
    thumb.addEventListener('keydown', (e) => {
      if (disabled) return;
      
      const delta = e.shiftKey ? step * 10 : step;
      let newValue = values[index] || min;
      
      if (isVertical) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
          e.preventDefault();
          newValue = Math.min(max, newValue + delta);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
          e.preventDefault();
          newValue = Math.max(min, newValue - delta);
        }
      } else {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          newValue = Math.min(max, newValue + delta);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          newValue = Math.max(min, newValue - delta);
        }
      }
      
      if (newValue !== values[index]) {
        // Evitar que los thumbs se crucen
        if (index > 0 && newValue < values[index - 1]) {
          newValue = values[index - 1];
        }
        if (index < values.length - 1 && newValue > values[index + 1]) {
          newValue = values[index + 1];
        }
        
        values[index] = newValue;
        updatePositions();
        
        // Dispatch event
        sliderElement.dispatchEvent(new CustomEvent('slider-change', {
          detail: { values: [...values], index, value: newValue },
          bubbles: true
        }));
      }
    });
  });
  
  // Click en track para mover thumb más cercano
  track.addEventListener('click', (e) => {
    if (disabled) return;
    
    const rect = track.getBoundingClientRect();
    const clickPosition = isVertical 
      ? rect.bottom - e.clientY 
      : e.clientX - rect.left;
    
    const clickedValue = positionToValue(clickPosition);
    
    // Encontrar el thumb más cercano
    let closestIndex = 0;
    let minDistance = Math.abs(values[0] - clickedValue);
    
    values.forEach((value, index) => {
      const distance = Math.abs(value - clickedValue);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    values[closestIndex] = clickedValue;
    updatePositions();
    
    // Dispatch event
    sliderElement.dispatchEvent(new CustomEvent('slider-change', {
      detail: { values: [...values], index: closestIndex, value: clickedValue },
      bubbles: true
    }));
  });
  
  // Recalcular en resize
  const resizeObserver = new ResizeObserver(() => {
    updatePositions();
  });
  resizeObserver.observe(track);
  
  // Guardar métodos
  sliderElement._sliderApi = {
    getValues: () => [...values],
    setValues: (newValues) => {
      if (Array.isArray(newValues)) {
        values = newValues.map(v => Math.max(min, Math.min(max, v)));
      } else {
        values = [Math.max(min, Math.min(max, newValues))];
      }
      updatePositions();
    },
    getValue: () => values[0],
    setValue: (value) => {
      values[0] = Math.max(min, Math.min(max, value));
      updatePositions();
    }
  };
}

/**
 * Inicializa todos los sliders en la página
 */
export function initSliders() {
  const sliders = document.querySelectorAll('[data-slot="slider"], .slider');
  
  sliders.forEach((slider) => {
    initSlider(slider);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSliders);
} else {
  initSliders();
}

