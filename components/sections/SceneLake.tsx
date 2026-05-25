'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { setLakeActive } from '@/lib/cameraOverride';
import { EXCURSION_CTAS } from '@/content/excursions';

/**
 * Scene 5 — The Lake. Watts Bar pontoon + dock + horizon.
 *
 * CTAs are pulled from content/excursions.ts so they CANNOT drift from
 * the /adventures page — both surfaces read the same constants.
 *
 * Sync mechanism: this section owns the 3D lake MOUNT flag (via
 * setLakeActive). The 3D lake (LakeStage + drifting pontoon) appears
 * and disappears in lockstep with this DOM section's ScrollTrigger
 * range, eliminating the "text says lake but world says forest" drift.
 *
 * Camera POSITION during the lake range is driven by CameraRig's
 * progress-based lake keyframe (t=0.64), not a snap-locked override —
 * that's what keeps the cinematic scrub continuous as the visitor
 * rolls into and out of the lake.
 */

export function SceneLake() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fired = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('[data-lake-anim]');

    if (reduced) {
      items.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    // Outer trigger — mounts/unmounts the 3D lake stage. Generous
    // bounds so the world finishes its transition before the visitor
    // gets here, and lingers until the DOM section is fully out. The
    // camera itself is driven by CameraRig's progress-based keyframes
    // (lake keyframe at t=0.64), NOT a snap-locked override — that's
    // what gives the camera the continuous cinematic scrub the visitor
    // feels as they roll into and out of the lake range.
    const mountTrig = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => setLakeActive(true),
      onEnterBack: () => setLakeActive(true),
      onLeave: () => setLakeActive(false),
      onLeaveBack: () => setLakeActive(false),
    });

    // Inner trigger — text reveal + sound crossfade. No camera lock.
    const trig = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 65%',
      end: 'bottom 35%',
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.10,
          ease: 'power3.out',
        });
        if (!fired.current) {
          sound.fade('ambient-forest', 0.32, 0.06, 2000);
          sound.fade('ambient-lake', 0, 0.2, 2200);
          sound.fade('water-lap', 0, 0.18, 2400);
          setTimeout(() => sound.play('pontoon-distant'), 6500);
          fired.current = true;
        }
      },
      onLeaveBack: () => {
        gsap.to(items, { opacity: 0, y: 28, duration: 0.6, ease: 'power2.in' });
        sound.fade('ambient-lake', 0.2, 0, 1400);
        sound.fade('water-lap', 0.18, 0, 1400);
        sound.fade('ambient-forest', 0.06, 0.18, 1400);
        fired.current = false;
      },
    });

    gsap.set(items, { opacity: 0, y: 28 });

    return () => {
      trig.kill();
      mountTrig.kill();
      setLakeActive(false);
    };
  }, [reduced]);

  return (
    <section
      id="lake"
      ref={ref}
      /* min-h-[180vh] — gives the lake scene more scroll runway so the
         text + camera + 3D world stay in sync instead of snapping past.
         flex items-end keeps the copy anchored at the bottom of the
         viewport while the visitor scrolls through the lake range. */
      className="scene flex items-end min-h-[180vh]"
      data-scene="lake"
    >
      <div className="home-card relative z-[var(--z-content)] max-w-[64rem] sticky bottom-[18vh]">
        <p data-lake-anim className="eyebrow text-cream/75 mb-4">On the water</p>
        <h2 data-lake-anim className="font-display text-display text-cream leading-[0.95]">
          Watts Bar Lake.<br />Twenty minutes from the property.
        </h2>
        <p data-lake-anim className="editorial mt-6 text-cream">
          Captain Anthony at the helm — USCG-licensed. The pontoon waits at
          the dock; the island campsite is just a short ride across. Lodging
          guests get $50 off every excursion.
        </p>
        <div data-lake-anim className="mt-10 flex flex-col md:flex-row gap-6 md:gap-8">
          <a
            href={EXCURSION_CTAS.pontoon.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary"
          >
            {EXCURSION_CTAS.pontoon.label}
          </a>
          <a
            href={EXCURSION_CTAS.islandCamping.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary"
          >
            {EXCURSION_CTAS.islandCamping.label}
          </a>
        </div>
      </div>
    </section>
  );
}
