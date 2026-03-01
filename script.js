/* ============================================================
   Sir Syed Public School â€” Premium Website JavaScript
   ============================================================ */

'use strict';

/* ---------- PRELOADER ---------- */
window.addEventListener('load', function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(function () {
    preloader.classList.add('hidden');
    setTimeout(function () {
      preloader.style.display = 'none';
    }, 700);
  }, 2200);
});

/* ---------- DARK MODE ---------- */
(function () {
  const btn = document.getElementById('darkModeToggle');
  const html = document.documentElement;
  const STORAGE_KEY = 'ssps-theme';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (btn) {
      btn.querySelector('i').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Init
  const saved = localStorage.getItem(STORAGE_KEY);
  applyTheme(saved === 'dark' ? 'dark' : 'light');

  if (btn) {
    btn.addEventListener('click', function () {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();

/* ---------- NAVBAR ---------- */
(function () {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Sticky scroll shadow
  window.addEventListener('scroll', function () {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinkItems.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Active nav link via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = { rootMargin: '-40% 0px -55% 0px', threshold: 0 };
  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinkItems.forEach(function (l) { l.classList.remove('active'); });
        const active = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, observerOptions);
  sections.forEach(function (s) { sectionObserver.observe(s); });
})();

/* ---------- HERO SLIDER ---------- */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  let current = 0;
  let autoTimer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    // Re-trigger animations
    slides[current].querySelectorAll('.animate-fade-up').forEach(function (el) {
      el.style.animation = 'none';
      el.offsetHeight; // reflow
      el.style.animation = '';
    });
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function () { goTo(current + 1); }, 5500);
  }

  if (slides.length > 0) {
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); startAuto(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); startAuto(); });
    });

    // Touch swipe
    let touchStartX = 0;
    const slider = document.querySelector('.hero-slider');
    if (slider) {
      slider.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
      slider.addEventListener('touchend', function (e) {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
      });
    }
    startAuto();
  }

  // Parallax hero
  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;
    document.querySelectorAll('.hero-slide').forEach(function (slide) {
      slide.style.backgroundPositionY = (scrollY * 0.3) + 'px';
    });
  });
})();

/* ---------- SCROLL REVEAL ---------- */
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });
})();

/* ---------- ANIMATED COUNTERS ---------- */
(function () {
  const statsSection = document.querySelector('.stats-section');
  let counted = false;

  function countUp(el, target, suffix, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(function () {
      start += step;
      if (start >= target) {
        el.textContent = target.toLocaleString() + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start).toLocaleString() + suffix;
      }
    }, 16);
  }

  if (statsSection) {
    const statsObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        document.querySelectorAll('.stat-number').forEach(function (el) {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          countUp(el, target, suffix, 2400);
        });
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }
})();

/* ---------- GALLERY FILTER ---------- */
(function () {
  const filterBtns = document.querySelectorAll('.gf-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(function (item) {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.opacity = '0';
          item.classList.remove('hidden');
          setTimeout(function () { item.style.opacity = '1'; item.style.transition = 'opacity 0.4s'; }, 10);
        } else {
          item.style.opacity = '0';
          setTimeout(function () { item.classList.add('hidden'); }, 400);
        }
      });
    });
  });
})();

/* ---------- LIGHTBOX ---------- */
(function () {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const src = galleryItems[index].getAttribute('data-src');
    lbImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    lbImg.src = galleryItems[currentIndex].getAttribute('data-src');
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    lbImg.src = galleryItems[currentIndex].getAttribute('data-src');
  }

  galleryItems.forEach(function (item, i) {
    item.addEventListener('click', function () { openLightbox(i); });
  });
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', showPrev);
  if (lbNext) lbNext.addEventListener('click', showNext);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
})();

/* ---------- TESTIMONIALS SLIDER ---------- */
(function () {
  const slides = document.querySelectorAll('.testi-slide');
  const dots = document.querySelectorAll('.testi-dot');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  let current = 0;
  let autoTimer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function () { goTo(current + 1); }, 6000);
  }

  if (slides.length > 0) {
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); startAuto(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); startAuto(); });
    });

    // Touch swipe
    const slider = document.getElementById('testiSlider');
    let touchStartX = 0;
    if (slider) {
      slider.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
      slider.addEventListener('touchend', function (e) {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
      });
    }
    startAuto();
  }
})();

/* ---------- ADMISSION FORM (REAL SUBMISSION) ---------- */
(function () {
  const form = document.getElementById('admissionForm');
  const successDiv = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Hide form, show success message
        form.style.display = 'none';
        successDiv.style.display = 'block';
        form.reset(); // optional
      } else {
        alert('Submission failed: ' + (data.message || 'Unknown error'));
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      alert('Network error. Please try again.');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
})();
/* ---------- NEWSLETTER FORM ---------- */
(function () {
  const form = document.getElementById('newsletterForm');
  const success = document.getElementById('newsletterSuccess');

  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailRegex.test(emailInput.value)) return;
    form.style.display = 'none';
    if (success) success.style.display = 'block';
  });
})();

/* ---------- SCROLL TO TOP ---------- */
(function () {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ---------- SMOOTH SCROLL FOR ANCHORS ---------- */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 72; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});

/* ---------- NOTICE URGENT GLOW (pulse via JS fallback) ---------- */
(function () {
  const urgents = document.querySelectorAll('.notice-urgent');
  urgents.forEach(function (el) {
    let growing = true;
    setInterval(function () {
      // CSS animation handles this â€” JS is a backup
    }, 1200);
  });
})();
