/* ==========================================================================
   SudAmerica Auto Elite — Main JavaScript
   Interattività, filtri, animazioni scroll, modal, tilt effect
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initNavbar();
  initSmoothScroll();
  initScrollReveal();
  initCatalogFilters();
  initModal();
  initCounterAnimation();
  initCardTiltEffect();
  initMobileMenu();
  initContactForm();
});


/* ---------- Page Loader ---------- */
function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });

  /* Fallback: hide the loader after 3s regardless */
  setTimeout(() => loader.classList.add('hidden'), 3000);
}


/* ---------- Navbar Scroll Behavior ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 80;

  const handleScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}


/* ---------- Smooth Scroll for Anchor Links ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();
      closeMobileMenu();

      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}


/* ---------- Scroll Reveal Animations ---------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
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


/* ---------- Catalog Filters ---------- */
function initCatalogFilters() {
  const filterButtons = document.querySelectorAll('.catalog__filter');
  const carCards = document.querySelectorAll('.car-card');
  if (filterButtons.length === 0 || carCards.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      /* Update active filter button */
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.dataset.filter;

      carCards.forEach(card => {
        const category = card.dataset.category;
        const shouldShow = filterValue === 'all' || category === filterValue;

        if (shouldShow) {
          card.style.display = '';
          /* Re-trigger the reveal animation */
          requestAnimationFrame(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}


/* ---------- Car Detail Modal ---------- */
function initModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (!overlay) return;

  const modal = overlay.querySelector('.modal');
  const closeBtn = overlay.querySelector('.modal__close');

  /* Open modal when clicking a car card */
  document.querySelectorAll('.car-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  /* Close modal */
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function openModal(card) {
    const data = card.dataset;
    const imgSrc = card.querySelector('.car-card__image img')?.src || '';

    /* Populate modal content */
    const modalImage = modal.querySelector('.modal__image img');
    const modalBadge = modal.querySelector('.modal__badge');
    const modalTitle = modal.querySelector('.modal__title');
    const modalYear = modal.querySelector('.modal__year');
    const modalDesc = modal.querySelector('.modal__description');
    const modalPrice = modal.querySelector('.modal__price');

    if (modalImage) modalImage.src = imgSrc;
    if (modalBadge) {
      modalBadge.textContent = data.category || '';
      modalBadge.className = `modal__badge car-card__badge--${(data.category || '').toLowerCase()}`;
    }
    if (modalTitle) modalTitle.textContent = data.name || '';
    if (modalYear) modalYear.textContent = `Anno: ${data.year || ''}`;
    if (modalDesc) modalDesc.textContent = data.description || '';
    if (modalPrice) modalPrice.textContent = data.price || '';

    /* Populate specs */
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
}

/* Expose closeModal globally for inline onclick */
function closeModalGlobal() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}


/* ---------- Animated Counters ---------- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.count, 10);
  const suffix = element.dataset.suffix || '';
  const prefix = element.dataset.prefix || '';
  const duration = 2000;
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const currentValue = Math.round(target * easedProgress);

    element.textContent = prefix + currentValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}


/* ---------- Card 3D Tilt Effect ---------- */
function initCardTiltEffect() {
  const cards = document.querySelectorAll('.car-card');
  if (cards.length === 0) return;

  /* Only apply on non-touch devices */
  if (window.matchMedia('(hover: none)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}


/* ---------- Mobile Menu ---------- */
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


/* ---------- Contact Form (Mock) ---------- */
function initContactForm() {
  const form = document.querySelector('.footer__form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.btn');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = '✓ Messaggio Inviato!';
    submitBtn.style.background = 'linear-gradient(90deg, #00c853, #00e676)';

    /* Reset all inputs */
    form.querySelectorAll('.footer__input, .footer__textarea').forEach(input => {
      input.value = '';
    });

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
    }, 3000);
  });
}
