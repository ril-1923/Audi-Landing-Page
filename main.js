/* ============================================
   AUDI LANDING PAGE — JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ---------- NAVBAR SCROLL EFFECT ---------- */
  const nav = document.getElementById('mainNav');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrolled = window.scrollY > 60;
    nav.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('show', window.scrollY > 500);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- SMOOTH SCROLL FOR NAV LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navCollapse = document.querySelector('#navMenu');
        if (navCollapse && navCollapse.classList.contains('show')) {
          bootstrap.Collapse.getInstance(navCollapse)?.hide();
        }
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- BACK TO TOP ---------- */
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- REVEAL ON SCROLL (IntersectionObserver) ---------- */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      el.textContent =
        value.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (c) {
      counterObserver.observe(c);
    });
  } else {
    counters.forEach(function (c) {
      const target = parseFloat(c.dataset.target);
      const decimals = parseInt(c.dataset.decimals || '0', 10);
      c.textContent = target.toFixed(decimals);
    });
  }

  /* ---------- THEME TOGGLE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  const html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-moon';
    } else {
      themeIcon.className = 'fa-solid fa-sun';
    }
    try {
      localStorage.setItem('audi-theme', theme);
    } catch (e) {}
  }

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('audi-theme');
  } catch (e) {}

  if (savedTheme) {
    setTheme(savedTheme);
  }

  themeToggle.addEventListener('click', function () {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------- CONFIGURATOR ---------- */
  const swatches = document.querySelectorAll('.swatch');
  const wheelBtns = document.querySelectorAll('.wheel-btn');
  const previewBox = document.getElementById('configPreview');
  const priceDisplay = document.getElementById('priceDisplay');

  const basePrices = {
    '19': 99800,
    '20': 104500,
    '21': 109900
  };

  let currentColor = '#1a1a1a';
  let currentWheel = '19';

  function updatePreview() {
    previewBox.style.background = currentColor;
    previewBox.style.borderColor = 'rgba(255,255,255,0.15)';
    const isLight = currentColor === '#c0c0c0';
    previewBox.style.color = isLight ? '#555' : 'rgba(255,255,255,0.4)';
    const price = basePrices[currentWheel];
    priceDisplay.textContent = '€' + price.toLocaleString('en-US');
  }

  swatches.forEach(function (sw) {
    sw.addEventListener('click', function () {
      swatches.forEach(function (s) { s.classList.remove('active'); });
      this.classList.add('active');
      currentColor = this.dataset.color;
      updatePreview();
    });
  });

  wheelBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      wheelBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      currentWheel = this.dataset.wheel;
      updatePreview();
    });
  });

  updatePreview();

  /* ---------- CONFIG FORM SUBMIT ---------- */
  const configForm = document.getElementById('configForm');
  const formSuccess = document.getElementById('formSuccess');

  configForm.addEventListener('submit', function (e) {
    e.preventDefault();
    configForm.style.display = 'none';
    formSuccess.classList.add('show');
  });

  /* ---------- NEWSLETTER FORM ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input');
      const btn = this.querySelector('button');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      input.value = '';
      setTimeout(function () {
        btn.innerHTML = original;
      }, 2000);
    });
  }

  /* ---------- HERO BG PARALLAX ---------- */
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = 'scale(1.1) translateY(' + scrolled * 0.4 + 'px)';
      }
    }, { passive: true });
  }

  /* ---------- GALLERY LIGHTBOX (simple) ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const img = this.querySelector('img');
      if (!img) return;

      const lightbox = document.createElement('div');
      lightbox.className = 'audi-lightbox';
      lightbox.innerHTML =
        '<div class="audi-lightbox-inner">' +
        '<button class="audi-lightbox-close">&times;</button>' +
        '<img src="' + img.src.replace('h=650&w=940', 'h=1200&w=1800') + '" alt="" />' +
        '</div>';

      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(function () {
        lightbox.classList.add('show');
      });

      function close() {
        lightbox.classList.remove('show');
        setTimeout(function () {
          document.body.removeChild(lightbox);
          document.body.style.overflow = '';
        }, 300);
      }

      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target.classList.contains('audi-lightbox-close') || e.target.classList.contains('audi-lightbox-inner')) {
          close();
        }
      });

      document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') {
          close();
          document.removeEventListener('keydown', esc);
        }
      });
    });
  });
})();
