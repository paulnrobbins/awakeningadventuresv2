'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * One firefly that arcs across the scene every ~25 seconds. Ambient-life
 * pattern (World-Building Pattern 2) — the world feels alive even when
 * the visitor isn't interacting.
 *
 * Multiple instances can be placed at different phase offsets to fill
 * the prairie scene in Phase 4a.
 */

interface FireflyProps {
  /** Phase offset 0..1 — stagger multiple instances. */
  phase?: number;
  /** Path width — how far the firefly travels along X. */
  pathWidth?: number;
  /** Path height — vertical range. */
  pathHeight?: number;
  /** Cycle period in seconds. */
  period?: number;
  /** Center of the arc. */
  origin?: [number, number, number];
}

export function Firefly({
  phase = 0,
  pathWidth = 8,
  pathHeight = 1.4,
  period = 25,
  origin = [0, 1.6, -2],
}: FireflyProps) {
  const ref = useRef<THREE.PointLight>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Precompute a noisy Bezier-like path
  const noise = useMemo(() => Array.from({ length: 16 }, () => Math.random() - 0.5), []);

  useFrame(({ clock }) => {
    if (!ref.current || !meshRef.current) return;
    const t = ((clock.getElapsedTime() / period) + phase) % 1;
    // Sigmoid easing so the firefly accelerates in middle, slows at edges
    const eased = 1 / (1 + Math.exp(-12 * (t - 0.5)));
    const x = origin[0] + (eased - 0.5) * pathWidth;
    const wobble = Math.sin(t * Math.PI * 8 + noise[0] * 6) * 0.3;
    const y = origin[1] + Math.sin(t * Math.PI) * pathHeight + wobble;
    const z = origin[2] + Math.sin(t * Math.PI * 2 + noise[3] * 4) * 0.6;
    ref.current.position.set(x, y, z);
    meshRef.current.position.set(x, y, z);

    // Blink slow on, sharper off — like real firefly bioluminescence
    const blink = Math.max(0, Math.sin(t * Math.PI * 6 - 0.3));
    ref.current.intensity = blink * 0.8;
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = blink;
  });

  return (
    <>
      <pointLight
        ref={ref}
        color="#E8C77A"
        intensity={0.0}
        distance={3}
        decay={2}
      />
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#FFE6A8" transparent opacity={0} toneMapped={false} />
      </mesh>
    </>
  );
}
