'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { brandColors } from '@/lib/three';

/**
 * Glamping tent — parametric. Used for both Homestead (Driftwood-adjacent
 * canvas tent with wood stove) and Serene-Seven (prairie pitch with
 * best night-sky exposure).
 *
 * The tent is a tall A-frame canvas structure with a wood platform base,
 * a small chimney for the stove (Homestead variant only — see firePit
 * prop), and a glowing interior. Form roughly matches typical safari /
 * platform tents at TN glamping properties.
 */

interface TentProps {
  position?: [number, number, number];
  rotationY?: number;
  /** Whether to render a chimney + glowing stove inside. */
  hasStove?: boolean;
  /** Glow intensity. */
  glowIntensity?: number;
  /** Tent canvas tint — Serene-Seven is lighter, Homestead is warmer. */
  canvasColor?: string;
}

export function Tent({
  position = [0, 0, 0],
  rotationY = 0,
  hasStove = true,
  glowIntensity = 0.55,
  canvasColor = '#D9C9A6',
}: TentProps) {
  const interiorLight = useRef<THREE.PointLight>(null);
  const fireGlow = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (interiorLight.current) {
      interiorLight.current.intensity = glowIntensity * 3.4 * (1 + Math.sin(t * 1.7) * 0.04);
    }
    if (fireGlow.current) {
      const flicker = 1 + Math.sin(t * 3.1) * 0.18 + Math.sin(t * 7.8) * 0.06;
      fireGlow.current.intensity = glowIntensity * 2.2 * flicker;
    }
  });

  // Tent silhouette as a triangle revolved/extruded canvas shape
  const tentShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.5, 0);
    s.lineTo(1.5, 0);
    s.lineTo(0, 2.2);
    s.closePath();
    return s;
  }, []);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Wood platform base */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[3.4, 0.24, 3.2]} />
        <meshStandardMaterial color="#4A3320" roughness={0.88} />
      </mesh>

      {/* Tent body — two triangular gable end-walls + canvas sides */}
      {[1.5, -1.5].map((z, i) => (
        <mesh
          key={`gable-${i}`}
          position={[0, 0, z]}
          rotation={[0, z > 0 ? 0 : Math.PI, 0]}
          castShadow
        >
          <shapeGeometry args={[tentShape]} />
          <meshStandardMaterial
            color={canvasColor}
            roughness={0.78}
            metalness={0}
            side={THREE.DoubleSide}
            emissive={brandColors.amber}
            emissiveIntensity={glowIntensity * 0.18}
          />
        </mesh>
      ))}

      {/* Tent canvas sides — two angled planes from peak to base */}
      {([
        [Math.PI / 2 - 0.65, 0.75, 0, 0],   // right side
        [-(Math.PI / 2 - 0.65), -0.75, 0, 0], // left side
      ] as const).map(([rotZ, x], i) => (
        <mesh key={`side-${i}`} position={[x, 1.1, 0]} rotation={[0, 0, rotZ]} castShadow>
          <planeGeometry args={[2.7, 3.0]} />
          <meshStandardMaterial
            color={canvasColor}
            roughness={0.82}
            metalness={0}
            side={THREE.DoubleSide}
            emissive={brandColors.amber}
            emissiveIntensity={glowIntensity * 0.14}
          />
        </mesh>
      ))}

      {/* Interior light */}
      <pointLight
        ref={interiorLight}
        position={[0, 0.9, 0]}
        color={brandColors.amber}
        intensity={glowIntensity * 3.4}
        distance={6}
        decay={2}
      />

      {/* Stove chimney + fire glow (Homestead variant) */}
      {hasStove && (
        <>
          {/* Chimney pipe */}
          <mesh position={[0.7, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
            <meshStandardMaterial color="#1A1410" roughness={0.4} metalness={0.4} />
          </mesh>
          {/* Small flicker behind canvas to simulate fire inside */}
          <pointLight
            ref={fireGlow}
            position={[0.6, 0.35, 0]}
            color="#FF8B3D"
            intensity={glowIntensity * 2.2}
            distance={3.5}
            decay={2}
          />
        </>
      )}
    </group>
  );
}
