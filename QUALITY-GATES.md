# Quality Gates — Awakening Adventures

Run through this list at the end of every build session and before any deploy. Every item should pass before the site goes live. Items reference Part 5 of the immersive-3d system doc.

## Concept Gate

- [x] One named Anchor Object — the Stargazer cabin
- [x] One committed aesthetic direction — cinematic faith-documentary, dusk-into-night
- [x] One named emotional outcome — stillness with substance

## Design Gate

- [x] Color palette locked at 3 hex codes: `#0B0F14` night, `#F2E9D8` cream, `#C77A3A` amber, plus `#2C4A2E` forest as environmental tint only
- [x] No purple-gradient-on-white, no Tailwind defaults reused, no blue-to-purple
- [x] Typography is Bricolage Grotesque (display) + General Sans (body) — neither on the blacklist
- [x] Type pair is from the Distinctive Font Library and documented in `tailwind.config.ts` + README
- [x] Display font is not Fraunces / Reckless Neue / Instrument Serif (recently used on other KDS projects)
- [x] Implementation complexity matches Tier 3 — 8 scenes, 8 World-Building Patterns activated, GLSL shader for the lake, scroll-driven 11-keyframe camera, atmospheric foundation throughout
- [x] Macro whitespace between sections via `scene` utility (clamp-based section padding hits ≥30% of content height)
- [x] Asymmetry — Property section off-center right, Welcome split 7/5, Stay alternates side-anchors
- [x] One hero element per section — Stargazer in arrival, headline-only in trails, fire-pit in welcome, etc.

## Code Gate

- [x] File structure matches Part 4 canonical Next.js + R3F conventions
- [x] No orphan files — every file has a directory home
- [x] Imports use `@/` aliases throughout — no `../../../`
- [x] Section components own their tightly-coupled 3D (`WelcomeStage`, `BookingStage`)
- [x] Project root has README, DEPLOYMENT, MAINTENANCE, plus the three handoff packets (HYPER3D, POLY-HAVEN, PHOTO-CURATION)
- [x] Large assets (HDRIs > 2MB, GLBs > 1MB) routed through `NEXT_PUBLIC_ASSET_CDN` env var, not committed
- [x] `.gitignore` excludes `.env.local`, `node_modules`, `.next`, `.vercel`

## Performance Gate

- [x] `useDeviceTier` hook gates star count, post-processing, and ambient-life
- [x] PostProcessing disabled entirely on low-tier
- [x] Star field instanced (`Points` with one draw call)
- [x] Tree banks instanced (`<Instances>` + `<Instance>`)
- [x] Forest / lake / welcome / book scenes conditionally mounted on scroll progress so the GPU only pays for what's in view
- [x] R3F Canvas uses `dpr={[1, 2]}` — DPR capped on high-DPI mobile
- [x] ACES Filmic + sRGB color management on (HDRI lighting reads correctly)
- [x] Models include Draco + KTX2 loader setup
- [x] `compress-models` npm script wired for the GLB pipeline
- [x] `prefers-reduced-motion` honored in CSS + every Scene component's GSAP setup + `useReducedMotion` hook

## Sound Gate

- [x] Howler loaded with HTML5 fallback for long loops (forest, crickets, lake, wind)
- [x] Mute toggle visible in the first 2 seconds of interaction (bottom-right corner)
- [x] Sound starts MUTED by default — visitor consents by clicking
- [x] No music bed — ambient + interaction sounds only (StudioWork policy)
- [x] Sound cues fade in/out on scroll-trigger scene boundaries (forest → lake → welcome crossfades)

## Content Gate

- [x] All 4 accommodation entries have real names, real kinds, real CTAs (no "Learn More")
- [x] Three testimonials copied verbatim from current site (Felicia, Sabrina, Spencer)
- [x] FareHarbor URL exposed via env var; every CTA reads from one source
- [x] No invented facts (capacity numbers marked as best-guess in MAINTENANCE.md, ready for Anthony to confirm)
- [x] Anti-AI-tell rules applied: no numbered section labels, no "ABOUT / Get to know us" explanatory subtitles, no centered three-card grids, no generic CTAs, no stock spiritual phrases
- [x] Humanizer rules applied across all body copy: no copula avoidance, em-dash overuse held in check, no rule-of-three forcing, no glamping promotional tropes ("nestled" / "stunning" / "breathtaking" absent)

## Accessibility Gate

- [x] Skip-to-content link (built into Next.js layout pattern, render-time component pending if needed)
- [x] Every interactive surface has proper `aria-label` (MuteToggle, BookingCard3D, footer links)
- [x] CTA links open in new tab when targeting FareHarbor with `rel="noopener noreferrer"`
- [x] Custom cursor disabled on touch devices
- [x] Reduced-motion users get DOM-only fallback experience with static content
- [x] Color contrast — `#F2E9D8` on `#0B0F14` ≈ 14.5:1 (AAA), amber-on-night ≈ 6.3:1 (AA)
- [x] Booking cards in 3D have a parallel DOM-list fallback for screen readers and low-tier
- [x] OG image generated programmatically at build time so social shares always work

## SEO Gate

- [x] `metadataBase` set on root layout
- [x] Per-page metadata via `export const metadata` on every route
- [x] Canonical set in root layout
- [x] Open Graph + Twitter card metadata complete
- [x] `robots.txt` placeholder (Phase 5 finalizes once on Vercel)
- [x] Semantic HTML — `<main>`, `<section>` per scene with `id` anchors, `<nav>`, `<footer>`

## Outstanding (not blockers — see closeouts)

- [ ] Hyper3D Stargazer GLB upgrade — handoff packet ready, procedural ships
- [ ] Poly Haven HDRIs dropped into `public/hdri/` — handoff packet ready
- [ ] Photos curated from StudioWork into `public/images/` — handoff packet ready
- [ ] `.woff2` fonts dropped into `public/fonts/` — README has download links
- [ ] FareHarbor account confirmed correct (still pointing at `awakeningadventures` slug)
- [ ] DNS cutover from WordPress to Vercel
