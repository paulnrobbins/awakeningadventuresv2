'use client';

import { useEffect, useState } from 'react';
import { getLenis } from '@/lib/lenis';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { subscribeLakeActive } from '@/lib/cameraOverride';
import { CameraRig } from './CameraRig';
import { EnvironmentRig } from './EnvironmentRig';
import { Firefly } from './Firefly';
import { StarField } from './StarField';
import { PropertyLayout } from './PropertyLayout';
import { ForestScene } from './ForestScene';
import { LakeStage } from './LakeStage';
import { PontoonBoat } from './PontoonBoat';
import { TreeBank } from './TreeBank';
import { WelcomeStage } from './WelcomeStage';
import { BookingStage } from './BookingStage';

/**
 * Everything inside the R3F Canvas.
 *
 * Conditional scene activation by scroll progress:
 *   • PropertyLayout — always (the world's anchor)
 *   • ForestScene — 0.46 < p < 0.70 (trails range)
 *   • LakeWater + PontoonBoat — 0.58 < p < 0.78 (lake range)
 *   • WelcomeStage — 0.66 < p < 0.92 (welcome + groups range)
 *   • Tree line — always (continuity)
 *
 * Tight ranges keep frame budget honest. Phase 5's perf pass adds
 * tab-hidden pause + LOD swaps.
 */
export function WorldScene() {
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [lakeActive, setLakeActive] = useState(false);

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    const handler = ({ progress: p }: { progress: number }) => {
      setProgress((prev) => (Math.abs(prev - p) > 0.002 ? p : prev));
    };
    lenis.on('scroll', handler);
    return () => lenis.off('scroll', handler);
  }, []);

  // DOM-driven lake mount. SceneLake fires setLakeActive(true/false)
  // based on its own ScrollTrigger range, so the 3D lake mounts when
  // the DOM section enters and unmounts when it leaves — no progress
  // math, no drift.
  useEffect(() => subscribeLakeActive(setLakeActive), []);

  const starCount = tier === 'high' ? 6000 : tier === 'mid' ? 2500 : 800;
  // Handheld shake peaks in the welcome scene's range
  const cameraShake =
    progress > 0.66 && progress < 0.80
      ? 0.36
      : reduced
      ? 0
      : 0.05;

  // Forest / welcome / book still progress-driven (they're stable).
  // Lake is now DOM-driven via lakeActive (set by SceneLake's
  // ScrollTrigger), eliminating the "not in sync over the water" drift.
  const inForest = progress > 0.46 && progress < 0.58;
  const inLakeRange = lakeActive;
  const inWelcomeRange = progress > 0.66 && progress < 0.92 && !lakeActive;
  const inBookRange = progress > 0.86;

  return (
    <>
      <EnvironmentRig progress={progress} />
      <CameraRig shake={cameraShake} />

      <PropertyLayout />

      <mesh position={[0.4, -0.18, 1.5]}>
        <boxGeometry args={[0.9, 0.12, 0.4]} />
        <meshStandardMaterial color="#3A2818" roughness={0.88} />
      </mesh>

      {!reduced && tier !== 'low' && (
        <>
          <Firefly phase={0} origin={[2, 1.6, -3]} period={28} />
          <Firefly phase={0.4} origin={[-3, 1.4, -4]} period={32} pathWidth={6} />
        </>
      )}

      {/* Property-side tree line — sits AROUND the property buildings,
          not in the lake area. Always mounted so the forest reads as
          present in every non-lake scene including welcome / groups /
          book.

          Center shifted east (+8 on x) and spread narrowed so the
          western edge of the bank lives at x≈-4, leaving a wide clear
          corridor for the Serene Seven keyframe to look straight at the
          tent at x=-26 with no green canopy crossing the camera's
          sightline. */}
      {!inLakeRange && (
        <TreeBank
          count={tier === 'high' ? 30 : 18}
          center={[8, 0, -18]}
          spread={[24, 10]}
          heightRange={[6, 10]}
          radiusRange={[0.10, 0.22]}
          seed={91}
          color="#2F4030"
        />
      )}

      {inForest && <ForestScene origin={[0, 0, -16]} />}
      {inLakeRange && (
        <>
          <LakeStage />
          {/* Plus the original drifting pontoon way out on the horizon —
              moving slowly across the lake far behind the moored boat */}
          <PontoonBoat startX={-50} endX={50} z={-88} baseY={0.35} period={110} />
        </>
      )}
      {inWelcomeRange && <WelcomeStage />}
      {inBookRange && <BookingStage />}

      {/* Sun motes — daytime equivalent of the night star field */}
      <StarField count={Math.round(starCount * 0.4)} radius={40} />

      {/* Forest floor — ALWAYS mounted but at a footprint that doesn't
          reach into the lake area. Covers the property zone (centered
          around the buildings at z=-5, extending 40m forward and 30m
          back, 60m wide). The lake at z=-30+ is well outside this
          patch so the lake water never has to compete with it. */}
      <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 50, 1, 1]} />
        <meshStandardMaterial color="#3D4A30" roughness={0.96} />
      </mesh>
    </>
  );
}
