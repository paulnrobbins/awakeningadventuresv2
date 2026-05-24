'use client';

import { ReactNode, useEffect } from 'react';

/**
 * Client-side providers. Heavy libraries (Lenis, GSAP, Howler) are
 * dynamically imported inside the useEffect so any import-time
 * failure stays isolated.
 *
 * Sound preload is NOT called here — Howler stays dormant until the
 * user clicks the mute toggle. Loading sound files that don't exist
 * (404s) was triggering Howler's audio-pool-exhausted path which
 * cascaded into a TypeError that crashed the React tree.
 */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const [{ ensureGsap }, { initLenis, destroyLenis }] = await Promise.all([
          import('@/lib/gsap'),
          import('@/lib/lenis'),
        ]);

        ensureGsap();
        initLenis();

        cleanup = () => destroyLenis();
      } catch (err) {
        console.warn('[Providers] init failed — page renders without smooth scroll:', err);
      }
    })();

    return () => { cleanup?.(); };
  }, []);

  return <>{children}</>;
}
