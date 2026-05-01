# Nic Milligan Creative — Product Requirements Document

## 1. Overview

A single-page, OS-style creative portfolio for **Nic Milligan**. The interface presents as a stylised desktop environment where the user clicks animated icons to open pop-up windows containing portfolio content. The site is intentionally non-scrolling on desktop — the desktop *is* the page.

**Domain:** TBD
**Owner:** Nic Milligan
**Repo:** `Creative-Portfolio`
**Stack:** Vanilla HTML / CSS / JavaScript (no framework)
**Deployment target:** TBD (recommend Netlify or Vercel free tier)

## 2. Goals & Success Criteria

### Primary goals
- Showcase Nic's creative work in a memorable, distinctive interface
- Demonstrate technical and creative range through interactive Rive elements
- Provide a clear path to contact / hire / follow
- Rank organically and be cited by AI search for Nic's name and creative work

### Success criteria (v1 launch)
- All six desktop apps functional (Projects, Playground, About, Resume, Contact, Blog)
- Site loads and is interactive in under 2 seconds on a mid-range mobile connection
- Lighthouse scores: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95
- Works on Chrome, Safari, Firefox (current + previous major version)
- Mobile fallback experience is genuinely usable, not a degraded afterthought
- All Rive animations respect `prefers-reduced-motion`

## 3. Reference Sites (technical pattern only — not art direction)

- [mitchivin.com](https://mitchivin.com) — XP-style desktop, boot screen, login, draggable windows
- [cyanbanister.com](https://cyanbanister.com) — illustrated desktop, icon grid, mobile fallback pattern
- [matvoyce.tv](https://matvoyce.tv) — motion-led portfolio (referenced for animation polish, not layout)

The visual style for this site is intentionally undefined in this PRD — see future `design.md` skill once art direction is locked.

## 4. Information Architecture

### 4.1 The Desktop (root view)
A full-bleed canvas. No page scroll. Contains:

- **Top bar** ("task bar"): site title `Nic Milligan Creative` on the left, social icons (Instagram, YouTube, LinkedIn, X) on the right
- **Desktop icons** (clickable, animated via Rive): Projects, Playground, About Me, Resume, Contact, Blog
- **Background:** static or Rive-animated (TBD with art direction)
- **Optional easter egg:** placeholder, location TBD

### 4.2 The Six Apps

Each app is a pop-up window that opens over the desktop. Windows can be **closed**, and where it makes sense, **dragged** by their title bar. Resize and minimise behaviour is out of scope for v1 unless cheap to add.

#### App 1: My Projects
- Opens a single window listing all projects
- List shows project thumbnail, title, year, and short description
- Clicking a project **replaces the contents of the same window** with a detail view
- Detail view includes: hero image/video, problem statement, approach, outcome, visuals, and a "← Back to projects" button that returns to the list
- Project content is authored as Markdown files in `/content/projects/` and rendered into the window at build time
- **Each project also gets a standalone static page at `/projects/[slug]/`** for SEO (same pattern as the blog — see §4.6)

#### App 2: Playground
- Opens a window showing experiments, side projects, motion tests, and Rive demos
- Grid of cards, each card embeds a small interactive piece inline
- Treated as informal — not full case studies. One-liner per item is fine
- Content authored in `/content/playground/`

#### App 3: About Me
- Opens a window with bio, photo, list of skills/tools, brands worked with, and a short personal note
- Single view, no sub-navigation
- Content authored as a single Markdown file in `/content/about.md`

#### App 4: Resume
- Opens a styled window with the CV laid out as readable HTML (not an embedded PDF)
- Sections: experience, education, skills, awards/recognition (if any)
- Includes a clear **"Download PDF"** button
- The actual PDF lives in `/public/nic-milligan-resume.pdf` and is also linked from the HTML `<head>` for SEO

#### App 5: Contact
- Opens a smaller window
- Contains: email address (clickable mailto), social links repeated, optional contact form
- Decision pending: simple mailto only for v1, or include a form (form requires Formspree/similar). **Recommend mailto-only for v1.**

#### App 6: My Blog
- Opens a window with a list of blog posts (title, date, excerpt)
- Clicking a post **navigates to the standalone post page** at `/blog/[slug]/`
- This is intentional — see §4.6
- Posts authored as Markdown in `/content/blog/`

### 4.3 Top bar (taskbar)
- Left: `Nic Milligan Creative` — clicking returns to a clean desktop (closes all windows)
- Right: Instagram, YouTube, LinkedIn, X icons (open in new tab)
- Persistent across all desktop interactions
- Optional: clock or status indicator (decide with art direction)

### 4.4 Window behaviour
- Windows open with a small entrance animation (scale + fade — keep it tight, ~200ms)
- Title bar shows app name and a close button
- Drag-to-move via title bar (desktop only)
- Click on background of an inactive window brings it to front (z-index management)
- Multiple windows can be open simultaneously
- Close on `Escape` key for the topmost window
- Position: open near-center with a slight random offset so multiple windows don't perfectly overlap

### 4.5 Easter egg
- Placeholder. Examples to consider: a hidden icon revealed on a specific cursor position, a Konami code trigger, a "trash can" that does something unexpected, a hidden audio clip
- **Not required for v1 launch.** Decide post-launch.

### 4.6 SEO architecture (critical)

The OS metaphor is bad for SEO if everything lives inside JS-rendered windows. The fix:

- **Every project and every blog post has a real static HTML page** at `/projects/[slug]/` and `/blog/[slug]/`
- These pages are generated at build time by a small Node script from Markdown source files
- The desktop UI links to these pages where appropriate (blog) or loads the Markdown content into a window where appropriate (projects work both ways)
- Each generated page includes:
  - Proper `<title>`, `<meta description>`, OpenGraph tags
  - JSON-LD structured data (`Article` schema for blog, `CreativeWork` for projects)
  - Canonical URL
  - Author markup pointing to the About page
- Site-wide:
  - `sitemap.xml` (auto-generated, includes all static pages)
  - `robots.txt`
  - `feed.xml` (RSS for blog — matters for AI search)
  - `humans.txt` (optional, on-brand for this kind of site)

## 5. Mobile Experience

The desktop metaphor breaks on phones. The mobile fallback follows the **Cyan Banister pattern**:

- Same icons, but laid out in a tighter grid (2–3 columns)
- No central illustration / no draggable windows
- Tapping an icon opens a **full-screen takeover** (not a pop-up window)
- Top bar simplified — site title and a hamburger or kebab for socials
- Triggered at viewport widths below ~768px
- Content inside each "app" is identical to desktop — only the chrome changes

## 6. Rive Integration

- Rive Web Runtime loaded via CDN: `https://unpkg.com/@rive-app/canvas`
- Each desktop icon is a Rive instance with at minimum: `idle`, `hover`, `click` states
- File naming convention: `/public/rive/icon-[appname].riv`
- Lazy-load Rive instances if not in viewport (relevant on mobile)
- Fallback: if Rive fails to load, show a static SVG/PNG version of the icon
- Background may be a Rive instance — if so, it must be optional (toggle for performance) and must respect `prefers-reduced-motion`

## 7. Performance Budget

- Total initial JS payload: under 80KB compressed (excluding Rive runtime)
- Rive runtime adds ~150KB but is essential
- All images: WebP with PNG fallback, served at correct size, lazy-loaded below the fold
- No web fonts beyond two faces total (display + text)
- Cache headers configured for static assets

## 8. Accessibility (non-negotiable)

- All interactive elements keyboard-navigable
- Visible focus states on every focusable element
- Windows trap focus when open, return focus on close
- All Rive animations have static fallback when `prefers-reduced-motion: reduce`
- Color contrast meets WCAG AA minimum
- All icons have proper `aria-label`s
- Images have meaningful `alt` text (decorative ones marked `alt=""`)

## 9. Build & Tooling

- **No bundler** initially — plain HTML/CSS/JS, ES modules where useful
- **Build step:** a single `build.js` Node script that:
  - Reads Markdown from `/content/`
  - Renders to static HTML using a template
  - Generates `sitemap.xml` and `feed.xml`
  - Copies static assets to `/dist/`
- **Dev server:** `npx serve` or similar — no Vite needed for v1
- **Deployment:** push to `main` triggers Netlify/Vercel build
- Add a bundler later only if complexity demands it

## 10. Out of Scope for v1

- CMS integration (content is Markdown in repo)
- Authentication / login screen (we're not copying mitchivin's boot sequence)
- Window resize / minimise / maximise
- Multiple desktop "spaces" or multi-window workspace memory
- Comments on blog posts
- Newsletter signup
- Analytics dashboard (can add Plausible/GA4 if wanted, simple)

## 11. Open Questions

- [ ] Domain name + DNS provider
- [ ] Deployment target (Netlify vs Vercel vs Cloudflare Pages)
- [ ] Contact form: mailto only, or proper form with Formspree/Resend?
- [ ] Easter egg concept
- [ ] Art direction (separate doc — `design.md`)
- [ ] Copy voice and microcopy patterns (separate doc — `copywriting.md`)
- [ ] Initial set of projects to feature in v1
- [ ] Resume content
- [ ] Bio + about copy

## 12. Build Order (Claude Code session plan)

Sessions should be built in this order. Each session ends with the work committed and reviewable.

1. **Project scaffold** — folder structure, `index.html`, base CSS, build script skeleton
2. **Static desktop layout** — top bar, icon grid (placeholder icons), no interactivity yet
3. **Window system** — open/close/drag/z-index logic with one dummy app
4. **About Me window** — first real content, validates the window pattern
5. **Resume window** — second window, validates Markdown rendering for content
6. **Projects window** — list view + detail view + back button + standalone static pages
7. **Blog window + standalone post pages** — validates the SEO architecture
8. **Playground window**
9. **Contact window**
10. **Rive integration** — replace placeholder icons with Rive animations
11. **Mobile fallback** — full-screen takeover pattern
12. **Polish pass** — motion timing, focus states, accessibility audit, Lighthouse
13. **SEO + meta** — sitemap, RSS, JSON-LD, OG images
14. **Deploy** — connect to host, configure DNS

Each session should reference this PRD plus the relevant skills (`design.md`, `copywriting.md`).
