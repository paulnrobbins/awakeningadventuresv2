'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

/**
 * Scene 1 — Arrival at the Stargazer (hero).
 *
 * Hero choreography per the Phase 1 brief:
 *   • Tagline reveals in two beats — "Because God" at 1.0s, the rest at 1.6s
 *   • Sub-headline fades up at 2.0s
 *   • Eyebrow holds from the start
 *   • Total entrance ≈ 2.4 seconds, then quiets
 *
 * Reduced-motion users get the final state immediately — no animation.
 */
export function SceneHero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;
    const root = ref.current;

    if (reduced) {
      gsap.set(root.querySelectorAll('[data-hero-anim]'), { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('[data-hero-anim="eyebrow"]', { opacity: 0, y: 12, duration: 0.9, delay: 0.3 })
      .from('[data-hero-anim="line1"]',   { opacity: 0, y: 36, duration: 1.1 }, '-=0.6')
      .from('[data-hero-anim="line2"]',   { opacity: 0, y: 36, duration: 1.1 }, '-=0.7')
      .from('[data-hero-anim="line3"]',   { opacity: 0, y: 36, duration: 1.1 }, '-=0.7')
      .from('[data-hero-anim="sub"]',     { opacity: 0, y: 18, duration: 1.0 }, '-=0.5');

    // Crickets + wind fade in once the loader has lifted
    sound.fade('wind-trees', 0, 0.4, 1800);
    sound.fade('crickets', 0, 0.3, 2400);

    return () => { tl.kill(); };
  }, [reduced]);

  return (
    <section
      id="arrival"
      ref={ref}
      className={cn(
        'scene relative flex items-end justify-start',
        'min-h-[100svh]',
      )}
      data-scene="arrival"
    >
      <div className="relative z-[var(--z-content)] max-w-[68rem]">
        <p data-hero-anim="eyebrow" className="eyebrow text-cream/80 mb-4">
          Grandview, Tennessee
        </p>
        <h1 className="font-display text-hero text-cream max-w-full" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
          <span data-hero-anim="line1" className="block">Because God</span>
          <span data-hero-anim="line2" className="block">is the Greatest</span>
          <span data-hero-anim="line3" className="block">Adventure of ALL.</span>
        </h1>
        <p data-hero-anim="sub" className="editorial mt-8 text-cream">
          42 acres of Tennessee woodland beauty, God&rsquo;s presence,
          tents, treehouses, and adventures.
        </p>
      </div>

      {/* Scroll hint — fades on first scroll, see Phase 5 for the magic. */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 eyebrow text-cream/80 flex items-center gap-2"
      >
        <span>Scroll into the world</span>
        <span aria-hidden="true" className="inline-block animate-pulse">↓</span>
      </div>
    </section>
  );
}
