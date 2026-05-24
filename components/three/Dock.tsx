'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Wooden dock — procedural. Six longitudinal planks decking, two rows
 * of vertical posts driven into the water, a small bench at the end,
 * and a mooring cleat. Sized roughly 8m long × 2m wide, sitting just
 * above the water line so the lake water shader's surface laps at
 * the support posts.
 *
 * Placed in world space along -Z from the lake-side shore so the
 * camera at the Lake scene keyframe looks toward the dock with the
 * pontoon moored at its end.
 */

interface DockProps {
  position?: [number, number, number];
  rotationY?: number;
  /** Length in meters (along local Z). */
  length?: number;
  /** Width in meters (along local X). */
  width?: number;
  /** Height of decking above the water plane. */
  deckHeight?: number;
}

export function Dock({
  position = [0, 0, 0],
  rotationY = 0,
  length = 8,
  width = 2.2,
  deckHeight = 0.45,
}: DockProps) {
  // Plank positions — six longitudinal planks across the width
  const planks = useMemo(() => {
    const out: number[] = [];
    const plankCount = 6;
    const plankWidth = width / plankCount;
    for (let i = 0; i < plankCount; i++) {
      out.push(-width / 2 + plankWidth * (i + 0.5));
    }
    return out;
  }, [width]);

  // Post positions — pairs running along the length on either side
  const postZs = useMemo(() => {
    const out: number[] = [];
    const postCount = 4;
    for (let i = 0; i < postCount; i++) {
      const t = i / (postCount - 1);
      out.push(-length / 2 + length * t);
    }
    return out;
  }, [length]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Decking planks */}
      {planks.map((x, i) => (
        <mesh
          key={`plank-${i}`}
          position={[x, deckHeight, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[width / planks.length - 0.02, 0.06, length]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#9A6F3D' : '#A07845'} roughness={0.86} />
        </mesh>
      ))}

      {/* Cross-stringers under the decking */}
      {postZs.map((z, i) => (
        <mesh key={`stringer-${i}`} position={[0, deckHeight - 0.08, z]}>
          <boxGeometry args={[width + 0.04, 0.08, 0.12]} />
          <meshStandardMaterial color="#6B4A2A" roughness={0.88} />
        </mesh>
      ))}

      {/* Support posts driven into the water — two per cross-stringer */}
      {postZs.map((z, i) => (
        <group key={`posts-${i}`}>
          <mesh position={[width / 2 + 0.03, deckHeight / 2 - 0.7, z]} castShadow>
            <cylinderGeometry args={[0.1, 0.12, deckHeight + 1.4, 8]} />
            <meshStandardMaterial color="#5A3D20" roughness={0.92} />
          </mesh>
          <mesh position={[-width / 2 - 0.03, deckHeight / 2 - 0.7, z]} castShadow>
            <cylinderGeometry args={[0.1, 0.12, deckHeight + 1.4, 8]} />
            <meshStandardMaterial color="#5A3D20" roughness={0.92} />
          </mesh>
        </group>
      ))}

      {/* Bench at the lakeside end — a single seat plank on two short posts */}
      <group position={[0, deckHeight, -length / 2 + 0.8]}>
        <mesh position={[width / 2 - 0.6, 0.22, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.44, 6]} />
          <meshStandardMaterial color="#6B4A2A" roughness={0.88} />
        </mesh>
        <mesh position={[-width / 2 + 0.6, 0.22, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.44, 6]} />
          <meshStandardMaterial color="#6B4A2A" roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.46, 0]} castShadow>
          <boxGeometry args={[width - 0.6, 0.06, 0.36]} />
          <meshStandardMaterial color="#8B6336" roughness={0.84} />
        </mesh>
      </group>

      {/* Mooring cleat at the very end of the dock */}
      <group position={[width / 2 - 0.25, deckHeight + 0.06, -length / 2 + 0.15]}>
        <mesh>
          <boxGeometry args={[0.16, 0.05, 0.34]} />
          <meshStandardMaterial color="#3A2818" roughness={0.5} metalness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
