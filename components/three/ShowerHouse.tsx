'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { brandColors } from '@/lib/three';

/**
 * Shower House — elevated 2-room treehouse-style bathhouse with a
 * pitched roof, sitting on four wooden stilts so it reads as elevated
 * in the forest (matches the reference photo from
 * StudioWork/Awakening Adventures/Grounds/Shower House).
 *
 * Procedural primitives. Subtle interior glow during dawn/dusk
 * suggests "lights are on inside".
 */
interface ShowerHouseProps {
  position?: [number, number, number];
  rotationY?: number;
  glowIntensity?: number;
}

export function ShowerHouse({
  position = [0, 0, 0],
  rotationY = 0,
  glowIntensity = 0.2,
}: ShowerHouseProps) {
  const windowLight = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!windowLight.current) return;
    const t = clock.getElapsedTime();
    windowLight.current.intensity = glowIntensity * 2.4 * (1 + Math.sin(t * 1.1) * 0.05);
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Four stilts holding the bathhouse up */}
      {[
        [-1.3, 0, -1.1],
        [1.3, 0, -1.1],
        [-1.3, 0, 1.1],
        [1.3, 0, 1.1],
      ].map((p, i) => (
        <mesh key={`stilt-${i}`} position={[p[0], 1.4, p[2]]} castShadow>
          <cylinderGeometry args={[0.10, 0.12, 2.8, 8]} />
          <meshStandardMaterial color="#6B4A2A" roughness={0.85} />
        </mesh>
      ))}

      {/* Cross brace under the platform */}
      <mesh position={[0, 2.7, 0]}>
        <boxGeometry args={[3.2, 0.16, 2.6]} />
        <meshStandardMaterial color="#5C3F22" roughness={0.85} />
      </mesh>

      {/* Cabin walls — two rooms side by side */}
      <mesh position={[0, 3.6, 0]} castShadow>
        <boxGeometry args={[3.0, 1.8, 2.4]} />
        <meshStandardMaterial color="#A07A4A" roughness={0.78} />
      </mesh>

      {/* Pitched roof — single ridge */}
      <mesh position={[0, 4.85, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[2.0, 0.8, 4, 1]} />
        <meshStandardMaterial color="#3D2A18" roughness={0.85} />
      </mesh>

      {/* Single window — emissive plane suggesting interior */}
      <mesh position={[0.4, 3.7, 1.21]}>
        <planeGeometry args={[0.7, 0.5]} />
        <meshBasicMaterial color={brandColors.amber} toneMapped={false} />
      </mesh>

      {/* Faint warm interior point light */}
      <pointLight
        ref={windowLight}
        position={[0.5, 3.7, 1.5]}
        color={brandColors.amber}
        intensity={glowIntensity * 2.4}
        distance={6}
        decay={2}
      />

      {/* A small wooden ramp from ground to platform — like the
          reference photo's switchback walkway */}
      <mesh position={[2.2, 1.4, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[2.8, 0.10, 0.7]} />
        <meshStandardMaterial color="#6B4A2A" roughness={0.85} />
      </mesh>
    </group>
  );
}
