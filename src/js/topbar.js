function formatClock(date) {
  const hours24 = date.getHours();
  const hours = String(hours24 % 12 || 12).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours24 < 12 ? 'AM' : 'PM';
  return `${hours}:${minutes}${period}`;
}

function initClock() {
  const clock = document.querySelector('.taskbar__clock');
  if (!clock) return;

  const tick = () => {
    clock.textContent = formatClock(new Date());
  };

  tick();
  setInterval(tick, 30000);
}

export function initTopbar({ windowManager, iconManager }) {
  initMenu({ windowManager, iconManager });
  initClock();
}

function initMenu({ windowManager, iconManager }) {
  const trigger = document.getElementById('taskbar-menu-trigger');
  const panel = document.getElementById('taskbar-menu');
  if (!trigger || !panel) return;

  const items = [...panel.querySelectorAll('.taskbar__menu-item')];
  const isOpen = () => trigger.getAttribute('aria-expanded') === 'true';

  const openMenu = () => {
    if (isOpen()) return;
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    document.addEventListener('pointerdown', onOutsidePointer, true);
    document.addEventListener('keydown', onMenuKeydown, true);
    items[0]?.focus();
  };

  const closeMenu = ({ refocusTrigger = false } = {}) => {
    if (!isOpen()) return;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', onOutsidePointer, true);
    document.removeEventListener('keydown', onMenuKeydown, true);
    if (refocusTrigger) trigger.focus();
  };

  const onOutsidePointer = (e) => {
    if (!panel.contains(e.target) && e.target !== trigger) closeMenu();
  };

  const onMenuKeydown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closeMenu({ refocusTrigger: true });
      return;
    }
    if (e.key === 'Tab' && items.length >= 2) {
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  trigger.addEventListener('click', () => (isOpen() ? closeMenu({ refocusTrigger: true }) : openMenu()));

  panel.querySelector('[data-action="reset-desktop"]').addEventListener('click', () => {
    windowManager.closeAll();
    iconManager.reset();
    closeMenu({ refocusTrigger: true });
  });

  panel.querySelector('[data-action="close-windows"]').addEventListener('click', () => {
    windowManager.closeAll();
    closeMenu({ refocusTrigger: true });
  });
}
