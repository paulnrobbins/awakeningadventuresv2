'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getLenis } from '@/lib/lenis';
import { clamp } from '@/lib/utils';
import { getCameraOverride, SCENE_TARGETS } from '@/lib/cameraOverride';

/**
 * Camera rig — drives the camera position + look-target as a function
 * of global scroll progress, using DOM-measured keyframes with a
 * hold-then-transition pattern.
 *
 * The earlier static-keyframe-table approach was fragile (every
 * section-height change shifted every downstream keyframe's actual
 * scroll position). The first dynamic-keyframe pass measured DOM but
 * placed only ONE keyframe per section, which meant the camera was
 * always in transit between adjacent keyframes — when the visitor was
 * on the Primitive Camp card, the camera was already lerping toward
 * the Shower position and showed empty back-corner.
 *
 * This pass emits TWO keyframes per section (start + end), both at
 * the same pos/target. The camera HOLDS at the section's position
 * through most of the section's scroll window, then TRANSITIONS in
 * the last gap to the next section's start keyframe.
 *
 * Lead = 30vh — the camera arrives at each scene exactly when its
 * card starts fading in (GSAP `'top 70%'` = card top 30vh below the
 * viewport top).
 *
 * Hold = 10vh — a small window during which the camera "anchors" on
 * the scene before starting to glide toward the next. Just enough
 * for the visitor to register the composition; not so long that the
 * camera reads as static.
 *
 * Everything else is transition. With hold=10vh, the transition
 * zone between two adjacent scenes is `sectionHeight − 10vh`:
 *   - article (100vh) → 90vh of continuous motion
 *   - section (140vh) → 130vh of continuous motion
 *   - lake (180vh)    → 170vh of continuous motion
 *
 * So the camera is in motion through ~90%+ of every scroll position.
 * No more hold/snap/hold rhythm — the visitor experiences a single
 * continuous cinematic-scrub from the first scene to the last.
 *
 * Ordering invariant: HOLD ≤ section height. Trivially satisfied at
 * hold=10vh for every section type — no oscillation possible.
 */

type CameraKeyframe = {
  t: number;
  pos: [number, number, number];
  target: [number, number, number];
};

// Selectors for each section/article in scroll order. The `id` maps
// to a key in SCENE_TARGETS. `kind` controls anticipation: 'section'
// gets larger lead (40% of viewport), 'article' gets smaller (30%).
const SCENE_SELECTORS: { selector: string; id: string; kind: 'section' | 'article' }[] = [
  { selector: 'section[data-scene="sanctuary"]', id: 'property',       kind: 'section' },
  { selector: '[data-accom="stargazer"]',        id: 'stargazer',      kind: 'article' },
  { selector: '[data-accom="driftwood"]',        id: 'driftwood',      kind: 'article' },
  { selector: '[data-accom="homestead"]',        id: 'homestead',      kind: 'article' },
  { selector: '[data-accom="serene-seven"]',     id: 'serene-seven',   kind: 'article' },
  { selector: '[data-accom="primitive-camp"]',   id: 'primitive-camp', kind: 'article' },
  { selector: 'section[data-scene="shower"]',    id: 'shower',         kind: 'section' },
  { selector: 'section[data-scene="trails"]',    id: 'trails',         kind: 'section' },
  { selector: 'section[data-scene="lake"]',      id: 'lake',           kind: 'section' },
  { selector: 'section[data-scene="welcome"]',   id: 'welcome',        kind: 'section' },
  { selector: 'section[data-scene="groups"]',    id: 'groups',         kind: 'section' },
  { selector: 'section[data-scene="book"]',      id: 'book',           kind: 'section' },
];

const DEFAULT_KEYFRAMES: CameraKeyframe[] = [
  { t: 0, ...SCENE_TARGETS.hero },
  { t: 1, ...SCENE_TARGETS.book },
];

function buildKeyframes(): CameraKeyframe[] {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return DEFAULT_KEYFRAMES;
  }

  const docHeight = document.documentElement.scrollHeight;
  const vh = window.innerHeight;
  const maxScroll = docHeight - vh;

  if (maxScroll <= 0) return DEFAULT_KEYFRAMES;

  const frames: CameraKeyframe[] = [];

  // Hero at t=0 — opening aerial. SceneHero's own choreography runs
  // independently; the keyframe is here so that as the visitor begins
  // scrolling, interpolation toward the Property keyframe starts from
  // a known position.
  frames.push({ t: 0, ...SCENE_TARGETS.hero });

  for (const { selector, id, kind } of SCENE_SELECTORS) {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) continue;
    const targetCfg = SCENE_TARGETS[id];
    if (!targetCfg) continue;

    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const height = rect.height;

    // Lead = how much earlier (in scroll-vh) the camera arrives at
    // this section's position. 30vh matches the GSAP fade-in trigger
    // ('top 70%' = card's top 30vh below viewport top) — camera lands
    // as the card starts fading in, not after.
    //
    // Hold = how long (in scroll-vh) the camera anchors on this
    // scene before starting to glide toward the next. Default 10vh
    // for the continuous-motion feel.
    //
    // Per-section override: Primitive Camp uses a 50vh hold (vs the
    // default 10vh) because it's the only scene where the 3D content
    // is a unique destination at a specific world position (back
    // corner [-12, 0, -32]) with nothing else visible nearby. The
    // 10vh default left the camp invisible during the card; the
    // earlier 90vh override made the camp visible but left only
    // 10vh for the transition to Shower (a perceptible jolt).
    //
    // 50vh hold is the balance: 20vh of camp visibility during the
    // user's actual card-reading window (scroll 640-660), then a
    // 50vh transition (scroll 660-710) toward Shower that's about
    // 55% as long as the typical 90vh inter-section transitions —
    // fast-ish but continuous rather than jolty.
    //
    // Ordering: hold + lead ≤ sectionHeight (100vh for articles), so
    // 50 + 30 = 80 ≤ 100 ✓, with 20vh of transition room beyond
    // (next.lead=30, gap=20vh+).
    void kind; // same values for both — kept for future per-kind tuning
    const leadVh = 30;
    const holdVh = id === 'primitive-camp' ? 50 : 10;

    const leadPx = (leadVh / 100) * vh;
    const holdPx = (holdVh / 100) * vh;

    // Start keyframe — camera arrives at this section's position
    // exactly when its card begins fading in.
    const startT = clamp((top - leadPx) / maxScroll, 0.001, 0.999);
    // End keyframe — placed just `hold` further along, same pos/target.
    // Between start and end the camera anchors; between end and the
    // NEXT section's start keyframe the camera glides continuously
    // through ~90%+ of the section's scroll range.
    const endT = clamp((top - leadPx + holdPx) / maxScroll, 0.001, 0.999);

    frames.push({ t: startT, ...targetCfg });
    if (endT > startT + 0.001) {
      frames.push({ t: endT, ...targetCfg });
    }

    // suppress unused warning if height ever becomes diagnostic only
    void height;
  }

  // Footer hold — same as Book so the camera doesn't drift after the
  // visitor reaches the bottom.
  frames.push({ t: 1, ...SCENE_TARGETS.book });

  // Sort by t in case adjacent measurements produced out-of-order ts.
  frames.sort((a, b) => a.t - b.t);
  return frames;
}

interface CameraRigProps {
  /** Optional handheld shake amount (0..1). Welcome scene uses ~0.3. */
  shake?: number;
}

function linear(t: number) {
  return t;
}

export function CameraRig({ shake = 0 }: CameraRigProps) {
  const { camera } = useThree();
  const tmpPos = useRef(new THREE.Vector3());
  const tmpTarget = useRef(new THREE.Vector3());
  const currentTarget = useRef(new THREE.Vector3(0, 1, 0));
  const progress = useRef(0);
  const keyframes = useRef<CameraKeyframe[]>(DEFAULT_KEYFRAMES);

  // Build keyframes once the DOM has settled, and rebuild on resize.
  // The initial setTimeout(0) defers past the first paint so all
  // Scene components have mounted their sections and any layout-
  // affecting CSS has settled.
  useEffect(() => {
    let rafId: number | null = null;
    const rebuild = () => {
      keyframes.current = buildKeyframes();
    };
    const scheduleRebuild = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = null;
        rebuild();
      });
    };

    // Initial build after the next frame
    scheduleRebuild();
    // Second build after fonts/images may have shifted layout
    const settleTimer = setTimeout(scheduleRebuild, 600);

    window.addEventListener('resize', scheduleRebuild);
    window.addEventListener('load', scheduleRebuild);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearTimeout(settleTimer);
      window.removeEventListener('resize', scheduleRebuild);
      window.removeEventListener('load', scheduleRebuild);
    };
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    const handler = ({ progress: p }: { progress: number }) => {
      progress.current = p;
    };
    lenis.on('scroll', handler);
    return () => lenis.off('scroll', handler);
  }, []);

  useFrame((state, delta) => {
    // OVERRIDE PATH — explicit setCameraOverride wins over keyframes.
    // No Scene component currently sets one; reserved for emergencies
    // (e.g. a future modal that wants to dolly the camera somewhere
    // specific). Kept here so opt-in callers still work.
    const override = getCameraOverride();
    if (override) {
      tmpPos.current.set(override.pos[0], override.pos[1], override.pos[2]);
      tmpTarget.current.set(override.target[0], override.target[1], override.target[2]);

      if (shake > 0) {
        const t2 = state.clock.getElapsedTime();
        tmpPos.current.x += Math.sin(t2 * 1.8) * 0.04 * shake;
        tmpPos.current.y += Math.cos(t2 * 1.3) * 0.03 * shake;
      }

      camera.position.lerp(tmpPos.current, 1 - Math.pow(0.001, delta));
      currentTarget.current.lerp(tmpTarget.current, 1 - Math.pow(0.001, delta));
      camera.lookAt(currentTarget.current);
      return;
    }

    // PROGRESS PATH — continuous lerp between DOM-measured keyframes.
    // This is what produces the cinematic glide: as the visitor scrolls,
    // the camera target moves smoothly along the path defined by
    // adjacent keyframes, and the position lerp below damps Lenis-frame
    // jitter without lagging visibly behind.
    const frames = keyframes.current;
    if (frames.length === 0) return;

    const p = clamp(progress.current, 0, 1);
    // Find the segment containing p
    let i = 0;
    for (let k = 0; k < frames.length - 1; k++) {
      if (p >= frames[k].t && p <= frames[k + 1].t) {
        i = k;
        break;
      }
    }
    if (p > frames[frames.length - 1].t) i = frames.length - 2;
    if (i < 0) i = 0;

    const a = frames[i];
    const b = frames[i + 1] ?? a;
    const span = b.t - a.t || 1;
    const local = clamp((p - a.t) / span, 0, 1);
    const eased = linear(local);

    tmpPos.current.set(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], eased),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], eased),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], eased),
    );
    tmpTarget.current.set(
      THREE.MathUtils.lerp(a.target[0], b.target[0], eased),
      THREE.MathUtils.lerp(a.target[1], b.target[1], eased),
      THREE.MathUtils.lerp(a.target[2], b.target[2], eased),
    );

    if (shake > 0) {
      const t2 = state.clock.getElapsedTime();
      tmpPos.current.x += Math.sin(t2 * 1.8) * 0.04 * shake;
      tmpPos.current.y += Math.cos(t2 * 1.3) * 0.03 * shake;
    }

    // 0.001 smoothing — tight enough that the camera tracks the
    // scroll-derived target with ~0.2s catch-up (vs ~0.5–1s at the
    // old 0.06 value, which made the camera arrive at scenes well
    // after the card was already visible). The continuous keyframe
    // interpolation above is what provides scene-to-scene smoothness;
    // this position lerp only damps per-frame Lenis micro-jitter.
    camera.position.lerp(tmpPos.current, 1 - Math.pow(0.001, delta));
    currentTarget.current.lerp(tmpTarget.current, 1 - Math.pow(0.001, delta));
    camera.lookAt(currentTarget.current);
  });

  return null;
}
