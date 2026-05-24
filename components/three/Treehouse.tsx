'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { brandColors } from '@/lib/three';

/**
 * Driftwood treehouse — procedural placeholder.
 *
 * Real Driftwood from the snapshot: built into the tree canopy, platform
 * + railing + small cabin elevated ~12 feet. The procedural version is
 * a wooden box on stilts with a sloped roof and a window glowing warm.
 *
 * Phase 4 ships this. Phase 5 swaps to a Hyper3D GLB if Paul opts in.
 */

interface TreehouseProps {
  position?: [number, number, number];
  scale?: number;
  glowIntensity?: number;
}

export function Treehouse({
  position = [0, 0, 0],
  scale = 1,
  glowIntensity = 0.7,
}: TreehouseProps) {
  const windowLight = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!windowLight.current) return;
    const t = clock.getElapsedTime();
    windowLight.current.intensity = glowIntensity * 4 * (1 + Math.sin(t * 1.4) * 0.04);
  });

  return (
    <group position={position} scale={scale}>
      {/* Stilts — 4 vertical posts holding the platform up */}
      {[
        [-1.4, 0, -1.0],
        [1.4, 0, -1.0],
        [-1.4, 0, 1.0],
        [1.4, 0, 1.0],
      ].map((p, i) => (
        <mesh key={`stilt-${i}`} position={[p[0], 1.8, p[2]]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 3.6, 8]} />
          <meshStandardMaterial color="#6B4A2A" roughness={0.82} />
        </mesh>
      ))}

      {/* Platform */}
      <mesh position={[0, 3.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.18, 2.6]} />
        <meshStandardMaterial color="#5C3F22" roughness={0.85} />
      </mesh>

      {/* Cabin walls */}
      <mesh position={[0, 4.7, 0]} castShadow>
        <boxGeometry args={[2.8, 2.0, 2.2]} />
        <meshStandardMaterial color="#8B6336" roughness={0.78} />
      </mesh>

      {/* Sloped roof — single triangular prism */}
      <mesh position={[0, 6.0, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[2.0, 0.9, 4, 1]} />
        <meshStandardMaterial color="#3D2A18" roughness={0.85} />
      </mesh>

      {/* Window — emissive plane glowing fire-amber */}
      <mesh position={[1.41, 4.7, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.9, 0.6]} />
        <meshBasicMaterial color={brandColors.amber} toneMapped={false} />
      </mesh>

      {/* Interior point light spilling from the window */}
      <pointLight
        ref={windowLight}
        position={[1.6, 4.7, 0]}
        color={brandColors.amber}
        intensity={glowIntensity * 4}
        distance={8}
        decay={2}
      />

      {/* Railing — simple horizontal beam around the platform */}
      <mesh position={[0, 4.0, -1.25]}>
        <boxGeometry args={[3.4, 0.06, 0.06]} />
        <meshStandardMaterial color="#6B4A2A" roughness={0.82} />
      </mesh>
      <mesh position={[0, 4.0, 1.25]}>
        <boxGeometry args={[3.4, 0.06, 0.06]} />
        <meshStandardMaterial color="#6B4A2A" roughness={0.82} />
      </mesh>
    </group>
  );
}
