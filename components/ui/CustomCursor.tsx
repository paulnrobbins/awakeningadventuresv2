'use client';

import { useEffect, useRef } from 'react';
import { useTouchPrimary } from '@/hooks/useResponsive';

/**
 * Custom cursor — fire-amber dot with a cream-on-ink ring.
 *
 * Tuning notes:
 *   • Dot lerps near 1.0 so it tracks the actual mouse position almost
 *     instantly. The lerp is just enough to smooth out raw event jitter.
 *   • Ring lerps higher (0.55) than the original 0.32 — still trails
 *     for the magnetic feel but never reads as laggy.
 *   • Dropped mix-blend-difference — it made the cursor adapt to the
 *     background but also caused the cursor to blend invisibly when the
 *     backdrop was a similar tone. The new pattern uses an opaque dot +
 *     ring with high-contrast colors that work against both paper-cream
 *     and deep-forest backgrounds.
 *   • Dot is bigger (10px instead of 6px) and has a thin white outline
 *     so it pops against any 3D world color.
 *
 * Disabled on touch devices entirely. Disabled in reduced-motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const touch = useTouchPrimary();

  useEffect(() => {
    if (touch) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Hide the native cursor on supporting browsers
    document.documentElement.style.cursor = 'none';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let pressed = false;

    const handleMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const handleDown = () => { pressed = true; };
    const handleUp = () => { pressed = false; };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointerup', handleUp);

    let rafId = 0;
    const tick = () => {
      // Dot snaps within a frame — virtually no lag, just smooths jitter
      dotX += (mouseX - dotX) * 0.85;
      dotY += (mouseY - dotY) * 0.85;
      // Ring follows tightly — small trail for the magnetic feel
      ringX += (mouseX - ringX) * 0.55;
      ringY += (mouseY - ringY) * 0.55;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX - 5}px, ${dotY - 5}px, 0) scale(${pressed ? 0.7 : 1})`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0) scale(${pressed ? 0.8 : 1})`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      cancelAnimationFrame(rafId);
      document.documentElement.style.cursor = '';
    };
  }, [touch]);

  if (touch) return null;

  return (
    <>
      {/* Ring — solid forest-ink border with a soft amber inner glow.
          Always visible against light AND dark backgrounds. */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-10 h-10 rounded-full z-[100]"
        style={{
          willChange: 'transform',
          border: '2px solid rgba(31, 46, 31, 0.55)',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.7) inset, 0 0 12px rgba(199, 122, 58, 0.35)',
          transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
      {/* Dot — opaque fire-amber with a thin white outline so it pops
          on any color. Larger than before (10px). */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-2.5 h-2.5 rounded-full z-[101]"
        style={{
          willChange: 'transform',
          background: '#C77A3A',
          boxShadow:
            '0 0 0 1.5px rgba(255,255,255,0.95), 0 0 8px rgba(31,46,31,0.45)',
          transition: 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </>
  );
}
