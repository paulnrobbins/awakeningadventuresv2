'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Scene 0 — Loading as Theater.
 *
 * Originally used drei's useProgress for real asset progress. Reverted
 * to a time-based gate for production stability — drei's useProgress
 * pulls in the Three.js DefaultLoadingManager which has caused
 * client-side crashes in certain Next.js production builds.
 *
 * The gate dwells ~1.6s — long enough to register as intentional,
 * short enough not to annoy. The amber line fades in at 30% through
 * the dwell, the gate lifts at the end.
 */
const DWELL_MS = 1600;
const HEADLINE_AT = 0.3;

export function PreloadGate() {
  const [hidden, setHidden] = useState(false);
  const [showHeadline, setShowHeadline] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const headlineTimer = setTimeout(() => setShowHeadline(true), DWELL_MS * HEADLINE_AT);
    const hideTimer = setTimeout(() => setHidden(true), DWELL_MS);

    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(100, (elapsed / DWELL_MS) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      clearTimeout(headlineTimer);
      clearTimeout(hideTimer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden={hidden}
      role="status"
      aria-live="polite"
      className={cn(
        'fixed inset-0 z-[var(--z-loader)] bg-night',
        'flex flex-col items-center justify-center',
        'transition-opacity duration-[900ms] ease-cinematic',
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
    >
      <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-3 eyebrow text-cream/70">
        <span>{Math.min(99, Math.round(progress)).toString().padStart(2, '0')}</span>
        <div className="w-24 h-px bg-cream/15 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-amber"
            style={{ width: `${Math.min(100, progress)}%`, transition: 'width 200ms linear' }}
          />
        </div>
      </div>

      <p
        className={cn(
          'font-display text-display text-amber max-w-[20ch] text-center px-6',
          'transition-opacity duration-1000 ease-cinematic',
          showHeadline ? 'opacity-100' : 'opacity-0',
        )}
      >
        The forest is awake.
      </p>

      <span className="sr-only">Loading</span>
    </div>
  );
}
