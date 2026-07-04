# Design Skill

## When to use

Read this skill before any task involving:
- Visual styling (CSS, color, type)
- Window chrome (title bars, borders, shadows)
- Icon design or layout
- Motion and transitions
- Mobile fallback styling
- Hover and focus states

## Status

**Typography, Color, and Window chrome are locked — and implemented.** Spacing, Motion, Iconography, and Responsive breakpoints are still 🚧 TBD.

### Typography

**Typefaces**
- Display face: **Doto** — headings, window titles, labels, tags
- Text face: **Merriweather** — body copy, paragraphs, lists
- Monospace face (code blocks, system text — if used): TBD

**Type styles**

| Style | Face | Size/Line-height | Weight | Usage |
|---|---|---|---|---|
| Headline 01 | Doto | 32px / 36px | Light | Section/content headings (e.g. "TITLE OF THE WORK") |
| Headline 02 | Doto | 16px / 20px | Light | Subheadings |
| Headline 03 | Doto | 14px / 16px | Regular | Small labels/tags (e.g. "personal" pill) |
| Headline 04 | Doto | 16px / 20px | Regular | Window titlebar text ("WORK", "ABOUT ME") |
| Body copy 01 | Merriweather | 16px / 20px | Regular | Default paragraph copy |
| Body copy 02 | Merriweather | 14px / 16px | Light | Secondary/meta text |
| Body copy 03 | Merriweather | 12px / 14.5px | Light | Fine print |

Usage column beyond "Headline 04" (confirmed by the "Windows" category in the type spec) is inferred from mockup context, not explicitly labeled — reasonable defaults, adjust if a specific use case disagrees.

There is no size above 24px in the locked scale — no hero/display moment has been designed yet. If one is needed later, treat it as a new addition, not a revival of the old abstract token scale.

**Line height rules**

| Context                              | Value | Rationale                                  |
|---------------------------------------|-------|--------------------------------------------|
| Headings (Doto 20–24px)| 1.2   | Comfortable without excess gap             |
| Subheadings (Doto ≤16px)| 1.25  | Slightly more open at small size           |
| Body copy (Merriweather)              | 1.25–1.35 | Matches Body copy 01/02 (16/20, 14/16) |
| Body copy, fine print (Merriweather ≤12px)| 1.2 | Matches Body copy 03 (12/14.5)         |
| Code / monospace                      | 1.6   | Standard for code readability              |

**Letter-spacing rules**

| Context                           | Value    | Rationale                              |
|-------------------------------------|----------|----------------------------------------|
| Doto, headings      | 0        | Default tracking                       |
| ALL-CAPS labels / UI chrome / window titles | 0.08em | Matches tracked uppercase treatment seen on window titles and section headings in mockups |
| Merriweather body                   | 0        | Serif handles its own spacing          |

### Color

| Token | Name | Hex | RGBA | Role |
|---|---|---|---|---|
| `--color-off-white` | Off-White | `#FAF9F6` | `rgba(250, 249, 246, 1)` | Primary background (desktop, window content) |
| `--color-grey` | Grey | `#EFEEEC` | `rgba(239, 238, 236, 1)` | Secondary surface (panels, dividers, placeholder thumbnails) |
| `--color-light-black` | Light Black | `#1C1F1C` | `rgba(28, 31, 28, 1)` | Foreground (text, icons, borders) |
| `--color-blue` | Blue | `#1D3DD8` | `rgba(29, 61, 216, 1)` | Accent/interactive (hover, focus, links, active states) |

- Semantic colors (success, warning, error) — not yet defined
- Dark mode — not yet defined
- All colors should be exposed as CSS custom properties on `:root` using the token names above

### Spacing
- Base unit (likely 4px or 8px)
- Spacing scale
- Window padding rules
- Icon grid spacing

### Window chrome

**Shape**
- Window corners: rounded, `--window-radius: 8px`
- Photo / thumbnail images inside windows: rounded, ~8px radius
- Tag / pill buttons (e.g. "personal"): fully rounded (pill shape)
- Window clips its own content to the rounded frame (`overflow: hidden` on `.window`) — titlebar/content backgrounds don't poke square corners past the rounded border

**Border & fill**
- Frame border: a concentric triple stroke (`--window-frame-stroke`) — 1px Light Black, then 4px Grey, then 1px Light Black (6px total), built as three flat `box-shadow` rings rather than the `border` property (only one color/style is possible with `border`)
- Frame background: soft diagonal gradient between `var(--color-off-white)` and `var(--color-grey)` — shows through the header too (titlebar background is transparent, not a separate panel)
- Structural note: `.window` (outer) carries the frame stroke/shadow/gradient with `overflow: visible`; a `.window__inner` wrapper (titlebar + content) carries `overflow: hidden` and its own matching `border-radius` so content still clips to the rounded corners. Needed because `overflow: hidden` on the same element would clip its own outer box-shadow rings — splitting frame decoration from content clipping avoids that.

**Shadow**
- `--window-shadow: 0 16px 32px rgba(28, 31, 28, 0.08)` — 16px offset, 8% opacity

**Titlebar (Window Header)**
- Bottom border only: `1px solid var(--stroke-40)` (Light Black at 40% opacity) — no border on the other three sides
- Title is centered (CSS grid `1fr auto 1fr`), set in Headline 02 (Doto, 16/20, weight 300/Light), uppercase, 0.08em tracking
- Title is flanked on both sides by a decorative horizontal hatch pattern (`repeating-linear-gradient`, `var(--stroke-40)`) — a drag-affordance texture, purely decorative, CSS-only (no extra markup per line)

**Controls**
- Three circular outline buttons (`~1.375rem`, `1px solid var(--color-light-black)`, invert fill on hover/focus) on the right side of the titlebar: minimize, maximize/restore, close
- **Close**: fully functional (unchanged behavior, restyled).
- **Maximize**: fully functional — toggles the window to fill the desktop area and restores its prior bounds on a second click (`WindowManager._toggleMaximize` in `src/js/windows.js`).
- **Minimize**: present in the DOM/CSS to match the visual spec but shipped `hidden` — there's no taskbar tray/dock to restore a minimized window from yet, so it's inert rather than a dead click target. Building that restore mechanism is future work.

**Content patterns**
- **List row** (seen in the Work window): thumbnail (Grey, rounded ~8px) + tag pill (Headline 03, outlined) + title (Headline 01) + description (Body copy 01) + thin horizontal divider rule between rows
- **Profile layout** (seen in the About Me window): full-width rounded photo (~8px radius) + name (Headline 04) + role line (Body copy 01) + body paragraphs (Body copy 01)
- **Scrollbar**: custom `::-webkit-scrollbar` — thin track with a `1px solid var(--stroke-40)` left border, thumb a small bordered rounded rect (`1px solid var(--color-light-black)`); `scrollbar-width: thin` fallback for Firefox

**Still TBD**
- Active vs inactive window appearance — not shown in either mockup

### Motion
- Default easing curve(s)
- Default durations (instant / fast / normal / slow)
- Window open/close animation spec
- Icon hover/click animation spec (Rive states required)
- `prefers-reduced-motion` fallbacks

### Iconography
- Icon style (illustrated, geometric, pixel, etc.)
- Icon size (rest state, hover state)
- Label placement and style
- Rive state requirements (`idle`, `hover`, `click`, optional `active`)

### Responsive breakpoints
- Mobile breakpoint (~768px)
- Mobile takeover styling
- Top bar adaptation

## Until this is filled in

Typography, color, and window chrome are locked — use the values above rather than placeholders.

For sections still marked TBD (Spacing, Motion, Iconography, Responsive breakpoints), if a decision is needed and this skill is empty, **propose 2–3 options** with concrete examples rather than picking silently. Default placeholders during development:

- Spacing base: 8px
- Motion: 180–200ms, ease-out, respecting `prefers-reduced-motion`
