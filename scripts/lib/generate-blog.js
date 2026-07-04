const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = path.join(__dirname, '..', '..');
const CONTENT_BLOG = path.join(ROOT, 'content', 'blog');
const TEMPLATE_PATH = path.join(ROOT, 'src', 'templates', 'static-page.html');
const DEFAULT_DESCRIPTION = 'The creative portfolio of Nic Milligan — design, motion, and interactive work.';
const EXCERPT_LENGTH = 160;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// YAML auto-parses a bare `date: 2026-06-01` into a real Date (UTC
// midnight) rather than leaving it a string — normalize both cases to a
// plain "YYYY-MM-DD" string so the rest of the pipeline only deals with one type.
function toIsoDateString(value) {
  if (value instanceof Date) {
    const y = value.getUTCFullYear();
    const m = String(value.getUTCMonth() + 1).padStart(2, '0');
    const d = String(value.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(value);
}

// Parsed manually rather than `new Date(dateString)` — the latter reads
// "YYYY-MM-DD" as UTC midnight, which renders as the previous day in
// negative-UTC-offset timezones.
function formatDisplayDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function deriveExcerpt(html) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return DEFAULT_DESCRIPTION;
  if (text.length <= EXCERPT_LENGTH) return text;
  const truncated = text.slice(0, EXCERPT_LENGTH);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : EXCERPT_LENGTH)}…`;
}

// Authors paste raw embed HTML (e.g. a YouTube iframe) directly into the
// markdown body — marked passes it through untouched since this is
// single-author/trusted content, never user-submitted. This just wraps
// whatever iframe shows up in a responsive-ratio container.
function wrapEmbeds(html) {
  return html.replace(/<iframe[\s\S]*?<\/iframe>/g, (match) => `<div class="embed-responsive">${match}</div>`);
}

function buildJsonLd({ title, description, dateIso, updatedIso, canonical, siteUrl }) {
  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: dateIso,
    dateModified: updatedIso || dateIso,
    author: { '@type': 'Person', name: 'Nic Milligan', url: `${siteUrl}/` },
    mainEntityOfPage: canonical,
  });
  // Prevent a title/description containing "</script>" from breaking out
  // of the JSON-LD script tag.
  return json.replace(/</g, '\\u003c');
}

function renderTemplate(template, tokens) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => (key in tokens ? tokens[key] : ''));
}

function generateBlog({ outDir, siteUrl }) {
  if (!fs.existsSync(CONTENT_BLOG)) return [];

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const files = fs.readdirSync(CONTENT_BLOG).filter((f) => f.endsWith('.md'));

  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(CONTENT_BLOG, filename), 'utf8');
    const { data, content } = matter(raw);

    if (!data.title) throw new Error(`content/blog/${filename}: missing required "title" in frontmatter`);
    if (!data.date) throw new Error(`content/blog/${filename}: missing required "date" in frontmatter`);

    const slug = data.slug || filename.replace(/\.md$/, '');
    const bodyHtml = wrapEmbeds(marked.parse(content));
    const excerpt = data.excerpt || data.description || deriveExcerpt(bodyHtml);
    const canonical = `${siteUrl}/blog/${slug}/`;
    const dateIso = toIsoDateString(data.date);

    return {
      slug,
      title: data.title,
      date: dateIso,
      dateDisplay: formatDisplayDate(dateIso),
      excerpt,
      updated: data.updated ? toIsoDateString(data.updated) : null,
      bodyHtml,
      canonical,
    };
  });

  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  ensureDir(outDir);

  const manifest = posts.map(({ slug, title, date, dateDisplay, excerpt }) => ({
    slug,
    title,
    date,
    dateDisplay,
    excerpt,
  }));
  fs.writeFileSync(path.join(outDir, 'blog-manifest.json'), JSON.stringify(manifest, null, 2));

  posts.forEach((post) => {
    const jsonLd = buildJsonLd({
      title: post.title,
      description: post.excerpt,
      dateIso: post.date,
      updatedIso: post.updated,
      canonical: post.canonical,
      siteUrl,
    });

    const html = renderTemplate(template, {
      title: escapeHtml(post.title),
      description: escapeHtml(post.excerpt),
      canonical: escapeHtml(post.canonical),
      og_type: 'article',
      json_ld: jsonLd,
      content: post.bodyHtml,
    });

    const postDir = path.join(outDir, 'blog', post.slug);
    ensureDir(postDir);
    fs.writeFileSync(path.join(postDir, 'index.html'), html);
  });

  return posts;
}

module.exports = { generateBlog };
