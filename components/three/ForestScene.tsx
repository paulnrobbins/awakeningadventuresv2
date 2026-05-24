'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeBank } from './TreeBank';
import { Firefly } from './Firefly';
import { PrayerShelter } from './PrayerShelter';
import { PerspectivePlatform } from './PerspectivePlatform';
import { useDeviceTier } from '@/hooks/useDeviceTier';

/**
 * The forest interior the camera moves through during Scene 4 (Trails).
 *
 * Built as overlapping tree banks at three depths, with one firefly
 * arc-pass and a slow "light shaft" sliver of warm light that breathes
 * to evoke morning sun filtering through canopy.
 *
 * Geographically sits in front of and around the trail keyframe in
 * CameraRig — when the camera descends to ground level it ends up
 * inside this group of trees.
 */
export function ForestScene({
  origin = [0, 0, -16],
}: {
  origin?: [number, number, number];
}) {
  const tier = useDeviceTier();
  const lightShaft = useRef<THREE.SpotLight>(null);

  // Light shaft breathing: a soft warm spotlight that fades in and out
  // every ~14 seconds, evoking filtered canopy light.
  useFrame(({ clock }) => {
    if (!lightShaft.current) return;
    const t = clock.getElapsedTime();
    lightShaft.current.intensity = 1.4 + Math.sin(t * 0.45) * 0.9;
  });

  // Counts reduced ~40% and banks split into LEFT + RIGHT halves with
  // a wide central clearing the camera looks straight through. The
  // Prayer Shelter sits inside the left clearing, the Perspective
  // Platform inside the right clearing — neither is occluded by trees
  // because no tree spawns in the central corridor.
  const nearCount = tier === 'high' ? 12 : tier === 'mid' ? 8 : 4;
  const midCount = tier === 'high' ? 16 : tier === 'mid' ? 10 : 6;
  const farCount = tier === 'high' ? 50 : tier === 'mid' ? 30 : 16;

  return (
    <group position={origin}>
      {/* NEAR — left flank only, well off the trail */}
      <TreeBank
        count={nearCount}
        center={[-10, 0, 4]}
        spread={[6, 6]}
        heightRange={[5, 9]}
        radiusRange={[0.16, 0.32]}
        seed={101}
        color="#0E1410"
      />
      {/* NEAR — right flank only */}
      <TreeBank
        count={nearCount}
        center={[10, 0, 4]}
        spread={[6, 6]}
        heightRange={[5, 9]}
        radiusRange={[0.16, 0.32]}
        seed={102}
        color="#0E1410"
      />
      {/* MID — left flank, set well off the prayer shelter */}
      <TreeBank
        count={midCount}
        center={[-13, 0, -3]}
        spread={[8, 10]}
        heightRange={[6, 11]}
        radiusRange={[0.14, 0.28]}
        seed={211}
        color="#121A14"
      />
      {/* MID — right flank, set well off the perspective platform */}
      <TreeBank
        count={midCount}
        center={[13, 0, -3]}
        spread={[8, 10]}
        heightRange={[6, 11]}
        radiusRange={[0.14, 0.28]}
        seed={212}
        color="#121A14"
      />
      {/* Far bank — full-width receding silhouette behind the structures.
          This one stays full-width on purpose so the horizon reads as
          continuous forest, but it's far enough back (z=-14 relative)
          that it's the backdrop, not the foreground. */}
      <TreeBank
        count={farCount}
        center={[0, 0, -14]}
        spread={[40, 14]}
        heightRange={[7, 13]}
        radiusRange={[0.10, 0.22]}
        seed={307}
        color="#0A100C"
      />

      {/* Breathing light shaft from canopy */}
      <spotLight
        ref={lightShaft}
        position={[-4, 14, -2]}
        target-position={[0, 0, -4]}
        angle={0.32}
        penumbra={0.85}
        intensity={2.0}
        distance={26}
        decay={1.4}
        color="#D9C089"
        castShadow={false}
      />

      {/* One firefly arc per trail pass */}
      {tier !== 'low' && (
        <Firefly phase={0} origin={[0, 1.2, -4]} pathWidth={8} period={22} />
      )}

      {/* Prayer shelter — sits in the LEFT central clearing, pulled
          forward so the camera at relative pos (-2, 1.6, -8) frames it
          clearly. No tree bank intersects this position. Scaled up so
          it reads at trail distance, angled toward the camera. */}
      <group position={[-5, 0, -2]} rotation={[0, Math.PI / 4, 0]} scale={1.7}>
        <PrayerShelter />
      </group>

      {/* Perspective platform — RIGHT central clearing, mirrored
          position. Angled toward the camera so the deck face reads,
          not the back of the railing. */}
      <group position={[5, 0, -2]} rotation={[0, -Math.PI / 4, 0]} scale={1.8}>
        <PerspectivePlatform />
      </group>

      {/* Small wooden trail marker dead center between the two
          structures — gives the eye a single midpoint anchor so the
          shelter / platform read as "around the trail" not "floating". */}
      <mesh position={[0, 0.7, -1]}>
        <cylinderGeometry args={[0.05, 0.06, 1.4, 6]} />
        <meshStandardMaterial color="#3D2A18" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.35, -1]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.4, 0.06, 0.15]} />
        <meshStandardMaterial color="#5A4126" roughness={0.85} />
      </mesh>
    </group>
  );
}
