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

🚧 **This skill is intentionally incomplete.** Art direction has not been locked yet.

When art direction is decided, this file will define:

### Typography

**Typefaces**
- Display face: **Alumni Sans** — large headings, window titles, app names
- Text face: **Merriweather** — body copy, paragraphs, lists
- Monospace face (code blocks, system text — if used): TBD

**Type scale** — Major Third (×1.25), base 16px, rounded to clean values

| Token       | Size  | Usage                              |
|-------------|-------|------------------------------------|
| `--text-xs`  | 12px  | Labels, captions, timestamps       |
| `--text-sm`  | 14px  | UI chrome, metadata, secondary text|
| `--text-base`| 16px  | Body copy (Merriweather default)    |
| `--text-md`  | 20px  | Large body, intro paragraphs       |
| `--text-lg`  | 24px  | H3, window section headings        |
| `--text-xl`  | 32px  | H2, window titles                  |
| `--text-2xl` | 48px  | H1, page-level headings            |
| `--text-3xl` | 64px  | Display / hero text (Alumni Sans)  |
| `--text-4xl` | 80px  | Oversized display moments only     |

**Line height rules**

| Context                          | Value | Rationale                                  |
|----------------------------------|-------|--------------------------------------------|
| Display / hero (Alumni Sans ≥48px)| 1.05  | Tight at scale; optical spacing            |
| Headings (Alumni Sans 24–40px)   | 1.2   | Comfortable without excess gap             |
| Subheadings (Alumni Sans ≤20px)  | 1.35  | More open as size decreases                |
| Body copy (Merriweather)         | 1.7   | Serif needs space; WCAG recommends ≥1.5    |
| UI / metadata (small text)       | 1.4   | Compact but readable                       |
| Code / monospace                 | 1.6   | Standard for code readability              |

**Letter-spacing rules**

| Context                          | Value    | Rationale                              |
|----------------------------------|----------|----------------------------------------|
| Alumni Sans ≥48px (display)      | -0.03em  | Optically tighten large Alumni Sans    |
| Alumni Sans 24–40px (heading)    | -0.01em  | Slight tightening at mid size          |
| Alumni Sans ≤20px                | 0        | Default tracking                       |
| ALL-CAPS labels / UI chrome      | 0.08em   | Industry standard for legibility       |
| Merriweather body                | 0        | Serif handles its own spacing          |

### Color
- Background palette (desktop background, window backgrounds)
- Foreground palette (text, icons)
- Accent / interactive colors (hover, focus, active)
- Semantic colors (link, success, warning if needed)
- Dark mode behaviour (if any)
- All colors as CSS custom properties on `:root`

### Spacing
- Base unit (likely 4px or 8px)
- Spacing scale
- Window padding rules
- Icon grid spacing

### Window chrome
- Title bar height and styling
- Close button placement and style
- Border / shadow / corner radius rules
- Active vs inactive window appearance
- Drag affordance

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

If a styling decision is needed and this skill is empty, **propose 2–3 options** with concrete examples rather than picking silently. Default placeholders during development:

- Background: `#0a0a0a`
- Foreground: `#ffffff`
- Accent: `#ff4d00` (intentionally jarring placeholder so it gets replaced)
- Type: Alumni Sans (headings), Merriweather (body)
- Spacing base: 8px
- Radius: 8px on windows
- Shadow: `0 24px 48px rgba(0,0,0,0.4)` on open windows
