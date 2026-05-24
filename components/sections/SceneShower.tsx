'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ImageCarousel } from '@/components/ui/ImageCarousel';

/**
 * Shower in the Trees — bonus scene between Stay and Trails. The
 * treehouse shower is one of the property's signature features per
 * the live sanctuary page ("Best Treehouse Shower in Tennessee").
 * Sits in 3D world space alongside the property buildings; this DOM
 * overlay supplies the editorial caption + carousel.
 *
 * Camera motion handled by CameraRig's progress-based shower keyframe
 * (t=0.44). No setCameraOverride — that snap-locked the camera and
 * broke cinematic scrub between scenes.
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

    const trig = ScrollTrigger.create({
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

    return () => {
      trig.kill();
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
            canopy overhead. All-natural toiletries are provided. The hot
            water is endless and on demand.
          </p>
          <p className="font-sans text-caption text-cream/70 mt-3">
            Anthony calls it the best treehouse shower in Tennessee. Reviews
            on Hipcamp tend to agree.
          </p>
        </div>

        {/* Carousel — pulls from /public/images/shower/ */}
        <div data-shower-anim className="lg:col-span-5 lg:col-start-8">
          <ImageCarousel
            images={[
              '/images/shower/1.jpg',
              '/images/shower/2.jpg',
              '/images/shower/3.jpg',
              '/images/shower/4.jpg',
              '/images/shower/5.jpg',
            ]}
            altBase="Treehouse shower — the bathhouse on the property"
          />
        </div>
      </div>
    </section>
  );
}
