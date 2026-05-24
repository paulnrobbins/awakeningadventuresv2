'use client';

import { useEffect, useState } from 'react';

export type DeviceTier = 'low' | 'mid' | 'high';

/**
 * Coarse GPU tier detection. Mid-range mobile is the perf floor (60fps
 * is non-negotiable per Three Foundations). On detected-low devices we:
 *   - load lower-poly model variants (Phase 3 ships these in /public/models)
 *   - disable post-processing (bloom, grain, color grade)
 *   - cap the star field instance count
 *   - skip ambient particles entirely
 *
 * Detection uses navigator.hardwareConcurrency + devicePixelRatio + a
 * cheap WebGL renderer-name probe. Not perfect, but reliable enough to
 * keep the perf floor without shipping a full benchmark.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('mid');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        setTier('low');
        return;
      }

      const cores = navigator.hardwareConcurrency ?? 4;
      const dpr = window.devicePixelRatio ?? 1;

      let rendererHint: string | null = null;
      try {
        const canvas = document.createElement('canvas');
        const gl = (canvas.getContext('webgl2') ||
          canvas.getContext('webgl')) as WebGLRenderingContext | null;
        if (gl) {
          const dbg = gl.getExtension('WEBGL_debug_renderer_info');
          if (dbg) {
            rendererHint = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '').toLowerCase();
          }
        }
      } catch {
        /* SecurityError on some browsers — ignore. */
      }

      const isLowMobile = /android.*chrome|mobile.*safari/i.test(navigator.userAgent) && cores <= 4 && dpr < 2.5;
      const isDesktopClass = cores >= 8 && dpr >= 1.5 && rendererHint && /nvidia|amd|radeon|apple m\d/.test(rendererHint);

      if (isLowMobile) setTier('low');
      else if (isDesktopClass) setTier('high');
      else setTier('mid');
    } catch {
      // Any unexpected failure → mid tier is the safe default
      setTier('mid');
    }
  }, []);

  return tier;
}
