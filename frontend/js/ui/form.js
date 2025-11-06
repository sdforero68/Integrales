/**
 * Form Component - Vanilla JS Implementation
 * Adaptación del componente Form de React (react-hook-form)
 * 
 * Versión simplificada para vanilla JS que maneja:
 * - IDs únicos para accesibilidad
 * - Conexión entre labels, inputs y mensajes
 * - Validación básica
 * - Estados de error
 */

/**
 * Genera un ID único
 */
function generateId() {
  return `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Inicializa un form item individual
 * @param {HTMLElement} formItemElement - Elemento form-item
 */
export function initFormItem(formItemElement) {
  // Generar ID único si no existe
  if (!formItemElement.id) {
    formItemElement.id = generateId();
  }
  
  const formItemId = formItemElement.id;
  const formDescriptionId = `${formItemId}-form-item-description`;
  const formMessageId = `${formItemId}-form-item-message`;
  
  // Buscar elementos relacionados
  const label = formItemElement.querySelector('[data-slot="form-label"], .form-label');
  const control = formItemElement.querySelector('[data-slot="form-control"], .form-control');
  const description = formItemElement.querySelector('[data-slot="form-description"], .form-description`);
  const message = formItemElement.querySelector('[data-slot="form-message"], .form-message');
  
  // Conectar label con control
  if (label && control) {
    const controlId = control.id || `${formItemId}-form-control`;
    control.id = controlId;
    
    if (label.tagName === 'LABEL') {
      label.setAttribute('for', controlId);
    } else {
      label.setAttribute('data-for', controlId);
    }
    
    // Asegurar que el control tenga aria-describedby
    let ariaDescribedBy = [];
    
    if (description) {
      description.id = formDescriptionId;
      ariaDescribedBy.push(formDescriptionId);
    }
    
    if (message) {
      message.id = formMessageId;
      ariaDescribedBy.push(formMessageId);
    }
    
    if (ariaDescribedBy.length > 0) {
      control.setAttribute('aria-describedby', ariaDescribedBy.join(' '));
    }
  }
  
  // Función para establecer error
  function setError(errorMessage) {
    if (control) {
      control.setAttribute('aria-invalid', 'true');
    }
    
    if (label) {
      label.setAttribute('data-error', 'true');
    }
    
    if (message) {
      message.textContent = errorMessage || '';
      message.style.display = errorMessage ? 'block' : 'none';
    }
  }
  
  // Función para limpiar error
  function clearError() {
    if (control) {
      control.removeAttribute('aria-invalid');
    }
    
    if (label) {
      label.removeAttribute('data-error');
    }
    
    if (message) {
      message.textContent = '';
      message.style.display = 'none';
    }
  }
  
  // Validación básica en tiempo real (opcional)
  if (control) {
    control.addEventListener('blur', () => {
      // Validación básica
      if (control.hasAttribute('required') && !control.value.trim()) {
        setError('Este campo es requerido');
      } else if (control.type === 'email' && control.value && !isValidEmail(control.value)) {
        setError('Por favor ingresa un email válido');
      } else {
        clearError();
      }
    });
    
    control.addEventListener('input', () => {
      // Limpiar error mientras el usuario escribe
      if (control.hasAttribute('aria-invalid')) {
        clearError();
      }
    });
  }
  
  // Guardar métodos en el elemento
  formItemElement._formItemApi = {
    setError,
    clearError,
    validate: () => {
      if (control && control.hasAttribute('required') && !control.value.trim()) {
        setError('Este campo es requerido');
        return false;
      }
      if (control && control.type === 'email' && control.value && !isValidEmail(control.value)) {
        setError('Por favor ingresa un email válido');
        return false;
      }
      clearError();
      return true;
    },
    getValue: () => control?.value || '',
    setValue: (value) => {
      if (control) {
        control.value = value;
      }
    }
  };
}

/**
 * Valida un email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Inicializa un formulario completo
 * @param {HTMLElement} formElement - Elemento form
 */
export function initForm(formElement) {
  const formItems = formElement.querySelectorAll('[data-slot="form-item"], .form-item');
  
  formItems.forEach((item) => {
    initFormItem(item);
  });
  
  // Función para validar todo el formulario
  function validate() {
    let isValid = true;
    
    formItems.forEach((item) => {
      if (item._formItemApi && !item._formItemApi.validate()) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  // Función para obtener valores del formulario
  function getValues() {
    const values = {};
    
    formItems.forEach((item) => {
      const control = item.querySelector('[data-slot="form-control"], .form-control');
      const name = control?.name || control?.id;
      if (name && control) {
        values[name] = control.value;
      }
    });
    
    return values;
  }
  
  // Función para establecer valores
  function setValues(values) {
    Object.entries(values).forEach(([name, value]) => {
      const control = formElement.querySelector(`[name="${name}"], #${name}`);
      if (control) {
        control.value = value;
      }
    });
  }
  
  // Función para resetear
  function reset() {
    formElement.reset();
    formItems.forEach((item) => {
      if (item._formItemApi) {
        item._formItemApi.clearError();
      }
    });
  }
  
  // Manejar submit del formulario
  formElement.addEventListener('submit', (e) => {
    if (!validate()) {
      e.preventDefault();
      return false;
    }
  });
  
  // Guardar métodos en el elemento
  formElement._formApi = {
    validate,
    getValues,
    setValues,
    reset
  };
}

/**
 * Inicializa todos los formularios en la página
 */
export function initForms() {
  // Inicializar formularios completos
  const forms = document.querySelectorAll('form[data-form], .form');
  forms.forEach((form) => {
    initForm(form);
  });
  
  // Inicializar form items individuales que no estén dentro de un form inicializado
  const formItems = document.querySelectorAll('[data-slot="form-item"], .form-item');
  formItems.forEach((item) => {
    if (!item.closest('form[data-form], .form') || !item.closest('form')?._formApi) {
      initFormItem(item);
    }
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initForms);
} else {
  initForms();
}

