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
  const reset = document.querySelector('.taskbar__reset');
  if (reset) {
    reset.addEventListener('click', () => {
      windowManager.closeAll();
      iconManager.reset();
    });
  }

  initClock();
}
