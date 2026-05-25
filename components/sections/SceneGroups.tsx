'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ReviewMarquee } from '@/components/ui/ReviewMarquee';

/**
 * Scene 7 — Groups. Small-church retreat conversion path.
 *
 * Two-row testimonial marquee plays under the headline so visitors
 * read live social proof from real guests as they scroll.
 */
export function SceneGroups() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fired = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('[data-groups-anim]');

    if (reduced) {
      items.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    const trig = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 65%',
      end: 'bottom 30%',
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.14,
          ease: 'power3.out',
        });
        if (!fired.current) {
          sound.fade('fire-crackle', 0.28, 0.08, 1600);
          sound.fade('crickets', 0.12, 0.28, 2200);
          // Whippoorwill at very low volume — the signature
          // Tennessee-dusk sound. Real bird on the property per
          // the sanctuary page WILDLIFE list. Plays in as the
          // groups pull-back reaches "full property at dusk".
          sound.fade('whippoorwill', 0, 0.10, 3000);
          fired.current = true;
        }
      },
      onLeaveBack: () => {
        gsap.to(items, { opacity: 0, y: 32, duration: 0.6, ease: 'power2.in' });
        sound.fade('whippoorwill', 0.10, 0, 1400);
        fired.current = false;
      },
    });

    gsap.set(items, { opacity: 0, y: 32 });

    return () => { trig.kill(); };
  }, [reduced]);

  return (
    <section
      id="groups"
      ref={ref}
      className="scene flex flex-col justify-center"
      data-scene="groups"
    >
      <div className="home-card relative z-[var(--z-content)] max-w-[68rem]">
        <p data-groups-anim className="eyebrow text-cream/75 mb-6">
          Set apart
        </p>
        <h2 data-groups-anim className="font-display text-display text-cream max-w-[24ch] leading-[0.95]">
          For pastors and small-group leaders planning a retreat.
        </h2>
        <p data-groups-anim className="editorial mt-8 text-cream">
          The entire forty-two acres can be reserved for your group. We
          help you build the schedule, or we get out of the way so you
          can build your own. Two-night minimum on group bookings.
        </p>
        <Link
          data-groups-anim
          href="/groups"
          className="cta-primary mt-10 inline-flex"
        >
          Plan your retreat
        </Link>
      </div>

      {/* Real reviews scrolling underneath — two rows in opposite directions */}
      <div
        data-groups-anim
        className="relative z-[var(--z-content)] mt-16 md:mt-20 -mx-section-x"
      >
        <ReviewMarquee />
      </div>
    </section>
  );
}
