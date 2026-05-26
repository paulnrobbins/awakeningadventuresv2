'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { ACCOMMODATIONS } from '@/content/accommodations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { LoopingVideo } from '@/components/ui/LoopingVideo';
import { cn } from '@/lib/utils';
import { setPrimitiveCampActive } from '@/lib/cameraOverride';

/**
 * Scene 3 — Stay.
 *
 * Five accommodations stack vertically. Each one is sticky-pinned to
 * the viewport and fades in as the visitor scrolls. Each article also
 * owns a SECOND ScrollTrigger that fires as the sticky pinning
 * activates — `start: 'top top'` / `end: 'bottom top'` is the natural
 * "this card is the active sticky" window. On enter, the matching
 * camera override fires so the 3D world lands on this card's subject
 * exactly when the user starts reading it. The 0.0001 camera lerp in
 * CameraRig smooths the transition between adjacent overrides so the
 * scrub still feels cinematic — no snap-lock.
 *
 * Primitive Camp's article also flips `primitiveCampActive` so
 * WorldScene mounts the back-corner camp scene only when this card is
 * in view — eliminates the flicker where the camp was appearing and
 * disappearing during scroll based on a progress-window guess.
 */
export function SceneStay() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('[data-stay-item]');
    if (!items.length) return;

    if (reduced) {
      items.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    // Camera position for each accommodation is handled by CameraRig's
    // DOM-measured keyframes (which read each article's data-accom and
    // its offsetTop), so this scene only owns the text fades + the
    // Primitive Camp mount flag. The fade triggers stay narrow ('top
    // 70%' → 'bottom 30%') because they're about the COPY animating
    // in/out; the camera follows scroll independently and continuously.

    const triggers: ScrollTrigger[] = [];
    items.forEach((item) => {
      const id = item.getAttribute('data-accom') ?? '';
      const isPrimitive = id === 'primitive-camp';

      // Text fade in/out tied to the article's visibility.
      const fadeTrig = ScrollTrigger.create({
        trigger: item,
        start: 'top 70%',
        end: 'bottom 30%',
        toggleActions: 'play reverse play reverse',
        onEnter: () => {
          gsap.to(item, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
        },
        onLeave: () => {
          gsap.to(item, { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in' });
        },
        onEnterBack: () => {
          gsap.to(item, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        },
        onLeaveBack: () => {
          gsap.to(item, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.in' });
        },
      });
      gsap.set(item, { opacity: 0, y: 32 });
      triggers.push(fadeTrig);

      // PrimitiveCamp 3D scene mount — WIDE trigger window. The camera
      // holds at the Primitive Camp position from ~30vh BEFORE the
      // article becomes sticky through ~60vh into its sticky window
      // (90vh hold per CameraRig's per-section override). So the
      // mount needs to cover from before the article enters viewport
      // until well past it. 'top bottom' starts mounting as soon as
      // the article's top hits the viewport bottom (~100vh before
      // sticky); 'bottom top+=200' keeps it mounted ~200vh past the
      // article's natural bottom, well outside any possible camera
      // hold zone overlap.
      if (isPrimitive) {
        const mountTrig = ScrollTrigger.create({
          trigger: item,
          start: 'top bottom',
          end: 'bottom top+=200',
          onEnter: () => setPrimitiveCampActive(true),
          onEnterBack: () => setPrimitiveCampActive(true),
          onLeave: () => setPrimitiveCampActive(false),
          onLeaveBack: () => setPrimitiveCampActive(false),
        });
        triggers.push(mountTrig);
      }
    });

    return () => {
      triggers.forEach((t) => t.kill());
      setPrimitiveCampActive(false);
    };
  }, [reduced]);

  return (
    <section
      id="stay"
      ref={ref}
      className="relative"
      data-scene="stay"
    >
      <div className="relative min-h-[400vh]">
        <p className="eyebrow text-cream mb-4 sticky top-32 z-[var(--z-content)] px-section-x">
          Stay
        </p>

        {ACCOMMODATIONS.map((a, i) => {
          const isRightAlign = i % 2 !== 0;
          return (
            <article
              key={a.id}
              data-stay-item
              data-accom={a.id}
              className="
                sticky top-0 min-h-screen flex items-center
                px-section-x
              "
              style={{ top: 0 }}
            >
              <div
                className={cn(
                  'w-full max-w-[88rem] mx-auto',
                  'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch',
                )}
              >
                {/* Text card — semi-translucent so the 3D world reads
                    behind it. The SceneBook cards at the end are the
                    only solid-white cards on the site. */}
                <div
                  className={cn(
                    'home-card lg:col-span-6 h-full',
                    'flex flex-col justify-center',
                    isRightAlign ? 'lg:col-start-7 lg:text-right' : '',
                  )}
                >
                  <p className={cn('eyebrow text-amber mb-3', isRightAlign && 'lg:text-right')}>{a.kind}</p>
                  <h3 className="font-display text-display text-cream leading-[0.95]">
                    {a.name}
                  </h3>
                  <p className={cn('editorial mt-6 text-cream', isRightAlign && 'lg:ml-auto')}>{a.hook}</p>
                  <p className="mt-3 font-sans text-caption text-cream/70">
                    {a.capacity}
                  </p>
                  <a
                    href={a.bookingUrl ?? process.env.NEXT_PUBLIC_FAREHARBOR_URL ?? '#book'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn('cta-primary mt-8 w-fit', isRightAlign && 'lg:ml-auto')}
                  >
                    {a.ctaLabel}
                  </a>
                </div>

                {/* Looping muted video walkthrough — see content/accommodations.ts */}
                <div className={cn(
                  'lg:col-span-5 h-full',
                  isRightAlign ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-8',
                )}>
                  {a.video ? (
                    <LoopingVideo
                      src={a.video}
                      poster={a.images?.[0] ?? a.heroImage}
                      alt={`${a.name} — ${a.kind} walkthrough`}
                      aspect="aspect-[4/5]"
                      className="h-full"
                    />
                  ) : (
                    <div className="relative w-full h-full aspect-[4/5] rounded-xl overflow-hidden bg-cream/15">
                      <img
                        src={a.images?.[0] ?? a.heroImage}
                        alt={`${a.name} — ${a.kind}`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
