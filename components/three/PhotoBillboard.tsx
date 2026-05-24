'use client';

import { useTexture } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Photo Billboard — Pattern A from Part 1 of the system doc.
 *
 * The photo lives in 3D space as a flat, slightly-tilted plane with
 * subtle parallax depth, soft shadow, and gentle hover-tilt. The photo
 * IS a 3D object, treated with the same lighting as the rest of the
 * scene. A grain overlay applied at post-process time unifies the
 * texture so the photo never looks like clipart in a video game.
 *
 * Position + tilt parameters let the same component place photos at
 * arbitrary locations across the property scene without bespoke code.
 */

interface PhotoBillboardProps {
  /** Path to the image inside /public/images. */
  src: string;
  /** World position. */
  position: [number, number, number];
  /** Width in meters. Height computed from texture aspect ratio. */
  width: number;
  /** Y-axis rotation in radians (heading). */
  rotationY?: number;
  /** Tilt forward/back in radians. */
  tilt?: number;
  /** Soft-shadow opacity 0..1. */
  shadowOpacity?: number;
  /** Whether to drift slightly on idle. */
  drift?: boolean;
}

export function PhotoBillboard({
  src,
  position,
  width,
  rotationY = 0,
  tilt = -0.06,
  shadowOpacity = 0.55,
  drift = true,
}: PhotoBillboardProps) {
  const tex = useTexture(src);
  const groupRef = useRef<THREE.Group>(null);

  // Compute plane height from texture aspect once loaded
  const aspect = useMemo(() => {
    const img = tex.image as HTMLImageElement | undefined;
    if (!img?.naturalWidth) return 1.5;
    return img.naturalHeight / img.naturalWidth;
  }, [tex]);

  const height = width * aspect;

  // Optional idle drift — micro yaw movement so the photo plane breathes
  useFrame(({ clock }) => {
    if (!drift || !groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = rotationY + Math.sin(t * 0.18) * 0.012;
  });

  return (
    <group ref={groupRef} position={position} rotation={[tilt, rotationY, 0]}>
      {/* Soft drop shadow behind the photo */}
      <mesh position={[0.06, -0.06, -0.04]}>
        <planeGeometry args={[width * 1.04, height * 1.04]} />
        <meshBasicMaterial color="#000000" transparent opacity={shadowOpacity} depthWrite={false} />
      </mesh>

      {/* The photo itself */}
      <mesh castShadow={false} receiveShadow={false}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={tex} toneMapped={true} />
      </mesh>

      {/* Subtle bezel/frame — barely visible, evokes "thing in space" not "image" */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[width + 0.04, height + 0.04]} />
        <meshBasicMaterial color="#1A1410" side={THREE.DoubleSide} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
