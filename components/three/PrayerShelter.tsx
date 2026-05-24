'use client';

import * as THREE from 'three';
import { useMemo } from 'react';

/**
 * Prayer shelter — small open-sided wooden A-frame pavilion deep in
 * the forest. Anchored on Luke 6:12 per the property's snapshot. Two
 * benches inside facing each other, a small wooden cross at the front
 * gable. Sits in the trails area so visitors see it when the camera
 * descends to ground level.
 */
interface PrayerShelterProps {
  position?: [number, number, number];
  rotationY?: number;
}

export function PrayerShelter({
  position = [0, 0, 0],
  rotationY = 0,
}: PrayerShelterProps) {
  // Roof triangle shape
  const roofShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.6, 0);
    s.lineTo(1.6, 0);
    s.lineTo(0, 1.4);
    s.closePath();
    return s;
  }, []);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Wood platform floor */}
      <mesh position={[0, 0.06, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.4, 0.12, 2.6]} />
        <meshStandardMaterial color="#4A3220" roughness={0.88} />
      </mesh>

      {/* Four corner posts holding the roof */}
      {[
        [-1.6, 0, -1.2],
        [1.6, 0, -1.2],
        [-1.6, 0, 1.2],
        [1.6, 0, 1.2],
      ].map((p, i) => (
        <mesh key={`post-${i}`} position={[p[0], 1.2, p[2]]} castShadow>
          <cylinderGeometry args={[0.07, 0.08, 2.4, 8]} />
          <meshStandardMaterial color="#6B4A2A" roughness={0.85} />
        </mesh>
      ))}

      {/* Gable ends — triangular shapes at front and back */}
      <mesh position={[0, 2.4, 1.2]} castShadow>
        <shapeGeometry args={[roofShape]} />
        <meshStandardMaterial color="#7A5230" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 2.4, -1.2]} rotation={[0, Math.PI, 0]} castShadow>
        <shapeGeometry args={[roofShape]} />
        <meshStandardMaterial color="#7A5230" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* Sloped roof — two angled planes */}
      <mesh position={[-0.8, 3.0, 0]} rotation={[0, 0, Math.atan2(1.4, 1.6)]} castShadow>
        <boxGeometry args={[1.85, 0.08, 2.5]} />
        <meshStandardMaterial color="#3D2A18" roughness={0.85} />
      </mesh>
      <mesh position={[0.8, 3.0, 0]} rotation={[0, 0, -Math.atan2(1.4, 1.6)]} castShadow>
        <boxGeometry args={[1.85, 0.08, 2.5]} />
        <meshStandardMaterial color="#3D2A18" roughness={0.85} />
      </mesh>

      {/* Ridge beam */}
      <mesh position={[0, 3.75, 0]}>
        <boxGeometry args={[0.10, 0.08, 2.5]} />
        <meshStandardMaterial color="#5A3D20" roughness={0.85} />
      </mesh>

      {/* Small cross on the front gable */}
      <mesh position={[0, 3.0, 1.22]}>
        <boxGeometry args={[0.06, 0.36, 0.06]} />
        <meshStandardMaterial color="#3D2A18" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.10, 1.22]}>
        <boxGeometry args={[0.20, 0.06, 0.06]} />
        <meshStandardMaterial color="#3D2A18" roughness={0.7} />
      </mesh>

      {/* Two benches facing each other inside */}
      <mesh position={[0, 0.55, -0.7]} castShadow>
        <boxGeometry args={[2.6, 0.08, 0.36]} />
        <meshStandardMaterial color="#8B6336" roughness={0.85} />
      </mesh>
      {/* Bench legs */}
      <mesh position={[-1.0, 0.32, -0.7]}>
        <boxGeometry args={[0.08, 0.46, 0.36]} />
        <meshStandardMaterial color="#6B4A2A" roughness={0.85} />
      </mesh>
      <mesh position={[1.0, 0.32, -0.7]}>
        <boxGeometry args={[0.08, 0.46, 0.36]} />
        <meshStandardMaterial color="#6B4A2A" roughness={0.85} />
      </mesh>

      <mesh position={[0, 0.55, 0.7]} castShadow>
        <boxGeometry args={[2.6, 0.08, 0.36]} />
        <meshStandardMaterial color="#8B6336" roughness={0.85} />
      </mesh>
      <mesh position={[-1.0, 0.32, 0.7]}>
        <boxGeometry args={[0.08, 0.46, 0.36]} />
        <meshStandardMaterial color="#6B4A2A" roughness={0.85} />
      </mesh>
      <mesh position={[1.0, 0.32, 0.7]}>
        <boxGeometry args={[0.08, 0.46, 0.36]} />
        <meshStandardMaterial color="#6B4A2A" roughness={0.85} />
      </mesh>
    </group>
  );
}
