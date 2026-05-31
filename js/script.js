/*
 * Richard Scobar — Core JS (vanilla, sin jQuery ni Bootstrap)
 * Menú móvil · header on-scroll · scroll suave · sección activa ·
 * reveal on-scroll · hero slider (Swiper).
 */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Menú móvil ---------- */
  function initMobileMenu() {
    const toggle = $('.header-menu-toggle');
    const nav = $('.header-nav-wrap');
    if (!toggle || !nav) return;

    const close = () => {
      nav.classList.remove('mobile');
      toggle.classList.remove('is-clicked');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = !nav.classList.contains('mobile');
      nav.classList.toggle('mobile', willOpen);
      toggle.classList.toggle('is-clicked', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
      document.body.classList.toggle('menu-open', willOpen);
      document.body.style.overflow = willOpen ? 'hidden' : '';
    });

    $$('a', nav).forEach((link) => link.addEventListener('click', close));

    document.addEventListener('click', (e) => {
      if (nav.classList.contains('mobile') && !e.target.closest('.header-wrap')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('mobile')) close();
    });
  }

  /* ---------- Header on-scroll ---------- */
  function initHeaderScroll() {
    const header = $('.header-wrap');
    if (!header) return;
    let lastScroll = 0;
    let ticking = false;

    const update = () => {
      const y = window.pageYOffset;
      header.classList.toggle('scrolled', y > 50);
      header.classList.toggle('hidden', y > lastScroll && y > 100);
      lastScroll = y;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  /* ---------- Scroll suave para anclas (#) ---------- */
  function initSmoothScroll() {
    $$('a[href*="#"]:not([href="#"])').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        // Solo anclas dentro de la misma página
        if (!id.startsWith('#')) return;
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        const headerH = $('.header-wrap')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ---------- Sección activa en el nav ---------- */
  function initActiveSection() {
    const sections = $$('section[id]');
    const links = $$('.nav-link');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((l) => {
          const href = l.getAttribute('href') || '';
          l.classList.toggle('active', href === '#' + id || href.endsWith('#' + id));
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Reveal on-scroll ---------- */
  function initScrollReveal() {
    const els = $$('.statement-content, .symbol-card, .gallery-preview-section .gallery-item');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('fade-in'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach((el) => observer.observe(el));
  }

  /* ---------- Hero slider (Swiper) ---------- */
  function initHeroSlider() {
    if (typeof Swiper === 'undefined' || !$('.heroSwiper')) return;

    const showActiveCaption = () => {
      $$('.caption-content').forEach((c) => c.classList.remove('visible'));
      const active = $('.swiper-slide-active .caption-content');
      if (active) active.classList.add('visible');
    };

    const swiper = new Swiper('.heroSwiper', {
      loop: true,
      effect: 'fade',
      speed: 1200,
      fadeEffect: { crossFade: true },
      autoplay: { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      keyboard: { enabled: true, onlyInViewport: true },
      on: {
        init: () => setTimeout(showActiveCaption, 400),
        slideChangeTransitionStart: () => $$('.caption-content').forEach((c) => c.classList.remove('visible')),
        slideChangeTransitionEnd: () => setTimeout(showActiveCaption, 200),
      },
    });

    return swiper;
  }

  /* ---------- Preloader (intro ink-fill del logo) ---------- */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const hide = () => {
      preloader.classList.add('hide-preloader');
      document.body.classList.add('loaded');
    };

    // matchMedia y sessionStorage pueden fallar en file:// o modo privado: protegidos
    let reduceMotion = false;
    try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

    let alreadySeen = false;
    try { alreadySeen = !!sessionStorage.getItem('introSeen'); } catch (e) {}

    // Ya vista en esta sesión o el usuario pidió menos movimiento: sin animación
    if (alreadySeen || reduceMotion) {
      preloader.classList.add('skip');
      requestAnimationFrame(hide);
      return;
    }

    try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}
    // Esperar a que termine el relleno de tinta (~1.05s) + breve hold
    setTimeout(hide, 1650);
    // Tope de seguridad
    setTimeout(hide, 4000);
  }

  /* ---------- Init ---------- */
  // Cada init va aislado: si uno falla, no rompe el resto ni deja el telón puesto
  function safe(fn) {
    try { fn(); } catch (e) { console.error(e); }
  }

  document.addEventListener('DOMContentLoaded', () => {
    safe(initPreloader);
    safe(initMobileMenu);
    safe(initHeaderScroll);
    safe(initSmoothScroll);
    safe(initActiveSection);
    safe(initScrollReveal);
    safe(initHeroSlider);
  });

  // Red de seguridad: pase lo que pase, el preloader se oculta al cargar la página
  window.addEventListener('load', () => {
    const p = document.getElementById('preloader');
    if (p) setTimeout(() => p.classList.add('hide-preloader'), 1800);
  });
})();
