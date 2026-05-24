# Awakening Adventures — Tier 3 inhabitable world

Forty-two acres of forest sanctuary on the Cumberland Plateau, rebuilt as a single-scroll immersive world. Hosted by Anthony &amp; Barb in Grandview, TN. Site built by Kingdom Digital Services.

> Phase 1 brief lives at `awakening-adventures-brief.md`. Read it first — it's the contract that governs every later phase.

## Stack

- Next.js 14 (App Router) · React 18 · TypeScript
- React Three Fiber + Drei + Postprocessing (R3F stack)
- Lenis (smooth scroll) + GSAP + ScrollTrigger (choreography)
- Howler.js (sound layer with mute toggle)
- Tailwind CSS with custom color/type tokens (no defaults reused)
- Three.js 0.169 with Draco + KTX2 compression for GLB models
- Self-Deploy via Vercel under Kingdom Digital Services

## Color lock

| Token | Hex | Use |
|---|---|---|
| `night` | `#0B0F14` | Dominant background (~70%) |
| `cream` | `#F2E9D8` | Off-white, body type |
| `amber` | `#C77A3A` | Single high-energy accent |
| `forest` | `#2C4A2E` | Environmental tint only (HDRI / fog), never UI |

## Type pair

- Display — **Bricolage Grotesque** (variable, Google Fonts, free)
- Body — **Manrope** (variable, Google Fonts, free)

Both fonts are pulled at build time via `next/font/google` — nothing to download, no `public/fonts/` setup required. Avoiding Fraunces, Reckless Neue, Instrument Serif (all used on recent KDS work), plus the Pillar 1 blacklist (Inter, Roboto, Arial, Space Grotesk, Montserrat, Poppins, Lato).

## Getting started

```bash
# inside this folder
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run type-check   # tsc --noEmit
```

## Fonts

Nothing to do — `app/layout.tsx` pulls both Bricolage Grotesque and Manrope from Google Fonts at build time via `next/font/google`. They are subset, self-hosted by Next, and cached on the build runner. No CDN reach at runtime.

If you ever want to swap either font, the change happens in one place: the imports at the top of `app/layout.tsx`. The CSS variables `--font-display` and `--font-body` flow through Tailwind and `styles/tokens.css` automatically.

## Phase status

| Phase | Status |
|---|---|
| 1 — Foundation (brief) | ✅ Done |
| 2 — Scaffolding & design tokens | ✅ Done (this commit) |
| 3 — Hero / Stargazer + scroll | ⏳ Next |
| 4a — Sanctuary (Scenes 2 + 3) | ⏳ |
| 4b — Lake (Scenes 4 + 5) | ⏳ |
| 4c — Welcome + Groups (Scenes 6 + 7) | ⏳ |
| 4d — Book (Scene 8) | ⏳ |
| 5 — Polish + mobile + perf + docs | ⏳ |

## Asset pipeline

Large assets do NOT live in this repo:

- **3D models** (GLB > 1MB): Cloudflare R2 or Vercel Blob. Set `NEXT_PUBLIC_ASSET_CDN` in `.env.local`. Compress before upload:
  ```bash
  npm run compress-models
  ```
- **HDRIs** (.hdr > 2MB): same CDN. Sourced from [Poly Haven](https://polyhaven.com), CC0.
- **Real photography**: curated from `StudioWork/Awakening Adventures/` into `/public/images/`. Phase 4 pulls specific files per scene.
- **Sound**: Freesound.org, CC0 / CC-BY. Drop into `/public/sound/`.

## Project structure

See `awakening-adventures-brief.md` (Phase 1) for the full canonical structure. Quick map:

```
app/                Next.js routes
components/
  sections/         Scene components (one per scroll scene)
  three/            R3F primitives (WorldCanvas + future models)
  layout/           Nav, Providers, PreloadGate
  ui/               Buttons, MuteToggle
lib/                gsap, lenis, sound, three helpers, utils
hooks/              useScrollProgress, useReducedMotion, useDeviceTier, useResponsive
styles/             tokens.css (source of truth for colors + type)
content/            accommodations, reviews, scene config
```
