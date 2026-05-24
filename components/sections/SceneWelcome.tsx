'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { REVIEWS } from '@/content/reviews';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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

    return () => { trig.kill(); };
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
      <div className="relative z-[var(--z-content)] grid grid-cols-1 md:grid-cols-12 gap-12 items-center max-w-[82rem] mx-auto">
        <div data-welcome-anim className="md:col-span-7">
          <p className="eyebrow text-cream/75 mb-4">Welcome</p>
          <h2 className="font-display text-display text-cream leading-[0.95]">
            Hosted, in&nbsp;person, by<br />Anthony &amp; Barb.
          </h2>
          <p className="editorial mt-6 text-cream">
            Reviews come back for them, not just for the property. Barb&rsquo;s
            cookies are real. Anthony brings a cart to the car for your bags.
          </p>
        </div>
        <figure data-welcome-anim className="md:col-span-5">
          <blockquote className="font-display text-lede text-cream leading-snug">
            &ldquo;{sabrinaQuote}.&rdquo;
          </blockquote>
          <figcaption className="mt-4 eyebrow text-amber">
            &mdash; {sabrina?.author}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
