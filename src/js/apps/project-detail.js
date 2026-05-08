import { projects } from './projects.js';

let windowManager = null;

export function setWindowManager(manager) {
  windowManager = manager;
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function renderHeader(p) {
  const dates = [p.startDate, p.endDate].filter(Boolean).join(' – ');
  const meta = [p.role, dates].filter(Boolean).join(' • ');

  const link = p.link
    ? `<a class="project-overview__link" href="${escapeHtml(p.link)}" target="_blank" rel="noopener">Visit Project <span aria-hidden="true">↗</span></a>`
    : '';

  const stack = p.stack?.length
    ? `<h3 class="project-overview__chips-label">Tech Stack</h3>
       <ul class="project-chips">${p.stack.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>`
    : '';

  const tasks = p.tasks?.length
    ? `<h3 class="project-overview__chips-label">Tasks</h3>
       <ul class="project-chips">${p.tasks.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`
    : '';

  return `
    <header class="project-overview__header">
      <h2 class="project-overview__title">${escapeHtml(p.title)}</h2>
      ${meta ? `<p class="project-overview__meta">${escapeHtml(meta)}</p>` : ''}
      ${link}
      ${stack}
      ${tasks}
    </header>`;
}

function renderSections(sections) {
  if (!sections?.length) return '';
  return `<div class="project-overview__body">${sections
    .map((s) => `<section class="project-section"><h3>${escapeHtml(s.heading)}</h3>${s.body}</section>`)
    .join('')}</div>`;
}

function renderVisualMedia(v) {
  switch (v.type) {
    case 'video':
      return `<video controls${v.poster ? ` poster="${escapeHtml(v.poster)}"` : ''}><source src="${escapeHtml(v.src)}"></video>`;
    case 'webm':
      return `<video autoplay muted loop playsinline><source src="${escapeHtml(v.src)}" type="video/webm"></video>`;
    case 'embed':
      return `<iframe src="${escapeHtml(v.url)}" title="${escapeHtml(v.title || 'Embedded video')}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    case 'gif':
      return `<img src="${escapeHtml(v.src)}" alt="${escapeHtml(v.alt || '')}" loading="lazy">`;
    case 'image':
    default:
      return `<img src="${escapeHtml(v.src)}" alt="${escapeHtml(v.alt || '')}" loading="lazy">`;
  }
}

function renderVisuals(visuals) {
  if (!visuals?.length) {
    return `
      <section class="project-visuals" aria-label="Visuals">
        <p class="project-visuals__empty">Visuals coming soon.</p>
      </section>`;
  }

  const items = visuals
    .map((v, i) => {
      const caption = v.caption || `Slide ${i + 1} • ${v.type}`;
      return `
        <li class="project-visual">
          <div class="project-visual__media">${renderVisualMedia(v)}</div>
          <p class="project-visual__caption">${escapeHtml(caption)}</p>
        </li>`;
    })
    .join('');

  return `
    <section class="project-visuals" aria-label="Visuals">
      <header class="project-visuals__header">
        <span>Visuals</span>
        <span>${visuals.length} ${visuals.length === 1 ? 'Slide' : 'Slides'}</span>
      </header>
      <ol class="project-visuals__list">${items}</ol>
    </section>`;
}

export function getContent(project) {
  return `
    <aside class="project-overview">
      ${renderHeader(project)}
      ${renderSections(project.sections)}
    </aside>
    <div class="project-divider" role="separator" aria-orientation="vertical" tabindex="0" aria-label="Resize panes" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40"></div>
    ${renderVisuals(project.visuals)}`;
}

function makePaneResizable(win) {
  const content  = win.querySelector('.window__content');
  const overview = win.querySelector('.project-overview');
  const divider  = win.querySelector('.project-divider');
  if (!content || !overview || !divider) return;

  const MIN_LEFT  = 240;
  const MIN_RIGHT = 240;

  const setFromPx = (px) => {
    const total = content.clientWidth;
    if (!total) return;
    const clamped = Math.max(MIN_LEFT, Math.min(total - MIN_RIGHT, px));
    const percent = (clamped / total) * 100;
    overview.style.flexBasis = `${percent}%`;
    divider.setAttribute('aria-valuenow', String(Math.round(percent)));
  };

  divider.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    divider.setPointerCapture(e.pointerId);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    const rect = content.getBoundingClientRect();
    const onMove = (ev) => setFromPx(ev.clientX - rect.left);
    const onEnd = () => {
      divider.removeEventListener('pointermove', onMove);
      divider.removeEventListener('pointerup', onEnd);
      divider.removeEventListener('pointercancel', onEnd);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    divider.addEventListener('pointermove', onMove);
    divider.addEventListener('pointerup', onEnd);
    divider.addEventListener('pointercancel', onEnd);
    e.preventDefault();
  });

  divider.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const step = e.shiftKey ? 48 : 16;
    const dir = e.key === 'ArrowLeft' ? -1 : 1;
    setFromPx(overview.offsetWidth + dir * step);
  });
}

export function openProjectWindow(slug, triggerEl) {
  if (!windowManager) return;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return;

  const width = Math.min(1200, window.innerWidth - 64);
  const height = Math.min(800, window.innerHeight - 96);

  const win = windowManager.open({
    id: `project:${slug}`,
    title: project.title,
    content: getContent(project),
    triggerEl,
    width,
    height,
  });

  if (win && !win.dataset.paneInitialized) {
    makePaneResizable(win);
    win.dataset.paneInitialized = 'true';
  }
}
