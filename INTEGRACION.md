# Guía de Integración Frontend-Backend

Esta guía explica cómo integrar el frontend existente con el nuevo backend PHP.

## 📋 Pasos de Integración

### 1. Configurar la Base de Datos

1. Crea la base de datos ejecutando el script SQL:
```bash
mysql -u root -p < backend/sql/init.sql
```

O manualmente:
- Crea una base de datos llamada `integrales_db`
- Ejecuta el contenido de `backend/sql/init.sql`

### 2. Configurar Variables de Entorno

Crea el archivo `backend/config/database.env`:
```env
DB_CLIENT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=integrales_db
DB_USER=root
DB_PASSWORD=tu_contraseña
```

### 3. Actualizar el Frontend para Usar la API

#### Opción A: Modificar los archivos existentes

**Ejemplo para `frontend/js/pages/login/index.js`:**

Reemplaza las funciones `handleLogin` y `handleSignup`:

```javascript
// Al inicio del archivo, agrega:
const API_BASE_URL = 'http://localhost/backend/api'; // Cambiar en producción

async function handleLogin(e) {
  e.preventDefault();
  
  setLoading('login', true);
  clearErrors();
  
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      showError('login', result.message);
      setLoading('login', false);
      return;
    }
    
    // Guardar sesión
    const { user, accessToken } = result.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('current_session', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('current_user', JSON.stringify(user));
    
    // Login exitoso
    onLoginSuccess(accessToken, user);
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
  
  // Validaciones locales
  if (!name || !email || password !== confirmPassword || password.length < 6) {
    // ... validaciones existentes
    setLoading('signup', false);
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, name, phone })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      showError('signup', result.message);
      setLoading('signup', false);
      return;
    }
    
    // Guardar sesión
    const { user, accessToken } = result.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('current_session', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('current_user', JSON.stringify(user));
    
    // Login automático después del registro
    onLoginSuccess(accessToken, user);
  } catch (err) {
    console.error('Signup error:', err);
    showError('signup', 'Error al crear la cuenta. Por favor intenta de nuevo.');
    setLoading('signup', false);
  }
}
```

**Ejemplo para `frontend/js/pages/checkout/index.js`:**

Modifica la función `handleSubmit` para enviar el pedido al backend:

```javascript
async function handleSubmit(e) {
  e.preventDefault();
  
  // ... validaciones existentes ...
  
  const user = getUserInfo();
  if (!user) {
    alert('Debes iniciar sesión para realizar un pedido');
    window.location.href = '../login/index.html';
    return;
  }
  
  const userId = user.user?.id || user.id;
  
  // Preparar datos del pedido
  const orderData = {
    userId: userId,
    items: cart,
    total: total,
    subtotal: subtotal,
    deliveryFee: deliveryFee,
    deliveryMethod: deliveryMethod,
    deliveryAddress: deliveryMethod === 'delivery' ? customerInfo.address : null,
    paymentMethod: paymentMethod,
    customerInfo: customerInfo,
    notes: customerInfo.notes || null
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/orders.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    // Limpiar carrito
    saveCart([]);
    
    // Guardar el ID del pedido
    sessionStorage.setItem('lastOrderId', result.data.id);
    
    // Redirigir a página de confirmación
    window.location.href = `../order-success/index.html?orderId=${result.data.id}`;
  } catch (error) {
    console.error('Error al procesar pedido:', error);
    if (errorEl) {
      errorEl.textContent = error.message || 'Error al procesar el pedido. Por favor intenta de nuevo.';
      errorEl.hidden = false;
    }
    submitBtn.disabled = false;
    btnText.hidden = false;
    if (btnLoading) btnLoading.hidden = true;
  }
}
```

**Ejemplo para `frontend/js/pages/profile/index.js`:**

Modifica la función `fetchOrders` para obtener pedidos del backend:

```javascript
async function fetchOrders(userId) {
  const loadingState = document.getElementById('loading-state');
  const emptyState = document.getElementById('empty-state');
  const ordersList = document.getElementById('orders-list');
  const infoNote = document.querySelector('.order-info-note');
  
  try {
    if (loadingState) loadingState.hidden = false;
    if (emptyState) emptyState.hidden = true;
    if (ordersList) {
      ordersList.hidden = true;
      ordersList.innerHTML = '';
    }
    if (infoNote) infoNote.hidden = true;
    
    const response = await fetch(`${API_BASE_URL}/orders.php?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    const result = await response.json();
    
    if (loadingState) loadingState.hidden = true;
    
    if (!result.success || !result.data || result.data.length === 0) {
      if (emptyState) emptyState.hidden = false;
      if (ordersList) ordersList.hidden = true;
      if (infoNote) infoNote.hidden = true;
    } else {
      // Transformar datos del backend al formato esperado
      const orders = result.data.map(order => ({
        id: `order_${order.id}`,
        userId: order.user_id,
        items: order.items.map(item => ({
          id: item.product_id,
          name: item.product_name,
          quantity: item.quantity,
          price: item.price
        })),
        total: order.total,
        subtotal: order.subtotal,
        deliveryFee: order.delivery_fee,
        deliveryMethod: order.delivery_method,
        deliveryAddress: order.delivery_address,
        paymentMethod: order.payment_method,
        status: order.status,
        customerInfo: {
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone
        },
        notes: order.notes,
        createdAt: order.created_at,
        date: order.created_at
      }));
      
      renderOrders(orders);
      if (emptyState) emptyState.hidden = true;
      if (ordersList) ordersList.hidden = false;
      if (infoNote) infoNote.hidden = false;
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    if (loadingState) loadingState.hidden = true;
    if (emptyState) emptyState.hidden = false;
    if (ordersList) {
      ordersList.hidden = true;
      ordersList.innerHTML = '';
    }
    if (infoNote) infoNote.hidden = true;
  }
}
```

### 4. Configurar URL de la API

Crea un archivo de configuración `frontend/js/config/api.js`:

```javascript
// Configuración de la API
export const API_CONFIG = {
  // Para desarrollo local
  baseURL: 'http://localhost/backend/api',
  
  // Para producción (ajustar según tu dominio de Vercel)
  // baseURL: 'https://tu-proyecto.vercel.app/api'
};

// Función helper para obtener la URL base
export function getApiBaseUrl() {
  // En producción, puedes usar variables de entorno
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost/backend/api';
  }
  return 'https://tu-proyecto.vercel.app/api';
}
```

### 5. Deploy en Vercel

1. **Configurar variables de entorno en Vercel:**
   - Ve al dashboard de Vercel
   - Selecciona tu proyecto
   - Ve a Settings > Environment Variables
   - Agrega:
     - `DB_HOST`: Host de tu base de datos
     - `DB_PORT`: 3306 (para MySQL)
     - `DB_NAME`: integrales_db
     - `DB_USER`: Usuario de la BD
     - `DB_PASSWORD`: Contraseña de la BD
     - `DB_CLIENT`: mysql

2. **Asegurar acceso a la base de datos:**
   - Si usas una base de datos local, necesitarás un servicio como PlanetScale, Railway, o similar
   - O configura tu base de datos MySQL para aceptar conexiones externas

3. **Actualizar URLs en el frontend:**
   - Cambia `API_BASE_URL` en los archivos del frontend a la URL de tu proyecto en Vercel

## 🔄 Migración Gradual

Puedes migrar gradualmente:

1. **Fase 1**: Mantener localStorage como fallback, intentar API primero
2. **Fase 2**: Usar API para nuevas operaciones, mantener localStorage para datos existentes
3. **Fase 3**: Migrar completamente a la API

## 🧪 Testing

Para probar localmente:

1. Inicia un servidor PHP local:
```bash
php -S localhost:8000 -t backend
```

2. Actualiza `API_BASE_URL` en el frontend a `http://localhost:8000/api`

3. Prueba los endpoints con herramientas como Postman o curl

## 📝 Notas Importantes

- Los tokens de sesión actuales son simples. En producción, implementa JWT
- Asegúrate de manejar errores de red apropiadamente
- Considera implementar un sistema de retry para requests fallidos
- En producción, usa HTTPS siempre
- Configura CORS apropiadamente en el backend si es necesario

