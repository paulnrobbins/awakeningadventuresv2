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
          // crossfade ambient: forest deepens here, gentle footsteps
          // underneath sell the "walking the trail" feeling
          sound.fade('ambient-forest', 0.18, 0.32, 1800);
          sound.fade('footsteps-leaves', 0, 0.12, 2000);
          fired.current = true;
        }
      },
      onLeaveBack: () => {
        gsap.to(items, { opacity: 0, y: 32, duration: 0.6, ease: 'power2.in' });
        sound.fade('footsteps-leaves', 0.12, 0, 1200);
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
        {/* TEXT first in DOM so mobile shows it before the media. On
            desktop, lg:order-2 pushes it back to the right column,
            preserving the existing media-left / text-right layout. */}
        <div className="home-card lg:col-span-6 lg:order-2 text-center lg:text-left">
          <p data-trail-anim className="eyebrow text-cream/75 mb-6">Walk the trails</p>
          <p data-trail-anim className="font-display text-display text-cream leading-[1.0]">
            Three miles of trail, a perspective platform, prayer
            shelter, and rock bridge. The perfect place to reflect and
            seek God and His presence.
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

        {/* MEDIA second in DOM (so it stacks BELOW the text on mobile),
            with lg:order-1 to push it back to the left column on
            desktop. */}
        <div data-trail-anim className="lg:col-span-6 lg:order-1 space-y-4">
          {/* Two looping muted videos — trail + perspective platform */}
          <div className="grid grid-cols-2 gap-4">
            <LoopingVideo
              src="/videos/trails.mp4"
              alt="Walking the trail through the sanctuary forest"
              aspect="aspect-[9/16]"
            />
            <LoopingVideo
              src="/videos/perspective-platform.mp4"
              alt="The perspective tree platform — twenty-two feet up in two red oaks"
              aspect="aspect-[9/16]"
            />
          </div>
          {/* Two photos beneath — rock bridge + prayer shelter,
              matching the videos' two-column grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-cream/15 bg-cream/10">
              <img
                src="/images/sanctuary/rock-bridge.webp"
                alt="The rock bridge across the wet-weather creek"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-cream/15 bg-cream/10">
              <img
                src="/images/sanctuary/prayer-shelter.webp"
                alt="The mountain prayer shelter — open-sided pavilion with natural-stone altar"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
