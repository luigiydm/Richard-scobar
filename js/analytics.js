/*
 * Google Analytics 4 — medición del sitio de Richard Scobar.
 *
 * CÓMO ACTIVARLO:
 *   1. Entrá a https://analytics.google.com y creá una propiedad Web.
 *   2. Copiá el "ID de medición" (formato G-XXXXXXXXXX).
 *   3. Pegalo abajo en MEASUREMENT_ID. ¡Eso es todo!
 *
 * Hasta que reemplaces el ID no se envía ningún dato (modo seguro).
 *
 * Eventos que mide:
 *   - page_view, scroll, tiempo de interacción ...... automático (GA4)
 *   - contacto_whatsapp ..... click a WhatsApp (con ubicación: fab/contacto/header/footer)
 *   - contacto_instagram .... click a Instagram (con ubicación)
 *   - galeria_foto_abierta .. abrir una foto en el lightbox (foto + categoría)
 *   - galeria_filtro ........ usar un filtro (brazo/pierna/espalda/todos)
 *   - galeria_ver_mas ....... click en "Ver más trabajos"
 */
(function () {
  'use strict';

  // ⬇️⬇️⬇️  PEGÁ ACÁ TU ID DE GA4  ⬇️⬇️⬇️
  var MEASUREMENT_ID = 'G-XXXXXXXXXX';
  // ⬆️⬆️⬆️ -------------------------- ⬆️⬆️⬆️

  if (!MEASUREMENT_ID || MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.info('[analytics] Falta configurar MEASUREMENT_ID en js/analytics.js — no se envían datos todavía.');
    return;
  }

  // 1) Cargar gtag.js (la librería oficial de GA4)
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);

  function track(name, params) { gtag('event', name, params || {}); }

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
  }

  if (document.readyState !== 'loading') initGaleria();
  else document.addEventListener('DOMContentLoaded', initGaleria);
})();
