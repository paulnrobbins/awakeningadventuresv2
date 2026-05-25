'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { ACCOMMODATIONS } from '@/content/accommodations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { LoopingVideo } from '@/components/ui/LoopingVideo';
import { cn } from '@/lib/utils';

/**
 * Scene 3 — Stay.
 *
 * Four accommodations stack vertically. Each one is sticky-pinned to
 * the viewport and fades in as the visitor scrolls. When an
 * accommodation has photos (e.g. Stargazer), an ImageCarousel renders
 * beside the text card. Otherwise the text card takes the full width.
 *
 * Camera motion is driven by CameraRig's progress-based keyframes
 * (one per accommodation). We DELIBERATELY no longer call
 * setCameraOverride from here — the override snap-locked the camera
 * per-card, breaking the cinematic scrub feel where the camera should
 * continuously walk between accommodations as the visitor scrolls.
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

    const triggers: ScrollTrigger[] = [];
    items.forEach((item) => {
      const st = ScrollTrigger.create({
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
      triggers.push(st);
    });

    return () => {
      triggers.forEach((t) => t.kill());
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
