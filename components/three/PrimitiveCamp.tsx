'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Primitive Camp — back-corner clearing in the forest where the
 * primitive (bring-your-own-tent) site lives. No real building; the
 * scene reads as: ring of stones around a campfire, three log seats,
 * a small pup-tent silhouette, scattered firewood.
 *
 * Positioned at world `origin` (default [-12, 0, -32] — deeper into
 * the property than the Serene Seven tent at [-26, 0, -24]). Mounted
 * conditionally from WorldScene during the Primitive-Camp scroll
 * range so the GPU only pays for it when the camera frame includes
 * it.
 *
 * Built from primitives only — same procedural-first discipline as
 * the rest of the property. No GLB, no texture loads.
 */
export function PrimitiveCamp({
  origin = [-12, 0, -32],
}: {
  origin?: [number, number, number];
}) {
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const flameRef = useRef<THREE.PointLight>(null);
  const emberRef = useRef<THREE.Mesh>(null);

  // Subtle flame flicker — same idiom as FirePit + StargazerCabin.
  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.getElapsedTime();
    if (flameRef.current) {
      flameRef.current.intensity = 1.6 + Math.sin(t * 6.2) * 0.35 + Math.cos(t * 9.1) * 0.18;
    }
    if (emberRef.current) {
      const s = 1 + Math.sin(t * 5.8) * 0.08;
      emberRef.current.scale.set(s, s, s);
    }
  });

  // Ring of fire-ring stones — 8 small rocks arranged in a circle
  const ringRadius = 0.55;
  const stoneCount = 8;
  const stones = Array.from({ length: stoneCount }, (_, i) => {
    const a = (i / stoneCount) * Math.PI * 2;
    return {
      pos: [Math.cos(a) * ringRadius, 0.08, Math.sin(a) * ringRadius] as [number, number, number],
      rot: (i * 0.37) % Math.PI,
    };
  });

  // Log seats — three rough cylinders around the fire ring
  const logSeats: { pos: [number, number, number]; rot: number }[] = [
    { pos: [-1.6, 0.16, 0.3], rot: 0.4 },
    { pos: [1.4, 0.16, 0.5], rot: -0.3 },
    { pos: [0.1, 0.16, -1.6], rot: 0.05 },
  ];

  // Scattered firewood — small sticks east of the fire
  const sticks: { pos: [number, number, number]; rot: [number, number, number] }[] = [
    { pos: [2.4, 0.06, -0.4], rot: [0, 0.2, Math.PI / 2] },
    { pos: [2.6, 0.06, -0.2], rot: [0, -0.4, Math.PI / 2] },
    { pos: [2.7, 0.06, 0.1], rot: [0, 0.8, Math.PI / 2] },
  ];

  // Pup tent — a small triangle silhouette behind the fire ring, just
  // enough to read as "camping" without competing with the real tents
  // already on the property. Skip on low-tier to keep poly budget down.
  const renderTent = tier !== 'low';

  return (
    <group position={origin}>
      {/* Ring of stones around the fire pit */}
      {stones.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[0, s.rot, 0]} castShadow={false}>
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color="#4A4640" roughness={0.95} />
        </mesh>
      ))}

      {/* Ash + ember bed inside the ring */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[ringRadius - 0.1, 16]} />
        <meshStandardMaterial color="#2A1E14" roughness={1} />
      </mesh>

      {/* Glowing ember disc — pulses subtly */}
      <mesh ref={emberRef} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 16]} />
        <meshBasicMaterial color="#C77A3A" transparent opacity={0.85} />
      </mesh>

      {/* Warm point light from the fire */}
      <pointLight
        ref={flameRef}
        position={[0, 0.5, 0]}
        intensity={1.6}
        distance={9}
        decay={1.6}
        color="#E89150"
      />

      {/* Log seats */}
      {logSeats.map((log, i) => (
        <mesh key={i} position={log.pos} rotation={[0, log.rot, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.17, 1.3, 8]} />
          <meshStandardMaterial color="#3D2A18" roughness={0.92} />
        </mesh>
      ))}

      {/* Scattered firewood */}
      {sticks.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot}>
          <cylinderGeometry args={[0.05, 0.06, 0.7, 6]} />
          <meshStandardMaterial color="#4A3520" roughness={0.95} />
        </mesh>
      ))}

      {/* Pup-tent silhouette behind the fire — two triangular gables
          plus two sloped sides, evokes a tarp tent without competing
          with the property's real glamping tents */}
      {renderTent && (
        <group position={[-0.4, 0, -2.2]} rotation={[0, 0.2, 0]}>
          {/* Front gable */}
          <mesh position={[0, 0.5, 0.6]}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([
                  -0.65, 0, 0,
                  0.65, 0, 0,
                  0, 1.0, 0,
                ]), 3]}
              />
            </bufferGeometry>
            <meshStandardMaterial color="#7A5C3A" roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
          {/* Back gable */}
          <mesh position={[0, 0.5, -0.6]}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([
                  -0.65, 0, 0,
                  0.65, 0, 0,
                  0, 1.0, 0,
                ]), 3]}
              />
            </bufferGeometry>
            <meshStandardMaterial color="#6A4F30" roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
          {/* Left slope */}
          <mesh position={[-0.32, 0.5, 0]} rotation={[0, 0, -0.55]}>
            <planeGeometry args={[1.18, 1.2]} />
            <meshStandardMaterial color="#7A5C3A" roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
          {/* Right slope */}
          <mesh position={[0.32, 0.5, 0]} rotation={[0, 0, 0.55]}>
            <planeGeometry args={[1.18, 1.2]} />
            <meshStandardMaterial color="#7A5C3A" roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Forest-floor patch — same sage-green family as the world
          floor in WorldScene (#3D4A30) but a touch darker /
          desaturated so the clearing reads as "trampled by campers"
          rather than a pristine field. The world floor stops at
          z=-25 (it was extended once, but that bled into the lake
          area and made the dock + boat sit on grass), so this patch
          has to be LARGE enough to cover the entire visible area
          while the camera is composed on the camp — otherwise the
          camera sees void cream beyond the patch's edge. 30×35 at
          local origin gives the camera at world [-9, 1.6, -25]
          looking at [-11, 0.6, -32] a continuous green floor through
          the full frustum. */}
      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 35, 1, 1]} />
        <meshStandardMaterial color="#34402B" roughness={0.98} />
      </mesh>
    </group>
  );
}
