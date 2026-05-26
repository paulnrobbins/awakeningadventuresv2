'use client';

import { useEffect, useState } from 'react';

/**
 * Heuristic 3D-viability probe. Returns:
 *   • `null`  — still probing (during SSR + first paint)
 *   • `true`  — device looks healthy enough to mount the R3F world
 *   • `false` — device will likely crash or render unusably; render the
 *                DOM-only fallback instead
 *
 * The probe is INTENTIONALLY CONSERVATIVE about saying "false" so modern
 * devices still get the world. Only the strongly-suspicious cases bail.
 *
 * Why this exists: an actual visitor on an older Android reported the
 * page "loads then shuts down" — classic WebGL context-loss / OOM crash
 * pattern. The Three Foundations principle says 60fps on mid-range
 * mobile is the floor; below that floor, the right move is to NOT
 * mount the world rather than ship a stuttering crash-prone experience.
 *
 * Checks (any one failure → return false):
 *   1. No WebGL context at all (browser doesn't support it)
 *   2. Software renderer detected (SwiftShader / ANGLE software / Mesa
 *      software / llvmpipe — these signal "no real GPU" and crash within
 *      seconds of mounting a complex scene)
 *   3. `MAX_TEXTURE_SIZE` < 4096 — older mobile GPUs that can't even
 *      handle a 2K HDRI
 *   4. `navigator.deviceMemory` < 2 (GB)  — typical for cheap Androids
 *      that get killed by the OOM-killer when the R3F runtime parses
 *   5. Older Android Chrome — UA matches `Android` AND Chrome version
 *      can be parsed AND major < 90. Pre-90 Chrome on Android predates
 *      a chunk of WebGL stability fixes
 *   6. Android + 4-or-fewer cores combined — pattern matches the
 *      crashy-on-load device class
 *
 * Tier-list separation: `useDeviceTier()` already returns 'low' for many
 * of these devices and reduces visual complexity. `useSupports3D()` is
 * the harder bail — it removes the Canvas entirely. Both can coexist:
 * mid-range mobile gets the world at low tier; pre-2018 Android gets no
 * Canvas at all.
 */
export function useSupports3D(): boolean | null {
  const [supports, setSupports] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // 1. WebGL context probe
      const canvas = document.createElement('canvas');
      const gl =
        (canvas.getContext('webgl2') as WebGLRenderingContext | null) ||
        (canvas.getContext('webgl') as WebGLRenderingContext | null) ||
        (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

      if (!gl) {
        setSupports(false);
        return;
      }

      // 2. Software-renderer probe
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      let rendererName = '';
      if (dbg) {
        try {
          rendererName = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '').toLowerCase();
        } catch {
          rendererName = '';
        }
      }
      const isSoftware =
        rendererName.includes('swiftshader') ||
        rendererName.includes('llvmpipe') ||
        rendererName.includes('software') ||
        (rendererName.includes('angle') && rendererName.includes('software'));
      if (isSoftware) {
        setSupports(false);
        return;
      }

      // 3. Max-texture-size probe — 2K HDRI = 2048, scene textures up to
      // 2048. A device that can't allocate a 4K texture won't survive
      // the post-processing pipeline either.
      const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
      if (typeof maxTex === 'number' && maxTex < 4096) {
        setSupports(false);
        return;
      }

      // 4. Device memory probe (Chrome only — undefined on iOS Safari etc.)
      const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      if (typeof mem === 'number' && mem < 2) {
        setSupports(false);
        return;
      }

      // 5-6. Android heuristics
      const ua = navigator.userAgent || '';
      const isAndroid = /Android/i.test(ua);
      if (isAndroid) {
        // Chrome version parse — works for both Chrome and Chromium-based
        // Android browsers
        const chromeMatch = ua.match(/Chrome\/(\d+)/);
        const chromeMajor = chromeMatch ? parseInt(chromeMatch[1], 10) : null;
        if (chromeMajor !== null && chromeMajor < 90) {
          setSupports(false);
          return;
        }

        // Low-core Android — pattern matches the crashy phone class
        const cores = navigator.hardwareConcurrency ?? 4;
        if (cores <= 4) {
          // Combined with low DPR, this is almost certainly a cheap
          // Android that will OOM-crash. High-DPR phones with 4 cores
          // (e.g. some mid-range) get a pass.
          const dpr = window.devicePixelRatio ?? 1;
          if (dpr < 2) {
            setSupports(false);
            return;
          }
        }
      }

      // Cleanup — release the probe context so we don't hold a slot
      const loseCtx = gl.getExtension('WEBGL_lose_context');
      loseCtx?.loseContext?.();

      setSupports(true);
    } catch {
      // Any thrown error in the probe itself signals a sketchy browser —
      // err on the side of NOT mounting the world.
      setSupports(false);
    }
  }, []);

  return supports;
}
