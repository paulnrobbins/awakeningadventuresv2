/**
 * Single source of truth for GSAP plugin registration and default eases.
 *
 * IMPORTANT: ScrollTrigger is registered at module-evaluation time, not
 * lazily inside a function call. Scene components import `gsap` and
 * `ScrollTrigger` from this module and call `gsap.to({scrollTrigger:})`
 * inside their useEffects — those effects can run BEFORE the
 * Providers' async init completes. Registering here guarantees the
 * plugin is available the moment any consumer imports it.
 *
 * This module is only imported by 'use client' components, so the
 * `typeof window` guard keeps it safe under SSR.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  try {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({
      ease: 'power3.out',
      duration: 1.2,
    });
  } catch (err) {
    // GSAP registerPlugin is idempotent in practice; this catch covers
    // the rare case where the plugin file failed to load cleanly.
    console.warn('[gsap] plugin registration failed:', err);
  }
}

/**
 * Kept as a no-op compatibility shim so existing callers
 * (Providers, lib/lenis) still work. Registration already happened at
 * module load.
 */
export function ensureGsap() {
  /* no-op — registration is module-side-effect */
}

export { gsap, ScrollTrigger };
