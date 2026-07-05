import { isMobile } from './mobile.js';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let zCounter = 100;

export class WindowManager {
  constructor(container) {
    this.container = container;
    this.template = document.getElementById('window-template');
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeTop();
    });
  }

  open({ id, title, content, triggerEl, width, height }) {
    const existing = this.container.querySelector(`[data-window-id="${id}"]`);
    if (existing) {
      this.bringToFront(existing);
      existing.querySelector('.window__control--close').focus();
      return existing;
    }

    const win = this.template.content.cloneNode(true).querySelector('.window');
    win.dataset.windowId = id;
    win.setAttribute('aria-label', title);

    if (width)  win.style.width  = `${width}px`;
    if (height) win.style.height = `${height}px`;

    this._position(win, width);
    win.style.zIndex = ++zCounter;

    win.querySelector('.window__title').textContent = title;
    win.querySelector('.window__content').innerHTML = content;

    const closeBtn = win.querySelector('.window__control--close');
    closeBtn.addEventListener('click', () => this.close(win, triggerEl));

    const maximizeBtn = win.querySelector('.window__control--maximize');
    maximizeBtn.addEventListener('click', () => this._toggleMaximize(win));

    win.addEventListener('mousedown', () => this.bringToFront(win));

    this._makeDraggable(win);
    this._makeResizable(win);
    this._trapFocus(win);

    if (!prefersReducedMotion()) {
      win.classList.add('is-opening');
      win.addEventListener('animationend', () => win.classList.remove('is-opening'), { once: true });
    }

    this.container.appendChild(win);
    this._clampToViewport(win);
    closeBtn.focus();
    return win;
  }

  close(win, triggerEl) {
    win.remove();
    if (triggerEl) triggerEl.focus();
  }

  closeTop() {
    const windows = [...this.container.querySelectorAll('.window')];
    if (!windows.length) return;
    const top = windows.reduce((a, b) =>
      parseInt(a.style.zIndex, 10) > parseInt(b.style.zIndex, 10) ? a : b
    );
    this.close(top);
  }

  closeAll() {
    [...this.container.querySelectorAll('.window')].forEach(w => w.remove());
  }

  bringToFront(win) {
    win.style.zIndex = ++zCounter;
  }

  _position(win, openingWidth) {
    const TASKBAR_H = 40;
    const H_SPREAD = 160; // horizontal: windows vary ±H_SPREAD/2 px from screen center
    const V_SPREAD = 48;  // vertical: windows open 24 to 24+V_SPREAD px below taskbar
    const winW = openingWidth || 512;
    const left = Math.max(8, (window.innerWidth - winW) / 2 + Math.round((Math.random() - 0.5) * H_SPREAD));
    const top = TASKBAR_H + 24 + Math.round(Math.random() * V_SPREAD);
    win.style.left = `${left}px`;
    win.style.top = `${top}px`;
  }

  _clampToViewport(win) {
    const MARGIN = 8;
    const TASKBAR_H = 40;
    const maxTop = window.innerHeight - win.offsetHeight - MARGIN;
    const clamped = Math.max(TASKBAR_H + MARGIN, maxTop);
    if (win.offsetTop > clamped) {
      win.style.top = `${clamped}px`;
    }
  }

  _makeDraggable(win) {
    const titlebar = win.querySelector('.window__titlebar');

    titlebar.addEventListener('pointerdown', (e) => {
      if (isMobile()) return; // full-screen takeover: no drag
      if (e.button !== 0) return;
      if (e.target.closest('.window__control')) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = win.offsetLeft;
      const startTop = win.offsetTop;

      titlebar.setPointerCapture(e.pointerId);
      this.bringToFront(win);

      const onMove = (ev) => {
        win.style.left = `${startLeft + ev.clientX - startX}px`;
        win.style.top = `${startTop + ev.clientY - startY}px`;
      };

      const onEnd = () => {
        titlebar.removeEventListener('pointermove', onMove);
        titlebar.removeEventListener('pointerup', onEnd);
        titlebar.removeEventListener('pointercancel', onEnd);
      };

      titlebar.addEventListener('pointermove', onMove);
      titlebar.addEventListener('pointerup', onEnd);
      titlebar.addEventListener('pointercancel', onEnd);
      e.preventDefault();
    });
  }

  _toggleMaximize(win) {
    const MARGIN = 8;
    const TASKBAR_H = 40;
    const btn = win.querySelector('.window__control--maximize');

    if (win.dataset.maximized === 'true') {
      win.style.left = win.dataset.prevLeft;
      win.style.top = win.dataset.prevTop;
      win.style.width = win.dataset.prevWidth;
      win.style.height = win.dataset.prevHeight;
      win.dataset.maximized = 'false';
      btn.setAttribute('aria-pressed', 'false');
    } else {
      win.dataset.prevLeft = win.style.left;
      win.dataset.prevTop = win.style.top;
      win.dataset.prevWidth = win.style.width;
      win.dataset.prevHeight = win.style.height;
      win.style.left = `${MARGIN}px`;
      win.style.top = `${TASKBAR_H + MARGIN}px`;
      win.style.width = `${window.innerWidth - MARGIN * 2}px`;
      win.style.height = `${window.innerHeight - TASKBAR_H - MARGIN * 2}px`;
      win.dataset.maximized = 'true';
      btn.setAttribute('aria-pressed', 'true');
    }
  }

  _makeResizable(win) {
    const MIN_W = 320;
    const MIN_H = 240;
    const EDGE_GAP = 8;

    const startResize = (handle, axes) => (e) => {
      if (e.button !== 0) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = win.offsetWidth;
      const startH = win.offsetHeight;
      const cursor = axes === 'xy' ? 'nwse-resize' : axes === 'x' ? 'ew-resize' : 'ns-resize';

      handle.setPointerCapture(e.pointerId);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = cursor;

      const onMove = (ev) => {
        if (axes.includes('x')) {
          const maxW = window.innerWidth - win.offsetLeft - EDGE_GAP;
          const next = startW + ev.clientX - startX;
          win.style.width = `${Math.min(maxW, Math.max(MIN_W, next))}px`;
        }
        if (axes.includes('y')) {
          const maxH = window.innerHeight - win.offsetTop - EDGE_GAP;
          const next = startH + ev.clientY - startY;
          win.style.height = `${Math.min(maxH, Math.max(MIN_H, next))}px`;
        }
      };

      const onEnd = () => {
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onEnd);
        handle.removeEventListener('pointercancel', onEnd);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };

      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onEnd);
      handle.addEventListener('pointercancel', onEnd);
      e.preventDefault();
    };

    const right = win.querySelector('.window__resize-right');
    const bottom = win.querySelector('.window__resize-bottom');
    const corner = win.querySelector('.window__resize-corner');
    right.addEventListener('pointerdown', startResize(right, 'x'));
    bottom.addEventListener('pointerdown', startResize(bottom, 'y'));
    corner.addEventListener('pointerdown', startResize(corner, 'xy'));
  }

  _trapFocus(win) {
    win.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = [...win.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )];
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
    });
  }
}
