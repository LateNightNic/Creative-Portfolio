const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let active = null;

export function openLightbox({ items, index, triggerEl }) {
  if (active) active.close();

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const showNav = items.length > 1;

  overlay.innerHTML = `
    ${showNav ? '<button type="button" class="lightbox__control lightbox__control--prev" aria-label="Previous image">‹</button>' : ''}
    <button type="button" class="lightbox__control lightbox__control--close" aria-label="Close enlarged image">×</button>
    <img class="lightbox__img" alt="">
    <p class="lightbox__caption"></p>
    ${showNav ? '<button type="button" class="lightbox__control lightbox__control--next" aria-label="Next image">›</button>' : ''}
  `;

  const img = overlay.querySelector('.lightbox__img');
  const caption = overlay.querySelector('.lightbox__caption');
  const closeBtn = overlay.querySelector('.lightbox__control--close');
  const prevBtn = overlay.querySelector('.lightbox__control--prev');
  const nextBtn = overlay.querySelector('.lightbox__control--next');

  let current = index;

  const render = () => {
    const item = items[current];
    img.src = item.src;
    img.alt = item.alt || '';
    caption.textContent = item.title || '';
    caption.hidden = !item.title;
    overlay.setAttribute('aria-label', escapeHtml(item.title || item.alt || 'Enlarged image'));
  };

  const go = (delta) => {
    current = (current + delta + items.length) % items.length;
    render();
  };

  const close = () => {
    document.removeEventListener('keydown', onKeydown, true);
    const finish = () => {
      overlay.remove();
      if (triggerEl) triggerEl.focus();
    };
    if (!prefersReducedMotion()) {
      overlay.classList.add('is-closing');
      overlay.addEventListener('animationend', finish, { once: true });
    } else {
      finish();
    }
    active = null;
  };

  // Capture phase + stopPropagation: the WindowManager also listens for
  // Escape at the document level (to close the topmost window). Without
  // intercepting here first, Escape would close the lightbox *and* the
  // window underneath it in the same keypress.
  const onKeydown = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
    if (showNav && e.key === 'ArrowLeft') { e.stopPropagation(); go(-1); return; }
    if (showNav && e.key === 'ArrowRight') { e.stopPropagation(); go(1); return; }
    if (e.key !== 'Tab') return;
    e.stopPropagation();
    const focusable = [...overlay.querySelectorAll('button')];
    if (focusable.length < 2) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => go(1));
  document.addEventListener('keydown', onKeydown, true);

  render();

  if (!prefersReducedMotion()) {
    overlay.classList.add('is-opening');
    overlay.addEventListener('animationend', () => overlay.classList.remove('is-opening'), { once: true });
  }

  document.body.appendChild(overlay);
  closeBtn.focus();
  active = { close };
}
