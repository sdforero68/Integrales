/**
 * InputOTP Component - Vanilla JS Implementation
 * Adaptación del componente InputOTP de React (input-otp)
 */

/**
 * Inicializa un input OTP individual
 * @param {HTMLElement} otpElement - Elemento contenedor del OTP input
 */
export function initInputOTP(otpElement) {
  const groups = otpElement.querySelectorAll('[data-slot="input-otp-group"], .input-otp-group');
  const slots = otpElement.querySelectorAll('[data-slot="input-otp-slot"], .input-otp-slot');
  
  if (slots.length === 0) {
    console.warn('InputOTP: No slots found');
    return;
  }
  
  // Obtener maxLength
  const maxLength = parseInt(otpElement.getAttribute('maxlength') || slots.length.toString(), 10);
  
  // Crear inputs ocultos para cada slot si no existen
  slots.forEach((slot, index) => {
    let input = slot.querySelector('input[type="text"], input[type="tel"], input[type="number"]');
    
    if (!input) {
      input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.setAttribute('aria-label', `Dígito ${index + 1} del código OTP`);
      slot.appendChild(input);
    }
    
    // Asegurar que el input esté oculto visualmente pero funcional
    input.style.position = 'absolute';
    input.style.opacity = '0';
    input.style.width = '100%';
    input.style.height = '100%';
    input.style.textAlign = 'center';
    input.style.fontSize = '0.875rem';
    
    // Función para actualizar el slot
    function updateSlot() {
      const value = input.value;
      const char = value.charAt(0).toUpperCase();
      
      // Actualizar el texto visible
      const existingChar = slot.querySelector('.otp-char');
      if (char && existingChar) {
        existingChar.textContent = char;
      } else if (char) {
        const charSpan = document.createElement('span');
        charSpan.className = 'otp-char';
        charSpan.textContent = char;
        slot.appendChild(charSpan);
      } else if (existingChar) {
        existingChar.remove();
      }
      
      // Mostrar/ocultar caret
      const caret = slot.querySelector('.otp-caret');
      if (caret) {
        caret.style.display = value ? 'none' : 'flex';
      }
    }
    
    // Crear caret si no existe
    if (!slot.querySelector('.otp-caret')) {
      const caret = document.createElement('div');
      caret.className = 'otp-caret';
      const caretLine = document.createElement('div');
      caretLine.className = 'otp-caret-line';
      caret.appendChild(caretLine);
      slot.appendChild(caret);
    }
    
    // Event listeners
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      
      // Solo permitir un carácter
      if (value.length > 1) {
        input.value = value.charAt(0).toUpperCase();
      } else {
        input.value = value.toUpperCase();
      }
      
      updateSlot();
      
      // Mover al siguiente slot si hay valor
      if (input.value && index < slots.length - 1) {
        const nextSlot = slots[index + 1];
        const nextInput = nextSlot.querySelector('input');
        if (nextInput) {
          nextInput.focus();
        }
      }
      
      // Dispatch event
      otpElement.dispatchEvent(new CustomEvent('input-otp-change', {
        detail: { value: getOTPValue(), index, char: input.value },
        bubbles: true
      }));
    });
    
    input.addEventListener('keydown', (e) => {
      // Backspace: si está vacío, ir al anterior
      if (e.key === 'Backspace' && !input.value && index > 0) {
        e.preventDefault();
        const prevSlot = slots[index - 1];
        const prevInput = prevSlot.querySelector('input');
        if (prevInput) {
          prevInput.focus();
          prevInput.value = '';
          const prevChar = prevSlot.querySelector('.otp-char');
          if (prevChar) prevChar.remove();
          const prevCaret = prevSlot.querySelector('.otp-caret');
          if (prevCaret) prevCaret.style.display = 'flex';
        }
      }
      
      // Arrow keys: navegar entre slots
      if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        const prevSlot = slots[index - 1];
        const prevInput = prevSlot.querySelector('input');
        if (prevInput) prevInput.focus();
      }
      
      if (e.key === 'ArrowRight' && index < slots.length - 1) {
        e.preventDefault();
        const nextSlot = slots[index + 1];
        const nextInput = nextSlot.querySelector('input');
        if (nextInput) nextInput.focus();
      }
      
      // Solo permitir caracteres alfanuméricos
      if (e.key.length === 1 && !/[a-zA-Z0-9]/.test(e.key)) {
        e.preventDefault();
      }
    });
    
    input.addEventListener('focus', () => {
      // Actualizar estado activo
      slots.forEach(s => s.setAttribute('data-active', 'false'));
      slot.setAttribute('data-active', 'true');
      updateSlot();
    });
    
    input.addEventListener('blur', () => {
      slot.setAttribute('data-active', 'false');
    });
    
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData('text').trim();
      
      if (pastedText.length > 0) {
        // Distribuir el texto pegado en los slots
        const chars = pastedText.substring(0, slots.length).split('');
        chars.forEach((char, i) => {
          if (index + i < slots.length) {
            const targetSlot = slots[index + i];
            const targetInput = targetSlot.querySelector('input');
            if (targetInput && /[a-zA-Z0-9]/.test(char)) {
              targetInput.value = char.toUpperCase();
              const charSpan = targetSlot.querySelector('.otp-char') || document.createElement('span');
              charSpan.className = 'otp-char';
              charSpan.textContent = char.toUpperCase();
              if (!targetSlot.querySelector('.otp-char')) {
                targetSlot.appendChild(charSpan);
              }
              const caret = targetSlot.querySelector('.otp-caret');
              if (caret) caret.style.display = 'none';
            }
          }
        });
        
        // Focus en el último slot con valor o el siguiente disponible
        const lastFilledIndex = Math.min(index + chars.length - 1, slots.length - 1);
        const nextEmptyIndex = Math.min(lastFilledIndex + 1, slots.length - 1);
        const focusSlot = slots[nextEmptyIndex];
        const focusInput = focusSlot?.querySelector('input');
        if (focusInput) focusInput.focus();
        
        // Dispatch event
        otpElement.dispatchEvent(new CustomEvent('input-otp-change', {
          detail: { value: getOTPValue(), pasted: true },
          bubbles: true
        }));
      }
    });
    
    // Inicializar slot
    updateSlot();
  });
  
  // Función para obtener el valor completo del OTP
  function getOTPValue() {
    return Array.from(slots).map(slot => {
      const input = slot.querySelector('input');
      return input?.value || '';
    }).join('');
  }
  
  // Función para establecer el valor
  function setValue(value) {
    const chars = value.substring(0, slots.length).split('');
    slots.forEach((slot, index) => {
      const input = slot.querySelector('input');
      if (input) {
        input.value = chars[index]?.toUpperCase() || '';
        const existingChar = slot.querySelector('.otp-char');
        if (chars[index]) {
          if (existingChar) {
            existingChar.textContent = chars[index].toUpperCase();
          } else {
            const charSpan = document.createElement('span');
            charSpan.className = 'otp-char';
            charSpan.textContent = chars[index].toUpperCase();
            slot.appendChild(charSpan);
          }
          const caret = slot.querySelector('.otp-caret');
          if (caret) caret.style.display = 'none';
        } else {
          if (existingChar) existingChar.remove();
          const caret = slot.querySelector('.otp-caret');
          if (caret) caret.style.display = 'flex';
        }
      }
    });
  }
  
  // Función para limpiar
  function clear() {
    setValue('');
    const firstInput = slots[0]?.querySelector('input');
    if (firstInput) firstInput.focus();
  }
  
  // Guardar métodos
  otpElement._inputOTPApi = {
    getValue: getOTPValue,
    setValue,
    clear,
    focus: () => {
      const firstInput = slots[0]?.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  };
}

/**
 * Inicializa todos los input OTP en la página
 */
export function initInputOTPs() {
  const inputOTPs = document.querySelectorAll('[data-slot="input-otp"], .input-otp');
  
  inputOTPs.forEach((inputOTP) => {
    initInputOTP(inputOTP);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInputOTPs);
} else {
  initInputOTPs();
}

