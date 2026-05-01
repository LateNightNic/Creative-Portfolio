const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const PUBLIC = path.join(ROOT, 'public');
const CONTENT = path.join(ROOT, 'content');
const DIST = path.join(ROOT, 'dist');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function build() {
  console.log('Building...');
  ensureDir(DIST);

  // Copy src and public assets to dist
  copyDir(SRC, DIST);
  copyDir(PUBLIC, path.join(DIST, 'public'));

  // TODO (Session 6): render /content/projects/*.md → /dist/projects/[slug]/index.html
  // TODO (Session 7): render /content/blog/*.md → /dist/blog/[slug]/index.html
  // TODO (Session 13): generate sitemap.xml, feed.xml, robots.txt

  console.log('Done → dist/');
}

build();
