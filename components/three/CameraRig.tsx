'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getLenis } from '@/lib/lenis';
import { clamp } from '@/lib/utils';
import { getCameraOverride } from '@/lib/cameraOverride';

/**
 * Camera rig — drives the camera position + look-target as a function of
 * global scroll progress.
 *
 * Phase 4a expands the keyframe table so the Stay range (~progress
 * 0.25-0.45) walks the camera past each of the four accommodations in
 * order: Stargazer → Driftwood treehouse → Homestead tent → Serene-Seven
 * tent. Each accommodation gets a 0.05 progress slice. The rig uses
 * cinematic easing on every transition so even quick scrolling looks
 * composed.
 */

type CameraKeyframe = {
  t: number;                      // global progress at this keyframe (0..1)
  pos: [number, number, number];
  target: [number, number, number];
  /** Optional per-segment ease — default power3-out. */
  ease?: 'linear' | 'ease-out' | 'ease-in-out';
};

// Camera keyframes — each keyframe's `t` is set to the SCROLL-PROGRESS
// MIDPOINT of the corresponding scene/card, computed from the actual
// rendered scene heights:
//
//   Hero       100vh   → progress 0.000 - 0.064  (midpoint 0.032)
//   Property   140vh   → progress 0.064 - 0.153  (midpoint 0.108)
//   Stay       400vh   → progress 0.153 - 0.408  (4 sticky cards)
//     Stargazer    → 0.153 - 0.217  (midpoint 0.185)
//     Driftwood    → 0.217 - 0.281  (midpoint 0.249)
//     Homestead    → 0.281 - 0.344  (midpoint 0.313)
//     Serene Seven → 0.344 - 0.408  (midpoint 0.376)
//   Shower     140vh   → progress 0.408 - 0.497  (midpoint 0.453)
//   Trails     140vh   → progress 0.497 - 0.586  (midpoint 0.541)
//   Lake       180vh   → progress 0.586 - 0.701  (midpoint 0.643)
//   Welcome    140vh   → progress 0.701 - 0.790  (midpoint 0.745)
//   Groups     140vh   → progress 0.790 - 0.879  (midpoint 0.835)
//   Book       140vh   → progress 0.879 - 0.968  (midpoint 0.924)
//   Footer      50vh   → progress 0.968 - 1.000
//
// Placement at midpoints means the camera is centered on each
// accommodation/scene EXACTLY when its DOM content is most visible.
// Linear interpolation between adjacent keyframes makes the camera
// sweep continuously from one focal point to the next as the visitor
// scrolls — the cinematic scrub.
const KEYFRAMES: CameraKeyframe[] = [
  // Opening aerial — comfortable wide framing of the 42 acres without
  // being so distant that buildings turn into specks. Held through the
  // hero scene.
  { t: 0.00,  pos: [22,   22,   32], target: [0,   0,    -10] },
  // Mid-descent — partway between opening aerial and ground level.
  // Lands inside the Property scene (~0.108) so the editorial copy
  // appears while the camera is in this descending aerial.
  { t: 0.11,  pos: [9,    11,   18], target: [0,   0.8,   -4] },
  // Stargazer focus — keyframe at progress 0.185 (Stargazer card
  // midpoint). Camera at low eye-level just south-west of the cabin
  // looking at the cabin entrance. The Stargazer building is the
  // dominant element behind the Stargazer card.
  { t: 0.185, pos: [-3.0, 1.8,   4.0], target: [0,   1.2,    0] },
  // Driftwood focus — keyframe at progress 0.249 (Driftwood card
  // midpoint). Driftwood treehouse is at [22, 0, -16] in the canopy.
  { t: 0.249, pos: [16,   4.0,  -6.0], target: [22,  4.0,  -16] },
  // Homestead focus — keyframe at 0.313 (Homestead card midpoint).
  // Homestead tent at [-22, 0, -6] in the prairie clearing.
  { t: 0.313, pos: [-15,  2.4,   2.0], target: [-22, 1.2,   -6] },
  // Serene Seven focus — keyframe at 0.376 (SS card midpoint). High
  // western vantage so the tent reads against open sky + distant
  // ridge, never through any forest canopy.
  { t: 0.376, pos: [-28,  6.5, -14],   target: [-26, 1.0,  -24] },
  // Shower house — keyframe at 0.453 (Shower scene midpoint).
  // Treehouse shower at [20, 0, 8].
  { t: 0.453, pos: [14,   3.6,  16],   target: [20,  3.0,    8] },
  // Trails — keyframe at 0.541 (Trails scene midpoint). Wide
  // eye-level view down the central trail corridor with prayer
  // shelter on the left and perspective platform on the right.
  { t: 0.541, pos: [0,    2.0,  -3],   target: [0,   1.8,  -18] },
  // Lake — keyframe at 0.643 (Lake scene midpoint). Shoreside view
  // with the dock leading diagonally into the lake on the left and
  // the moored pontoon at its lakeside end.
  { t: 0.643, pos: [-7,   3.2, -22],   target: [2,   0.4,  -40] },
  // Welcome — keyframe at 0.745 (Welcome scene midpoint). Sitting
  // at the fire pit which is at [-2, 0, -8] in world space.
  { t: 0.745, pos: [-3.4, 1.2,  -5.0], target: [-2,  0.5,   -8] },
  // Groups — keyframe at 0.835 (Groups scene midpoint). Full
  // pull-back to see the entire property again, late afternoon.
  { t: 0.835, pos: [14,   16,   20],   target: [-2,  0.5,   -6] },
  // Book — keyframe at 0.924 (Book scene midpoint). Return to a
  // composition close to the original hero so the visitor reads the
  // final "Come and see" against the same anchor they entered with.
  { t: 0.924, pos: [0,    1.4,   6.0], target: [0,   1.0,    0] },
  // Footer hold — same position as Book so the camera doesn't drift
  // past the booking moment while the visitor scrolls through the
  // footer.
  { t: 1.000, pos: [0,    1.4,   6.0], target: [0,   1.0,    0] },
];

interface CameraRigProps {
  /** Optional handheld shake amount (0..1). Welcome scene uses ~0.3. */
  shake?: number;
}

/**
 * Camera interpolation curve.
 *
 * We use LINEAR interpolation (`t` returned as-is) so the camera moves
 * in lock-step with the scroll wheel — the visitor scrolls, the camera
 * travels. Earlier this was a power3 ease-out, which finished 87% of
 * the move in the first 50% of scroll, making the camera "snap then
 * sit still" on every scene. Linear gives the true cinematic-scrub
 * feel of a Lando-Norris / Awwwards-style site where the camera is
 * effectively a Pro Tools playhead bound to the timeline.
 *
 * The eased path is left available for future opt-in (Welcome's
 * handheld micro-shake, for example, could ease in to feel handheld).
 */
function linear(t: number) {
  return t;
}

export function CameraRig({ shake = 0 }: CameraRigProps) {
  const { camera } = useThree();
  const tmpPos = useRef(new THREE.Vector3());
  const tmpTarget = useRef(new THREE.Vector3());
  const currentTarget = useRef(new THREE.Vector3(0, 1, 0));
  const progress = useRef(0);

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
    // OVERRIDE PATH — if a Scene component has set a camera target,
    // use that directly. Bypasses the progress-based lerp entirely so
    // ScrollTrigger-driven camera moves (e.g. SceneStay's per-card
    // transitions) are perfectly synced with the DOM card fade-ins.
    const override = getCameraOverride();
    if (override) {
      tmpPos.current.set(override.pos[0], override.pos[1], override.pos[2]);
      tmpTarget.current.set(override.target[0], override.target[1], override.target[2]);

      if (shake > 0) {
        const t2 = state.clock.getElapsedTime();
        tmpPos.current.x += Math.sin(t2 * 1.8) * 0.04 * shake;
        tmpPos.current.y += Math.cos(t2 * 1.3) * 0.03 * shake;
      }

      camera.position.lerp(tmpPos.current, 1 - Math.pow(0.06, delta));
      currentTarget.current.lerp(tmpTarget.current, 1 - Math.pow(0.06, delta));
      camera.lookAt(currentTarget.current);
      return;
    }

    // PROGRESS PATH — keyframe lerp for every scene except Stay.
    const p = clamp(progress.current, 0, 1);
    let i = 0;
    for (let k = 0; k < KEYFRAMES.length - 1; k++) {
      if (p >= KEYFRAMES[k].t && p <= KEYFRAMES[k + 1].t) {
        i = k;
        break;
      }
      if (p > KEYFRAMES[KEYFRAMES.length - 1].t) i = KEYFRAMES.length - 2;
    }
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1] ?? a;
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

    // Camera-position lerp slowed from 0.10 → 0.06 so the camera
    // glides toward the scroll-derived target rather than snapping
    // into place. Combined with the linear progress curve above,
    // this is what produces "cinematic camera moving with you" as
    // opposed to "camera teleports to next keyframe."
    camera.position.lerp(tmpPos.current, 1 - Math.pow(0.06, delta));
    currentTarget.current.lerp(tmpTarget.current, 1 - Math.pow(0.06, delta));
    camera.lookAt(currentTarget.current);
  });

  return null;
}
