'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Fire pit — procedural, no AI / no texture.
 *
 * Three nested billboard sprites at decreasing scale form the flame
 * silhouette; each one rotates on Y at slightly different speeds to
 * break up the symmetry. A warm point light pulses on top.
 *
 * Sized small (~0.5m tall) so it reads as a real campfire from
 * camera distance, not a bonfire.
 */
export function FirePit({
  position = [0, 0, 0],
  glow = 1.0,
}: {
  position?: [number, number, number];
  glow?: number;
}) {
  const flameRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lightRef = useRef<THREE.PointLight>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Stone-ring positions around the pit
  const stones = useMemo(() => {
    const arr: { angle: number; radius: number; size: number }[] = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      arr.push({ angle, radius: 0.55, size: 0.12 + Math.random() * 0.06 });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    flameRefs.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.y = t * (0.5 + i * 0.2);
      const scale = 1 + Math.sin(t * (3 + i) + i) * 0.06;
      m.scale.set(scale, 1 + Math.sin(t * 4 + i) * 0.04, scale);
    });
    if (lightRef.current) {
      lightRef.current.intensity = glow * (3.0 + Math.sin(t * 2.8) * 0.7 + Math.sin(t * 7.1) * 0.3);
    }
  });

  return (
    <group position={position}>
      {/* Stone ring */}
      {stones.map((s, i) => (
        <mesh
          key={i}
          position={[Math.cos(s.angle) * s.radius, 0.05, Math.sin(s.angle) * s.radius]}
        >
          <sphereGeometry args={[s.size, 6, 6]} />
          <meshStandardMaterial color="#2A1F18" roughness={0.95} />
        </mesh>
      ))}

      {/* Coal bed (dark ember-glow plane on ground) */}
      <mesh ref={ringRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 24]} />
        <meshBasicMaterial color="#B84A18" toneMapped={false} transparent opacity={0.6} />
      </mesh>

      {/* Three flame sprites rotating at different speeds */}
      {[0, 1, 2].map((i) => {
        const h = 0.42 - i * 0.08;
        const w = 0.32 - i * 0.05;
        const yOffset = 0.22 + i * 0.08;
        const colors = ['#FFB155', '#FF8132', '#FF5520'];
        return (
          <mesh
            key={`flame-${i}`}
            ref={(m) => { flameRefs.current[i] = m; }}
            position={[0, yOffset, 0]}
          >
            <coneGeometry args={[w, h, 8]} />
            <meshBasicMaterial color={colors[i]} toneMapped={false} transparent opacity={0.85 - i * 0.12} />
          </mesh>
        );
      })}

      {/* Point light — main illumination for the welcome scene */}
      <pointLight
        ref={lightRef}
        position={[0, 0.6, 0]}
        color="#FF7838"
        intensity={glow * 3.5}
        distance={8}
        decay={1.8}
        castShadow={false}
      />
    </group>
  );
}
