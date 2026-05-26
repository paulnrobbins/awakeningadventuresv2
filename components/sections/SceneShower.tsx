'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { LoopingVideo } from '@/components/ui/LoopingVideo';

/**
 * Shower in the Trees — bonus scene between Stay and Trails. The
 * treehouse shower is one of the property's signature features per
 * the live sanctuary page ("Best Treehouse Shower in Tennessee").
 *
 * Camera: handled by CameraRig's DOM-measured keyframes — the rig
 * reads this section's offsetTop on mount + resize and interpolates
 * the camera between the adjacent shower/trails/stay positions
 * continuously as the visitor scrolls. This component only owns the
 * text fade in/out.
 */
export function SceneShower() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('[data-shower-anim]');

    if (reduced) {
      items.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    // Text fade in/out
    const fadeTrig = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 70%',
      end: 'bottom 30%',
      toggleActions: 'play reverse play reverse',
      onEnter: () => {
        gsap.to(items, { opacity: 1, y: 0, duration: 1.0, stagger: 0.12, ease: 'power3.out' });
      },
      onLeaveBack: () => {
        gsap.to(items, { opacity: 0, y: 28, duration: 0.6, ease: 'power2.in' });
      },
    });
    gsap.set(items, { opacity: 0, y: 28 });

    // Camera position handled by CameraRig's DOM-measured keyframes
    // (it reads this section's offsetTop on mount + resize). No
    // override from here so the keyframe interpolation between shower
    // and adjacent scenes stays continuous.

    return () => {
      fadeTrig.kill();
    };
  }, [reduced]);

  return (
    <section
      id="shower"
      ref={ref}
      className="scene flex items-center"
      data-scene="shower"
    >
      <div className="relative z-[var(--z-content)] w-full max-w-[88rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Text card */}
        <div
          data-shower-anim
          className="lg:col-span-6 bg-night/92 border border-cream/25 rounded-xl p-8 md:p-10"
        >
          <p className="eyebrow text-amber mb-3">Included with every stay</p>
          <h3 className="font-display text-display text-cream leading-[0.95]">
            A shower in the trees.
          </h3>
          <p className="editorial mt-6 text-cream">
            Ten feet off the ground, standing next to a live tree, with the
            canopy overhead. Best treehouse shower in Tennessee.
          </p>
        </div>

        {/* Looping muted shower walkthrough (rebuilt portrait, 1080×1920). */}
        <div data-shower-anim className="lg:col-span-5 lg:col-start-8">
          <LoopingVideo
            src="/videos/shower.mp4"
            poster="/images/shower/1.jpg"
            alt="Treehouse shower — ten feet up next to a live tree"
            aspect="aspect-[9/16]"
            className="max-w-[28rem] mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
