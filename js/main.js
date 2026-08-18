/* ==========================================================================
   SudAmerica Auto Elite — Main JavaScript
   Modern & Bold · Interactive Showroom Engine
   Zero external dependencies · High-performance vanilla JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initNavbar();
  initSmoothScroll();
  initScrollReveal();
  initHeroCanvas();
  initAmbientGlow();
  initCatalogEngine();
  initSavingsCalculator();
  initFaqAccordion();
  initModal();
  initCounterAnimation();
  initCardTiltEffect();
  initMobileMenu();
  initContactForm();
  initBackToTop();
  initSocialTicker();
});


/* ---------- 1. Page Loader ---------- */
function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add('hidden');
    setTimeout(() => {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    }, 600);
  };

  window.addEventListener('load', () => setTimeout(hideLoader, 300));
  setTimeout(hideLoader, 2500);
}


/* ---------- 2. Navbar Scroll Behavior ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 60;
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > SCROLL_THRESHOLD) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}


/* ---------- 3. Smooth Scroll for Anchor Links ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();
      closeMobileMenu();

      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}


/* ---------- 4. Scroll Reveal Animations ---------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}


/* ---------- 5. Hero Interactive Canvas Particles ---------- */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 120 };

  const resize = () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.color = Math.random() > 0.5 ? 'rgba(0, 229, 255, ' : 'rgba(124, 77, 255, ';
      this.alpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse reaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  // Create particles
  const particleCount = Math.min(Math.floor(width / 20), 65);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Connect particles
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const opacity = (1 - dist / 110) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}


/* ---------- 6. Ambient Mouse Glow Follower ---------- */
function initAmbientGlow() {
  const glow = document.getElementById('ambientGlow');
  if (!glow || window.matchMedia('(hover: none)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function renderGlow() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(renderGlow);
  }

  renderGlow();
}


/* ---------- 7. Catalog Advanced Engine (Search, Filter, Sort) ---------- */
function initCatalogEngine() {
  const searchInput = document.getElementById('catalogSearch');
  const sortSelect = document.getElementById('catalogSort');
  const filterButtons = document.querySelectorAll('.catalog__filter');
  const carGrid = document.getElementById('catalogGrid');
  const emptyState = document.getElementById('catalogEmpty');
  const resultsCountEl = document.getElementById('catalogResultsCount');
  const resetBtn = document.getElementById('resetFiltersBtn');

  if (!carGrid) return;

  const originalCards = Array.from(carGrid.querySelectorAll('.car-card'));
  let currentFilter = 'all';
  let currentSearch = '';
  let currentSort = 'featured';

  // Update dynamic count badges on filter pills
  const updateFilterCounts = () => {
    const counts = { all: originalCards.length, classica: 0, rally: 0, supercar: 0, suv: 0 };
    originalCards.forEach(card => {
      const cat = (card.dataset.category || '').toLowerCase();
      if (counts[cat] !== undefined) counts[cat]++;
    });

    document.querySelectorAll('.catalog__filter-count').forEach(badge => {
      const catKey = badge.dataset.countFor;
      if (counts[catKey] !== undefined) {
        badge.textContent = counts[catKey];
      }
    });
  };

  updateFilterCounts();

  const applyFiltersAndSort = () => {
    let visibleCards = originalCards.filter(card => {
      const category = (card.dataset.category || '').toLowerCase();
      const name = (card.dataset.name || '').toLowerCase();
      const year = (card.dataset.year || '').toLowerCase();
      const engine = (card.dataset.engine || '').toLowerCase();
      const desc = (card.dataset.description || '').toLowerCase();

      // Category matching
      const matchesCategory = currentFilter === 'all' || category === currentFilter;

      // Full text search matching
      const searchTerms = currentSearch.toLowerCase().trim().split(/\s+/);
      const combinedText = `${name} ${year} ${category} ${engine} ${desc}`;
      const matchesSearch = searchTerms.every(term => combinedText.includes(term));

      return matchesCategory && matchesSearch;
    });

    // Sorting
    if (currentSort === 'price-asc') {
      visibleCards.sort((a, b) => (parseFloat(a.dataset.rawPrice) || 0) - (parseFloat(b.dataset.rawPrice) || 0));
    } else if (currentSort === 'price-desc') {
      visibleCards.sort((a, b) => (parseFloat(b.dataset.rawPrice) || 0) - (parseFloat(a.dataset.rawPrice) || 0));
    } else if (currentSort === 'year-desc') {
      visibleCards.sort((a, b) => (parseInt(b.dataset.rawYear, 10) || 0) - (parseInt(a.dataset.rawYear, 10) || 0));
    } else if (currentSort === 'year-asc') {
      visibleCards.sort((a, b) => (parseInt(a.dataset.rawYear, 10) || 0) - (parseInt(b.dataset.rawYear, 10) || 0));
    }

    // DOM Update
    originalCards.forEach(card => {
      if (visibleCards.includes(card)) {
        card.style.display = '';
        card.classList.add('visible');
      } else {
        card.style.display = 'none';
      }
    });

    // Reorder DOM children according to sorted visibleCards
    visibleCards.forEach(card => carGrid.appendChild(card));

    // Show/Hide Empty State
    if (emptyState) {
      if (visibleCards.length === 0) {
        emptyState.style.display = 'block';
        carGrid.appendChild(emptyState);
      } else {
        emptyState.style.display = 'none';
      }
    }

    // Results Count text
    if (resultsCountEl) {
      resultsCountEl.textContent = `Mostrando ${visibleCards.length} di ${originalCards.length} auto disponibili`;
    }
  };

  // Search input handler with debounce
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentSearch = e.target.value;
        applyFiltersAndSort();
      }, 150);
    });
  }

  // Sort dropdown handler
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFiltersAndSort();
    });
  }

  // Filter pills handler
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter || 'all';
      applyFiltersAndSort();
    });
  });

  // Reset filters button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearch = '';
      currentFilter = 'all';
      filterButtons.forEach(b => {
        b.classList.toggle('active', b.dataset.filter === 'all');
      });
      if (sortSelect) sortSelect.value = 'featured';
      currentSort = 'featured';
      applyFiltersAndSort();
    });
  }
}


/* ---------- 8. Interactive Savings & Import Cost Calculator ---------- */
function initSavingsCalculator() {
  const carSelect = document.getElementById('calcCarSelect');
  const customPriceWrap = document.getElementById('calcCustomPriceWrap');
  const customPriceInput = document.getElementById('calcCustomPrice');
  const countrySelect = document.getElementById('calcCountry');
  const optInsurance = document.getElementById('calcOptInsurance');
  const optAsi = document.getElementById('calcOptAsi');
  const optHomeDelivery = document.getElementById('calcOptHomeDelivery');

  const resCarName = document.getElementById('calcResCarName');
  const resBase = document.getElementById('calcResBase');
  const resShipping = document.getElementById('calcResShipping');
  const resCustoms = document.getElementById('calcResCustoms');
  const resOptions = document.getElementById('calcResOptions');
  const resTotal = document.getElementById('calcResTotal');
  const resEuMarket = document.getElementById('calcResEuMarket');
  const resSavings = document.getElementById('calcResSavings');
  const whatsappCta = document.getElementById('calcWhatsappCta');

  if (!carSelect) return;

  const formatEuro = (amount) => '€' + Math.round(amount).toLocaleString('it-IT');

  const calculate = () => {
    let basePrice = 28500;
    let euMarketPrice = 42000;
    let carName = 'Alfa Romeo Spider 2000 (1972)';

    if (carSelect.value === 'custom') {
      if (customPriceWrap) customPriceWrap.style.display = 'block';
      basePrice = parseFloat(customPriceInput?.value) || 30000;
      euMarketPrice = basePrice * 1.45; // Estimated 45% premium in Europe
      carName = `Veicolo Personalizzato (${formatEuro(basePrice)})`;
    } else {
      if (customPriceWrap) customPriceWrap.style.display = 'none';
      const selectedOption = carSelect.options[carSelect.selectedIndex];
      basePrice = parseFloat(selectedOption.dataset.price) || 28500;
      euMarketPrice = parseFloat(selectedOption.dataset.eu) || basePrice * 1.4;
      carName = selectedOption.dataset.name || 'Veicolo Selezionato';
    }

    // Shipping estimation
    const destination = countrySelect?.value || 'IT';
    let shippingCost = 2600;
    if (destination === 'DE') shippingCost = 2800;
    if (destination === 'FR') shippingCost = 2700;
    if (destination === 'ES') shippingCost = 2500;
    if (destination === 'CH') shippingCost = 2950;

    // Customs & Duties for Historic/Classic Cars (>30 years old favorable rate: ~10% customs/import taxes)
    const customsDuties = basePrice * 0.10 + 285;

    // Options breakdown
    let optionsTotal = 0;
    let optionsList = [];
    if (optInsurance?.checked) {
      optionsTotal += 650;
      optionsList.push('Assicurazione All-Risk');
    }
    if (optAsi?.checked) {
      optionsTotal += 850;
      optionsList.push('Pratiche ASI/CRS');
    }
    if (optHomeDelivery?.checked) {
      optionsTotal += 700;
      optionsList.push('Bisarca a domicilio');
    }

    const grandTotal = basePrice + shippingCost + customsDuties + optionsTotal;
    const savingsAmount = Math.max(0, euMarketPrice - grandTotal);
    const savingsPercent = Math.round((savingsAmount / euMarketPrice) * 100);

    // Update UI elements
    if (resCarName) resCarName.textContent = carName;
    if (resBase) resBase.textContent = formatEuro(basePrice);
    if (resShipping) resShipping.textContent = formatEuro(shippingCost);
    if (resCustoms) resCustoms.textContent = formatEuro(customsDuties);
    if (resOptions) resOptions.textContent = formatEuro(optionsTotal);
    if (resTotal) resTotal.textContent = formatEuro(grandTotal);
    if (resEuMarket) resEuMarket.textContent = formatEuro(euMarketPrice);

    if (resSavings) {
      resSavings.textContent = `${formatEuro(savingsAmount)} (-${savingsPercent}%)`;
    }

    // Update WhatsApp pre-filled CTA
    if (whatsappCta) {
      const destinationText = countrySelect?.options[countrySelect.selectedIndex]?.text || 'Italia';
      const msg = `Ciao SudAmerica Auto Elite! Ho configurato un preventivo per: ${carName}.\nDestinazione: ${destinationText}\nTotale Stimato: ${formatEuro(grandTotal)} (Risparmio stimato: ${formatEuro(savingsAmount)}).\nVorrei bloccare questo preventivo e ricevere maggiori dettagli.`;
      whatsappCta.href = `https://wa.me/595971774994?text=${encodeURIComponent(msg)}`;
    }
  };

  carSelect.addEventListener('change', calculate);
  if (customPriceInput) customPriceInput.addEventListener('input', calculate);
  if (countrySelect) countrySelect.addEventListener('change', calculate);
  [optInsurance, optAsi, optHomeDelivery].forEach(opt => {
    if (opt) opt.addEventListener('change', calculate);
  });

  calculate();
}


/* ---------- 9. Interactive FAQ Accordion ---------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq__item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq__question-btn');
    const answer = item.querySelector('.faq__answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq__question-btn');
        const otherAnswer = otherItem.querySelector('.faq__answer');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}


/* ---------- 10. Car Detail Modal (Multi-view Gallery, Checklist & Share) ---------- */
function initModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (!overlay) return;

  const modal = overlay.querySelector('.modal');
  const closeBtn = overlay.querySelector('.modal__close');
  const shareBtn = document.getElementById('modalShareBtn');
  const calcLinkBtn = document.getElementById('modalCalcLinkBtn');
  const galleryTabs = document.querySelectorAll('.modal__gallery-tab');

  /* Open modal on car card click */
  document.querySelectorAll('.car-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  /* Close modal handlers */
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  let currentCardData = null;

  function openModal(card) {
    const data = card.dataset;
    currentCardData = data;
    const imgSrc = card.querySelector('.car-card__image img')?.src || '';

    const modalImage = document.getElementById('modalMainImg');
    const modalBadge = modal.querySelector('.modal__badge');
    const modalTitle = modal.querySelector('.modal__title');
    const modalYear = modal.querySelector('.modal__year');
    const modalDesc = modal.querySelector('.modal__description');
    const modalPrice = modal.querySelector('.modal__price');
    const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');

    if (modalImage) {
      modalImage.src = imgSrc;
      modalImage.dataset.defaultSrc = imgSrc;
    }

    // Reset gallery tabs
    galleryTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.view === 'front'));

    if (modalBadge) {
      modalBadge.textContent = data.category || 'Speciale';
      modalBadge.className = `modal__badge car-card__badge--${(data.category || '').toLowerCase()}`;
    }
    if (modalTitle) modalTitle.textContent = data.name || '';
    if (modalYear) modalYear.textContent = `Anno: ${data.year || ''} · Match: ${data.match === 'matching-numbers' ? 'Matching Numbers' : 'Artigianale d\'Autore'}`;
    if (modalDesc) modalDesc.textContent = data.description || '';
    if (modalPrice) modalPrice.textContent = data.price || '';

    if (modalWhatsappBtn) {
      const carText = `Ciao SudAmerica Auto Elite! Sono interessato alla scheda completa di: ${data.name || ''} (${data.year || ''}) a ${data.price || ''}. Vorrei richiedere il video test drive e il report a 120 punti.`;
      modalWhatsappBtn.href = `https://wa.me/595971774994?text=${encodeURIComponent(carText)}`;
    }

    // Specs
    const specs = modal.querySelectorAll('.modal__spec-value');
    if (specs.length >= 4) {
      specs[0].textContent = data.engine || '-';
      specs[1].textContent = data.power || '-';
      specs[2].textContent = data.km || '-';
      specs[3].textContent = data.transmission || '-';
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Gallery tabs switcher simulation
  galleryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      galleryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const modalImage = document.getElementById('modalMainImg');
      if (!modalImage) return;

      modalImage.style.opacity = '0.4';
      modalImage.style.transform = 'scale(0.98)';

      setTimeout(() => {
        modalImage.style.transition = 'all 0.3s ease';
        modalImage.style.opacity = '1';
        modalImage.style.transform = 'scale(1)';
      }, 150);
    });
  });

  // Share button copy link
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const carName = currentCardData?.name || 'Auto Esclusiva';
      const url = window.location.href.split('#')[0] + '#catalogo';

      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          const origText = shareBtn.textContent;
          shareBtn.textContent = '✓ Link Copiato!';
          shareBtn.style.borderColor = '#00e676';
          shareBtn.style.color = '#00e676';

          setTimeout(() => {
            shareBtn.textContent = origText;
            shareBtn.style.borderColor = '';
            shareBtn.style.color = '';
          }, 2500);
        });
      }
    });
  }

  // Link to calculator button inside modal
  if (calcLinkBtn) {
    calcLinkBtn.addEventListener('click', () => {
      closeModal();
      const calcSection = document.getElementById('calcolatore');
      const carSelect = document.getElementById('calcCarSelect');

      if (carSelect && currentCardData) {
        // Try to match select option
        for (let i = 0; i < carSelect.options.length; i++) {
          if (carSelect.options[i].text.toLowerCase().includes((currentCardData.name || '').toLowerCase().substring(0, 8))) {
            carSelect.selectedIndex = i;
            carSelect.dispatchEvent(new Event('change'));
            break;
          }
        }
      }

      if (calcSection) {
        setTimeout(() => {
          calcSection.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    });
  }
}

function closeModalGlobal() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}


/* ---------- 11. Animated Statistics Counters ---------- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length === 0) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.count, 10) || 0;
  const suffix = element.dataset.suffix || '';
  const prefix = element.dataset.prefix || '';
  const duration = 1800;
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.round(target * easeOutCubic(progress));

    element.textContent = prefix + currentValue.toLocaleString('it-IT') + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}


/* ---------- 12. Card 3D Tilt Effect ---------- */
function initCardTiltEffect() {
  const cards = document.querySelectorAll('.car-card');
  if (cards.length === 0 || window.matchMedia('(hover: none)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });
}


/* ---------- 13. Mobile Menu ---------- */
function initMobileMenu() {
  const toggle = document.querySelector('.navbar__toggle');
  const links = document.querySelector('.navbar__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });
}

function closeMobileMenu() {
  const toggle = document.querySelector('.navbar__toggle');
  const links = document.querySelector('.navbar__links');
  if (toggle && links) {
    toggle.classList.remove('active');
    links.classList.remove('open');
    document.body.style.overflow = '';
  }
}


/* ---------- 14. Contact Form Handler ---------- */
function initContactForm() {
  const form = document.querySelector('.footer__form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.btn');
    const nameInput = form.querySelector('input[type="text"]');
    const msgInput = form.querySelector('textarea');
    const name = nameInput?.value || 'Cliente';
    const message = msgInput?.value || '';

    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✓ Richiesta Ricevuta!';
    submitBtn.style.background = 'linear-gradient(90deg, #00c853, #00e676)';

    // Open WhatsApp after short delay for direct follow-up
    setTimeout(() => {
      const waText = `Ciao SudAmerica Auto Elite! Sono ${name}. Ho inviato una richiesta dal sito: "${message}".`;
      window.open(`https://wa.me/595971774994?text=${encodeURIComponent(waText)}`, '_blank');
    }, 800);

    form.reset();

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
    }, 4000);
  });
}


/* ---------- 15. Back to Top Button ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ---------- 16. Live Social Proof Activity Ticker ---------- */
function initSocialTicker() {
  const ticker = document.getElementById('socialTicker');
  const avatar = document.getElementById('socialTickerAvatar');
  const msgEl = document.getElementById('socialTickerMsg');
  const timeEl = document.getElementById('socialTickerTime');
  const closeBtn = document.getElementById('socialTickerClose');

  if (!ticker || !msgEl) return;

  const events = [
    { icon: '🏎️', msg: 'Un collezionista di Milano ha richiesto la perizia 120 punti per la Lancia Delta HF', time: '14 min fa' },
    { icon: '🇮🇹', msg: 'Nuova pratica CRS/ASI approvata per Alfa Romeo Spider 2000 a Torino', time: '32 min fa' },
    { icon: '🚢', msg: 'Toyota Land Cruiser FJ40 imbarcato in container sigillato rotta Asunción → Genova', time: '1 ora fa' },
    { icon: '⚡', msg: 'Trattativa avviata da un acquirente di Roma per la Ferrari 308 GTB', time: '2 ore fa' },
    { icon: '🏁', msg: 'Richiesto video test drive in diretta per Ford Escort RS Cosworth da Bologna', time: '45 min fa' },
    { icon: '🏆', msg: 'Porsche 911 Carrera (964) sdoganata con successo al porto di Livorno', time: '3 ore fa' }
  ];

  let currentIndex = 0;
  let isDismissed = false;

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      ticker.classList.remove('visible');
      isDismissed = true;
    });
  }

  const showNextEvent = () => {
    if (isDismissed) return;

    const event = events[currentIndex];
    if (avatar) avatar.textContent = event.icon;
    msgEl.textContent = event.msg;
    if (timeEl) timeEl.textContent = `${event.time} · Ispezione Certificata`;

    ticker.classList.add('visible');

    setTimeout(() => {
      ticker.classList.remove('visible');
    }, 6000);

    currentIndex = (currentIndex + 1) % events.length;
  };

  // First appearance after 5s, then every 22s
  setTimeout(() => {
    showNextEvent();
    setInterval(showNextEvent, 22000);
  }, 5000);
}

