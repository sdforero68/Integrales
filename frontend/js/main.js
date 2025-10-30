import { products, categories } from './products.js';

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
  const cartBadges = Array.from(document.querySelectorAll('.cart-badge'));
  let cartItemsCount = 0; // demo default
  const isLoggedIn = false; // demo default

  const updateCartBadge = () => {
    cartBadges.forEach((badge) => {
      if (cartItemsCount > 0) {
        badge.textContent = String(cartItemsCount);
        badge.hidden = false;
      } else {
        badge.hidden = true;
      }
    });
  };
  updateCartBadge();

  document.querySelectorAll('[data-action="cart"]').forEach((el) => {
    el.addEventListener('click', () => {
      // demo: navegar al catálogo; aquí podrías abrir un modal de carrito
      navigate('catalog');
    });
  });
  document.querySelectorAll('[data-action="user"]').forEach((el) => {
    el.addEventListener('click', () => {
      // demo: navegar a about; en real: profile/login
      navigate(isLoggedIn ? 'about' : 'about');
    });
  });

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
        card.innerHTML = `
          <div class="product-media">
            <img src="${p.image}" alt="${p.name}" />
          </div>
          <div class="product-body">
            <div class="product-title">${p.name}</div>
            <div class="product-desc">${p.description || ''}</div>
            <div class="product-tags">${(p.tags || []).map(t => `<span class="badge-tag">${t}</span>`).join('')}</div>
            <div class="product-footer">
              <span class="price">${formatCurrency(p.price)}</span>
              <div class="actions">
                <button class="btn-small btn-view">Ver</button>
                <button class="btn-small btn-add">Añadir</button>
              </div>
            </div>
          </div>
        `;
        const [btnView, btnAdd] = card.querySelectorAll('.actions > button');
        btnView.addEventListener('click', () => {
          alert(`${p.name}\n\n${p.description || ''}`);
        });
        btnAdd.addEventListener('click', () => {
          cartItemsCount += 1;
          updateCartBadge();
        });
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
