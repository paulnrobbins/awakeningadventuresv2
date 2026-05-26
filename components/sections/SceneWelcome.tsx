'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { REVIEWS } from '@/content/reviews';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { setWelcomeActive } from '@/lib/cameraOverride';

/**
 * Scene 6 — The Welcome.
 *
 * Sabrina's "Anthony and Barb were so inviting" line is verbatim — the
 * brand's emotional anchor. The 3D world supplies the fire pit and the
 * photo billboards behind the DOM content; this section just floats the
 * editorial overlay on top.
 *
 * Sound: lake ambient fades out, fire crackle fades in.
 */
export function SceneWelcome() {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);
  const reduced = useReducedMotion();
  const sabrina = REVIEWS.find((r) => r.author === 'Sabrina');

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('[data-welcome-anim]');

    if (reduced) {
      items.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    const trig = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 65%',
      end: 'bottom 35%',
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.12,
          ease: 'power3.out',
        });
        if (!fired.current) {
          sound.fade('ambient-lake', 0.2, 0.04, 1600);
          sound.fade('water-lap', 0.18, 0, 1600);
          sound.fade('fire-crackle', 0, 0.28, 2000);
          // Single owl hoot 4 seconds after the fire comes up — a
          // grace note that says "dusk on the property" without
          // looping or competing with the fire crackle bed.
          setTimeout(() => sound.play('owl-hoot'), 4000);
          fired.current = true;
        }
      },
      onLeaveBack: () => {
        gsap.to(items, { opacity: 0, y: 28, duration: 0.6, ease: 'power2.in' });
        sound.fade('fire-crackle', 0.28, 0, 1200);
        sound.fade('ambient-lake', 0.04, 0.2, 1200);
        sound.fade('water-lap', 0, 0.18, 1200);
        fired.current = false;
      },
    });

    gsap.set(items, { opacity: 0, y: 28 });

    // Mount trigger — keeps WelcomeStage (fire pit + photo billboards)
    // mounted while the section is anywhere near the viewport, so the
    // 3D fire is already present as the camera moves in. Wider bounds
    // than the camera trigger to prevent flicker.
    const mountTrig = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => setWelcomeActive(true),
      onEnterBack: () => setWelcomeActive(true),
      onLeave: () => setWelcomeActive(false),
      onLeaveBack: () => setWelcomeActive(false),
    });

    // Camera position handled by CameraRig's DOM-measured keyframes.

    return () => {
      trig.kill();
      mountTrig.kill();
      setWelcomeActive(false);
    };
  }, [reduced]);

  // Use only the first sentence of Sabrina's testimonial — the rest can
  // live on the future Reviews page.
  const sabrinaQuote = sabrina?.body.split('. ')[0];

  return (
    <section
      id="welcome"
      ref={ref}
      className="scene flex items-center"
      data-scene="welcome"
    >
      <div className="home-card relative z-[var(--z-content)] max-w-[68rem] mx-auto">
        <div data-welcome-anim>
          <p className="eyebrow text-cream/75 mb-4">Welcome</p>
          <h2 className="font-display text-display text-cream leading-[0.95]">
            Hosted by us,<br />Anthony and Barb.
          </h2>
          <p className="editorial mt-6 text-cream">
            We&rsquo;re here to make your stay memorable, comfortable, and as
            great as can be. Feel free to reach out to us so we can make your
            trip perfect!
          </p>
          <Link
            href="/contact"
            className="cta-primary mt-8 inline-flex"
          >
            Reach out
          </Link>
        </div>
      </div>
    </section>
  );
}
