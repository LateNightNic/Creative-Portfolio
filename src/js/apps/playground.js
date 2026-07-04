import { openLightbox } from '../lightbox.js';

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const items = [
  { src: 'images/playground/cyberverse-frame-1.png', alt: 'Cyberverse — Frame 1', title: 'Cyberverse — Frame 1' },
  { src: 'images/playground/cyberverse-frame-2.png', alt: 'Cyberverse — Frame 2', title: 'Cyberverse — Frame 2' },
  { src: 'images/playground/cyberverse-frame-3.png', alt: 'Cyberverse — Frame 3', title: 'Cyberverse — Frame 3' },
  { src: 'images/playground/toybox-post-002.png', alt: 'Toybox — Post 002', title: 'Toybox — Post 002' },
  { src: 'images/playground/toybox-post-003.png', alt: 'Toybox — Post 003', title: 'Toybox — Post 003' },
  { src: 'images/playground/toybox-post-004.png', alt: 'Toybox — Post 004', title: 'Toybox — Post 004' },
  { src: 'images/playground/sky.gif', alt: 'Sky', title: 'Sky' },
  { src: 'images/playground/f-zero-speed-test.gif', alt: 'F-Zero Speed Test', title: 'F-Zero Speed Test' },
];

export function getContent() {
  return `
    <div class="playground-grid">
      ${items.map((item, i) => `
        <button type="button" class="playground-item" data-index="${i}" aria-label="Enlarge ${escapeHtml(item.title || item.alt)}">
          <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy">
          ${item.title ? `<span class="playground-item__title">${escapeHtml(item.title)}</span>` : ''}
        </button>
      `).join('')}
    </div>
  `;
}

export function init(win) {
  const grid = win.querySelector('.playground-grid');
  if (!grid) return;

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.playground-item');
    if (!btn) return;
    const index = Number(btn.dataset.index);
    if (Number.isNaN(index)) return;
    openLightbox({ items, index, triggerEl: btn });
  });
}
