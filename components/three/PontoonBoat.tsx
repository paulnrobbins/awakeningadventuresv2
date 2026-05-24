'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Pontoon silhouette drifting across the horizon during Scene 5.
 *
 * Built from primitives — two pontoon tubes underneath, a small deck,
 * a canopy roof on four posts, and a single warm light at the helm.
 * Procedural, never AI-generated — the silhouette is doing the work.
 *
 * Drifts very slowly (one cross every ~90 seconds), bobs gently to
 * imply wake, and the warm helm light flickers minimally.
 */
export function PontoonBoat({
  startX = -40,
  endX = 40,
  z = -50,
  baseY = 0.4,
  period = 90,
}: {
  startX?: number;
  endX?: number;
  z?: number;
  baseY?: number;
  /** Cycle period in seconds. */
  period?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const helmLight = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() / period) % 1;
    ref.current.position.x = startX + (endX - startX) * t;
    ref.current.position.y = baseY + Math.sin(clock.getElapsedTime() * 0.7) * 0.06;
    ref.current.position.z = z;

    if (helmLight.current) {
      const ft = clock.getElapsedTime();
      helmLight.current.intensity = 0.8 + Math.sin(ft * 1.6) * 0.12;
    }
  });

  return (
    <group ref={ref}>
      {/* Pontoons — two tubes */}
      <mesh position={[0, 0, 0.7]}>
        <cylinderGeometry args={[0.22, 0.22, 6.0, 8]} />
        <meshStandardMaterial color="#1A1410" roughness={0.7} metalness={0.45} />
      </mesh>
      <mesh position={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.22, 0.22, 6.0, 8]} />
        <meshStandardMaterial color="#1A1410" roughness={0.7} metalness={0.45} />
      </mesh>

      {/* Deck */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[6.2, 0.18, 2.0]} />
        <meshStandardMaterial color="#3A2818" roughness={0.85} />
      </mesh>

      {/* Canopy posts */}
      {[[-2.4, 0.7], [2.4, 0.7], [-2.4, -0.7], [2.4, -0.7]].map((p, i) => (
        <mesh key={i} position={[p[0], 1.2, p[1]]}>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 6]} />
          <meshStandardMaterial color="#1F1410" roughness={0.7} />
        </mesh>
      ))}

      {/* Canopy roof */}
      <mesh position={[0, 1.85, 0]}>
        <boxGeometry args={[5.4, 0.1, 1.8]} />
        <meshStandardMaterial color="#0F0A07" roughness={0.85} />
      </mesh>

      {/* Helm light — Captain Anthony's lamp */}
      <pointLight ref={helmLight} position={[-1.8, 1.4, 0]} color="#FFB066" intensity={0.8} distance={4} decay={2} />
    </group>
  );
}
