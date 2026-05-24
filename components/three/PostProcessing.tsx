'use client';

import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useDeviceTier } from '@/hooks/useDeviceTier';

/**
 * Daytime post-processing — minimal.
 *
 * Bloom held low (bright scenes don't need much). Subtle multiplicative
 * grain for organic texture. NO vignette — a dark vignette on a bright
 * scene pulls the corners back toward night and undoes the whole
 * daytime feel.
 *
 * Disabled entirely on low-tier.
 */
export function PostProcessing() {
  const tier = useDeviceTier();
  if (tier === 'low') return null;

  return (
    <EffectComposer>
      <Bloom
        intensity={0.28}
        luminanceThreshold={0.82}
        luminanceSmoothing={0.22}
      />
      <Noise
        opacity={0.025}
        blendFunction={BlendFunction.MULTIPLY}
      />
    </EffectComposer>
  );
}
