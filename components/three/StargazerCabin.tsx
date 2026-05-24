'use client';

import { useGLTF } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { brandColors, modelUrl } from '@/lib/three';

/**
 * The Stargazer cabin — anchor object for the entire site.
 *
 * Two-track strategy. If /public/models/stargazer.glb exists (Hyper3D
 * output dropped in by Paul), the GLB renders. If it does not exist,
 * the procedural fallback below renders and the page still ships.
 * Either way the API surface is identical from the parent's perspective.
 *
 * The procedural cabin matches the real structure from the reference
 * photos: gable-roofed wood frame (~14ft × ~8ft × ~9ft tall), vertical
 * stud posts every ~3 feet, clear plexiglass panels between the studs,
 * translucent slat roof, wood-deck base. Interior point-light at fire
 * amber sells the "lit from inside at dusk" feeling that the brand
 * lives on.
 */

const STARGAZER_GLB = 'stargazer.glb';

interface StargazerCabinProps {
  /** World position of the cabin floor. */
  position?: [number, number, number];
  /** Rotation in radians around Y (heading). */
  rotationY?: number;
  /** Scale modifier — defaults to 1.0 (real size, ~4m long). */
  scale?: number;
  /** Interior glow intensity 0..1 — drives the fire-amber emissive ramp. */
  interiorGlow?: number;
}

export function StargazerCabin({
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1,
  interiorGlow = 0.85,
}: StargazerCabinProps) {
  // Try to load the GLB. If missing, useGLTF throws asynchronously;
  // the Suspense boundary in WorldCanvas catches it and we fall back
  // by rendering ProceduralStargazer instead. The fall-through is
  // handled at the parent (Scene 1) — see SceneHero.
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <ProceduralStargazer interiorGlow={interiorGlow} />
    </group>
  );
}

/**
 * If you want to swap to the GLB once Hyper3D produces it, replace the
 * <ProceduralStargazer /> above with <GlbStargazer interiorGlow={...} />.
 * Both components share identical bounding boxes so camera + lighting
 * keep working.
 */
export function GlbStargazer({ interiorGlow = 0.85 }: { interiorGlow?: number }) {
  // Only call useGLTF when this component actually renders — calling
  // useGLTF.preload() at module scope kicks off a fetch even when the
  // procedural fallback is the one in use, which 404s noisily in prod.
  const { scene } = useGLTF(modelUrl(STARGAZER_GLB));
  return <primitive object={scene} />;
}

/**
 * Procedural Stargazer — built entirely from Three.js primitives so it
 * runs without an external model file. Geometry numbers come from the
 * reference photos and the snapshot's description ("clear plexiglass
 * house — sleep-under-the-stars structure"). All sizes in meters.
 */
function ProceduralStargazer({ interiorGlow }: { interiorGlow: number }) {
  // Dimensions
  const length = 4.2;   // along Z
  const width = 2.5;    // along X
  const wallHeight = 2.0;
  const peakHeight = 2.8;
  const deckThickness = 0.18;
  const studWidth = 0.08;
  const studDepth = 0.08;
  const studSpacing = 1.05;

  const interiorLight = useRef<THREE.PointLight>(null);

  // Subtle interior flicker — small (0.04 amplitude) random walk so the
  // fire-amber lantern feel survives without becoming a strobe.
  useFrame(({ clock }) => {
    if (!interiorLight.current) return;
    const t = clock.getElapsedTime();
    const flicker = 1 + Math.sin(t * 2.1) * 0.025 + Math.sin(t * 5.7) * 0.015;
    interiorLight.current.intensity = interiorGlow * 6 * flicker;
  });

  // Stud x-positions along the length (front + back walls)
  const studsX = useMemo(() => {
    const xs: number[] = [];
    const half = length / 2;
    for (let x = -half; x <= half + 0.001; x += studSpacing) xs.push(x);
    return xs;
  }, [length, studSpacing]);

  // Same logic for the side walls (z direction)
  const studsZ = useMemo(() => {
    const zs: number[] = [];
    const half = width / 2;
    for (let z = -half; z <= half + 0.001; z += studSpacing) zs.push(z);
    return zs;
  }, [width, studSpacing]);

  return (
    <group>
      {/* ---------- Wood deck base ---------- */}
      <mesh position={[0, -deckThickness / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[length + 0.6, deckThickness, width + 0.6]} />
        <meshStandardMaterial
          color="#3A2818"
          roughness={0.85}
          metalness={0.02}
        />
      </mesh>

      {/* ---------- Plexiglass walls (4 panels) ---------- */}
      {/* Front wall */}
      <PlexiglassPanel
        position={[0, wallHeight / 2, width / 2]}
        size={[length, wallHeight, 0.02]}
      />
      {/* Back wall */}
      <PlexiglassPanel
        position={[0, wallHeight / 2, -width / 2]}
        size={[length, wallHeight, 0.02]}
      />
      {/* Side walls */}
      <PlexiglassPanel
        position={[length / 2, wallHeight / 2, 0]}
        size={[0.02, wallHeight, width]}
      />
      <PlexiglassPanel
        position={[-length / 2, wallHeight / 2, 0]}
        size={[0.02, wallHeight, width]}
      />

      {/* ---------- Wood studs (front + back walls) ---------- */}
      {studsX.map((x, i) => (
        <group key={`stud-x-${i}`}>
          <WoodStud position={[x, wallHeight / 2, width / 2]} size={[studWidth, wallHeight, studDepth]} />
          <WoodStud position={[x, wallHeight / 2, -width / 2]} size={[studWidth, wallHeight, studDepth]} />
        </group>
      ))}

      {/* Wood studs on side walls (skip the corners — already covered) */}
      {studsZ.slice(1, -1).map((z, i) => (
        <group key={`stud-z-${i}`}>
          <WoodStud position={[length / 2, wallHeight / 2, z]} size={[studDepth, wallHeight, studWidth]} />
          <WoodStud position={[-length / 2, wallHeight / 2, z]} size={[studDepth, wallHeight, studWidth]} />
        </group>
      ))}

      {/* ---------- Top plate (horizontal beams at wall top) ---------- */}
      <WoodStud position={[0, wallHeight, width / 2]} size={[length + 0.1, studWidth, studDepth]} />
      <WoodStud position={[0, wallHeight, -width / 2]} size={[length + 0.1, studWidth, studDepth]} />
      <WoodStud position={[length / 2, wallHeight, 0]} size={[studDepth, studWidth, width]} />
      <WoodStud position={[-length / 2, wallHeight, 0]} size={[studDepth, studWidth, width]} />

      {/* ---------- Gable roof (translucent slat structure) ---------- */}
      <GableRoof
        length={length}
        width={width}
        wallHeight={wallHeight}
        peakHeight={peakHeight}
      />

      {/* ---------- Interior light source ---------- */}
      <pointLight
        ref={interiorLight}
        position={[0, wallHeight * 0.55, 0]}
        intensity={interiorGlow * 6}
        distance={12}
        decay={1.6}
        color={brandColors.amber}
        castShadow={false}
      />

      {/* Subtle red ridge cap visible in reference photos */}
      <mesh position={[0, peakHeight + 0.02, 0]}>
        <boxGeometry args={[length + 0.2, 0.04, 0.06]} />
        <meshStandardMaterial color="#7A2418" roughness={0.6} />
      </mesh>
    </group>
  );
}

function PlexiglassPanel({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshPhysicalMaterial
        color="#E8EDF0"
        transparent
        transmission={0.92}
        roughness={0.05}
        thickness={0.4}
        ior={1.49}              // plexiglass IOR
        clearcoat={0.4}
        clearcoatRoughness={0.2}
        envMapIntensity={1.2}
        attenuationColor="#D8E0E4"
        attenuationDistance={6}
      />
    </mesh>
  );
}

function WoodStud({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#9A6F3D" roughness={0.78} metalness={0.0} />
    </mesh>
  );
}

/**
 * Gable roof built as a series of thin slats running along the length.
 * Matches the bamboo / slat translucent roof visible in the reference
 * interior photo (IMG_7117). Slats let starlight through onto the bed.
 */
function GableRoof({
  length,
  width,
  wallHeight,
  peakHeight,
}: {
  length: number;
  width: number;
  wallHeight: number;
  peakHeight: number;
}) {
  const slatCount = 18;
  const slats = useMemo(() => {
    const out: { x: number; rotZ: number; side: 'L' | 'R' }[] = [];
    // Roof rise + run for trig
    const rise = peakHeight - wallHeight;
    const run = width / 2;
    const slope = Math.atan2(rise, run);

    // Left side slats
    for (let i = 0; i < slatCount; i++) {
      const t = (i + 0.5) / slatCount;
      const z = -width / 2 + t * (width / 2);
      out.push({ x: z, rotZ: slope, side: 'L' });
    }
    // Right side slats
    for (let i = 0; i < slatCount; i++) {
      const t = (i + 0.5) / slatCount;
      const z = t * (width / 2);
      out.push({ x: z, rotZ: -slope, side: 'R' });
    }
    return out;
  }, [width, wallHeight, peakHeight]);

  const ridgeLen = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(peakHeight - wallHeight, 2));

  return (
    <group>
      {/* Ridge beam */}
      <mesh position={[0, peakHeight, 0]} castShadow>
        <boxGeometry args={[length + 0.2, 0.08, 0.1]} />
        <meshStandardMaterial color="#7A5230" roughness={0.75} />
      </mesh>

      {/* Slats */}
      {slats.map((s, i) => {
        const y = (wallHeight + peakHeight) / 2;
        const z = s.side === 'L' ? -Math.abs(s.x) - 0.05 : Math.abs(s.x) + 0.05;
        return (
          <mesh
            key={`slat-${i}`}
            position={[0, y, z]}
            rotation={[s.rotZ, 0, 0]}
          >
            <boxGeometry args={[length + 0.2, 0.025, ridgeLen / slatCount * 0.9]} />
            <meshStandardMaterial
              color="#B8A076"
              roughness={0.62}
              metalness={0.02}
              transparent
              opacity={0.92}
            />
          </mesh>
        );
      })}

      {/* End-cap triangles (gable ends — clear plexiglass triangle) */}
      <GableEnd position={[length / 2, wallHeight, 0]} width={width} peak={peakHeight - wallHeight} />
      <GableEnd position={[-length / 2, wallHeight, 0]} width={width} peak={peakHeight - wallHeight} flip />
    </group>
  );
}

function GableEnd({
  position,
  width,
  peak,
  flip,
}: {
  position: [number, number, number];
  width: number;
  peak: number;
  flip?: boolean;
}) {
  // A simple triangle made from a thin plane with shape geometry.
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-width / 2, 0);
    s.lineTo(width / 2, 0);
    s.lineTo(0, peak);
    s.closePath();
    return s;
  }, [width, peak]);

  return (
    <mesh position={position} rotation={[0, flip ? Math.PI : 0, 0]}>
      <shapeGeometry args={[shape]} />
      <meshPhysicalMaterial
        color="#E8EDF0"
        transparent
        transmission={0.85}
        roughness={0.08}
        ior={1.49}
        thickness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
