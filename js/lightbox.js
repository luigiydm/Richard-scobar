/*
 * Lightbox reutilizable (vanilla JS, sin dependencias).
 * Usa el markup con ids: #lightbox, #lightbox-img, #lightbox-title,
 * #lightbox-description, #lightbox-close, #lightbox-prev, #lightbox-next.
 *
 * Uso:
 *   const lb = createLightbox(() => itemsArray);
 *   lb.open(index);
 *
 * El callback getItems se evalúa en cada apertura, así soporta
 * listas que cambian (p. ej. galería filtrada).
 */
function createLightbox(getItems) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return { open() {} };

  const img = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-description');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  // Contador "n / total": se crea si no existe en el markup
  const info = lightbox.querySelector('.lightbox-info');
  let counterEl = document.getElementById('lightbox-counter');
  if (!counterEl && info) {
    counterEl = document.createElement('span');
    counterEl.id = 'lightbox-counter';
    counterEl.className = 'lightbox-counter';
    info.appendChild(counterEl);
  }

  let index = 0;
  let items = [];

  function render() {
    const item = items[index];
    if (!item) return;
    img.setAttribute('src', item.src);
    img.setAttribute('alt', item.title || '');
    if (titleEl) titleEl.textContent = item.title || '';
    if (descEl) descEl.textContent = item.description || '';
    if (counterEl) counterEl.textContent = (index + 1) + ' / ' + items.length;
    // Precargar la siguiente para navegación fluida
    const next = items[(index + 1) % items.length];
    if (next) { const pre = new Image(); pre.src = next.src; }
  }

  function open(i) {
    items = (typeof getItems === 'function' ? getItems() : getItems) || [];
    if (!items.length) return;
    index = i;
    render();
    lightbox.style.display = 'flex';
    requestAnimationFrame(() => lightbox.classList.add('active'));
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    setTimeout(() => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }

  function prev() { index = (index - 1 + items.length) % items.length; render(); }
  function next() { index = (index + 1) % items.length; render(); }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
  });

  // Swipe en móvil
  let startX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].screenX;
    if (Math.abs(endX - startX) > 50) {
      endX < startX ? next() : prev();
    }
  }, { passive: true });

  return { open, close };
}

window.createLightbox = createLightbox;
