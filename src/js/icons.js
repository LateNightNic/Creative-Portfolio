const MOBILE_QUERY = '(max-width: 768px)';
const DRAG_THRESHOLD = 5;

export class IconManager {
  constructor() {
    this.grid = document.querySelector('.icon-grid');
    this.desktop = this.grid ? this.grid.parentElement : null;
    this.icons = [...document.querySelectorAll('.desktop-icon')];
    this.state = new Map();
    this.defaults = new Map();
    this.isMobile = window.matchMedia(MOBILE_QUERY).matches;
    this.activated = false;

    if (!this.isMobile) {
      requestAnimationFrame(() => this._activate());
    }

    window.addEventListener('resize', () => this._onResize());
  }

  reset() {
    if (!this.activated) return;
    for (const icon of this.icons) {
      const def = this.defaults.get(icon);
      if (!def) continue;
      this.state.set(icon, { ...def });
      this._apply(icon);
    }
  }

  _activate() {
    if (this.activated) return;

    const snapshots = this.icons.map((icon) => {
      const r = icon.getBoundingClientRect();
      return { icon, viewportLeft: r.left, viewportTop: r.top };
    });

    this.grid.classList.add('icon-grid--free');
    const newGridRect = this.grid.getBoundingClientRect();

    for (const { icon, viewportLeft, viewportTop } of snapshots) {
      const def = {
        xPercent: (viewportLeft / window.innerWidth) * 100,
        yPx: viewportTop - newGridRect.top,
      };
      this.defaults.set(icon, { ...def });
      this.state.set(icon, { ...def });
    }

    for (const icon of this.icons) {
      this._apply(icon);
      this._makeDraggable(icon);
    }

    this.activated = true;
  }

  _deactivate() {
    if (!this.activated) return;
    this.grid.classList.remove('icon-grid--free');
    for (const icon of this.icons) {
      icon.style.left = '';
      icon.style.top = '';
    }
    this.activated = false;
  }

  _apply(icon) {
    const s = this.state.get(icon);
    if (!s) return;
    const gridRect = this.grid.getBoundingClientRect();
    const viewportX = (s.xPercent / 100) * window.innerWidth;
    const rawLeft = viewportX - gridRect.left;
    const maxLeft = Math.max(0, this.grid.clientWidth - icon.offsetWidth);
    icon.style.left = `${Math.max(0, Math.min(maxLeft, rawLeft))}px`;
    icon.style.top = `${s.yPx}px`;
  }

  _makeDraggable(icon) {
    icon.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (this.isMobile) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = icon.offsetLeft;
      const startTop = icon.offsetTop;
      const iconW = icon.offsetWidth;
      const iconH = icon.offsetHeight;
      const iconRect = icon.getBoundingClientRect();
      const desktopRect = this.desktop.getBoundingClientRect();

      const dxMin = desktopRect.left - iconRect.left;
      const dxMax = desktopRect.right - iconW - iconRect.left;
      const dyMin = desktopRect.top - iconRect.top;
      const dyMax = desktopRect.bottom - iconH - iconRect.top;

      let moved = false;

      icon.setPointerCapture(e.pointerId);

      const onMove = (ev) => {
        const dxRaw = ev.clientX - startX;
        const dyRaw = ev.clientY - startY;
        if (!moved && Math.hypot(dxRaw, dyRaw) > DRAG_THRESHOLD) {
          moved = true;
        }
        if (!moved) return;

        const dx = Math.max(dxMin, Math.min(dxMax, dxRaw));
        const dy = Math.max(dyMin, Math.min(dyMax, dyRaw));
        icon.style.left = `${startLeft + dx}px`;
        icon.style.top = `${startTop + dy}px`;
      };

      const onEnd = () => {
        icon.removeEventListener('pointermove', onMove);
        icon.removeEventListener('pointerup', onEnd);
        icon.removeEventListener('pointercancel', onEnd);

        if (moved) {
          const gridRect = this.grid.getBoundingClientRect();
          const viewportX = gridRect.left + icon.offsetLeft;
          this.state.set(icon, {
            xPercent: (viewportX / window.innerWidth) * 100,
            yPx: icon.offsetTop,
          });
          const swallow = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            icon.removeEventListener('click', swallow, true);
          };
          icon.addEventListener('click', swallow, true);
        }
      };

      icon.addEventListener('pointermove', onMove);
      icon.addEventListener('pointerup', onEnd);
      icon.addEventListener('pointercancel', onEnd);
    });
  }

  _onResize() {
    const nowMobile = window.matchMedia(MOBILE_QUERY).matches;

    if (nowMobile && !this.isMobile) {
      this.isMobile = true;
      this._deactivate();
      return;
    }

    if (!nowMobile && this.isMobile) {
      this.isMobile = false;
      requestAnimationFrame(() => this._activate());
      return;
    }

    if (!this.activated) return;
    for (const icon of this.icons) this._apply(icon);
  }
}
