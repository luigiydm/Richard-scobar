/*
 * Umami — medición del sitio de Richard Scobar.
 * Privacy-friendly y sin cookies (no requiere banner de consentimiento).
 *
 * CÓMO ACTIVARLO:
 *   1. Conseguí una instancia de Umami:
 *      - Opción fácil: cuenta gratis en https://cloud.umami.is
 *      - O self-host (Docker/Vercel) con tu propio dominio.
 *   2. Agregá tu sitio en el panel (Settings → Websites). Te da un
 *      "Website ID" (un UUID) y la URL del script de tracking.
 *   3. Pegá ambos valores abajo en UMAMI_SRC y WEBSITE_ID. ¡Listo!
 *
 * Hasta que reemplaces el WEBSITE_ID no se envía ningún dato (modo seguro).
 *
 * Eventos que mide:
 *   - page_view ............. automático (Umami, sin cookies)
 *   - contacto_whatsapp ..... click a WhatsApp (con ubicación: fab/contacto/header/footer)
 *   - contacto_instagram .... click a Instagram (con ubicación)
 *   - galeria_foto_abierta .. abrir una foto en el lightbox (foto + categoría)
 *   - galeria_filtro ........ usar un filtro (brazo/pierna/espalda/todos)
 *   - galeria_ver_mas ....... click en "Ver más trabajos"
 *   - galeria_recorrido ..... cuántas fotos distintas miró en el lightbox
 *   - scroll_profundidad .... tramos 25/50/75/100% de scroll
 */
(function () {
  'use strict';

  // ⬇️⬇️⬇️  CONFIG UMAMI — completá estos dos valores  ⬇️⬇️⬇️
  // URL del script de tu instancia de Umami:
  //   - Umami Cloud: 'https://cloud.umami.is/script.js'
  //   - Self-host:   'https://TU-DOMINIO/script.js'
  var UMAMI_SRC = 'https://cloud.umami.is/script.js';
  // Website ID (UUID) que te da el panel de Umami:
  var WEBSITE_ID = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';
  // ⬆️⬆️⬆️ -------------------------------------------- ⬆️⬆️⬆️

  if (!WEBSITE_ID || WEBSITE_ID.indexOf('XXXX') !== -1) {
    console.info('[analytics] Falta configurar WEBSITE_ID en js/analytics.js — no se envían datos todavía.');
    return;
  }

  // 1) Cargar el script de Umami (rastrea page_view automáticamente, sin cookies)
  var s = document.createElement('script');
  s.async = true;
  s.defer = true;
  s.src = UMAMI_SRC;
  s.setAttribute('data-website-id', WEBSITE_ID);
  document.head.appendChild(s);

  // Helper: manda un evento. Si Umami todavía no cargó, lo encola y reintenta.
  var cola = [];
  function flush() {
    if (!(window.umami && typeof window.umami.track === 'function')) return;
    while (cola.length) {
      var ev = cola.shift();
      window.umami.track(ev.name, ev.data);
    }
  }
  function track(name, data) {
    cola.push({ name: name, data: data || {} });
    flush();
  }
  s.addEventListener('load', flush);

  // 2) ¿En qué parte de la página está el link de contacto?
  function ubicacion(el) {
    if (el.closest('.whatsapp-fab')) return 'fab';
    if (el.closest('.contact-method')) return 'contacto';
    if (el.closest('header')) return 'header';
    if (el.closest('footer')) return 'footer';
    return 'otro';
  }

  // 3) Delegación: un solo listener cubre TODOS los links (aunque estén duplicados)
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';

    if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) {
      track('contacto_whatsapp', {
        ubicacion: ubicacion(link),
        pagina: document.title,
        link_url: href
      });
    } else if (href.indexOf('instagram.com') !== -1) {
      track('contacto_instagram', {
        ubicacion: ubicacion(link),
        pagina: document.title,
        link_url: href
      });
    }
  });

  // 4) Eventos de galería (solo corren si existe la grilla)
  function initGaleria() {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;

    // Foto abierta en el lightbox
    grid.addEventListener('click', function (e) {
      var item = e.target.closest('.gallery-item');
      if (!item) return;
      var img = item.querySelector('img');
      track('galeria_foto_abierta', {
        foto: img ? img.getAttribute('src') : '',
        categoria: item.dataset.location || ''
      });
    });

    // Uso de filtros
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        track('galeria_filtro', { filtro: btn.dataset.filter || '' });
      });
    });

    // Botón "Ver más"
    var loadMoreBtn = document.getElementById('loadmore-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function () {
        track('galeria_ver_mas');
      });
    }

    // Recorrido en el lightbox: cuenta cuántas fotos distintas mira la
    // persona entre que abre y cierra, y manda UN solo evento al cerrar
    // (en vez de uno por cada flecha/swipe, para no inundar la métrica).
    var vistas = null;
    document.addEventListener('lightbox:open', function () { vistas = {}; });
    document.addEventListener('lightbox:view', function (e) {
      if (vistas) vistas[e.detail.index] = true;
    });
    document.addEventListener('lightbox:close', function () {
      if (!vistas) return;
      track('galeria_recorrido', { fotos_vistas: Object.keys(vistas).length });
      vistas = null;
    });
  }

  // 5) Profundidad de scroll por tramos: dice DÓNDE abandona la gente
  //    en páginas largas.
  function initScroll() {
    var marcas = [25, 50, 75, 100];
    var disparadas = {};
    var ticking = false;

    function medir() {
      ticking = false;
      var doc = document.documentElement;
      var alto = doc.scrollHeight - doc.clientHeight;
      if (alto <= 0) return;
      var pct = ((window.scrollY || doc.scrollTop) / alto) * 100;
      marcas.forEach(function (m) {
        if (pct >= m && !disparadas[m]) {
          disparadas[m] = true;
          track('scroll_profundidad', { porcentaje: m, pagina: document.title });
        }
      });
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(medir);
    }, { passive: true });
  }

  function init() {
    initGaleria();
    initScroll();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
