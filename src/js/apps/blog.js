import { registerBlogWindow, handlePostClick } from './blog-post.js';

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function getContent() {
  return `
    <ul class="blog-list" data-state="loading" aria-live="polite">
      <li class="blog-list__loading">Loading posts&hellip;</li>
    </ul>`;
}

function renderList(posts) {
  if (!posts.length) {
    return '<li class="blog-list__error">No posts yet — check back soon.</li>';
  }
  return posts
    .map(
      (post) => `
      <li>
        <a class="blog-post-card" href="/blog/${encodeURIComponent(post.slug)}/" data-slug="${escapeHtml(post.slug)}">
          <span class="blog-post-card__date">${escapeHtml(post.dateDisplay)}</span>
          <span class="blog-post-card__title">${escapeHtml(post.title)}</span>
          <p class="blog-post-card__excerpt">${escapeHtml(post.excerpt)}</p>
        </a>
      </li>`
    )
    .join('');
}

export function init(win) {
  const content = win.querySelector('.window__content');

  content.addEventListener('click', (e) => {
    const anchor = e.target.closest('.blog-post-card');
    if (!anchor) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    handlePostClick(win, anchor.dataset.slug);
  });

  fetch('/blog-manifest.json')
    .then((res) => {
      if (!res.ok) throw new Error(`Manifest request failed: ${res.status}`);
      return res.json();
    })
    .then((posts) => {
      if (!document.contains(win)) return;
      const list = win.querySelector('.blog-list');
      list.dataset.state = 'ready';
      list.innerHTML = renderList(posts);
      registerBlogWindow(win, posts);
    })
    .catch(() => {
      if (!document.contains(win)) return;
      const list = win.querySelector('.blog-list');
      list.dataset.state = 'error';
      list.innerHTML = '<li class="blog-list__error">Couldn&rsquo;t load posts. Try again shortly.</li>';
    });
}
