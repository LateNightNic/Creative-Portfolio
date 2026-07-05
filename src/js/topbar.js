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
  initSocialMenu();
  initClock();
}

function createDropdown({ trigger, panel, getItems, onToggle }) {
  const isOpen = () => trigger.getAttribute('aria-expanded') === 'true';

  const open = () => {
    if (isOpen()) return;
    trigger.setAttribute('aria-expanded', 'true');
    onToggle?.(true);
    document.addEventListener('pointerdown', onOutsidePointer, true);
    document.addEventListener('keydown', onKeydown, true);
    getItems()[0]?.focus();
  };

  const close = ({ refocusTrigger = false } = {}) => {
    if (!isOpen()) return;
    trigger.setAttribute('aria-expanded', 'false');
    onToggle?.(false);
    document.removeEventListener('pointerdown', onOutsidePointer, true);
    document.removeEventListener('keydown', onKeydown, true);
    if (refocusTrigger) trigger.focus();
  };

  const onOutsidePointer = (e) => {
    if (!panel.contains(e.target) && e.target !== trigger) close();
  };

  const onKeydown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close({ refocusTrigger: true });
      return;
    }
    if (e.key === 'Tab') {
      const items = getItems();
      if (items.length < 2) return;
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

  trigger.addEventListener('click', () => (isOpen() ? close({ refocusTrigger: true }) : open()));

  return { close };
}

function initMenu({ windowManager, iconManager }) {
  const trigger = document.getElementById('taskbar-menu-trigger');
  const panel = document.getElementById('taskbar-menu');
  if (!trigger || !panel) return;

  const dropdown = createDropdown({
    trigger,
    panel,
    getItems: () => [...panel.querySelectorAll('.taskbar__menu-item')],
    onToggle: (open) => {
      panel.hidden = !open;
    },
  });

  panel.querySelector('[data-action="reset-desktop"]').addEventListener('click', () => {
    windowManager.closeAll();
    iconManager.reset();
    dropdown.close({ refocusTrigger: true });
  });

  panel.querySelector('[data-action="close-windows"]').addEventListener('click', () => {
    windowManager.closeAll();
    dropdown.close({ refocusTrigger: true });
  });
}

function initSocialMenu() {
  const trigger = document.getElementById('taskbar-social-trigger');
  const panel = document.getElementById('taskbar-social');
  if (!trigger || !panel) return;

  createDropdown({
    trigger,
    panel,
    getItems: () => [...panel.querySelectorAll('.taskbar__social-link')],
  });
}
