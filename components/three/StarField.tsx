'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Renamed-in-spirit: this used to be a night star field. In daytime
 * mode it's a SunMotes field — dust particles drifting in sunbeams.
 * Same component name kept so WorldScene's import doesn't break;
 * same instanced-points approach for cheap GPU cost.
 *
 * Particles cluster lower in the scene (around 2–8m height) rather
 * than across a celestial sphere — dust is in the air you breathe,
 * not above the treeline. Slow upward drift with sideways wobble.
 */

interface StarFieldProps {
  /** Total particle count. Caller picks based on device tier. */
  count?: number;
  /** Volume radius — particles sit within this distance of origin. */
  radius?: number;
  /** Period seconds (unused in daytime — left for API compatibility). */
  periodSeconds?: number;
}

export function StarField({
  count = 2500,
  radius = 40,
}: StarFieldProps) {
  const ref = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const velRef = useRef<Float32Array | null>(null);

  // Generate initial positions within a wide, low cylindrical volume
  // (motes float at human height, not far up in the sky).
  const { positions, sizes, colors, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Wide horizontal spread, low vertical range
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * radius;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const y = 0.5 + Math.random() * 7;  // human-eye to mid-canopy

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Small variation — most motes are tiny, a few catch light
      const mag = Math.pow(Math.random(), 3);
      sizes[i] = 0.08 + mag * 0.7;

      // Warm white with occasional gold tint (sunlit dust catches warm light)
      const tint = Math.random();
      if (tint < 0.15) {
        // Warm gold mote
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.88;
        colors[i * 3 + 2] = 0.65;
      } else {
        // Plain warm white
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.97;
        colors[i * 3 + 2] = 0.92;
      }

      // Slow upward drift with subtle lateral velocity
      velocities[i * 3] = (Math.random() - 0.5) * 0.015;
      velocities[i * 3 + 1] = 0.02 + Math.random() * 0.04;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }
    return { positions, sizes, colors, velocities };
  }, [count, radius]);

  // Keep mutable copies so useFrame can integrate
  positionsRef.current = positions;
  velRef.current = velocities;

  useFrame((_state, delta) => {
    if (!ref.current) return;
    const geom = ref.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const vel = velRef.current!;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += vel[i * 3] * delta * 60;
      pos[i * 3 + 1] += vel[i * 3 + 1] * delta * 60;
      pos[i * 3 + 2] += vel[i * 3 + 2] * delta * 60;
      // Wrap when a mote rises past 9m — re-emit at the floor
      if (pos[i * 3 + 1] > 9) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.sqrt(Math.random()) * radius;
        pos[i * 3] = Math.cos(angle) * dist;
        pos[i * 3 + 1] = 0.5;
        pos[i * 3 + 2] = Math.sin(angle) * dist;
      }
    }
    posAttr.needsUpdate = true;
  });

  // Build the soft-circle sprite via canvas inside useEffect — never SSR.
  const [sprite, setSprite] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0.0, 'rgba(255,250,235,1)');
    grad.addColorStop(0.4, 'rgba(255,250,235,0.55)');
    grad.addColorStop(0.75, 'rgba(255,250,235,0.10)');
    grad.addColorStop(1.0, 'rgba(255,250,235,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    setSprite(new THREE.CanvasTexture(canvas));
  }, []);

  if (!sprite) return null;

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        sizeAttenuation
        map={sprite}
        alphaTest={0.001}
        transparent
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
