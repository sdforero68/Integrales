# Anita Integrales - E-commerce

Sitio web e-commerce para productos artesanales e integrales, desarrollado con HTML, CSS y JavaScript vanilla. El proyecto incluye un sistema completo de autenticación, catálogo de productos, carrito de compras y proceso de checkout.

## 📋 Descripción

Anita Integrales es una tienda en línea especializada en productos artesanales elaborados con ingredientes naturales como quinua, yacón, linaza y harinas ancestrales. El sitio permite a los usuarios explorar el catálogo, agregar productos al carrito, realizar compras y gestionar su perfil.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- **Registro de usuarios**: Formulario de signup con validación de campos
- **Inicio de sesión**: Autenticación segura con email y contraseña
- **Gestión de sesiones**: Manejo de sesiones de usuario mediante localStorage
- **Navegación condicional**: Redirección automática según el estado de autenticación
- **Menú de usuario**: Dropdown con información del usuario y opciones de perfil

### 🛍️ Catálogo de Productos
- **Búsqueda en tiempo real**: Filtrado por nombre, ingredientes o descripción
- **Filtros por categoría**: Panadería, Amasijos, Galletería, Granola, Frutos Secos, Envasados
- **Tarjetas de productos**: Diseño moderno con imágenes, descripción, precio y botones de acción
- **Vista detallada**: Modal con información completa del producto (ingredientes, beneficios, precio)
- **Imágenes por defecto**: Sistema de imágenes de respaldo según la categoría del producto

### 🛒 Carrito de Compras
- **Gestión de productos**: Agregar, actualizar cantidades y eliminar productos
- **Cálculo automático**: Subtotal, envío y total actualizados en tiempo real
- **Estado vacío**: Mensaje y botón para continuar comprando cuando el carrito está vacío
- **Badge de contador**: Indicador visual en el navbar con la cantidad de items
- **Persistencia**: Datos guardados en localStorage

### 💳 Checkout
- **Información del cliente**: Formulario para datos de contacto y dirección de entrega
- **Métodos de entrega**: Selección entre envío a domicilio o recogida en punto
- **Métodos de pago**: Opciones de pago (efectivo, transferencia, etc.)
- **Resumen del pedido**: Vista detallada de productos, cantidades y totales
- **Procesamiento de pedidos**: Guardado de órdenes en localStorage
- **Validación de sesión**: Requiere autenticación para completar la compra

### 👤 Perfil de Usuario
- **Información personal**: Visualización de datos del usuario (nombre, email, teléfono)
- **Historial de pedidos**: Lista de compras realizadas con detalles
- **Estado de pedidos**: Información sobre el estado de cada orden
- **Navegación**: Botón para volver al inicio

### 🎨 Diseño y UX
- **Diseño responsive**: Adaptable a diferentes tamaños de pantalla
- **Animaciones**: Transiciones suaves y efectos de entrada/salida
- **Tema consistente**: Paleta de colores y tipografía coherente
- **Navegación intuitiva**: Menú de navegación con scroll suave entre secciones

## 📁 Estructura del Proyecto

```
frontend/
├── index.html          # Página principal (Hero, Catálogo, Secciones)
├── login.html          # Página de login y registro
├── profile.html        # Página de perfil de usuario
├── cart.html           # Página del carrito de compras
├── checkout.html       # Página de checkout
├── css/
│   ├── styles.css      # Estilos globales y componentes principales
│   ├── login.css       # Estilos específicos de login/signup
│   ├── profile.css     # Estilos del perfil de usuario
│   ├── cart.css        # Estilos del carrito
│   └── checkout.css    # Estilos del checkout
└── js/
    ├── main.js         # Lógica principal (navegación, carrito, productos)
    ├── products.js     # Datos de productos y categorías
    ├── login.js        # Lógica de autenticación (localStorage)
    ├── profile.js      # Gestión del perfil de usuario
    ├── cart.js         # Funcionalidad del carrito
    ├── checkout.js     # Procesamiento de pedidos
    └── config.js       # Configuración (si aplica)
```

## 🚀 Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con Flexbox, Grid, Animaciones y Variables CSS
- **JavaScript (ES6+)**: Programación funcional, módulos ES6, localStorage API
- **LocalStorage**: Persistencia de datos del lado del cliente

## 📦 Almacenamiento Local

El proyecto utiliza `localStorage` para almacenar:

- **`app_users`**: Lista de usuarios registrados
- **`current_user`**: Usuario actual autenticado
- **`current_session`**: Token de sesión actual
- **`user`** / **`accessToken`**: Compatibilidad con formato anterior
- **`app_cart`**: Items del carrito de compras
- **`app_orders`**: Historial de pedidos realizados

## 🎯 Funcionalidades por Módulo

### `main.js`
- Navegación suave entre secciones
- Renderizado del catálogo de productos
- Gestión del carrito (getCart, saveCart, getCartItemsCount)
- Menú de usuario con dropdown
- Modal de detalles de productos
- Actualización de badge del carrito

### `login.js`
- Registro de nuevos usuarios
- Autenticación de usuarios existentes
- Generación de IDs y tokens de sesión
- Validación de formularios
- Redirección post-login/registro
- Animaciones de transición entre formularios

### `cart.js`
- Renderizado de items del carrito
- Actualización de cantidades
- Eliminación de productos
- Cálculo de totales
- Manejo de estado vacío del carrito
- Navegación al checkout

### `checkout.js`
- Validación de sesión de usuario
- Captura de información del cliente
- Selección de métodos de entrega y pago
- Procesamiento y guardado de pedidos
- Redirección post-compra

### `profile.js`
- Visualización de información del usuario
- Carga de historial de pedidos
- Cierre de sesión
- Validación de autenticación

### `products.js`
- Definición de categorías de productos
- Base de datos de productos (demo)

## 🎨 Paleta de Colores

El proyecto utiliza variables CSS para mantener consistencia:

- **Primary**: Azul principal (`#0d6efd`)
- **Accent**: Verde para acciones positivas (`#22c55e`)
- **Tertiary**: Color terciario para acentos
- **Secondary**: Color secundario para textos y fondos

## 📱 Secciones del Sitio

1. **Hero**: Sección principal con logo, título y CTAs
2. **Benefits**: Razones para elegir Anita Integrales
3. **Catalog**: Catálogo con búsqueda, filtros y grid de productos
4. **Markets**: Información sobre mercados campesinos (placeholder)
5. **About**: Información sobre la empresa
6. **Contact**: Información de contacto (placeholder)

## 🔄 Flujo de Usuario

1. **Exploración**: Usuario navega por el catálogo sin necesidad de registro
2. **Registro/Login**: Usuario se registra o inicia sesión para realizar compras
3. **Agregar al carrito**: Usuario agrega productos desde el catálogo o modal de detalles
4. **Revisar carrito**: Usuario revisa items y cantidades en el carrito
5. **Checkout**: Usuario completa información y realiza el pedido
6. **Confirmación**: Pedido guardado y visible en el perfil del usuario

## 🛠️ Próximas Mejoras

- Integración con backend real (API REST)
- Sistema de pagos en línea
- Gestión de inventario
- Panel de administración
- Sistema de reseñas de productos
- Notificaciones por email
- Integración con mapas para puntos de recogida

## 📝 Notas de Desarrollo

- El proyecto utiliza módulos ES6 (`import`/`export`)
- Las funciones del carrito están exportadas desde `main.js` para reutilización
- El sistema de autenticación es básico y utiliza localStorage (no para producción)
- Las imágenes de productos usan URLs de Unsplash como placeholder
- El diseño está optimizado para móviles primero (mobile-first)

## 👥 Créditos

Proyecto desarrollado para Anita Integrales - Más de 15 años creando alimentos saludables con amor.

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024