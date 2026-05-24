'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { Instance, Instances } from '@react-three/drei';

/**
 * Instanced tree trunks for the forest scenes. Cheap to render (one draw
 * call), enough variation to read as a real forest. Trunks lean slightly
 * by deterministic seed so the bank looks natural without random
 * re-shuffling on each render.
 *
 * Two banks per scene typically — a "near" bank ~5m from camera at trail
 * depth and a "far" bank ~25m for the horizon line.
 *
 * Lighting comes from the scene's main directional light + HDRI; trunks
 * are deliberately matte and dark so they read as silhouettes against
 * the sky.
 */

interface TreeBankProps {
  count?: number;
  /** Center of the bank in world space. */
  center?: [number, number, number];
  /** Total area dimensions (x, z). */
  spread?: [number, number];
  /** Trunk height range. */
  heightRange?: [number, number];
  /** Trunk radius range. */
  radiusRange?: [number, number];
  /** Random seed — keep two TreeBanks distinct. */
  seed?: number;
  /** Material color override. */
  color?: string;
}

function seededRandom(seed: number) {
  // Mulberry32 deterministic PRNG
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function TreeBank({
  count = 80,
  center = [0, 0, 0],
  spread = [40, 40],
  heightRange = [4, 9],
  radiusRange = [0.12, 0.28],
  seed = 1337,
  color = '#1A1A14',
}: TreeBankProps) {
  const trees = useMemo(() => {
    const rand = seededRandom(seed);
    const arr: { pos: [number, number, number]; rotZ: number; scale: number; height: number }[] = [];
    for (let i = 0; i < count; i++) {
      const x = center[0] + (rand() - 0.5) * spread[0];
      const z = center[2] + (rand() - 0.5) * spread[1];
      const height = heightRange[0] + rand() * (heightRange[1] - heightRange[0]);
      const radius = radiusRange[0] + rand() * (radiusRange[1] - radiusRange[0]);
      const tilt = (rand() - 0.5) * 0.08;
      arr.push({
        pos: [x, center[1] + height / 2 - 0.2, z],
        rotZ: tilt,
        scale: radius / 0.2,
        height,
      });
    }
    return arr;
  }, [count, center, spread, heightRange, radiusRange, seed]);

  return (
    <Instances limit={Math.max(count, 100)} range={count}>
      <cylinderGeometry args={[0.2, 0.25, 1, 6]} />
      <meshStandardMaterial color={color} roughness={0.92} metalness={0} />
      {trees.map((t, i) => (
        <Instance
          key={i}
          position={t.pos as [number, number, number]}
          rotation={[0, 0, t.rotZ]}
          scale={[t.scale, t.height, t.scale]}
        />
      ))}
    </Instances>
  );
}
