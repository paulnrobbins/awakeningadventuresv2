'use client';

import { Suspense } from 'react';
import { PhotoBillboard } from './PhotoBillboard';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { WorldErrorBoundary } from './WorldErrorBoundary';

/**
 * Welcome scene staging — two flat photo billboards (Anthony & Barb,
 * fire-pit detail). The FirePit + log seats moved to PropertyLayout
 * so they're always in the scene graph and visible throughout the
 * Lake→Welcome camera transition, rather than popping in only when
 * SceneWelcome's ScrollTrigger fires. Photo billboards stay here
 * because they're texture-heavy and only relevant when the camera
 * is close enough to read them.
 *
 * Each billboard is independently guarded so a missing image file
 * degrades silently.
 */
export function WelcomeStage() {
  const tier = useDeviceTier();
  const showPhotos = tier !== 'low';

  if (!showPhotos) return null;

  return (
    <group position={[-2, 0, -8]}>
      <WorldErrorBoundary>
        <Suspense fallback={null}>
          <PhotoBillboard
            src="/images/anthony-barb-welcome.jpg"
            position={[2.6, 1.6, -0.8]}
            width={2.6}
            rotationY={-Math.PI / 6}
            tilt={-0.04}
            shadowOpacity={0.6}
          />
        </Suspense>
      </WorldErrorBoundary>
      <WorldErrorBoundary>
        <Suspense fallback={null}>
          <PhotoBillboard
            src="/images/fire-pit.jpg"
            position={[-2.6, 1.4, -1.4]}
            width={2.2}
            rotationY={Math.PI / 5}
            tilt={-0.06}
            shadowOpacity={0.55}
          />
        </Suspense>
      </WorldErrorBoundary>
    </group>
  );
}
