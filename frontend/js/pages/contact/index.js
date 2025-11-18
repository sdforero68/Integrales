/**
 * Manejo del formulario de contacto
 * Prellena automáticamente los datos si el usuario está logueado
 */

// Claves de localStorage
const CURRENT_USER_KEY = 'current_user';
const CURRENT_SESSION_KEY = 'current_session';

/**
 * Obtiene la información del usuario actual
 */
function getCurrentUser() {
  const userStr = localStorage.getItem('user') || localStorage.getItem(CURRENT_USER_KEY);
  const accessToken = localStorage.getItem('accessToken') || localStorage.getItem(CURRENT_SESSION_KEY);
  
  if (!userStr || !accessToken) {
    return null;
  }
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Prellena el formulario con los datos del usuario
 */
function prefillContactForm() {
  const user = getCurrentUser();
  
  if (!user) {
    return; // Usuario no logueado, no hacer nada
  }
  
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  
  // Prellenar campos con datos del usuario
  if (nameInput && user.user_metadata?.name) {
    nameInput.value = user.user_metadata.name;
  }
  
  if (emailInput && user.email) {
    emailInput.value = user.email;
  }
  
  if (phoneInput && user.user_metadata?.phone) {
    phoneInput.value = user.user_metadata.phone;
  }
  
  // Mostrar mensaje informativo si se prellenaron datos
  if ((nameInput?.value || emailInput?.value || phoneInput?.value)) {
    showPrefillMessage();
  }
}

/**
 * Muestra un mensaje indicando que los datos fueron prellenados
 */
function showPrefillMessage() {
  const infoMessage = document.getElementById('contact-prefill-info');
  if (infoMessage) {
    infoMessage.hidden = false;
    
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      if (infoMessage) {
        infoMessage.style.opacity = '0';
        infoMessage.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          if (infoMessage) {
            infoMessage.hidden = true;
            infoMessage.style.opacity = '1';
          }
        }, 300);
      }
    }, 5000);
  }
}

/**
 * Convierte el tipo de mensaje a formato legible
 */
function getMessageTypeLabel(type) {
  const labels = {
    'duda': 'Duda',
    'sugerencia': 'Sugerencia',
    'queja': 'Queja',
    'reclamo': 'Reclamo'
  };
  return labels[type] || 'Consulta';
}

/**
 * Maneja el envío del formulario
 */
function handleFormSubmit(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const typeInput = document.getElementById('contact-type');
  const messageInput = document.getElementById('contact-message');
  const submitButton = document.getElementById('contact-submit');
  const submitText = document.getElementById('contact-submit-text');
  const successMessage = document.getElementById('contact-success');
  const errorMessage = document.getElementById('contact-error');
  
  // Ocultar mensajes anteriores
  if (successMessage) successMessage.hidden = true;
  if (errorMessage) errorMessage.hidden = true;
  
  // Validar campos requeridos
  if (!nameInput?.value || !emailInput?.value || !typeInput?.value || !messageInput?.value) {
    if (errorMessage) {
      errorMessage.textContent = 'Por favor completa todos los campos requeridos.';
      errorMessage.hidden = false;
    }
    return;
  }
  
  // Obtener valores del formulario
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const messageType = typeInput.value;
  const message = messageInput.value.trim();
  
  // Crear asunto del correo con el tipo de mensaje
  const messageTypeLabel = getMessageTypeLabel(messageType);
  const subject = encodeURIComponent(`[${messageTypeLabel}] - Consulta Anita Integrales`);
  
  // Crear cuerpo del correo con el mensaje y la firma
  let emailBody = message;
  emailBody += '\n\n---';
  emailBody += '\nDatos de contacto:';
  emailBody += `\nNombre: ${name}`;
  emailBody += `\nEmail: ${email}`;
  if (phone) {
    emailBody += `\nTeléfono: ${phone}`;
  }
  
  const encodedBody = encodeURIComponent(emailBody);
  
  // Crear URL de Gmail con todos los datos prellenados
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=sdht91memories@gmail.com&su=${subject}&body=${encodedBody}`;
  
  // Abrir Gmail en una nueva ventana
  window.open(gmailUrl, '_blank');
  
  // Mostrar estado de carga
  if (submitButton) {
    submitButton.disabled = true;
  }
  if (submitText) {
    submitText.textContent = 'Abriendo correo...';
  }
  
  // Después de un momento, mostrar mensaje de éxito
  setTimeout(() => {
    // Ocultar mensaje de prellenado si existe
    const prefillInfo = document.getElementById('contact-prefill-info');
    if (prefillInfo) {
      prefillInfo.hidden = true;
    }
    
    // Mostrar mensaje de éxito
    if (successMessage) {
      successMessage.textContent = '¡Correo preparado! Por favor completa el envío en tu cliente de correo.';
      successMessage.hidden = false;
    }
    
    // Resetear formulario (pero mantener datos prellenados si el usuario está logueado)
    if (messageInput) {
      messageInput.value = '';
    }
    if (typeInput) {
      typeInput.value = '';
    }
    
    // Restaurar botón
    if (submitButton) {
      submitButton.disabled = false;
    }
    if (submitText) {
      submitText.textContent = 'Enviar Mensaje';
    }
    
    // Ocultar mensaje de éxito después de 8 segundos
    setTimeout(() => {
      if (successMessage) {
        successMessage.hidden = true;
      }
    }, 8000);
    
    // Scroll al mensaje de éxito
    if (successMessage) {
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 500);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Prellenar formulario si el usuario está logueado
  prefillContactForm();
  
  // Manejar envío del formulario
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
});

