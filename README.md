# Zention Systems — Portfolio Site

A single-page corporate portfolio site for Zention Systems, built with plain
HTML5, CSS3, and vanilla JavaScript (ES modules). No build tool, no framework,
no dependencies.

## Running locally

Open `index.html` directly in a browser, or use the VS Code "Live Server"
extension for hot reload during development. There is no build/install step.

## Folder structure

```
./
├── index.html              All 10 sections in one document
├── assets/images/logo.svg  Placeholder wordmark, also used as favicon
├── css/
│   ├── reset.css           Opinion-free normalization
│   ├── variables.css       Design tokens (color, spacing, type, motion)
│   ├── layout.css          Macro structure: nav, container, grids, rhythm
│   └── components.css      All visual component styling
└── js/
    ├── main.js              Entry point — wires up nav, form, animations
    ├── utils.js              Shared helpers ($, debounce, easing, etc.)
    └── animations/
        ├── hero-network.js   Animation 1 — canvas constellation background
        ├── scroll-reveal.js  Animation 2 — scroll reveals + stat counters
        └── stack-diagram.js  Animation 3 — interactive SVG tech diagram
```

## CSS architecture

Files are layered by responsibility: `reset` → `variables` → `layout` →
`components`. Breakpoints (375 / 768 / 1024px) are mobile-first and, where
`repeat(auto-fit, minmax())` and `clamp()` can't cover a layout on their own,
handled with small `min-width` media queries co-located directly under each
component's base rules in `components.css`, rather than centralized in a
separate breakpoints file — the site is small enough that the extra
indirection isn't worth it.

## Accessibility

- Semantic landmarks (`header`/`nav`/`main`/`section`/`footer`) and a single
  `<h1>` with sequential `<h2>`s per section.
- All three animations respect `prefers-reduced-motion`: reduced-motion
  visitors get the end-state instantly, with no continuous motion, backed by
  both a JS-level check (computed once in `main.js`, passed into each
  animation module) and CSS-level `@media` fallbacks.
- Visible `:focus-visible` outlines are preserved everywhere; the tech stack
  diagram's layers are keyboard-operable (`tabindex`, hover parity on focus).
- A skip-to-content link is provided for keyboard users.

## Known placeholders — replace before launch

- **Contact section**: email (`hello@zentionsystems.com`), phone, and
  location ("Colombo, Sri Lanka") are placeholder values. Social links point
  to `#`.
- **Contact form**: submission is handled entirely client-side
  (`js/main.js`) — there is no backend integration yet. See the `TODO`
  comments in `index.html` and `main.js`.
- **Portfolio section**: the 4 project cards are fictional-but-plausible
  placeholders (marked with `<!-- PLACEHOLDER -->` comments in `index.html`)
  using styled CSS panels instead of real screenshots.
- **Team section**: 3 placeholder members with initials-only avatars, marked
  with `<!-- PLACEHOLDER -->` comments.
- **Logo**: `assets/images/logo.svg` is a simple placeholder mark, not a
  final brand logo.
- **Tech stack icons**: the icons in the Tech Stack diagram are hand-drawn
  abstract geometric glyphs (not the official React/Vue/Node/.NET/Go/PHP
  logos, which are trademarked) — swap in official brand marks later if
  desired.
- **`og:image`**: omitted for now (a raster social-preview image can't be
  authored as code) — see the `TODO` comment in `index.html`'s `<head>`.
- No real deployment domain configured yet.
