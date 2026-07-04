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

function initConnect() {
  const wrap = document.querySelector('.taskbar__connect-wrap');
  const button = document.querySelector('.taskbar__connect');
  const menu = document.querySelector('.taskbar__connect-menu');
  if (!wrap || !button || !menu) return;

  const closeMenu = () => {
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
  };

  button.addEventListener('click', () => {
    if (menu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (!wrap.contains(event.target)) {
      closeMenu();
    }
  });

  wrap.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      closeMenu();
      button.focus();
    }
  });
}

export function initTopbar({ windowManager, iconManager }) {
  const title = document.querySelector('.taskbar__title');
  if (title) {
    title.addEventListener('click', () => windowManager.closeAll());
  }

  const reset = document.querySelector('.taskbar__reset');
  if (reset) {
    reset.addEventListener('click', () => {
      windowManager.closeAll();
      iconManager.reset();
    });
  }

  initConnect();
  initClock();
}
