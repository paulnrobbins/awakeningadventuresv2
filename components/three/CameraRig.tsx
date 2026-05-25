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
// START of the corresponding scene/card, so the subject is centered
// the moment the section becomes visible (rather than after the user
// has scrolled halfway through it). Linear interpolation between
// adjacent keyframes makes the camera sweep continuously from one
// focal point to the next as the visitor scrolls.
//
// Scroll-progress boundaries derived from rendered scene heights:
//
//   Hero       100vh   → progress 0.000 - 0.064
//   Property   140vh   → progress 0.064 - 0.153
//   Stay       400vh   → progress 0.153 - 0.408  (4 sticky cards)
//     Stargazer    → starts 0.153
//     Driftwood    → starts 0.217
//     Homestead    → starts 0.281
//     Serene Seven → starts 0.344
//   Shower     140vh   → starts 0.408
//   Trails     140vh   → starts 0.497
//   Lake       180vh   → starts 0.586
//   Welcome    140vh   → starts 0.701
//   Groups     140vh   → starts 0.790
//   Book       140vh   → starts 0.879
//   Footer      50vh   → starts 0.968
//
// Result: as the visitor enters each section, the camera is already
// composed on that section's subject. As they scroll through the
// section the camera drifts toward the next subject, arriving when
// the next section's content fades in.
const KEYFRAMES: CameraKeyframe[] = [
  // Opening aerial — held through the entire hero scene so the
  // visitor's first impression is the wide property.
  { t: 0.00,  pos: [22,   22,   32], target: [0,   0,    -10] },
  // Property scene start — mid-descent. Lands at progress 0.064
  // (when "Forty-two acres" copy enters viewport) so the camera is
  // already moving from aerial toward the cabins as the copy reads.
  { t: 0.064, pos: [12,   14,   22], target: [0,   0.8,   -4] },
  // Stargazer — keyframe at section START (0.153). Stargazer cabin
  // is centered the moment the Stargazer card becomes visible.
  { t: 0.153, pos: [-3.0, 1.8,   4.0], target: [0,   1.2,    0] },
  // Driftwood — at the Driftwood card's first scroll position.
  { t: 0.217, pos: [16,   4.0,  -6.0], target: [22,  4.0,  -16] },
  // Homestead — at the Homestead card's first scroll position.
  { t: 0.281, pos: [-15,  2.4,   2.0], target: [-22, 1.2,   -6] },
  // Serene Seven — at the Serene Seven card's first scroll position.
  // High western vantage so the tent reads against open sky + ridge.
  { t: 0.344, pos: [-28,  6.5, -14],   target: [-26, 1.0,  -24] },
  // Shower house — at start of the Shower scene.
  { t: 0.408, pos: [14,   3.6,  16],   target: [20,  3.0,    8] },
  // Trails — at start of the Trails scene. Wide eye-level view
  // straight down the central trail corridor (prayer shelter left,
  // perspective platform right, central trail marker).
  { t: 0.497, pos: [0,    2.0,  -3],   target: [0,   1.8,  -18] },
  // Lake — at start of the Lake scene. Shoreside view with the dock
  // leading into the water and the moored pontoon at its end.
  { t: 0.586, pos: [-7,   3.2, -22],   target: [2,   0.4,  -40] },
  // Welcome — at start of the Welcome scene. Sitting at the fire pit
  // (the pit is at [-2, 0, -8] in world space).
  { t: 0.701, pos: [-3.4, 1.2,  -5.0], target: [-2,  0.5,   -8] },
  // Groups — at start of the Groups scene. Full pull-back to see the
  // entire property at late afternoon.
  { t: 0.790, pos: [14,   16,   20],   target: [-2,  0.5,   -6] },
  // Book — at start of the Book scene. Return to a composition close
  // to the original hero so the visitor reads the final "Come and
  // see" against the same anchor they entered with.
  { t: 0.879, pos: [0,    1.4,   6.0], target: [0,   1.0,    0] },
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
