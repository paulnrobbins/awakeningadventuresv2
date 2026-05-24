'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Scene 2 — The Property.
 *
 * The camera dolly is owned by CameraRig in the 3D world. This section
 * provides the DOM content overlay: an editorial paragraph anchored
 * off-center on the right, animated in on scroll-trigger.
 *
 * Anti-AI-tell check: no "ABOUT / Get to know us" label, no centered
 * heading, no three-bullet feature list. Asymmetric anchor, real
 * editorial sentence.
 */
export function SceneProperty() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current || reduced) return;
    const items = ref.current.querySelectorAll<HTMLElement>('[data-prop-anim]');

    const tween = gsap.from(items, {
      opacity: 0,
      y: 32,
      duration: 1.0,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 70%',
        end: 'center 50%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [reduced]);

  return (
    <section
      id="sanctuary"
      ref={ref}
      className="scene flex items-center"
      data-scene="sanctuary"
    >
      <div className="relative z-[var(--z-content)] ml-auto max-w-[44rem] text-right">
        <p data-prop-anim className="eyebrow text-cream/75 mb-4">The property</p>
        <p data-prop-anim className="font-display text-display text-cream leading-[0.95]">
          Forty-two acres of<br />God&rsquo;s Creation.
        </p>
        <p data-prop-anim className="editorial mt-6 ml-auto text-cream">
          Three miles of trails. One rock bridge across a wet-weather creek.
          Enough quiet to actually hear yourself pray. Welcome to the
          Forest Sanctuary Refuge.
        </p>
      </div>
    </section>
  );
}
