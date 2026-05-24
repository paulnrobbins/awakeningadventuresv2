/**
 * Lenis smooth scroll, wired into GSAP ScrollTrigger.
 *
 * Defensive: ScrollTrigger.update is only bound as a Lenis listener if
 * it's actually a function. In some bundles the property is undefined
 * at the moment of binding, which triggers a Lenis event-emitter
 * crash ("ev is not a function") downstream.
 */

import Lenis from 'lenis';
import { ScrollTrigger } from './gsap';

let instance: Lenis | null = null;
let rafId: number | null = null;

export function initLenis() {
  if (instance || typeof window === 'undefined') return instance;

  try {
    instance = new Lenis({
      // duration extended + wheelMultiplier reduced so individual
      // wheel ticks travel less, and the smoothing carries longer.
      // The visitor still scrolls at their pace, but the rate at
      // which the page actually advances is more cinematic so scenes
      // don't snap past each other.
      duration: 1.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.65,
      touchMultiplier: 1.1,
      lerp: 0.075,
    });
  } catch (err) {
    console.warn('[lenis] init failed — falling back to native scroll:', err);
    instance = null;
    return null;
  }

  // Only bind ScrollTrigger.update if it's a real function
  if (typeof ScrollTrigger?.update === 'function') {
    try {
      instance.on('scroll', ScrollTrigger.update);
    } catch (err) {
      console.warn('[lenis] ScrollTrigger binding failed:', err);
    }
  }

  const raf = (time: number) => {
    instance?.raf(time * 1000);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame((t) => raf(t / 1000));

  return instance;
}

export function destroyLenis() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  try { instance?.destroy(); } catch { /* ignore */ }
  instance = null;
  rafId = null;
}

export function getLenis() {
  return instance;
}
