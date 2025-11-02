import { products, categories } from './products.js';

// Sistema de carrito con localStorage (scope global)
const CART_STORAGE_KEY = 'app_cart';

// Función para obtener el carrito desde localStorage
function getCart() {
  const cartStr = localStorage.getItem(CART_STORAGE_KEY);
  return cartStr ? JSON.parse(cartStr) : [];
}

// Función para guardar el carrito en localStorage
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Función para contar items en el carrito
function getCartItemsCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

// Exportar funciones del carrito para uso en otros módulos
export { getCart, saveCart, getCartItemsCount, CART_STORAGE_KEY };

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const navHeight = navbar ? navbar.offsetHeight : 0;

  const navigate = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) {
      console.log(`Sección no encontrada: ${sectionId}`);
      return;
    }
    const rect = el.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - navHeight + 1; // +1 to avoid overlap
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  document.querySelectorAll('[data-target]')
    .forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        navigate(target);
      });
    });

  // Reveal animations on scroll for .animate-fade-in-up
  const revealEls = document.querySelectorAll('.animate-fade-in-up');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.willChange = 'transform, opacity';
        // Triggering animation by forcing reflow then adding class is not needed;
        // the element already has the animation; ensure it restarts once
        entry.target.style.animationPlayState = 'running';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => {
    // Pause until visible
    el.style.animationPlayState = 'paused';
    io.observe(el);
  });

  // Scrollspy active link handling
  const sections = [
    { id: 'home', el: document.getElementById('home') },
    { id: 'about', el: document.getElementById('about') },
    { id: 'catalog', el: document.getElementById('catalog') },
    { id: 'markets', el: document.getElementById('markets') },
    { id: 'contact', el: document.getElementById('contact') },
  ].filter(s => s.el);
  const links = Array.from(document.querySelectorAll('.nav-link'));

  const setActive = (id) => {
    links.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('data-target') === id);
    });
  };

  const onScroll = () => {
    const fromTop = window.scrollY + navHeight + 10;
    let current = sections[0]?.id;
    sections.forEach((s) => {
      const top = s.el.offsetTop;
      if (fromTop >= top) current = s.id;
    });
    if (current) setActive(current);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Header actions
  const cartBadges = Array.from(document.querySelectorAll('.cart-badge, #cart-badge'));

  const updateCartBadge = () => {
    const count = getCartItemsCount();
    cartBadges.forEach((badge) => {
      if (count > 0) {
        badge.textContent = String(count);
        badge.hidden = false;
      } else {
        badge.hidden = true;
      }
    });
  };
  
  // Inicializar badge del carrito
  updateCartBadge();

  document.querySelectorAll('[data-action="cart"]').forEach((el) => {
    el.addEventListener('click', () => {
      // Redirigir a la página del carrito
      window.location.href = './cart.html';
    });
  });
  // Verificar si el usuario está logueado
  const checkLoginStatus = () => {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
  };

  // Obtener información del usuario
  const getUserInfo = () => {
    const userStr = localStorage.getItem('user') || localStorage.getItem('current_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  // Actualizar información del usuario en el menú
  const updateUserMenu = () => {
    const userMenu = document.getElementById('user-menu');
    const userMenuName = document.getElementById('user-menu-name');
    const userMenuEmail = document.getElementById('user-menu-email');
    
    if (checkLoginStatus()) {
      const user = getUserInfo();
      if (userMenuName && user) {
        userMenuName.textContent = user?.user_metadata?.name || 'Usuario';
      }
      if (userMenuEmail && user) {
        userMenuEmail.textContent = user?.email || '-';
      }
    }
  };

  // Manejo del menú de usuario
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userMenu = document.getElementById('user-menu');
  
  if (userMenuBtn && userMenu) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (checkLoginStatus()) {
        // Mostrar menú desplegable
        updateUserMenu();
        userMenu.hidden = !userMenu.hidden;
      } else {
        // Redirigir al login si no está logueado
        window.location.href = './login.html';
      }
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
        userMenu.hidden = true;
      }
    });
  }

  // Manejo del botón de logout en el navbar
  const logoutBtnNavbar = document.getElementById('logout-btn-navbar');
  if (logoutBtnNavbar) {
    logoutBtnNavbar.addEventListener('click', () => {
      // Limpiar localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('current_user');
      localStorage.removeItem('current_session');
      
      // Ocultar menú
      if (userMenu) userMenu.hidden = true;
      
      // Recargar página
      window.location.reload();
    });
  }

  // Actualizar menú al cargar
  updateUserMenu();

  // Footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // =====================
  // Catalog (filter + grid)
  // =====================
  const gridEl = document.getElementById('catalog-grid');
  const filtersEl = document.getElementById('catalog-filters');
  const searchEl = document.getElementById('catalog-search');
  const emptyEl = document.getElementById('catalog-empty');
  const clearBtn = document.getElementById('catalog-clear');

  if (gridEl && filtersEl) {
    let selectedCategory = 'all';
    let searchQuery = '';

    const renderFilters = () => {
      filtersEl.innerHTML = '';
      categories.forEach((cat) => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (selectedCategory === cat.id ? ' active' : '');
        btn.textContent = cat.name;
        btn.addEventListener('click', () => {
          selectedCategory = cat.id;
          renderFilters();
          renderGrid();
        });
        filtersEl.appendChild(btn);
      });
    };

    const formatCurrency = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
    
    // Función para obtener imagen por categoría
    const getCategoryImage = (category) => {
      const categoryMap = {
        'panaderia': 'https://images.unsplash.com/photo-1627308593341-d886acdc06a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwYnJlYWQlMjBiYWtlcnl8ZW58MXx8fHwxNzYxODE5MTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'granola': 'https://images.unsplash.com/photo-1595787572590-545171362a1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZ3Jhbm9sYSUyMG51dHN8ZW58MXx8fHwxNzYxODUwNTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'galleteria': 'https://images.unsplash.com/photo-1644595425685-5769f217654a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY29va2llc3xlbnwxfHx8fDE3NjE4NTA1ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'frutos-secos': 'https://images.unsplash.com/photo-1702506183897-e4869f155209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGZydWl0cyUyMHNlZWRzfGVufDF8fHx8MTc2MTg1MDU4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'bakery': 'https://images.unsplash.com/photo-1627308593341-d886acdc06a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwYnJlYWQlMjBiYWtlcnl8ZW58MXx8fHwxNzYxODE5MTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'cookies': 'https://images.unsplash.com/photo-1644595425685-5769f217654a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY29va2llc3xlbnwxfHx8fDE3NjE4NTA1ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'nuts': 'https://images.unsplash.com/photo-1702506183897-e4869f155209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGZydWl0cyUyMHNlZWRzfGVufDF8fHx8MTc2MTg1MDU4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      };
      
      return categoryMap[category] || categoryMap['panaderia'];
    };
    
    // Función para manejar agregar al carrito
    const handleAddToCart = (product) => {
      const cart = getCart();
      
      // Buscar si el producto ya está en el carrito
      const existingItemIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Si existe, incrementar la cantidad
        cart[existingItemIndex].quantity += 1;
      } else {
        // Si no existe, agregar nuevo item
        cart.push({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image || getCategoryImage(product.category),
          category: product.category,
          quantity: 1
        });
      }
      
      // Guardar carrito en localStorage
      saveCart(cart);
      
      // Actualizar badge
      updateCartBadge();
      
      // Mostrar confirmación visual (opcional)
      console.log('Producto agregado al carrito:', product.name);
    };
    
    // Función para abrir modal de detalles
    const openProductModal = (product) => {
      const modal = document.getElementById('product-modal');
      const modalTitle = document.getElementById('product-modal-title');
      const modalImage = document.getElementById('product-modal-image');
      const modalDescription = document.getElementById('product-modal-description');
      const modalIngredients = document.getElementById('product-modal-ingredients');
      const modalIngredientsSection = document.getElementById('product-modal-ingredients-section');
      const modalBenefits = document.getElementById('product-modal-benefits');
      const modalBenefitsSection = document.getElementById('product-modal-benefits-section');
      const modalPrice = document.getElementById('product-modal-price');
      const modalAddBtn = document.getElementById('product-modal-add-btn');
      
      if (!modal) return;
      
      // Llenar información del producto
      const productImage = product.image || getCategoryImage(product.category);
      
      if (modalTitle) modalTitle.textContent = product.name;
      if (modalImage) {
        modalImage.src = productImage;
        modalImage.alt = product.name;
        modalImage.onerror = () => {
          modalImage.src = getCategoryImage(product.category);
        };
      }
      if (modalDescription) modalDescription.textContent = product.description || '';
      
      // Ingredientes
      if (product.ingredients) {
        if (modalIngredients) modalIngredients.textContent = product.ingredients;
        if (modalIngredientsSection) modalIngredientsSection.hidden = false;
      } else {
        if (modalIngredientsSection) modalIngredientsSection.hidden = true;
      }
      
      // Beneficios
      if (product.benefits) {
        if (modalBenefits) modalBenefits.textContent = product.benefits;
        if (modalBenefitsSection) modalBenefitsSection.hidden = false;
      } else {
        if (modalBenefitsSection) modalBenefitsSection.hidden = true;
      }
      
      if (modalPrice) modalPrice.textContent = formatCurrency(product.price);
      
      // Guardar referencia al producto para el botón
      if (modalAddBtn) {
        modalAddBtn.dataset.productId = product.id;
      }
      
      modal.hidden = false;
      document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    };
    
    // Función para cerrar modal
    const closeProductModal = () => {
      const modal = document.getElementById('product-modal');
      if (modal) {
        modal.hidden = true;
        document.body.style.overflow = ''; // Restaurar scroll del body
      }
    };
    
    // Función para ver detalles (compatibilidad)
    const handleViewDetails = (product) => {
      openProductModal(product);
    };
    
    // Event listeners para el modal
    const modalOverlay = document.getElementById('product-modal-overlay');
    const modalClose = document.getElementById('product-modal-close');
    const modalAddBtn = document.getElementById('product-modal-add-btn');
    
    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeProductModal);
    }
    
    if (modalClose) {
      modalClose.addEventListener('click', closeProductModal);
    }
    
    // Event listener para agregar al carrito desde el modal
    if (modalAddBtn) {
      modalAddBtn.addEventListener('click', () => {
        const modal = document.getElementById('product-modal');
        if (!modal || modal.hidden) return;
        
        // Buscar el producto actual por el ID guardado
        const productId = modalAddBtn.dataset.productId;
        if (productId) {
          const product = products.find(p => p.id === productId);
          if (product) {
            handleAddToCart(product);
            closeProductModal();
          }
        }
      });
    }
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('product-modal');
        if (modal && !modal.hidden) {
          closeProductModal();
        }
      }
    });

    const filterProducts = () => {
      let list = products.slice();
      if (selectedCategory !== 'all') list = list.filter(p => p.category === selectedCategory);
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        list = list.filter(p =>
          p.name.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.ingredients || '').toLowerCase().includes(q)
        );
      }
      return list;
    };

    const renderGrid = () => {
      const list = filterProducts();
      gridEl.innerHTML = '';
      if (list.length === 0) {
        if (emptyEl) emptyEl.hidden = false;
        return;
      }
      if (emptyEl) emptyEl.hidden = true;
      list.forEach((p) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Obtener imagen del producto o usar imagen por categoría
        const productImage = p.image || getCategoryImage(p.category);
        
        card.innerHTML = `
          <div class="product-media">
            <img 
              src="${productImage}" 
              alt="${p.name}"
              onerror="this.src='${getCategoryImage(p.category)}'"
            />
          </div>
          <div class="product-body">
            <h3 class="product-title">${p.name}</h3>
            <p class="product-desc">${p.description || ''}</p>
            <div class="product-price-row">
              <span class="product-price">${formatCurrency(p.price)}</span>
              <button class="product-info-btn" data-product-id="${p.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="product-footer">
            <button class="product-view-btn" data-product-id="${p.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>Ver Detalles</span>
            </button>
            <button class="product-add-btn" data-product-id="${p.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>Agregar al carrito</span>
            </button>
          </div>
        `;
        
        // Agregar event listeners
        const infoBtn = card.querySelector('.product-info-btn');
        const viewBtn = card.querySelector('.product-view-btn');
        const addBtn = card.querySelector('.product-add-btn');
        
        if (infoBtn) {
          infoBtn.addEventListener('click', () => handleViewDetails(p));
        }
        
        if (viewBtn) {
          viewBtn.addEventListener('click', () => handleViewDetails(p));
        }
        
        if (addBtn) {
          addBtn.addEventListener('click', () => handleAddToCart(p));
        }
        
        gridEl.appendChild(card);
      });
    };

    if (searchEl) {
      searchEl.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderGrid();
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        selectedCategory = 'all';
        searchQuery = '';
        if (searchEl) searchEl.value = '';
        renderFilters();
        renderGrid();
        navigate('catalog');
      });
    }

    renderFilters();
    renderGrid();
  }
});
