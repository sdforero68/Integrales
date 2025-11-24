// Sistema de autenticación con API Backend

import { api, setAuthToken } from '../../config/api.js';

// Variables globales para las cards
let loginCard = null;
let signupCard = null;

// Función para cambiar a signup con animación
function switchToSignup() {
  if (loginCard && signupCard) {
    // Animar salida del login
    loginCard.classList.add('fade-out');
    
    setTimeout(() => {
      loginCard.hidden = true;
      loginCard.classList.remove('fade-out');
      
      // Mostrar y animar entrada del signup
      signupCard.hidden = false;
      signupCard.classList.add('fade-in');
      
      // Resetear animaciones de los elementos del formulario
      resetFormAnimations(signupCard.querySelector('form'));
      
      clearErrors();
    }, 300);
  }
}

// Función para cambiar a login con animación
function switchToLogin() {
  if (loginCard && signupCard) {
    // Animar salida del signup
    signupCard.classList.add('fade-out');
    
    setTimeout(() => {
      signupCard.hidden = true;
      signupCard.classList.remove('fade-out');
      
      // Mostrar y animar entrada del login
      loginCard.hidden = false;
      loginCard.classList.add('fade-in');
      
      // Resetear animaciones de los elementos del formulario
      resetFormAnimations(loginCard.querySelector('form'));
      
      clearErrors();
    }, 300);
  }
}

// Función para resetear animaciones del formulario
function resetFormAnimations(form) {
  if (!form) return;
  
  // Agregar clase de animación
  form.classList.add('animate-elements');
  
  const elements = form.querySelectorAll('.form-group, .form-row, .form-options, .btn-submit, .register-link, .separator, .social-buttons');
  elements.forEach((el) => {
    el.style.animation = 'none';
    el.style.opacity = '0';
  });
  
  // Forzar reflow
  void form.offsetHeight;
  
  // Reactivar animaciones con pequeño delay
  setTimeout(() => {
    elements.forEach((el, index) => {
      el.style.animation = '';
      el.style.opacity = '';
    });
  }, 50);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Cambio entre login y signup
  loginCard = document.getElementById('login-card');
  signupCard = document.getElementById('signup-card');
  const signupLink = document.getElementById('signup-link');
  const loginLink = document.getElementById('login-link');
  const loginForm = document.getElementById('login-form');
  
  // Verificar si hay parámetro register=true en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const shouldShowRegister = urlParams.get('register') === 'true';
  
  if (shouldShowRegister) {
    // Mostrar formulario de registro directamente
    if (loginCard) loginCard.hidden = true;
    if (signupCard) {
      signupCard.hidden = false;
      const signupForm = signupCard.querySelector('form');
      if (signupForm) signupForm.classList.add('animate-elements');
    }
  } else {
    // Mostrar formulario de login por defecto
    if (loginForm) {
      loginForm.classList.add('animate-elements');
    }
    if (loginCard) loginCard.hidden = false;
    if (signupCard) signupCard.hidden = true;
  }
  
  if (signupLink) {
    signupLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchToSignup();
    });
  }
  
  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchToLogin();
    });
  }
  
  // Manejo de formulario de login
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Manejo de formulario de signup
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  // Botones de login social (deshabilitados por ahora)
  const googleBtn = document.getElementById('google-login');
  const appleBtn = document.getElementById('apple-login');
  
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      showError('login', 'Login social no disponible con localStorage');
    });
  }
  
  if (appleBtn) {
    appleBtn.addEventListener('click', () => {
      showError('login', 'Login social no disponible con localStorage');
    });
  }
});

// Estado
let isLoading = false;

function setLoading(formType, loading) {
  isLoading = loading;
  const submitBtn = formType === 'login' 
    ? document.getElementById('login-submit')
    : document.getElementById('signup-submit');
  
  if (submitBtn) {
    submitBtn.disabled = loading;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (btnText) btnText.hidden = loading;
    if (btnLoading) btnLoading.hidden = !loading;
  }
}

function showError(formType, message) {
  const errorEl = formType === 'login'
    ? document.getElementById('login-error')
    : document.getElementById('signup-error');
  
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }
}

function clearErrors() {
  const loginError = document.getElementById('login-error');
  const signupError = document.getElementById('signup-error');
  if (loginError) loginError.hidden = true;
  if (signupError) signupError.hidden = true;
}

async function handleLogin(e) {
  e.preventDefault();
  
  setLoading('login', true);
  clearErrors();
  
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  
  try {
    // Llamar a la API del backend
    const response = await api.auth.login({ email, password });
    
    // Guardar token y datos del usuario
    setAuthToken(response.token);
    
    const userData = {
      id: response.user.id,
      email: response.user.email,
      user_metadata: {
        name: response.user.nombre,
        phone: response.user.telefono || null
      }
    };
    
    // Guardar datos del usuario
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('current_user', JSON.stringify(userData));
    
    // Login exitoso
    onLoginSuccess(response.token, userData);
  } catch (err) {
    console.error('Login error:', err);
    const errorMessage = err.message || 'Error al iniciar sesión. Por favor intenta de nuevo.';
    showError('login', errorMessage);
    setLoading('login', false);
  }
}

async function handleSignup(e) {
  e.preventDefault();
  
  setLoading('signup', true);
  clearErrors();
  
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const phone = document.getElementById('signup-phone').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm').value;
  
  // Validaciones
  if (!name) {
    showError('signup', 'Por favor ingresa tu nombre');
    setLoading('signup', false);
    return;
  }
  
  if (!email) {
    showError('signup', 'Por favor ingresa tu correo electrónico');
    setLoading('signup', false);
    return;
  }
  
  if (!email.includes('@')) {
    showError('signup', 'Correo electrónico inválido');
    setLoading('signup', false);
    return;
  }
  
  if (password !== confirmPassword) {
    showError('signup', 'Las contraseñas no coinciden');
    setLoading('signup', false);
    return;
  }
  
  if (password.length < 6) {
    showError('signup', 'La contraseña debe tener al menos 6 caracteres');
    setLoading('signup', false);
    return;
  }
  
  try {
    // Separar nombre y apellido si hay espacio
    const nameParts = name.split(' ');
    const nombre = nameParts[0];
    const apellido = nameParts.slice(1).join(' ') || null;
    
    // Llamar a la API del backend
    const response = await api.auth.register({
      nombre,
      apellido,
      email,
      password,
      telefono: phone || null
    });
    
    // Guardar token y datos del usuario
    setAuthToken(response.token);
    
    const userData = {
      id: response.user.id,
      email: response.user.email,
      user_metadata: {
        name: response.user.nombre,
        phone: response.user.telefono || null
      }
    };
    
    // Guardar datos del usuario
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('current_user', JSON.stringify(userData));
    
    // Login automático después del registro
    onLoginSuccess(response.token, userData);
  } catch (err) {
    console.error('Signup error:', err);
    const errorMessage = err.message || 'Error al crear la cuenta. Por favor intenta de nuevo.';
    showError('signup', errorMessage);
    setLoading('signup', false);
  }
}

// Función callback cuando el login es exitoso
function onLoginSuccess(accessToken, user) {
  console.log('Login exitoso:', { accessToken, user });
  
  // Redirigir a la pantalla de inicio después del login exitoso
  window.location.href = '../../index.html';
}
