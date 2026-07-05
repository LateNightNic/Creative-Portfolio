# Mobile Session Plan — Mobile Responsiveness Implementation

> **For the executing model:** This plan is self-contained. All file paths, line references, and code sketches below were verified against the repo on 2026-07-05 (branch `develop-mobile-responsive`, tip `f4f8c83`). Read CLAUDE.md before starting and follow its hard rules. Execute the steps **in order**, one commit per step, using the exact commit messages given. Do not build anything not listed here.

## Context

The portfolio (OS-style desktop, vanilla HTML/CSS/JS, no framework, no bundler) currently has only token mobile support: a `@media (max-width: 768px)` block that tweaks taskbar spacing and the icon grid, and one that hides window resize handles. The mobile behaviors described in CLAUDE.md (full-screen window takeover, contact `mailto:`) are **aspirational — not implemented**. This change makes the site genuinely usable on mobile:

1. Taskbar social icons collapse into a hamburger menu on the right (social links only; the left "Nic Milligan Creative" dropdown with Reset/Close stays as-is).
2. The six app icons lay out 2 columns × 3 rows, larger than desktop.
3. App windows open full-screen below the taskbar; close button enlarged to 44px; maximize hidden; drag disabled; content scrolls vertically; existing aesthetic (gradient chrome, hatches, frame stroke) preserved.
4. Project detail pages read vertically: text on top, visuals beneath. Blog posts are already single-column.
5. Contact icon on mobile triggers `mailto:hello@nicmilligan.com` directly (CLAUDE.md hard rule; user confirmed). Desktop keeps the Web3Forms window.

**Breakpoint: 768px** everywhere, matching the existing media queries.
**Branch:** already on clean `develop-mobile-responsive` — work there. Never commit to `main`.
**User decisions (already made — do not re-ask):** contact = `mailto:` on mobile; hamburger contains social links only.

## Facts verified during exploration (trust these)

- `src/js/icons.js` is an empty stub (`class IconManager { reset() {} }`). Icon drag does **not** exist anywhere in the codebase. Build nothing for it — out of scope, despite what CLAUDE.md implies.
- No mobile detection exists in JS; the only `matchMedia` uses are `prefers-reduced-motion` (`src/js/windows.js:2`, `src/js/lightbox.js:2`).
- **Markup bug:** in `src/index.html:44-49` the Instagram `<a>` never closes before LinkedIn's `<a>` opens, and a stray `</a>` at line 49 mis-nests them. Fixed in Step 1.
- Taskbar is `z-index: 9999`; `#windows` container is `z-index: 100` — the taskbar always sits above windows, so a full-screen window never covers it or its dropdowns.
- `--taskbar-height: 2.5rem` lives in `src/css/base.css:43`. `body` already uses `100dvh` and `overflow: hidden`.
- `WindowManager.open()` (`src/js/windows.js`) sets inline px `width/height/left/top`; per-app sizes live in `src/js/main.js:12-19`. Desktop icon clicks are wired in `src/js/main.js:25-42`.
- Project detail (`src/js/apps/project-detail.js`) renders `<aside class="project-overview">` (text) → `.project-divider` (draggable divider that sets inline `flex-basis` %) → `.project-visuals` (media). DOM order already matches "text on top" — a CSS-only change flips it vertical.
- Playground masonry already drops to 2 columns ≤768px (`src/css/windows.css:990`). Blog post content is already single-column (`.page-content`, `src/css/static-page.css:41`).
- Existing mobile CSS blocks to extend (don't create parallel duplicates): `src/css/desktop.css:208` and `src/css/windows.css:493`.

## Architecture decisions (follow these — do not deviate)

- **Mobile detection:** one new two-line module `src/js/mobile.js`:
  ```js
  export const mobileQuery = window.matchMedia('(max-width: 768px)');
  export const isMobile = () => mobileQuery.matches;
  ```
  JS checks `isMobile()` **at interaction time** (drag pointerdown, contact tap). All layout is CSS-media-query-driven, so rotation across the breakpoint reflows live with no resize listeners.
- **Full-screen takeover is CSS-driven** (`!important` over the inline px geometry). Do **not** change `open()`, `_position()`, `_clampToViewport()`, or `_toggleMaximize()` in `windows.js` — the inline styles are deliberately kept as the fallback so a window opened on mobile lands in sane centered geometry when the device rotates to desktop width.
- **Hamburger uses the disclosure pattern** (button + `aria-expanded` + `aria-controls` + plain links, NOT `role="menu"` — these are navigation links). No duplicated markup: the same four `<a>`s render inline on desktop and become a dropdown panel on mobile via CSS keyed off `aria-expanded`. Reuse the existing open/close/Escape/Tab-wrap machinery in `topbar.js` by extracting it into a `createDropdown()` helper used by both menus.
- **Contact mailto is intercepted at the icon-click layer in `main.js`**, not in `contact.js` — "no window at all" is a launch decision, not app content. `src/js/apps/contact.js` stays untouched.

## Steps

### Step 1 — Fix mis-nested social anchors (`src/index.html:44-49`)

Current (broken):
```html
<a class="taskbar__social-link" href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
  <img src="images/social-icons/icon-Instagram.svg" alt="" />
<a class="taskbar__social-link" href="https://www.linkedin.com/in/nicmilligan/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
  <img src="images/social-icons/icon-LinkedIn.svg" alt="" />
</a>
</a>
```
Fix: close Instagram's `<a>` after its `<img>`; delete the stray `</a>`. Result: four sibling, correctly closed `.taskbar__social-link` anchors (Instagram, LinkedIn, X, YouTube). Change nothing else about them.

Commit: `fix nested social link anchors in taskbar`

### Step 2 — Add shared mobile helper (new file `src/js/mobile.js`)

The two-line module shown under Architecture decisions. This is the only new file in the whole change.

Commit: `add shared mobile matchMedia helper`

### Step 3 — Taskbar hamburger (social links)

**3a. `src/index.html`** — restructure `.taskbar__right` (lines 42-58): wrap the social block in `.taskbar__social-menu` (positioning context), add the trigger button before it, and upgrade the social `<div>` to `<nav>` (an `aria-label` on a bare `<div>` is ignored by AT):
```html
<div class="taskbar__right">
  <div class="taskbar__social-menu">
    <button class="taskbar__social-trigger" id="taskbar-social-trigger"
            aria-expanded="false" aria-controls="taskbar-social" aria-label="Social links">
      <span class="taskbar__social-trigger-bar" aria-hidden="true"></span>
      <span class="taskbar__social-trigger-bar" aria-hidden="true"></span>
      <span class="taskbar__social-trigger-bar" aria-hidden="true"></span>
    </button>
    <nav class="taskbar__social" id="taskbar-social" aria-label="Social links">
      <!-- the four fixed <a> links from Step 1, unchanged -->
    </nav>
  </div>
  <div class="taskbar__clock" aria-hidden="true"></div>
</div>
```

**3b. `src/js/topbar.js`** — extract the generic machinery from `initMenu` (lines 26-87: `aria-expanded` toggle, capture-phase outside-`pointerdown` close, Escape-with-refocus, Tab wrap, focus-first-item-on-open) into a helper:
```js
function createDropdown({ trigger, panel, getItems, onToggle }) {
  // isOpen(): trigger aria-expanded === 'true'
  // open(): set aria-expanded=true, onToggle?.(true), add capture-phase
  //         pointerdown/keydown document listeners, getItems()[0]?.focus()
  // close({ refocusTrigger }): reverse of open()
  // outside-pointer and keydown handlers identical to current initMenu bodies,
  // but Tab wrap uses getItems() so it works for link lists too
  // trigger click toggles open/close
  return { close };
}
```
- Rewire `initMenu` as a thin wrapper: `createDropdown({ trigger, panel, getItems: () => [...panel.querySelectorAll('.taskbar__menu-item')], onToggle: (open) => { panel.hidden = !open; } })`, keeping the existing two `data-action` button wirings (reset-desktop / close-windows) exactly as they are, each followed by `dropdown.close({ refocusTrigger: true })`. **Left-menu behavior must not change at all.**
- Add `initSocialMenu()` called from `initTopbar`: `createDropdown({ trigger: document.getElementById('taskbar-social-trigger'), panel: document.getElementById('taskbar-social'), getItems: () => [...panel.querySelectorAll('.taskbar__social-link')] })` — **no `onToggle`** (never set `hidden`; CSS controls visibility so the links remain visible inline on desktop). Guard `if (!trigger || !panel) return;` like `initMenu` does.
- On desktop the trigger is `display:none`, so this JS is inert there — no `isMobile()` check needed.

**3c. `src/css/desktop.css`** — base rules (outside any media query, near the existing `.taskbar__social` styles): `.taskbar__social-menu { position: relative; }` and `.taskbar__social-trigger { display: none; }`. Then inside the existing `@media (max-width: 768px)` block (line 208):
```css
.taskbar__social-trigger {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.25rem; width: 2.75rem; height: 2.5rem; cursor: pointer;
}
.taskbar__social-trigger-bar { width: 1.125rem; height: 2px; background: var(--color-light-black); }
.taskbar__social { display: none; }
.taskbar__social-trigger[aria-expanded="true"] + .taskbar__social {
  display: flex; flex-direction: column;
  position: absolute; top: calc(100% + 0.5rem); right: 0; padding: 0.5rem;
  background: linear-gradient(135deg, var(--color-off-white), var(--color-grey));
  border-radius: var(--window-radius);
  box-shadow: var(--window-frame-stroke), var(--window-shadow);
}
.taskbar__social-link { min-width: 2.75rem; min-height: 2.75rem; justify-content: center; }
```
Before styling the panel, look at the actual `.taskbar__menu-panel` rules in `desktop.css` and mirror that aesthetic (background, radius, shadow) so the two dropdowns match.

Commit: `collapse taskbar social links into hamburger on mobile`

### Step 4 — Icon grid 2×3 with larger tiles (`src/css/desktop.css` mobile block, lines 235-252)

The per-app `grid-column/grid-row` placements at lines 151-156 are unconditional and currently defeat the mobile `grid-auto-flow` (icons keep their sparse 4-row desktop placement). Replace the mobile `.icon-grid` / `.desktop-icon` / `.desktop-icon__graphic` rules with:
```css
.icon-grid {
  grid-template-columns: repeat(2, minmax(0, 10.5rem));
  grid-template-rows: none;
  grid-auto-flow: row;
  justify-content: center;
  gap: 2rem 1.25rem;
  width: 100%;
}
.icon-grid .desktop-icon { grid-column: auto; grid-row: auto; width: 100%; }
.desktop-icon__graphic { width: 100%; max-width: 9.5rem; height: auto; aspect-ratio: 1 / 1; }
```
Why `.icon-grid .desktop-icon` works: it has the same 0-2-0 specificity as `.desktop-icon[data-app="…"]` and appears later in the file, so it wins the cascade. `minmax(0, …)` + `width: 100%` keeps two columns fitting at 320px. Keep the existing mobile `.desktop { justify-content: center; }`. Six icons auto-flow into exactly 2 columns × 3 rows.

Commit: `lay out desktop icons 2x3 with larger tiles on mobile`

### Step 5 — Full-screen windows on mobile

**5a. `src/css/windows.css`** — extend the existing mobile block (lines 493-499, which already hides the three resize handles — keep that):
```css
.window {
  left: 0 !important;                                       /* beats inline styles from open()/_position/drag */
  top: var(--taskbar-height) !important;
  width: 100vw !important;
  height: calc(100dvh - var(--taskbar-height)) !important;  /* dvh handles iOS URL-bar chrome */
  min-width: 0; min-height: 0; max-width: none; max-height: none;
  border-radius: 0;
  box-shadow: var(--window-frame-stroke);                   /* keep frame stroke, drop the offset shadow */
}
.window__inner { border-radius: 0; }
.window__titlebar { height: 3.25rem; cursor: default; }
.window__titlebar:active { cursor: default; }
.window__control--maximize { display: none; }
.window__control--close { width: 2.75rem; height: 2.75rem; font-size: 1.25rem; }  /* 44px touch target */
```
Stacked windows still layer by z-index; close/Escape (`closeTop` in `windows.js`) reveals the one beneath — no JS change needed for stacking.

**5b. `src/js/windows.js`** — one targeted guard only. Add `import { isMobile } from './mobile.js';` at the top, and as the first line of the `pointerdown` handler in `_makeDraggable` (~line 105):
```js
if (isMobile()) return; // full-screen takeover: no drag
```
`_makeResizable` needs no guard (its handles are `display:none` on mobile and receive no pointer events). Do **not** touch `open`/`_position`/`_clampToViewport`/`_toggleMaximize` (see Architecture decisions). Focus trap, Escape handling, and `closeBtn.focus()` on open are unchanged and correct for full-screen dialogs.

Commit: `make app windows full-screen below taskbar on mobile`

### Step 6 — Project detail vertical + content polish (`src/css/windows.css`)

In the mobile media query, targeting the project two-pane layout (desktop rules live at ~638-686):
```css
[data-window-id^="project:"] .window__content {
  flex-direction: column;
  overflow-y: auto;              /* one scroll container for the whole page */
}
.project-overview,
.project-visuals {
  flex: none;
  flex-basis: auto !important;   /* beats the inline flexBasis % left by desktop divider drag */
  min-width: 0;
  overflow: visible;             /* panes stop being independent scrollers */
}
.project-divider { display: none; }  /* also removes its tabindex from tab order;
                                        makePaneResizable becomes unreachable — no JS guard needed */
```
DOM order in `project-detail.js` is already overview (text) → divider → visuals, so text lands on top and visuals beneath with no JS or markup change.

Touch-target polish in the same mobile block: `.blog-post-back { padding: 1rem 1.25rem; min-height: 2.75rem; }` and `.resume__btn { min-height: 2.75rem; }`. Blog posts and playground need nothing else.

Commit: `stack project detail panes vertically on mobile`

### Step 7 — Contact icon → mailto on mobile (`src/js/main.js`)

Add `import { isMobile } from './mobile.js';`, then at the top of the per-icon click handler (line 28, before `manager.open(...)`):
```js
if (icon.dataset.app === 'contact' && isMobile()) {
  window.location.href = 'mailto:hello@nicmilligan.com';
  return;
}
```
`src/js/apps/contact.js` is untouched — desktop keeps the Web3Forms window. The icon stays a `<button>` (it triggers an action; on desktop it still opens a window).

Commit: `trigger mailto from contact icon on mobile (CLAUDE.md contact rule)`

## Edge cases (handled by the design above — do not add code for these)

- **Rotate desktop→mobile with windows open:** CSS `!important` snaps them full-screen; the drag guard checks `isMobile()` live at pointerdown.
- **Rotate mobile→desktop:** inline geometry from `open()` was never removed, so windows restore centered desktop layout.
- **Divider dragged on desktop, then rotated to mobile:** `flex-basis: auto !important` (Step 6) neutralizes the inline basis.
- **Hamburger open when viewport widens past 768px:** trigger/panel dropdown styles vanish via media query; links render inline regardless of `aria-expanded` state. Stale listeners are harmless.
- **Scroll containment:** `body { overflow: hidden }` + `.window__content { overscroll-behavior: contain }` already prevent scroll-chaining to the desktop.
- **Reduced motion:** no new animations are introduced, so nothing new is needed; the window-open animation is already guarded (`windows.js` / `windows.css`).

## Verification checklist

Run `npm run dev`, test in responsive dev tools at 320 / 375 / 768 / 769 px widths (and a real phone if available):

- [ ] **Desktop ≥769px: zero visual or behavioral change** — social icons inline, windows drag/resize/maximize, contact opens the form window, left menu works.
- [ ] Social anchors are 4 non-nested siblings (inspect the DOM).
- [ ] Mobile: hamburger appears at right; tap opens a right-aligned panel with 4 links (≥44px targets); outside tap, Escape, and re-tap all close it; Tab wraps inside; Escape refocuses the trigger. Left Reset/Close menu unchanged.
- [ ] Icons: exactly 2 columns × 3 rows, centered, visibly larger than desktop, no horizontal overflow at 320px.
- [ ] Any app icon on mobile → full-screen window below the taskbar; no maximize button; enlarged close button; titlebar does not drag; content scrolls vertically; the desktop behind does not scroll.
- [ ] Two windows open on mobile: closing/Escaping the top one reveals the one beneath, full-screen.
- [ ] Project detail on mobile: title/meta/sections first, visuals below, no divider, one continuous scroll. Blog post reads single-column; back button easy to tap.
- [ ] Contact icon: mobile → mail client with `mailto:hello@nicmilligan.com`; desktop → form window.
- [ ] Rotate/resize across 768px in both directions with windows open (including a project window whose divider was dragged on desktop).
- [ ] `prefers-reduced-motion: reduce` emulation: no window-open animation; everything still works.
- [ ] Keyboard-only pass at mobile width: Tab reaches trigger → menu → icons → window controls; focus trap holds inside an open window; Escape closes.
- [ ] `npm run build` still succeeds; Lighthouse mobile Accessibility ≥ 95 (CLAUDE.md budget).

Then open a PR from `develop-mobile-responsive` → `main`.
