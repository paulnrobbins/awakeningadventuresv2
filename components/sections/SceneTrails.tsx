'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Scene 4 — The Trails. The rock bridge moment, told through
 * environmental implication: forest interior in 3D, fog, light shafts,
 * a firefly arc. The DOM overlay is a centered pull-quote that fades
 * in when the visitor reaches the section.
 *
 * Bird-call sound fires once on entry — a small environmental cue. No
 * music, per StudioWork policy.
 */
export function SceneTrails() {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('[data-trail-anim]');

    if (reduced) {
      items.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    const trig = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.14,
          ease: 'power3.out',
        });
        if (!fired.current) {
          sound.play('bird-call');
          // crossfade ambient: forest deepens here
          sound.fade('ambient-forest', 0.18, 0.32, 1800);
          fired.current = true;
        }
      },
      onLeaveBack: () => {
        gsap.to(items, { opacity: 0, y: 32, duration: 0.6, ease: 'power2.in' });
      },
    });

    gsap.set(items, { opacity: 0, y: 32 });

    return () => { trig.kill(); };
  }, [reduced]);

  return (
    <section
      id="trails"
      ref={ref}
      className="scene flex items-center"
      data-scene="trails"
    >
      <div className="relative z-[var(--z-content)] mx-auto max-w-[64rem] text-center">
        <p data-trail-anim className="eyebrow text-cream/75 mb-6">Walk the trails</p>
        <p data-trail-anim className="font-display text-display text-cream leading-[1.0]">
          Three miles of trail. One rock bridge.<br />
          Enough quiet to pray.
        </p>
        <p data-trail-anim className="editorial mt-8 mx-auto text-cream">
          The trail passes the mountain prayer shelter — a small wooden
          pavilion with a natural stone altar inspired by Luke 6:12, tucked
          into the back corner of the sanctuary for solitude. Just past it,
          the perspective tree platform sits twenty-two feet up in two red
          oaks. Both are great places to pray and see God&rsquo;s creation.
        </p>
        <p data-trail-anim className="editorial mt-4 mx-auto text-cream/85">
          Guided prayer hikes are available on request. Talk to Anthony
          when you arrive.
        </p>
      </div>
    </section>
  );
}
