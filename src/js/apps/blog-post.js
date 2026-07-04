// Hybrid in-app post view: the static page at /blog/[slug]/ is the real,
// crawlable source of truth (see PRD §4.6). When a user is already inside
// the desktop app, clicking a post fetches that same static page and
// splices its content into the Blog window in place — no duplicate
// rendering, no full reload — and keeps the URL in sync via the History
// API so a refresh lands on the real static page (expected: that's the
// SEO-safe fallback, not a bug).

const stateByWindow = new WeakMap(); // win -> { listHtml, posts }
let activeWin = null;
let popstateBound = false;

function siteTitle(pageTitle) {
  return pageTitle ? `${pageTitle} — Nic Milligan Creative` : 'Nic Milligan Creative';
}

function findPost(win, slug) {
  const state = stateByWindow.get(win);
  return state?.posts.find((p) => p.slug === slug);
}

async function fetchPostContent(slug) {
  const res = await fetch(`/blog/${encodeURIComponent(slug)}/`);
  if (!res.ok) throw new Error(`Post request failed: ${res.status}`);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const content = doc.querySelector('.page-content');
  return content ? content.innerHTML : '<p>Couldn&rsquo;t load this post.</p>';
}

function renderPostChrome(bodyHtml) {
  return `
    <button type="button" class="blog-post-back">&larr; Back to posts</button>
    <div class="page-content">${bodyHtml}</div>`;
}

function restoreList(win) {
  const state = stateByWindow.get(win);
  if (!state) return;
  win.querySelector('.window__content').innerHTML = state.listHtml;
  win.querySelector('.window__title').textContent = 'Blog';
  document.title = siteTitle();
}

async function renderPostIntoWindow(win, slug) {
  const contentEl = win.querySelector('.window__content');
  const post = findPost(win, slug);

  try {
    const bodyHtml = await fetchPostContent(slug);
    if (!document.contains(win)) return;

    contentEl.innerHTML = renderPostChrome(bodyHtml);
    const backBtn = contentEl.querySelector('.blog-post-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => history.back());
      backBtn.focus();
    }

    const title = post ? post.title : 'Blog';
    win.querySelector('.window__title').textContent = title;
    document.title = siteTitle(title);
  } catch {
    if (!document.contains(win)) return;
    contentEl.innerHTML = '<p class="blog-list__error">Couldn&rsquo;t load this post. Try again shortly.</p>';
  }
}

function onPopState() {
  const win = activeWin;
  if (!win || !document.contains(win)) return;

  const match = location.pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (match) {
    renderPostIntoWindow(win, decodeURIComponent(match[1]));
  } else {
    restoreList(win);
  }
}

// Called once per window-open lifecycle, after the post list has rendered.
export function registerBlogWindow(win, posts) {
  activeWin = win;
  stateByWindow.set(win, { listHtml: win.querySelector('.window__content').innerHTML, posts });

  if (!popstateBound) {
    window.addEventListener('popstate', onPopState);
    popstateBound = true;
  }
}

export function handlePostClick(win, slug) {
  const post = findPost(win, slug);
  if (!post) return;

  history.pushState({ blogSlug: slug }, '', `/blog/${slug}/`);
  renderPostIntoWindow(win, slug);
}
