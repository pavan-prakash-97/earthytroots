# EarthyRoots Farm — React site

The EarthyRoots Farm marketing site, rebuilt as a React 18 + Vite single-page app from
the original design preview. Six routes, no server side rendering.

## Getting started

```bash
pnpm install
pnpm dev        # http://127.0.0.1:5174
pnpm build      # production bundle in dist/
pnpm preview    # serve the production bundle
```

Node 20+ is required. The dev server runs on **5174** so it can sit alongside the
legacy site on 5173/8080.

## Routes

| Route | Page component |
|---|---|
| `/` | `src/pages/Index.jsx` |
| `/about` | `src/pages/About.jsx` |
| `/project-1` | `src/pages/ProjectAamra.jsx` |
| `/amenities` | `src/pages/Amenities.jsx` |
| `/gallery` | `src/pages/Gallery.jsx` |
| `/contact` | `src/pages/Contact.jsx` |

## Structure

```
src/
├─ App.jsx                  routes, SPA link handling, title + scroll reset
├─ components/
│  ├─ Header.jsx            logo, CTA, circular menu button, full-screen menu
│  ├─ Footer.jsx            "Come home." footer
│  ├─ Loader.jsx            intro loader
│  ├─ Lightbox.jsx          [data-lb] gallery lightbox
│  ├─ AmenityGrid.jsx       icon grid with scroll stagger + hover draw
│  ├─ Masterplan.jsx        fly-over video → plan, 35 plots, filters, tooltip
│  └─ Location3D.jsx        scroll-driven 3D location model
├─ hooks/useSiteEffects.js  reveal, parallax, hero clips, rail, forms, masterplan
├─ pages/                   one component per route
└─ data/masterplan.js       plot / amenity / destination data

public/
├─ css/site.css             theme, sections, footer, amenity grid
├─ css/masterplan.css       masterplan + 3D location (ported, token-mapped)
├─ images/redesign/*.jpg    11 photographs
├─ images/*.jpeg            masterplan plan
└─ videos/hero-1..4.mp4     hero drone clips
```

## Design system

- Marcellus-style display type via **Literata** (variable, opsz + weight) and **Instrument
  Sans** for body text, with **Mea Culpa** for the script wordmark.
- Palette tokens live in `public/css/site.css`: bordeaux `#581B1D`, pearl `#E4D5BC`,
  manuscript `#B0936D`, ink `#151212`, paper `#F4ECDD`.
- Plot status colours are semantic and deliberately outside the brand palette.

## Notes

- The masterplan block was ported from the previous build; its stylesheet keeps the old
  variable names and maps them onto this palette with a token shim at the top of
  `masterplan.css`, so it inherits brand changes automatically.
- `pnpm build:smoke && pnpm smoke` builds an IIFE bundle (jsdom cannot run ES modules) and
  renders every route in jsdom, asserting page mount, image integrity, plot markers,
  amenity icons and footer text.
