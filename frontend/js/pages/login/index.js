// Sistema de autenticación con localStorage

// Variables globales para las cards
let loginCard = null;
let signupCard = null;

// Clave para almacenar usuarios en localStorage
const USERS_STORAGE_KEY = 'app_users';
const CURRENT_USER_KEY = 'current_user';
const CURRENT_SESSION_KEY = 'current_session';

// Obtener todos los usuarios
function getUsers() {
  const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
}

// Guardar usuarios
function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Generar ID único
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Generar token de sesión
function generateSessionToken() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

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
    // Buscar usuario en localStorage
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      showError('login', 'Correo o contraseña incorrectos');
      setLoading('login', false);
      return;
    }
    
    // Verificar contraseña (en producción, usar hash)
    if (user.password !== password) {
      showError('login', 'Correo o contraseña incorrectos');
      setLoading('login', false);
      return;
    }
    
    // Crear sesión
    const sessionToken = generateSessionToken();
    const userData = {
      id: user.id,
      email: user.email,
      user_metadata: {
        name: user.name,
        phone: user.phone || null
      }
    };
    
    // Guardar sesión actual
    localStorage.setItem(CURRENT_SESSION_KEY, sessionToken);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    
    // También guardar en formato compatible con código anterior
    localStorage.setItem('accessToken', sessionToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Login exitoso
    onLoginSuccess(sessionToken, userData);
  } catch (err) {
    console.error('Login error:', err);
    showError('login', 'Error al iniciar sesión. Por favor intenta de nuevo.');
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
    // Verificar si el usuario ya existe
    const users = getUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      showError('signup', 'Este correo electrónico ya está registrado');
      setLoading('signup', false);
      return;
    }
    
    // Crear nuevo usuario
    const newUser = {
      id: generateId(),
      email: email,
      password: password, // En producción, usar hash
      name: name,
      phone: phone || null,
      createdAt: new Date().toISOString()
    };
    
    // Guardar usuario
    users.push(newUser);
    saveUsers(users);
    
    // Crear sesión automáticamente
    const sessionToken = generateSessionToken();
    const userData = {
      id: newUser.id,
      email: newUser.email,
      user_metadata: {
        name: newUser.name,
        phone: newUser.phone || null
      }
    };
    
    // Guardar sesión actual
    localStorage.setItem(CURRENT_SESSION_KEY, sessionToken);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    
    // También guardar en formato compatible
    localStorage.setItem('accessToken', sessionToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Login automático después del registro
    onLoginSuccess(sessionToken, userData);
  } catch (err) {
    console.error('Signup error:', err);
    showError('signup', 'Error al crear la cuenta. Por favor intenta de nuevo.');
    setLoading('signup', false);
  }
}

// Función callback cuando el login es exitoso
function onLoginSuccess(accessToken, user) {
  console.log('Login exitoso:', { accessToken, user });
  
  // Redirigir a la pantalla de inicio después del login exitoso
  window.location.href = '../../index.html';
}
