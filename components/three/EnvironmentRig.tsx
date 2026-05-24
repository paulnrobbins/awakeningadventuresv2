'use client';

import { Environment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { hdriUrl } from '@/lib/three';
import { SCENES, type SceneConfig } from '@/content/scenes';
import { clamp } from '@/lib/utils';
import { WorldErrorBoundary } from './WorldErrorBoundary';

/**
 * Drives scene-level lighting & fog from global scroll progress.
 * Daytime build: warm ambient + a sun-color directional from the
 * south-east, both bright enough to read as real-world midday.
 * Fog colors come from each scene's config and are warm paper or
 * sage tints rather than night-black.
 */
interface EnvironmentRigProps {
  progress: number;
}

export function EnvironmentRig({ progress }: EnvironmentRigProps) {
  const { scene } = useThree();

  const activeScene: SceneConfig = useMemo(() => {
    const idx = clamp(Math.floor(progress * SCENES.length), 0, SCENES.length - 1);
    return SCENES[idx];
  }, [progress]);

  useEffect(() => {
    const color = new THREE.Color(activeScene.fog);
    scene.fog = new THREE.Fog(color, activeScene.fogNear, activeScene.fogFar);
    // Per-scene sky tint — keeps the daytime feel and lets fog blend
    // smoothly into the visible horizon. WorldCanvas sets a default;
    // each scene refines it.
    scene.background = new THREE.Color(activeScene.fog);
  }, [scene, activeScene]);

  return (
    <>
      {/* Bright warm ambient — fills the shadow side of every object */}
      <ambientLight intensity={0.55} color="#FFF6E0" />

      {/* Sun key light — slight east, slight south, warm color */}
      <directionalLight
        position={[14, 22, 10]}
        intensity={2.2}
        color="#FFE9B8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={60}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
      />

      {/* Subtle sky bounce — cool blue from above to anchor it as outdoors */}
      <hemisphereLight args={['#BFD2DF', '#5E6F4A', 0.45]} />

      {/* HDRI environment — daytime captures from Poly Haven. Errors
          silently if the .hdr file isn't dropped in yet. */}
      <WorldErrorBoundary>
        <Suspense fallback={null}>
          <Environment
            files={hdriUrl(activeScene.hdri)}
            background={false}
            environmentIntensity={0.85}
          />
        </Suspense>
      </WorldErrorBoundary>
    </>
  );
}
