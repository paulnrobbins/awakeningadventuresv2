'use client';

import { useEffect, useRef, useState } from 'react';
import { getLenis } from '@/lib/lenis';

/**
 * Returns a 0..1 progress value reflecting how far the visitor has
 * scrolled through the entire document. Driven by Lenis so it stays
 * in sync with the smooth-scroll lerp.
 *
 * Pinned scene-level progress is handled by GSAP ScrollTrigger inside
 * each Scene component — this hook is for global page-level effects
 * like the loader gate fade and the HDRI environment swap.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const tickedRef = useRef(false);

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;

    const handler = ({ progress: p }: { progress: number }) => {
      // Avoid setState every frame — only when value actually moves.
      // Lenis publishes a smoothed progress so we round to 3 dp.
      const next = Math.round(p * 1000) / 1000;
      setProgress((prev) => (prev === next ? prev : next));
      tickedRef.current = true;
    };

    lenis.on('scroll', handler);
    return () => {
      lenis.off('scroll', handler);
    };
  }, []);

  return progress;
}
