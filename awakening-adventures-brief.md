# Awakening Adventures — Phase 1 Brief
*Immersive 3D System · Phase 1 (Foundation) deliverable · Locked 2026-05-22*

---

## Project header

| Field | Value |
|---|---|
| Project | awakening-adventures |
| Client | Awakening Adventures LLC (Anthony & Barb, Grandview, TN) |
| Source site | https://awakeningadventuresllc.com (WordPress / Site Kit) |
| Mode | Remake Mode |
| Deployment intent | Self-Deploy (Paul ships via Vercel under Kingdom Digital Services) |
| Experience Tier | **Tier 3 — Inhabitable World** |
| Phase plan | 1 Foundation · 2 Scaffolding · 3 Hero/Stargazer · 4a Sanctuary · 4b Lake · 4c Welcome · 4d Booking · 5 Polish |
| Total phases | 8 (multi-page-equivalent, single-page scroll-world) |

---

## Audit summary (silent audit, recorded for the record)

The current site is a stock WordPress build. Tagline is real and good (*"Because God is the Greatest Adventure of ALL"*). Hero is a small inset photo with no anchor. A flat four-card services grid follows (Treehouse Glampground / Island Camping / Pontoon / Group Retreats), then a seven-bullet feelings list, then three five-star reviews. The Stargazer cabin — the property's single most ownable feature — is buried in the lodging gallery as one of many photos. FareHarbor booking works. Photography is decent on some pages and weak on others. Voice on the page reads closer to a Hipcamp listing than to a brand. Conversion path exists; brand identity does not.

Working with us: 501 real source files in `StudioWork/Awakening Adventures/` mapped across seven property zones (Boating, Driftwood treehouse, Grounds, Homestead tent, Serene-Seven tent, Stargazer plexiglass cabin, plus subfolders for Island Camping, Perspective Platform, Shower House). This asset library is the reason a Tier-3 build is viable at all.

---

## Better-Solution Audit (one flag for Paul to accept or reject)

The current site treats the four offerings as equal weight. The Stargazer cabin is the single most differentiated feature on the entire property — clear plexiglass, sleep under the stars, no TN glamping competitor matches it. The redesign leads with Stargazer as the visceral hook, then reveals the other accommodations as the visitor walks the property through scroll. Anthony's group retreats and the pontoon are not demoted; they are paced into the journey so each gets its own cinematic moment instead of competing for the hero. **Status: ACCEPTED by Paul (default if not overridden by Phase 2).**

---

## The Concept

### Anchor object
**The Stargazer.** A clear plexiglass cabin on a wood deck under a Tennessee night sky. It rotates slowly on the hero. Stars drift across the glass at real-world speed (one full sky rotation per ~120 seconds — not "fast spinning sci-fi"). Cabin interior glows warm fire-amber. Camera holds on it the first three seconds, then begins the slow dolly out that becomes the rest of the world.

### Aesthetic direction
**Cinematic faith-documentary, dusk-into-night.** Real light, real moments, atmospheric depth. Think *The Revenant*'s ambient blues plus *True Detective* Season 3's warm interior lamps. The brand is a working sanctuary; the site feels like dusk on the property the night before guests arrive — quiet, anticipatory, lit from inside.

### Emotional outcome
**Stillness with substance.** The visitor leaves the site feeling like they have already exhaled, like they already know what it would be like to be there. Conviction without sermon. Quiet without empty.

### Color lock
| Role | Hex | Use |
|---|---|---|
| Dominant background | `#0B0F14` | Cumberland night sky just shy of true black. Owns 70%+ of pixels |
| Off-white / paper | `#F2E9D8` | Prairie cream from the brand snapshot. Body type, light UI |
| High-energy accent | `#C77A3A` | Warm fire-amber. Interior glow, focused interactive states, one CTA flourish |
| Environmental tint | `#2C4A2E` | Forest green. Appears in HDRI ambient tint and post-process color grade only — never in UI |

This deliberately rotates the snapshot's inferred palette to a dark-mode dominant. The fire-amber accent is the single high-energy color that lives in the cabin interior, the CTA hover state, and the loading progress arc — nowhere else. Per Pillar 2 (Two-Color Discipline) this is the "deep brand tone + off-white + one sharp accent" pattern.

**Anti-AI-Slop confirmation**: no purple gradients, no blue-to-purple, no Tailwind defaults, no mint-coral pastels. Locked.

### Type pair
| Role | Font | Source | Reasoning |
|---|---|---|---|
| Display | **Bricolage Grotesque** (variable) | Google Fonts, free | Variable grotesk with character. Holds up at 16vw oversized hero scale. Cinematic without being editorial-serif. Not on the Pillar 1 blacklist. |
| Body | **General Sans** | Fontshare, free | Humanist sans with personality. Lets Bricolage do the dramatic work. Workhorse for paragraphs and captions. |

**Don't-Reuse confirmation**: not Fraunces (recently used), not Reckless Neue (recently used), not Instrument Serif (recently used), not Inter / Roboto / Arial / Space Grotesk / Montserrat / Poppins / Lato (blacklist).

**Paid upgrade flag**: if Paul wants to invest, swap display to **Migra** (Pangram Pangram) for a measurable lift in cinematic feel. The build does not depend on this — Bricolage ships strong on its own.

### Experience Tier rationale
Tier 3 (Inhabitable World) — committed at Paul's explicit direction (*"3d immersive world, cinematic, movie video game feel"*). The eight World-Building Patterns are all activated, not optional:

| Pattern | How it shows up here |
|---|---|
| 1 — Atmospheric Foundation | Poly Haven night-sky HDRI (`kloppenheim_06` or `moonless_golf`) for hero; dawn-forest HDRI for the sanctuary scene. ACES Filmic tone mapping. Subtle film grain via `@react-three/postprocessing`. |
| 2 — Ambient Life | Stars drift at real sidereal speed. One occasional firefly arc per 25 seconds. Slow camera yaw drift (~3° over 10s) when the visitor stops scrolling. Crickets fade in/out faintly under the bed. |
| 3 — Cinematic Camera | Easing curves on every camera move (`power2.inOut` minimum, often custom Bezier). Depth-of-field shift on each scene anchor. Subtle handheld micro-shake on the hero only. |
| 4 — Spatial Navigation | Scroll = dolly through the property. Each section is a different location, not a different page block. Sanctuary → Lake → Welcome → Book. |
| 5 — Sound Design | Forest ambient bed + crickets (Freesound CC0) + amber-glow interaction whoosh on key hovers + boat-water lap in the lake scene. Mute toggle visible top-right within the first 2 seconds. |
| 6 — Loading as Theater | Star field appears, single line of type fades up (*"…step out of the light pollution"*), real loader progress arc in fire-amber, transitions INTO scene 1, never hard cuts. |
| 7 — Reactive Environment | Cursor parallax on the Stargazer (mouse moves the camera microscopically). Magnetism on the primary CTA. Hover sounds on accommodation cards. The world notices the visitor before they click. |
| 8 — Environmental Storytelling | The rock bridge is implied as a trail moment, never labeled. The fire pit smoke is real (real photo billboard). Anthony & Barb appear as one frame-pattern moment, not as a "Meet the Hosts" card. The brand is told through what is *in the world*. |

### Honest ceiling
Tier 3 with the AI asset pipeline gets us to **strong prototype + first-real-launch** quality. To push to Awwwards-Site-of-the-Year tier we would still need: (1) a commissioned bespoke Stargazer 3D model from a 3D artist (Fiverr/CGTrader, ~$300–800), (2) real custom sound design (Splice subscription or commissioned composer, ~$200–500), (3) a real on-site half-day shoot specifically for the hero plate. None of these are required to ship; all of them are levers if Paul ever wants to push it further.

---

## The Scroll Score (8 scenes, top to bottom)

> Each scene = a location in the world, a 3D state, a content state, a motion state, a user goal. The visitor's mental model is *"I am walking onto this property at dusk."*

### Scene 0 — Loader (3.5–5 seconds, real progress)
- **3D state**: empty black. Single point-light off-camera. Stars fade in one by one.
- **Content**: oversized single line in Bricolage Grotesque, fire-amber, fades up at 30% loaded: *"Step out of the light pollution."*
- **Motion**: progress arc fills in fire-amber, top-right corner. At 100% the camera begins moving forward into the stars.
- **User goal**: signal the world is real, the wait is part of the experience, not a wait.
- **Sound**: subtle wind-through-trees fade up at 50% loaded. Mute toggle appears top-right at 70%.

### Scene 1 — Arrival at the Stargazer (hero)
- **3D state**: the Stargazer cabin sits 12m ahead on the wood deck. Night sky filling the entire scene. Cabin interior glowing fire-amber. Real Tennessee night HDRI environment.
- **Content**: tagline reveals in two beats — *"Because God"* (1.0s in), *"is the Greatest Adventure of ALL."* (1.6s in). Massive Bricolage Grotesque, prairie-cream. Sub-headline in General Sans, half opacity: *"42 acres. 20 minutes from Watts Bar Lake. Hosted by Anthony & Barb."*
- **Motion**: hero choreography is a 2.4-second sequence — stars drift in (loader continuation), cabin lifts up into frame on subtle ease-out, type animates in on stagger. After 2.4s everything quiets. 80/20 rule: stars continue to drift, cabin glow flickers occasionally, everything else still.
- **User goal**: feel the place. Don't click yet. Read the line.
- **Sound**: crickets faint, wind continues. No music.

### Scene 2 — The Property (slow dolly across 42 acres)
- **3D state**: camera lifts and dollies backward and up. Reveals the full property at dusk — Stargazer in foreground, Driftwood treehouse glowing in the mid-ground tree canopy, Homestead and Serene-Seven tents with firelight in the prairie clearing, the perspective platform silhouette on the ridge.
- **Content**: short editorial paragraph, prairie-cream, left-aligned, off-center anchor: *"42 acres of forest on a dead-end road, three miles of trails, one rock bridge across a wet-weather creek, and enough quiet to actually hear yourself pray. Welcome to the Forest Sanctuary Refuge."*
- **Motion**: scroll-scrubbed camera move. Each accommodation gets a brief floating label as the camera passes near it — name only, no card, no CTA. Visitor sees the property as a place first.
- **User goal**: register that this is real geography, not a stylized template.
- **Sound**: forest ambient bed deeper now. Faint distant water from the lake direction.

### Scene 3 — Stay (accommodations as 3D scenes, not cards)
- **3D state**: camera locks into a side-scroll. Four 3D scenes pass left-to-right — Stargazer, Driftwood, Homestead, Serene-Seven. Each is its own micro-environment with real photo plates layered in (Billboard pattern from Part 1).
- **Content**: each accommodation gets a single editorial caption — name in Bricolage Grotesque, a one-line description in General Sans, and a specific CTA: *"Book the Stargazer for Friday."* / *"Book Driftwood for the weekend."* etc. No generic "Learn More."
- **Motion**: horizontal scroll-scrubbed via GSAP ScrollTrigger pin. Stargazer is the entry, the rest reveal as the visitor scrolls.
- **User goal**: identify which one fits *this* trip.
- **Sound**: each scene gets its own subtle ambient (treehouse = wind in branches; tent = firewood crackle; Stargazer = stars/silence).

### Scene 4 — The Trails (the rock bridge moment)
- **3D state**: camera descends to ground level inside the forest. Light shafts through trees. Volumetric fog. No specific landmarks (we have no rock bridge footage per snapshot — handled through environmental implication).
- **Content**: pull quote, Bricolage Grotesque large, prairie-cream, no attribution underneath: *"Three miles of trail. One rock bridge. Enough quiet to pray."* Below in smaller General Sans: *"Guided prayer hikes available on request — talk to Anthony when you arrive."*
- **Motion**: camera moves forward through the forest at walking speed. Trees parallax. One firefly arc passes through the frame.
- **User goal**: feel the stillness. Make the spiritual hook visible without preaching.
- **Sound**: crickets, light footsteps on leaves (subtle Freesound layer), birdsong fade.

### Scene 5 — The Lake (Watts Bar)
- **3D state**: camera emerges from the forest line. Lake at sunset. Pontoon silhouette on the horizon. Island in the distance.
- **Content**: editorial caption with two CTAs side-by-side — *"Book a sunset pontoon excursion."* + *"Reserve the island campsite."* Sub-line: *"Watts Bar Lake — twenty minutes from the property. Captain Anthony at the helm."*
- **Motion**: lake water shimmers (procedural shader, low amplitude). Pontoon drifts very slowly across the horizon. Sun dips below the ridge over the course of the scene (subtle, ~15% drop while scrolling through).
- **User goal**: register that the property is not the only thing — there's a water layer too.
- **Sound**: water lap, faint boat motor at the end of the scene (Doppler-shifted), wind off the lake.

### Scene 6 — The Welcome (Anthony & Barb)
- **3D state**: camera lands at the fire pit. The fire is a real photo billboard (Pattern A — the photo lives in 3D space as a flat, slightly-tilted plane with grain unification). A second photo plate — Anthony & Barb at the welcome moment — anchors the right side.
- **Content**: real testimonial quote, full attribution, prairie-cream: *"Anthony and Barb were so inviting, we arrived an hour early because we forgot about the time zones and they were ready for us anyways."* — Sabrina. Single sub-line: *"Hosted, in person, by Anthony & Barb."*
- **Motion**: fire flickers (subtle alpha animation on the billboard). Slight handheld camera micro-shake on this scene only — to humanize.
- **User goal**: trust. Make the hosts the experience, the way the actual reviews say they are.
- **Sound**: fire crackle (CC0 Freesound), distant crickets.

### Scene 7 — Groups (the small-church retreat)
- **3D state**: camera pulls back to show the full property at dusk again, but now the light is fading further — every light source on the property is visible (treehouse glow, tent firelight, fire pit, Stargazer interior). Like the property at 8:45 PM in October.
- **Content**: short paragraph for small-church retreat leaders: *"For pastors and small-group leaders planning a retreat: the entire 42 acres can be reserved. We'll help you build the schedule, or get out of the way so you can build your own."* CTA: *"Plan a small-church retreat."*
- **Motion**: extreme slow zoom-out. The visitor sees the whole world they've been walking through.
- **User goal**: trigger the group-retreat conversion path for the highest-value audience.
- **Sound**: ambient bed thins, single ambient pad (Freesound) carries the emotional close.

### Scene 8 — Book / Come and See
- **3D state**: night sky returns. The Stargazer is back in frame, but now there are four floating glass cards in 3D space — one per accommodation — each with the booking CTA.
- **Content**: single oversized line, Bricolage Grotesque, fire-amber: *"Come and see."* (the brand's preferred CTA per the snapshot). Below: the four accommodation cards in 3D space, with the FareHarbor link wired to each.
- **Motion**: cards float on subtle Y-bob, magnetism on hover, fire-amber glow on the active card.
- **User goal**: convert. Booking happens here or the visitor returns later.
- **Sound**: final ambient swell on hover of the booking CTA. Mute toggle still available.

### Footer (separate from the world)
- Standard footer: nav links (Sanctuary / Lodging / Excursions / Groups / Blog / Contact), social icons (Facebook / Instagram / YouTube — handles per snapshot), legal, "Hosted by Anthony & Barb · Grandview, TN."
- Not part of the 3D world. Plain HTML, prairie-cream on near-black, Bricolage Grotesque at small caps for headings, General Sans body.

---

## Asset list (the ground truth)

### HDR Environment Maps (Poly Haven, free CC0)
| Asset | Use | Status |
|---|---|---|
| `kloppenheim_06_2k.hdr` (or `moonless_golf_2k.hdr`) | Hero / Stargazer night sky scene | To download Phase 2 |
| `pretville_cinema_2k.hdr` (or `kiara_1_dawn_2k.hdr`) | Sanctuary / property reveal scene | To download Phase 2 |
| `golden_gate_hills_2k.hdr` (or `sunset_jhbcentral_2k.hdr`) | Lake / sunset scene | To download Phase 2 |

### PBR materials (AmbientCG / Poly Haven Textures, free CC0)
- Cedar / pine wood (deck planks, treehouse cladding)
- Bark texture (forest scene tree trunks)
- Glass (Stargazer plexiglass — no PBR material, custom shader with refraction)
- Cloth (tent fabric for Homestead and Serene-Seven scenes)

### Real photography (from StudioWork — already in hand, 501 files)
Each scene maps to specific source folders:
- Scene 1 / 2 (hero, property): `Grounds/`, `Stargazer/`, `Grounds/Perspective Platform/`
- Scene 3 (stay): `Driftwood/`, `Homestead/`, `Serene-Seven/`, `Stargazer/`
- Scene 4 (trails): `Grounds/` — light shafts and forest interiors only (no rock bridge footage exists)
- Scene 5 (lake): `Boating/` — pontoon and lake horizon
- Scene 6 (welcome): host photo (need Paul to identify the best one)
- Scene 7 (groups): wide property shots, dusk preferred
- Scene 8 (book): per-accommodation hero plate from each accommodation folder

### Sound (Freesound.org, CC0 / CC-BY)
- Forest ambient bed (continuous, low-amplitude)
- Crickets (looping, evening)
- Wood fire crackle (Scene 6)
- Lake water lap (Scene 5)
- Distant pontoon motor (Scene 5, brief)
- Bird call (Scene 4, occasional)
- UI whoosh / amber-glow tone (interaction sounds, single tone, mute-respecting)

### 3D models
- **Stargazer cabin** — generated via Hyper3D from reference photo (`Stargazer/` folder). Multi-image input (front + side + 3/4 + interior). Target < 2 MB GLB post Draco compression.
- **Driftwood treehouse** — Hyper3D from reference photo. Mid-ground hero, slightly lower fidelity acceptable. Target < 2 MB GLB.
- **Homestead + Serene-Seven tents** — procedural (Three.js primitives) plus low-poly Hyper3D output. Background placement. Target < 1 MB each.
- **Perspective platform** — procedural geometry only (simple deck + railing on ridge silhouette).
- **Pontoon boat** — silhouette only, low-poly free GLB from Sketchfab (CC license) or procedural. Target < 500 KB.

**AI asset permission**: Hyper3D + Poly Haven autonomous use confirmed by Paul.

---

## File structure (Phase 2 will scaffold this)

```
Websites/awakening-adventures/
├── README.md
├── DEPLOYMENT.md                       (Phase 5)
├── MAINTENANCE.md                      (Phase 5)
├── awakening-adventures-brief.md       (this file)
├── package.json
├── next.config.js                      (transpile R3F packages)
├── tailwind.config.ts                  (custom tokens, no defaults)
├── postcss.config.mjs
├── tsconfig.json
├── .gitignore
├── .env.example
├── public/
│   ├── fonts/                          (Bricolage variable + General Sans)
│   ├── images/                         (curated real photos from StudioWork)
│   ├── hdri/                           (Poly Haven HDRIs, .hdr files)
│   ├── models/                         (compressed GLB files, < 2MB each)
│   ├── sound/                          (Freesound assets, ogg/mp3)
│   ├── favicon.ico
│   ├── og-image.jpg
│   └── robots.txt
├── app/
│   ├── layout.tsx                      (root layout, font loading, providers)
│   ├── page.tsx                        (the 8-scene world)
│   ├── globals.css
│   ├── sanctuary/page.tsx              (deep page — optional Phase 4 extension)
│   ├── lodging/page.tsx                (deep page — optional Phase 4 extension)
│   ├── excursions/page.tsx
│   ├── groups/page.tsx
│   ├── contact/page.tsx
│   ├── blog/page.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/                             (Button, MuteToggle, SoundCue)
│   ├── sections/
│   │   ├── SceneLoader.tsx             (Scene 0)
│   │   ├── SceneHero.tsx               (Scene 1)
│   │   ├── SceneProperty.tsx           (Scene 2)
│   │   ├── SceneStay.tsx               (Scene 3)
│   │   ├── SceneTrails.tsx             (Scene 4)
│   │   ├── SceneLake.tsx               (Scene 5)
│   │   ├── SceneWelcome.tsx            (Scene 6)
│   │   ├── SceneGroups.tsx             (Scene 7)
│   │   ├── SceneBook.tsx               (Scene 8)
│   │   └── Footer.tsx
│   ├── three/
│   │   ├── WorldCanvas.tsx             (R3F Canvas wrapper, suspense boundary)
│   │   ├── StargazerCabin.tsx          (GLB loader + glass shader)
│   │   ├── Treehouse.tsx
│   │   ├── Tent.tsx                    (parametric — both Homestead + Serene-Seven)
│   │   ├── PerspectivePlatform.tsx
│   │   ├── Pontoon.tsx
│   │   ├── StarField.tsx               (instanced points, real sidereal speed)
│   │   ├── Firefly.tsx                 (per-scene single-instance arc)
│   │   ├── VolumetricFog.tsx
│   │   ├── PhotoBillboard.tsx          (Pattern A — flat tilted photo plane in 3D space)
│   │   ├── PostProcessing.tsx          (ACES, bloom, film grain, color grade)
│   │   └── EnvironmentRig.tsx          (HDRI swap on scroll progress)
│   └── layout/
│       ├── Nav.tsx
│       ├── Providers.tsx               (Lenis, GSAP, sound context, reduced-motion)
│       └── PreloadGate.tsx
├── lib/
│   ├── gsap.ts                         (registerPlugin, defaults)
│   ├── lenis.ts                        (smooth scroll, RAF loop)
│   ├── sound.ts                        (Howler.js setup, mute state, spatial audio)
│   ├── three.ts                        (DRACOLoader, KTX2Loader, gltf-transform notes)
│   └── utils.ts
├── hooks/
│   ├── useScrollProgress.ts
│   ├── useReducedMotion.ts
│   ├── useDeviceTier.ts                (GPU detection, mobile fallback)
│   └── useResponsive.ts
├── styles/
│   └── tokens.css                      (color + type + spacing tokens)
├── types/
│   └── index.ts
└── content/
    ├── accommodations.ts               (4 records, real specs, real CTAs)
    ├── reviews.ts                      (real testimonials from current site)
    └── scenes.ts                       (scroll-trigger config per scene)
```

---

## Phase plan

| Phase | What it produces | Approx LOC |
|---|---|---|
| **1 — Foundation** (this brief) | Audit, concept, color lock, type pair, scroll score, asset list, file structure plan, better-solution audit. No code. | ~0 (this doc only) |
| **2 — Scaffolding** | Project shell, layout, providers (Lenis + GSAP + R3F + sound + reduced-motion), design tokens, font loading, empty section components, mute toggle, loader skeleton. Builds + runs. | ~500 |
| **3 — Hero / Stargazer** | Scene 0 (loader), Scene 1 (arrival), Stargazer cabin GLB load, glass shader, star field, HDRI environment, hero choreography, sub-headline reveal. The single most important phase. | ~700 |
| **4a — Sanctuary** | Scene 2 (property dolly) + Scene 3 (stay — accommodations side-scroll). Treehouse + tent + perspective platform models or procedural geometry. Photo billboards. | ~500 |
| **4b — Lake** | Scene 4 (trails) + Scene 5 (lake). Forest fog scene, lake water shader, pontoon silhouette, sunset HDRI swap. | ~450 |
| **4c — Welcome + Groups** | Scene 6 (Anthony & Barb fire pit) + Scene 7 (groups full-property pull-back). Photo billboards, real testimonial copy, handheld camera shake on Welcome only. | ~400 |
| **4d — Book** | Scene 8 (booking carousel) + Footer. Four floating glass cards, FareHarbor links wired, magnetism on hover. | ~350 |
| **5 — Polish + Mobile + Performance** | Custom cursor, micro-interactions, mobile reduced-quality variant, `prefers-reduced-motion` fallback, 404 page, OG image, performance pass (Suspense boundaries, model compression script, R2 upload notes), DEPLOYMENT.md, MAINTENANCE.md, Quality Gates checklist, final humanizer audit on every word. | ~400 + docs |

Total: ~3,300 LOC across 8 phases. Phased to avoid truncation and compression errors per Part 4 protocol.

---

## Key decisions locked (do not re-litigate in later phases)

- Stargazer is the anchor; site leads with it
- Tier 3 — Inhabitable World
- Color lock: `#0B0F14` / `#F2E9D8` / `#C77A3A` / `#2C4A2E` (environmental only)
- Type pair: Bricolage Grotesque (display) + General Sans (body)
- Self-Deploy via Vercel under Kingdom Digital Services
- Hyper3D + Poly Haven autonomous asset use approved
- Real photo billboards (Pattern A) for all human / property content moments
- No music bed (per StudioWork policy — Paul adds music in post for video, but the site uses ambient sound only, mute-toggleable)
- No AI faces, no AI voiceover, no stock B-roll (per StudioWork content don'ts)
- Real testimonial copy reused verbatim from current site (Felicia, Sabrina, Spencer)
- FareHarbor link is the single booking destination — every CTA leads there

---

## Open items (collect over the build, not blockers)

- Final Hyper3D output for Stargazer needs cleanup pass in Phase 3 (probably retopology)
- Specific Poly Haven HDRI selection finalized in Phase 3 after preview
- Anthony & Barb welcome photo selection (Paul picks during Phase 4c)
- Confirm `awakeningadventures.com` or `awakeningadventuresllc.com` is the production domain
- Confirm whether the existing FareHarbor embed account remains or is replaced
- Optional: paid Migra display font upgrade (~$50–150 one-time, Pangram Pangram)

---

## Phase Closeout Block

```
═══════════════════════════════════════════════════
PHASE 1 COMPLETE — RESUME INSTRUCTIONS
═══════════════════════════════════════════════════

WHAT'S DONE THIS PHASE:
  • Silent audit of awakeningadventuresllc.com
  • Cross-reference with StudioWork/Awakening Adventures snapshot
  • Concept locked: Stargazer-led Tier 3 Inhabitable World
  • Color lock locked: #0B0F14 / #F2E9D8 / #C77A3A / #2C4A2E
  • Type pair locked: Bricolage Grotesque + General Sans
  • 8-scene scroll score written end to end
  • Asset list fully specified (HDRIs, PBR, photos, sound, 3D models)
  • File structure planned (Next.js 14+ App Router, R3F, GSAP, Lenis, Howler)
  • Better-Solution Audit recommendation accepted by Paul
  • 8-phase build plan scoped (~3,300 LOC total)
  • Hyper3D + Poly Haven asset permissions granted

FILES PRODUCED THIS PHASE:
  • Websites/awakening-adventures/awakening-adventures-brief.md
    (this document — single source of truth for the whole build)

CURRENT PROJECT STATE:
  awakening-adventures/
  └── awakening-adventures-brief.md     ← just created

  (No code yet — Phase 1 is intentionally docs-only)

PROPOSED FOLDER STRUCTURE FOR PHASE 2:
  (see "File structure" section above — scaffolds the full tree)

NEXT PHASE: Phase 2 — Scaffolding & Design Tokens
  What it covers:
  • Next.js 14 App Router project bootstrap (package.json, tsconfig, next.config)
  • Tailwind + custom CSS variable tokens for the color and type locks
  • Font loading (Bricolage Grotesque variable + General Sans)
  • Layout shell (root layout, Providers, Nav, Footer skeleton)
  • Lenis + GSAP + R3F + Howler base setup, all wired into Providers
  • Empty Scene components (placeholders, render their scene name only)
  • MuteToggle + PreloadGate UI primitives
  • Reduced-motion + device-tier hooks
  • .gitignore, .env.example, README.md scaffolded
  No 3D content yet. Builds + runs. ~500 LOC.

TO CONTINUE IN THIS CHAT:
  Just say: "Run Phase 2"

TO RESUME IN A FRESH CHAT:
  Upload: immersive-3d-system.md + awakening-adventures-brief.md
  Say: "Resuming Awakening Adventures at Phase 2. Use the uploaded brief.
        Run the Confirmation Recital, then proceed."
═══════════════════════════════════════════════════
```
