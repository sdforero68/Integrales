/**
 * Manejo centralizado de errores
 */

// Manejar errores no capturados
window.addEventListener('error', (event) => {
  console.error('Error no capturado:', event.error);
  
  // Si es un error de CORS o de red, mostrar mensaje amigable
  if (event.message.includes('Failed to fetch') || event.message.includes('CORS')) {
    console.warn('⚠️ Error de conexión con el backend. Verifica que el servidor esté corriendo en http://localhost:3000');
  }
});

// Manejar promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promesa rechazada:', event.reason);
  
  // Prevenir que el error se muestre en la consola por defecto
  event.preventDefault();
  
  // Si es un error de red, mostrar mensaje
  if (event.reason && (event.reason.message?.includes('Failed to fetch') || event.reason.message?.includes('NetworkError'))) {
    console.warn('⚠️ No se pudo conectar con el backend. Usando modo offline (localStorage).');
  }
});

// Función para verificar conexión con el backend
export async function checkBackendConnection() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Backend no disponible, usando modo offline');
    return false;
  }
}

export default { checkBackendConnection };

