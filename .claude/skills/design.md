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
- Display face (large headings, window titles, app names)
- Text face (body, paragraphs, lists)
- Monospace face (code blocks, system text — if used)
- Type scale (e.g. 12 / 14 / 16 / 20 / 28 / 40 / 64)
- Line height rules
- Letter-spacing rules per face

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
- Type: system stack `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Spacing base: 8px
- Radius: 8px on windows
- Shadow: `0 24px 48px rgba(0,0,0,0.4)` on open windows
