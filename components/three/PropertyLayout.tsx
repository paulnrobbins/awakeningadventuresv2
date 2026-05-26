'use client';

import { Suspense } from 'react';
import { StargazerCabin } from './StargazerCabin';
import { Treehouse } from './Treehouse';
import { Tent } from './Tent';
import { PerspectivePlatform } from './PerspectivePlatform';
import { ShowerHouse } from './ShowerHouse';
import { PhotoBillboard } from './PhotoBillboard';
import { Firefly } from './Firefly';
import { FirePit } from './FirePit';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { WorldErrorBoundary } from './WorldErrorBoundary';

/**
 * The whole 42-acre layout, in proper relative position to the
 * Stargazer at origin.
 *
 * Photo billboards are wrapped in their own Suspense + ErrorBoundary so
 * a missing image file degrades silently — the rest of the layout still
 * renders.
 */
export function PropertyLayout() {
  const tier = useDeviceTier();
  const renderPhotos = tier !== 'low';

  return (
    <group>
      {/* Accommodations spread out so each Stay-walk camera shot frames
          one building cleanly without others stacked behind it.
          Layout (X = east/west, Z = into property, all in meters):
            Stargazer at origin (the anchor)
            Driftwood deep back-right canopy
            Homestead far left in the prairie clearing
            Serene Seven way back-left, deeper prairie pitch
            Shower house far right, near trail entry
            Perspective platform far back ridge silhouette */}
      <StargazerCabin position={[0, 0, 0]} rotationY={-Math.PI / 8} interiorGlow={0.15} />

      <Treehouse position={[22, 0, -16]} scale={1} glowIntensity={0.08} />

      <Tent
        position={[-22, 0, -6]}
        rotationY={Math.PI / 6}
        hasStove
        glowIntensity={0.08}
        canvasColor="#E8D9B0"
      />

      <Tent
        position={[-26, 0, -24]}
        rotationY={-Math.PI / 8}
        hasStove={false}
        glowIntensity={0.05}
        canvasColor="#F2E6C5"
      />

      <PerspectivePlatform position={[30, 1.2, -38]} rotationY={Math.PI} />

      <ShowerHouse position={[20, 0, 8]} rotationY={-Math.PI / 4} glowIntensity={0.15} />

      {/* Welcome fire pit — moved here from WelcomeStage so it's
          ALWAYS mounted. Previously the fire mounted only when
          SceneWelcome's ScrollTrigger fired, which meant the camera's
          continuous lerp from Lake to Welcome had nothing to look at
          until the very end of the transition — fire appeared
          "out of nowhere" at scroll ~topLake+150. Now it's a
          permanent property feature: visible as a tiny distant glow
          during aerial scenes, growing in the frame as the camera
          approaches Welcome. The flickering point light is small
          (distance=9, intensity ~1.6) so it doesn't blow out other
          scenes. PhotoBillboards stay in WelcomeStage — they're
          texture-heavy and only relevant when camera is close. */}
      <group position={[-2, 0, -8]}>
        <FirePit position={[0, 0, 0]} glow={1.1} />
        {[
          { p: [-0.9, 0.18, 1.0] as [number, number, number], r: 0.6 },
          { p: [0.8, 0.18, 1.0] as [number, number, number], r: -0.4 },
          { p: [0, 0.18, -1.1] as [number, number, number], r: 0 },
        ].map((log, i) => (
          <mesh key={i} position={log.p} rotation={[0, log.r, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.13, 1.2, 8]} />
            <meshStandardMaterial color="#3A2818" roughness={0.92} />
          </mesh>
        ))}
      </group>

      {/* Photo billboards — Pattern A. Each wrapped individually so one
          missing image doesn't take down the other. */}
      {renderPhotos && (
        <>
          <WorldErrorBoundary>
            <Suspense fallback={null}>
              <PhotoBillboard
                src="/images/grounds-trail.jpg"
                position={[-4, 2.6, -8]}
                width={3.6}
                rotationY={Math.PI / 9}
                tilt={-0.04}
              />
            </Suspense>
          </WorldErrorBoundary>
          <WorldErrorBoundary>
            <Suspense fallback={null}>
              <PhotoBillboard
                src="/images/anthony-barb-welcome.jpg"
                position={[5, 2.4, -10]}
                width={3.0}
                rotationY={-Math.PI / 6}
                tilt={-0.05}
              />
            </Suspense>
          </WorldErrorBoundary>
        </>
      )}

      {tier === 'high' && (
        <>
          <Firefly phase={0.15} origin={[-7, 1.4, -4]} period={29} pathWidth={5} />
          <Firefly phase={0.55} origin={[-11, 1.6, -8]} period={34} pathWidth={6} />
          <Firefly phase={0.8} origin={[6, 1.8, -5]} period={31} pathWidth={4} />
        </>
      )}
    </group>
  );
}
