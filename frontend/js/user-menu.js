/**
 * user-menu.js - Gestión simple del menú de usuario
 * Actualiza el menú de usuario según el estado de sesión sin depender de sync.js
 */

// Función para verificar si hay sesión activa
function isLoggedIn() {
  const accessToken = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  return !!(accessToken && user);
}

// Función para obtener información del usuario
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

// Función para actualizar el menú de usuario
function updateUserMenu() {
  const userMenu = document.getElementById('user-menu');
  const userMenuName = document.getElementById('user-menu-name');
  const userMenuEmail = document.getElementById('user-menu-email');
  const userMenuHeader = userMenu?.querySelector('.user-menu-header');
  const userMenuDivider = userMenu?.querySelector('.user-menu-divider');
  const loginMenuItem = document.getElementById('user-menu-login');
  const registerMenuItem = document.getElementById('user-menu-register');
  const profileMenuItem = document.getElementById('user-menu-profile');
  const logoutMenuItem = document.getElementById('logout-btn-navbar');

  if (!userMenu) {
    return; // El elemento no existe aún, pero no reintentamos recursivamente
  }

  const loggedIn = isLoggedIn();

  if (loggedIn) {
    const user = getCurrentUser();

    // Mostrar información del usuario
    if (userMenuName && user) {
      userMenuName.textContent = user?.user_metadata?.name || 'Usuario';
    }

    if (userMenuEmail && user) {
      userMenuEmail.textContent = user?.email || '-';
    }

    // Mostrar elementos de usuario logueado
    if (userMenuHeader) userMenuHeader.hidden = false;
    if (userMenuDivider) userMenuDivider.hidden = false;
    if (profileMenuItem) {
      profileMenuItem.hidden = false;
      profileMenuItem.style.display = '';
    }
    if (logoutMenuItem) {
      logoutMenuItem.hidden = false;
      logoutMenuItem.style.display = '';
    }

    // Ocultar opciones de login/registro
    if (loginMenuItem) {
      loginMenuItem.hidden = true;
      loginMenuItem.style.display = 'none';
    }
    if (registerMenuItem) {
      registerMenuItem.hidden = true;
      registerMenuItem.style.display = 'none';
    }
  } else {
    // Ocultar información del usuario
    if (userMenuHeader) userMenuHeader.hidden = true;
    if (userMenuDivider) userMenuDivider.hidden = true;
    if (profileMenuItem) {
      profileMenuItem.hidden = true;
      profileMenuItem.style.display = 'none';
    }
    if (logoutMenuItem) {
      logoutMenuItem.hidden = true;
      logoutMenuItem.style.display = 'none';
    }

    // Mostrar opciones de login/registro
    if (loginMenuItem) {
      loginMenuItem.hidden = false;
      loginMenuItem.style.display = '';
    }
    if (registerMenuItem) {
      registerMenuItem.hidden = false;
      registerMenuItem.style.display = '';
    }
  }
}

// Configurar botón de logout si existe
function setupLogoutButton() {
  const logoutBtn = document.getElementById('logout-btn-navbar');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Limpiar localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('current_user');
      localStorage.removeItem('current_session');
      
      // Actualizar menú
      updateUserMenu();
      
      // Redirigir según la página actual
      const currentPage = window.location.pathname.split('/').pop();
      if (currentPage === 'profile.html' || currentPage === 'checkout.html' || currentPage === 'index.html') {
        window.location.href = currentPage === 'index.html' ? './index.html' : '../login/index.html';
      } else {
        window.location.reload();
      }
    });
  }
}

// Función de inicialización
function initUserMenu() {
  // Función para ejecutar la actualización múltiples veces para asegurar que funcione
  function runUpdate() {
    updateUserMenu();
    setupLogoutButton();
  }
  
  // Ejecutar inmediatamente
  runUpdate();
  
  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(runUpdate, 10);
      setTimeout(runUpdate, 100);
      setTimeout(runUpdate, 300);
    });
  } else {
    setTimeout(runUpdate, 10);
    setTimeout(runUpdate, 100);
    setTimeout(runUpdate, 300);
  }
  
  // También escuchar cambios en localStorage (para sincronización entre pestañas)
  window.addEventListener('storage', (e) => {
    if (e.key === 'accessToken' || e.key === 'user') {
      setTimeout(updateUserMenu, 50);
    }
  });
  
  // También interceptar cambios directos en localStorage (misma pestaña)
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (key === 'accessToken' || key === 'user') {
      setTimeout(updateUserMenu, 50);
    }
  };
  
  const originalRemoveItem = Storage.prototype.removeItem;
  Storage.prototype.removeItem = function(key) {
    originalRemoveItem.apply(this, arguments);
    if (key === 'accessToken' || key === 'user') {
      setTimeout(updateUserMenu, 50);
    }
  };
}

// Inicializar
initUserMenu();

