const PDF_PATH = 'nic-milligan-resume.pdf';
const IMG_WEBP = 'images/resume-preview.webp';
const IMG_PNG  = 'images/resume-preview.png';

export function getContent() {
  return `
    <div class="resume">
      <div class="resume__toolbar" role="toolbar" aria-label="Resume actions">
        <button type="button" class="resume__btn" data-action="zoom" aria-pressed="false" aria-label="Toggle zoom (fit to width)">Zoom</button>
        <a class="resume__btn" data-action="save" href="${PDF_PATH}" download aria-label="Download resume PDF">Save</a>
      </div>
      <div class="resume__viewer">
        <picture>
          <!-- TODO: re-add <source srcset="${IMG_WEBP}" type="image/webp"> once real WebP asset is delivered -->
          <img class="resume__image" src="${IMG_PNG}" alt="Nic Milligan resume">
        </picture>
      </div>
    </div>
  `;
}

export function init(win) {
  const viewer = win.querySelector('.resume__viewer');
  const zoomBtn = win.querySelector('[data-action="zoom"]');
  if (!viewer || !zoomBtn) return;

  zoomBtn.addEventListener('click', () => {
    const on = viewer.classList.toggle('is-zoomed');
    zoomBtn.setAttribute('aria-pressed', String(on));
    if (on) viewer.scrollTop = 0;
  });
}
