# CLAUDE.md

This file is read by Claude Code at the start of every session. Keep it short, stable, and authoritative. Detailed guidance lives in `/.claude/skills/`.

## Project

**Nic Milligan Creative** — an OS-style creative portfolio. Single-page desktop interface with draggable, resizable pop-up windows. Desktop icons are repositionable via drag. A Reset button in the top bar restores the desktop to its default state. Vanilla HTML/CSS/JS. No framework.

**Domain:** `https://www.nicmilligan.com`
**Contact email:** `hello@nicmilligan.com`

Full spec: see `PRD.md` in the repo root.

## Stack

- HTML, CSS, vanilla JavaScript (ES modules)
- Rive Web Runtime via CDN for animated icons and interactive elements
- Node-based build script for generating static pages from Markdown
- No bundler, no framework, no TypeScript (unless explicitly requested later)

## Hard rules

- **Never** introduce a framework (React, Vue, Svelte, etc.) without explicit approval
- **Never** add a CSS framework (Tailwind, Bootstrap) — we are writing custom CSS by hand
- **Never** rewrite working code unless asked. Make targeted edits.
- **Never** commit to `main` directly. Branch → PR → review.
- **Always** check `prefers-reduced-motion` before adding any non-essential animation
- **Always** include keyboard support (Escape to close, Tab navigation, focus traps in windows)
- **Always** add proper `aria-label`s on interactive elements
- **Always** use semantic HTML (`<button>` for actions, `<a>` for navigation, real headings)
- **Icon positions** are stored as percentages of viewport width/height (never px) so they reflow on browser resize. Session-only — no localStorage
- **Reset** (top bar button) must close all windows and restore all icon positions to their CSS-defined defaults without reloading the page
- **Window resize** is handled via right edge (horizontal), bottom edge (vertical), and bottom-right corner (both). Content is pinned top-left; overflow scrolls vertically. Minimum window size: 320 × 240px
- **Icon drag and window resize are disabled on mobile** (below 768px). Mobile uses full-screen takeover instead
- **Contact app:** desktop opens a Web3Forms-powered contact form (free tier, plain HTML `<form>` POST) to `hello@nicmilligan.com`. Mobile triggers `mailto:hello@nicmilligan.com` directly. No paid backend — never introduce one without explicit approval

## Folder structure

```
/
├── public/              # static assets served as-is
│   ├── rive/            # .riv files
│   ├── images/
│   └── nic-milligan-resume.pdf
├── src/
│   ├── index.html       # the desktop
│   ├── css/
│   ├── js/
│   │   ├── main.js
│   │   ├── windows.js   # window open/close/drag/resize/z-index
│   │   ├── icons.js     # icon drag, percentage positioning, reset restore
│   │   ├── topbar.js    # top bar behaviour incl. Reset button
│   │   ├── rive.js      # Rive loader & state mgmt
│   │   └── apps/        # one file per app
│   └── templates/       # HTML templates for static page generation
├── content/
│   ├── about.md
│   ├── projects/        # one .md per project
│   ├── playground/
│   └── blog/            # one .md per post
├── scripts/
│   └── build.js         # generates /dist
├── dist/                # build output, gitignored
├── .claude/
│   └── skills/
│       ├── design.md
│       └── copywriting.md
├── PRD.md
├── CLAUDE.md            # this file
└── README.md
```

## Skills (load when relevant)

Read these before doing the corresponding work. Do not duplicate their contents into prompts.

- `.claude/skills/design.md` — visual system, typography, color, motion, window chrome
- `.claude/skills/copywriting.md` — voice, tone, microcopy patterns

## Working agreements

- **Plan before building.** For any non-trivial task, propose the approach in 3–5 bullets first. Wait for confirmation. Then build.
- **One feature at a time.** Don't build three things in one PR.
- **Commit messages:** present-tense, imperative mood. Example: `add window drag handler`. Reference PRD section if relevant: `add window drag handler (PRD §4.4)`.
- **Branch names:** `feat/window-system`, `fix/focus-trap`, `chore/build-script`.
- **Show, don't tell.** When iterating on visuals, render and show the result rather than describing what it would look like.

## Build & dev commands

```bash
# Install deps (only needed for build script)
npm install

# Run dev server
npm run dev

# Build static site
npm run build

# Preview build output
npm run preview
```

(These commands will be defined in `package.json` when scaffolded.)

## What to do when stuck or uncertain

- If a request is ambiguous, ask before building
- If a design decision isn't covered in `design.md`, propose 2–3 options rather than picking one silently
- If a request would violate a hard rule above, flag it before complying
- If the PRD and a request conflict, surface the conflict rather than assuming

## Browser support

- Latest Chrome, Safari, Firefox, Edge
- Previous major version of each
- Mobile Safari and Chrome on Android (latest two majors)
- No IE, no legacy Edge

## Performance constraints

- Initial JS under 80KB compressed (excluding Rive runtime)
- All images WebP with PNG fallback
- Lazy-load anything below the fold or off-screen
- Lighthouse: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95

## Out of scope

See PRD §10. If a request falls under "out of scope," flag it before doing it.

