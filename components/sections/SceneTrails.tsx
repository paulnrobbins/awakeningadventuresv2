'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { LoopingVideo } from '@/components/ui/LoopingVideo';

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
      <div className="relative z-[var(--z-content)] w-full max-w-[88rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div data-trail-anim className="lg:col-span-5 max-w-[28rem] mx-auto w-full">
          <LoopingVideo
            src="/videos/trails.mp4"
            alt="Walking the trail through the sanctuary forest"
            aspect="aspect-[9/16]"
          />
        </div>

        <div className="home-card lg:col-span-7 text-center lg:text-left">
          <p data-trail-anim className="eyebrow text-cream/75 mb-6">Walk the trails</p>
          <p data-trail-anim className="font-display text-display text-cream leading-[1.0]">
            Three miles of trail. One rock bridge.<br />
            Enough quiet to seek God and His presence.
          </p>
          <p data-trail-anim className="editorial mt-8 text-cream lg:mx-0 mx-auto">
            Reconnect with your Creator through prayer trails led by host
            Anthony. View God&rsquo;s creation from the perspective
            platform, walk the rock bridge, and feel God&rsquo;s presence
            in the prayer shelter.
          </p>
          <Link
            data-trail-anim
            href="/sanctuary"
            className="cta-primary mt-10 inline-flex"
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
}
