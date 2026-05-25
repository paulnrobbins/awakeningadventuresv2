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
  // Property scene start — mid-descent. Camera is already moving
  // from aerial toward the cabins as the "Forty-two acres" copy reads.
  { t: 0.040, pos: [12,   14,   22], target: [0,   0.8,   -4] },
  // Stargazer — keyframe pulled ~3% earlier than section start so
  // the cabin is centered BEFORE the visitor finishes scrolling
  // into the Stargazer card. Each subsequent keyframe shifts the
  // same amount earlier so every subject leads its content.
  { t: 0.125, pos: [-3.0, 1.8,   4.0], target: [0,   1.2,    0] },
  // Driftwood
  { t: 0.190, pos: [16,   4.0,  -6.0], target: [22,  4.0,  -16] },
  // Homestead
  { t: 0.255, pos: [-15,  2.4,   2.0], target: [-22, 1.2,   -6] },
  // Serene Seven — high western vantage so tent reads against open
  // sky + ridge.
  { t: 0.320, pos: [-28,  6.5, -14],   target: [-26, 1.0,  -24] },
  // Primitive Camp — there's no 3D structure for this site (it's an
  // open clearing in the back of the property near the rock bridge),
  // so the camera moves to a low forest-floor frame back-and-up from
  // Serene Seven, looking into the back corner of the property where
  // the campsite lives. The DOM card carries the photo.
  { t: 0.355, pos: [-18,  2.0, -10],   target: [-22, 1.0,  -26] },
  // Shower scene — re-aimed at the Driftwood treehouse (per Paul's
  // direction). The text card overlay says "Shower in the trees" so
  // framing the treehouse behind it sells the "in the trees" idea
  // visually. Mirrors the Driftwood keyframe at t=0.190 — same camera
  // position + look-target, just played at the shower scroll point.
  { t: 0.385, pos: [16,   4.0,  -6.0], target: [22,  4.0,  -16] },
  // Trails — wide eye-level view down the central trail corridor.
  { t: 0.475, pos: [0,    2.0,  -3],   target: [0,   1.8,  -18] },
  // Lake — shoreside view with the dock and moored pontoon.
  { t: 0.560, pos: [-7,   3.2, -22],   target: [2,   0.4,  -40] },
  // Welcome — sitting at the fire pit (the pit is at [-2, 0, -8]).
  { t: 0.675, pos: [-3.4, 1.2,  -5.0], target: [-2,  0.5,   -8] },
  // Groups — full pull-back to see the entire property at late
  // afternoon.
  { t: 0.765, pos: [14,   16,   20],   target: [-2,  0.5,   -6] },
  // Book — return to a composition close to the original hero so
  // the visitor reads the final "Come and see" against the same
  // anchor they entered with.
  { t: 0.855, pos: [0,    1.4,   6.0], target: [0,   1.0,    0] },
  // Footer hold — same position so the camera doesn't drift past
  // the booking moment while the visitor scrolls through the footer.
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
