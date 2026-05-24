'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks the user's prefers-reduced-motion setting reactively.
 * Scene components query this and downgrade to static photo billboards
 * + faded labels when true. The world still exists, but doesn't move.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
