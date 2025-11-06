import { products, categories } from './products.js';
import { initAccordions } from './ui/accordion.js';
import { initAlertDialogs } from './ui/alert-dialog.js';
import { initAlerts } from './ui/alert.js';
import { initAspectRatios } from './ui/aspect-ratio.js';
import { initAvatars } from './ui/avatar.js';
import { initBreadcrumbs } from './ui/breadcrumb.js';
import { initButtons } from './ui/button.js';
import { initCalendars } from './ui/calendar.js';
import { initCards } from './ui/card.js';
import { initCarousels } from './ui/carousel.js';
import { initCharts } from './ui/chart.js';
import { initCheckboxes } from './ui/checkbox.js';
import { initCollapsibles } from './ui/collapsible.js';
import { initContextMenus } from './ui/context-menu.js';
import { initDialogs } from './ui/dialog.js';
import { initDrawers } from './ui/drawer.js';
import { initDropdownMenus } from './ui/dropdown-menu.js';
import { initForms } from './ui/form.js';
import { initHoverCards } from './ui/hover-card.js';
import { initInputOTPs } from './ui/input-otp.js';
import { initInputs } from './ui/input.js';
import { initLabels } from './ui/label.js';
import { initMenubars } from './ui/menubar.js';
import { initNavigationMenus } from './ui/navigation-menu.js';
import { initPagination } from './ui/pagination.js';
import { initPopovers } from './ui/popover.js';
import { initProgresses } from './ui/progress.js';
import { initRadioGroups } from './ui/radio-group.js';
import { initResizablePanelGroups } from './ui/resizable-panel.js';
import { initScrollAreas } from './ui/scroll-area.js';
import { initSelects } from './ui/select.js';
import { initSeparators } from './ui/separator.js';
import { initSheets } from './ui/sheet.js';
import { initSidebars } from './ui/sidebar.js';
import { initSkeletons } from './ui/skeleton.js';
import { initSliders } from './ui/slider.js';
import { initSwitches } from './ui/switch.js';
import { initTables } from './ui/table.js';
import { initTabs } from './ui/tabs.js';
import { initTextareas } from './ui/textarea.js';
import { initToggles } from './ui/toggle.js';
import { initToggleGroups } from './ui/toggle-group.js';
import { initTooltips } from './ui/tooltip.js';
import { initToaster } from './ui/toaster.js';
import { initApp } from './app.js';

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

  // Función para navegar a páginas separadas o secciones en la misma página
  function navigate(target) {
    // Si el target es una página HTML, redirigir
    if (target.endsWith('.html')) {
      window.location.href = target;
      return;
    }
    
    // Si estamos en index.html, intentar hacer scroll a la sección
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
      const el = document.getElementById(target);
      if (el) {
        const rect = el.getBoundingClientRect();
        const targetY = window.scrollY + rect.top - navHeight + 1;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        return;
      }
    }
    
    // Mapeo de secciones a páginas
    const pageMap = {
      'home': './index.html',
      'catalog': './catalog.html',
      'markets': './markets.html',
      'about': './about.html',
      'contact': './contact.html'
    };
    
    if (pageMap[target]) {
      window.location.href = pageMap[target];
    }
  }

  // Manejar botones con data-target
  document.querySelectorAll('[data-target]')
    .forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
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

  // Scrollspy active link handling (solo para index.html)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
    const sections = [
      { id: 'home', el: document.getElementById('home') },
      { id: 'about', el: document.getElementById('about') },
    ].filter(s => s.el);
    const links = Array.from(document.querySelectorAll('.nav-link'));

    const setActive = (id) => {
      links.forEach((a) => {
        const href = a.getAttribute('href');
        if (href === './index.html' || href === 'index.html') {
          a.classList.toggle('active', id === 'home' || !id);
        } else {
          a.classList.remove('active');
        }
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
  } else {
    // Para otras páginas, marcar el enlace activo según la página actual
    const links = Array.from(document.querySelectorAll('.nav-link'));
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && (href.includes(currentPage) || (currentPage === 'index.html' && (href === './index.html' || href === 'index.html')))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Función local para actualizar badge (para compatibilidad cuando sync.js no está disponible)
  const updateCartBadgeLocal = () => {
    const count = getCartItemsCount();
    const cartBadges = Array.from(document.querySelectorAll('.cart-badge, #cart-badge'));
    cartBadges.forEach((badge) => {
      if (count > 0) {
        badge.textContent = String(count);
        badge.hidden = false;
      } else {
        badge.hidden = true;
      }
    });
  };
  
  // Intentar usar sync.js, pero tener fallback local
  import('./sync.js').then(({ updateCartBadge }) => {
    updateCartBadge();
  }).catch(() => {
    // Si sync.js no está disponible, usar función local
    updateCartBadgeLocal();
  });
  
  // También definir updateCartBadge para uso en otras funciones
  window.updateCartBadge = updateCartBadgeLocal;

  // El manejo del botón de carrito ahora se hace mediante sync.js
  // El manejo del login ahora se hace mediante sync.js
  // Solo mantener funciones locales para compatibilidad si es necesario

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
        'amasijos': 'https://images.unsplash.com/photo-1603532551666-451a96bca5fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        'galleteria': 'https://images.unsplash.com/photo-1644595425685-5769f217654a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY29va2llc3xlbnwxfHx8fDE3NjE4NTA1ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'granola': 'https://images.unsplash.com/photo-1595787572590-545171362a1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZ3Jhbm9sYSUyMG51dHN8ZW58MXx8fHwxNzYxODUwNTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'frutos-secos': 'https://images.unsplash.com/photo-1702506183897-e4869f155209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGZydWl0cyUyMHNlZWRzfGVufDF8fHx8MTc2MTg1MDU4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'envasados': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        // Compatibilidad con IDs antiguos
        'bakery': 'https://images.unsplash.com/photo-1627308593341-d886acdc06a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwYnJlYWQlMjBiYWtlcnl8ZW58MXx8fHwxNzYxODE5MTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'cookies': 'https://images.unsplash.com/photo-1644595425685-5769f217654a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY29va2llc3xlbnwxfHx8fDE3NjE4NTA1ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'nuts': 'https://images.unsplash.com/photo-1702506183897-e4869f155209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGZydWl0cyUyMHNlZWRzfGVufDF8fHx8MTc2MTg1MDU4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'jarred': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
      };
      
      return categoryMap[category] || categoryMap['panaderia'];
    };
    
    // Función para manejar agregar al carrito (usando sync.js)
    const handleAddToCart = async (product) => {
      try {
        // Importar función de sincronización
        const { addToCart } = await import('./sync.js');
        addToCart(product);
      } catch (error) {
        // Fallback local si sync.js no está disponible
        console.error('Error importing sync:', error);
        const cart = getCart();
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
          cart[existingItemIndex].quantity += 1;
        } else {
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
        
        saveCart(cart);
        updateCartBadgeLocal();
        
        if (window.toast) {
          window.toast.success(`${product.name} agregado al carrito`);
        } else {
          console.log('Producto agregado al carrito:', product.name);
        }
      }
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
    
    // Función para ver detalles
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
      // Verificar que products esté disponible
      if (!products || products.length === 0) {
        console.error('No hay productos disponibles');
        if (emptyEl) emptyEl.hidden = false;
        if (gridEl) gridEl.innerHTML = '<div class="text-center py-16"><p class="text-xl">No hay productos disponibles en este momento.</p></div>';
        return;
      }
      
      const list = filterProducts();
      console.log(`Renderizando ${list.length} productos de ${products.length} totales`);
      
      if (!gridEl) {
        console.error('Elemento catalog-grid no encontrado');
        return;
      }
      
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
        // No navegar, solo limpiar filtros y mostrar todos los productos
      });
    }

    // Verificar que products y categories estén disponibles
    if (!products || products.length === 0) {
      console.error('Error: No se pudieron cargar los productos');
      if (gridEl) {
        gridEl.innerHTML = '<div class="text-center py-16"><p class="text-xl">Error al cargar los productos. Por favor, recarga la página.</p></div>';
      }
    } else {
      console.log(`Productos cargados: ${products.length}`);
      renderFilters();
      renderGrid();
    }
  } else {
    console.warn('Elementos del catálogo no encontrados (catalog-grid o catalog-filters)');
  }

  // =====================
  // Contact Form
  // =====================
  const contactForm = document.getElementById('contact-form');
  const contactSubmit = document.getElementById('contact-submit');
  const contactSubmitText = document.getElementById('contact-submit-text');
  const contactSuccess = document.getElementById('contact-success');
  const contactError = document.getElementById('contact-error');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Obtener valores del formulario
      const formData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        phone: document.getElementById('contact-phone').value,
        message: document.getElementById('contact-message').value
      };

      // Deshabilitar botón y mostrar estado de carga
      contactSubmit.disabled = true;
      contactSubmitText.textContent = 'Enviando...';
      contactSuccess.hidden = true;
      contactError.hidden = true;

      try {
        // Importar configuración de Supabase
        const { projectId, publicAnonKey } = await import('./config.js');
        
        // Verificar que las credenciales estén configuradas
        if (projectId === 'tu-project-id' || publicAnonKey === 'tu-public-anon-key') {
          throw new Error('Por favor configura las credenciales de Supabase en config.js');
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-7b271734/contact`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify(formData)
          }
        );

        if (response.ok) {
          // Mostrar mensaje de éxito
          contactSuccess.hidden = false;
          contactError.hidden = true;
          
          // Limpiar formulario
          contactForm.reset();
          
          // Ocultar mensaje después de 5 segundos
          setTimeout(() => {
            contactSuccess.hidden = true;
          }, 5000);
        } else {
          // Mostrar mensaje de error
          contactError.hidden = false;
          contactSuccess.hidden = true;
        }
      } catch (error) {
        console.error('Error submitting contact form:', error);
        contactError.hidden = false;
        contactSuccess.hidden = true;
      } finally {
        // Restaurar botón
        contactSubmit.disabled = false;
        contactSubmitText.textContent = 'Enviar Mensaje';
      }
    });
  }

  // =====================
  // Accordion
  // =====================
  initAccordions();

  // =====================
  // AlertDialog
  // =====================
  initAlertDialogs();

  // =====================
  // Alert
  // =====================
  initAlerts();

  // =====================
  // AspectRatio
  // =====================
  initAspectRatios();

  // =====================
  // Avatar
  // =====================
  initAvatars();

  // =====================
  // Breadcrumb
  // =====================
  initBreadcrumbs();

  // =====================
  // Button
  // =====================
  initButtons();

  // =====================
  // Calendar
  // =====================
  initCalendars();

  // =====================
  // Card
  // =====================
  initCards();

  // =====================
  // Carousel
  // =====================
  initCarousels();

  // =====================
  // Chart
  // =====================
  initCharts();

  // =====================
  // Checkbox
  // =====================
  initCheckboxes();

  // =====================
  // Collapsible
  // =====================
  initCollapsibles();

  // =====================
  // ContextMenu
  // =====================
  initContextMenus();

  // =====================
  // Dialog
  // =====================
  initDialogs();

  // =====================
  // Drawer
  // =====================
  initDrawers();

  // =====================
  // DropdownMenu
  // =====================
  initDropdownMenus();

  // =====================
  // Form
  // =====================
  initForms();

  // =====================
  // HoverCard
  // =====================
  initHoverCards();

  // =====================
  // InputOTP
  // =====================
  initInputOTPs();

  // =====================
  // Input
  // =====================
  initInputs();

  // =====================
  // Label
  // =====================
  initLabels();

  // =====================
  // Menubar
  // =====================
  initMenubars();

  // =====================
  // NavigationMenu
  // =====================
  initNavigationMenus();

  // =====================
  // Pagination
  // =====================
  initPagination();

  // =====================
  // Popover
  // =====================
  initPopovers();

  // =====================
  // Progress
  // =====================
  initProgresses();

  // =====================
  // RadioGroup
  // =====================
  initRadioGroups();

  // =====================
  // ResizablePanelGroup
  // =====================
  initResizablePanelGroups();

  // =====================
  // ScrollArea
  // =====================
  initScrollAreas();

  // =====================
  // Select
  // =====================
  initSelects();

  // =====================
  // Separator
  // =====================
  initSeparators();

  // =====================
  // Sheet
  // =====================
  initSheets();

  // =====================
  // Sidebar
  // =====================
  initSidebars();

  // =====================
  // Skeleton
  // =====================
  initSkeletons();

  // =====================
  // Slider
  // =====================
  initSliders();

  // =====================
  // Switch
  // =====================
  initSwitches();

  // =====================
  // Table
  // =====================
  initTables();

  // =====================
  // Tabs
  // =====================
  initTabs();

  // =====================
  // Textarea
  // =====================
  initTextareas();

  // =====================
  // Toggle
  // =====================
  initToggles();

  // =====================
  // ToggleGroup
  // =====================
  initToggleGroups();

  // =====================
  // Tooltip
  // =====================
  initTooltips();

  // =====================
  // Toaster
  // =====================
  initToaster();

  // =====================
  // App (Estado Global y Navegación)
  // =====================
  initApp();
});
