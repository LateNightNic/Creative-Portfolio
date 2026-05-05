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
}
