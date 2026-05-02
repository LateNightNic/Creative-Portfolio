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

  open({ id, title, content, triggerEl }) {
    const existing = this.container.querySelector(`[data-window-id="${id}"]`);
    if (existing) {
      this.bringToFront(existing);
      existing.querySelector('.window__close').focus();
      return existing;
    }

    const win = this.template.content.cloneNode(true).querySelector('.window');
    win.dataset.windowId = id;
    win.setAttribute('aria-label', title);

    this._position(win);
    win.style.zIndex = ++zCounter;

    win.querySelector('.window__title').textContent = title;
    win.querySelector('.window__content').innerHTML = content;

    const closeBtn = win.querySelector('.window__close');
    closeBtn.addEventListener('click', () => this.close(win, triggerEl));

    win.addEventListener('mousedown', () => this.bringToFront(win));

    this._makeDraggable(win);
    this._makeResizable(win);
    this._trapFocus(win);

    if (!prefersReducedMotion()) {
      win.classList.add('is-opening');
      win.addEventListener('animationend', () => win.classList.remove('is-opening'), { once: true });
    }

    this.container.appendChild(win);
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

  _position(win) {
    const TASKBAR_H = 40;
    const spread = 60;
    const offset = () => Math.round((Math.random() - 0.5) * spread * 2);
    const winW = 512;
    const winH = 400;
    const left = Math.max(8, (window.innerWidth - winW) / 2 + offset());
    const top = Math.max(TASKBAR_H + 8, (window.innerHeight - winH) / 2 + offset());
    win.style.left = `${left}px`;
    win.style.top = `${top}px`;
  }

  _makeDraggable(win) {
    const titlebar = win.querySelector('.window__titlebar');
    let startX, startY, startLeft, startTop;

    const onMove = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      win.style.left = `${startLeft + x - startX}px`;
      win.style.top = `${startTop + y - startY}px`;
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.window__close')) return;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = win.offsetLeft;
      startTop = win.offsetTop;
      this.bringToFront(win);
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      e.preventDefault();
    });
  }

  _makeResizable(win) {
    const MIN_W = 320;
    const MIN_H = 240;

    const startResize = (e, resizeW, resizeH) => {
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = win.offsetWidth;
      const startH = win.offsetHeight;

      const onMove = (ev) => {
        if (resizeW) {
          win.style.width = `${Math.max(MIN_W, startW + ev.clientX - startX)}px`;
        }
        if (resizeH) {
          win.style.height = `${Math.max(MIN_H, startH + ev.clientY - startY)}px`;
        }
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };

      document.body.style.userSelect = 'none';
      document.body.style.cursor = resizeW && resizeH ? 'nwse-resize' : resizeW ? 'ew-resize' : 'ns-resize';
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      e.preventDefault();
    };

    win.querySelector('.window__resize-right').addEventListener('mousedown', (e) => startResize(e, true, false));
    win.querySelector('.window__resize-bottom').addEventListener('mousedown', (e) => startResize(e, false, true));
    win.querySelector('.window__resize-corner').addEventListener('mousedown', (e) => startResize(e, true, true));
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
