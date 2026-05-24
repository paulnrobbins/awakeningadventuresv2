'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { attachKtx2 } from '@/lib/three';
import { WorldScene } from './WorldScene';
import { PostProcessing } from './PostProcessing';
import { WorldErrorBoundary } from './WorldErrorBoundary';

/**
 * Single full-bleed R3F Canvas hosting the inhabitable world.
 *
 * Daytime tune:
 *   • `alpha: true` so the DOM sky-gradient behind the canvas shows
 *     through wherever 3D geometry doesn't render. The earlier
 *     `alpha: false` was painting opaque black over the gradient.
 *   • `gl.setClearColor` to a paper-cream as a defense-in-depth in
 *     case alpha:true is overridden by a browser or driver quirk.
 *   • `scene.background` set to the same cream so any onscreen pixel
 *     not covered by geometry reads as warm haze, not void.
 */
export function WorldCanvas() {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  return (
    <div
      className="fixed inset-0 z-[var(--z-world)]"
      style={{ background: 'linear-gradient(180deg, #C8D4C0 0%, #EFEAD8 70%)' }}
    >
      <WorldErrorBoundary>
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
            outputColorSpace: THREE.SRGBColorSpace,
            powerPreference: 'high-performance',
            alpha: true,
          }}
          camera={{ position: [0, 1.4, 6], fov: 38, near: 0.1, far: 500 }}
          onCreated={({ gl, scene }) => {
            rendererRef.current = gl;
            attachKtx2(gl);
            // Paper-cream clear color so the canvas never paints black
            gl.setClearColor(new THREE.Color('#EFEAD8'), 1);
            // Scene background as a soft daytime sky tone — visible
            // anywhere the 3D world doesn't fully occlude
            scene.background = new THREE.Color('#D8DCC8');
          }}
          frameloop="always"
          shadows
        >
          <Suspense fallback={null}>
            <WorldErrorBoundary>
              <WorldScene />
            </WorldErrorBoundary>
            <WorldErrorBoundary>
              <PostProcessing />
            </WorldErrorBoundary>
          </Suspense>
        </Canvas>
      </WorldErrorBoundary>
    </div>
  );
}
