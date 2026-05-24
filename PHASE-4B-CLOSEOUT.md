═══════════════════════════════════════════════════
PHASE 4b COMPLETE — RESUME INSTRUCTIONS
═══════════════════════════════════════════════════

WHAT'S DONE THIS PHASE:
  • TreeBank — instanced tree-trunk renderer with deterministic seeded
    placement, two-bank pattern for foreground/background depth, one
    draw call per bank. ~80 trees at 'high' tier, 24 at 'low'
  • ForestScene — three overlapping tree banks at near/mid/far depths
    forming the trail interior, plus a breathing warm spotlight light
    shaft from the canopy, plus one firefly arc-pass
  • LakeWater — custom GLSL shader with two-layer sine ripple, Fresnel
    horizon line, distance-based darkness near camera vs warm at the
    horizon. 200m × 200m plane with 128² segments for shimmer detail
  • PontoonBoat — full primitive build (two cylindrical pontoons, deck,
    four canopy posts, canopy roof, captain's helm light). Drifts from
    -45 to +45 X over ~90 seconds with subtle wake bob
  • WorldScene updated — adds a permanent low tree line across the
    property's southern edge (continuity between trails and lake) and
    mounts ForestScene / LakeWater / PontoonBoat conditionally based on
    scroll progress so the GPU only pays for what's visible
  • SceneTrails — ScrollTrigger entrance, plays a single bird-call cue
    on enter, fades forest ambient up
  • SceneLake — ScrollTrigger entrance with sound crossfade (forest
    quiets, lake ambient + water lap fade in, distant pontoon motor
    fires ~6.5 seconds after entry as a one-shot cue)
  • Both DOM sections respect reduced-motion users by setting final
    state immediately
  • ~570 LOC across 4 new components + 3 updates

FILES PRODUCED THIS PHASE:
  awakening-adventures/
  ├── components/three/TreeBank.tsx            (new — instanced trunks)
  ├── components/three/ForestScene.tsx         (new — trails interior)
  ├── components/three/LakeWater.tsx           (new — GLSL water shader)
  ├── components/three/PontoonBoat.tsx         (new — pontoon silhouette)
  ├── components/three/WorldScene.tsx          (updated — conditional mounting + tree line)
  ├── components/sections/SceneTrails.tsx      (updated — ScrollTrigger + bird call)
  └── components/sections/SceneLake.tsx        (updated — ScrollTrigger + sound crossfade)

VERIFICATION:
  • Scroll past Stay into Trails: camera descends to ground level inside
    a forest interior. Trees flank the trail. A warm light shaft breathes
    from the canopy. A firefly arcs through. The pull-quote fades in and
    a bird call plays once
  • Continue scrolling into Lake: forest ambient quiets, water lap fades
    in, the lake stretches to the horizon with shimmering ripples in
    fire-amber, a pontoon silhouette drifts across the far horizon, and
    ~6 seconds after entry the distant motor cue plays once. Two
    side-by-side CTAs route to FareHarbor

NEXT PHASE: Phase 4c — Welcome + Groups (Scenes 6 + 7)
  • Fire pit scene with real photo billboard of Anthony & Barb
  • Real fire shader/sprite (procedural — no AI image needed)
  • Handheld camera shake intensifies in this scene
  • Full property pull-back for Groups scene with every light source
    visible (treehouse + tents + fire pit + Stargazer interior)
  • ~400 LOC

TO CONTINUE IN THIS CHAT:
  Just say: "Run Phase 4c"

KEY DECISIONS ALREADY MADE (do not re-litigate):
  • ForestScene and LakeWater mount conditionally — perf-first
  • Lake water is procedural shader, no texture needed
  • Pontoon is procedural silhouette, no GLB
  • Sound crossfades happen on scroll-trigger boundaries
  • One bird-call + one pontoon-motor are the only one-shot cues in
    these scenes (everything else is looped ambient)
═══════════════════════════════════════════════════
