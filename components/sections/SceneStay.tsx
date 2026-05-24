'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { ACCOMMODATIONS } from '@/content/accommodations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { setCameraOverride, STAY_TARGETS } from '@/lib/cameraOverride';
import { cn } from '@/lib/utils';

/**
 * Scene 3 — Stay.
 *
 * Four accommodations stack vertically. Each one is sticky-pinned to
 * the viewport and fades in as the visitor scrolls. When an
 * accommodation has photos (e.g. Stargazer), an ImageCarousel renders
 * beside the text card. Otherwise the text card takes the full width.
 *
 * Camera (CameraRig) walks past each accommodation in 3D space at the
 * same time the DOM caption + carousel fade in.
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
      const accomId = item.getAttribute('data-accom') ?? '';
      const target = STAY_TARGETS[accomId];

      const st = ScrollTrigger.create({
        trigger: item,
        start: 'top 70%',
        end: 'bottom 30%',
        toggleActions: 'play reverse play reverse',
        onEnter: () => {
          gsap.to(item, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
          // Move camera to this accommodation the instant its card
          // fades in — no progress-based lag.
          if (target) setCameraOverride(target);
        },
        onLeave: () => {
          gsap.to(item, { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in' });
        },
        onEnterBack: () => {
          gsap.to(item, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
          if (target) setCameraOverride(target);
        },
        onLeaveBack: () => {
          gsap.to(item, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.in' });
        },
      });
      gsap.set(item, { opacity: 0, y: 32 });
      triggers.push(st);
    });

    // Section boundary — when the WHOLE Stay section leaves the viewport
    // (top or bottom), clear the camera override so the next scene's
    // progress-based camera takes back over.
    const boundary = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => setCameraOverride(null),
      onLeaveBack: () => setCameraOverride(null),
    });
    triggers.push(boundary);

    return () => {
      triggers.forEach((t) => t.kill());
      setCameraOverride(null);
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
          const hasImages = a.images && a.images.length > 0;
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
              {hasImages ? (
                /* Two-column layout: card + carousel. Same row height by
                   stretching both children with h-full inside an items-stretch grid. */
                <div
                  className={cn(
                    'w-full max-w-[88rem] mx-auto',
                    'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch',
                  )}
                >
                  {/* Text card — paper-cream tinted, matches the rest
                      of the scroll-world. The SceneBook cards at the
                      end are the only solid-white cards on the site. */}
                  <div
                    className={cn(
                      'lg:col-span-6 h-full',
                      'bg-night/92 border border-cream/25 rounded-xl p-8 md:p-10',
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
                      className="cta-primary mt-8"
                    >
                      {a.ctaLabel}
                    </a>
                  </div>

                  {/* Carousel — h-full + min-h removed via inline so it matches the card */}
                  <div className={cn(
                    'lg:col-span-5 h-full',
                    isRightAlign ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-8',
                  )}>
                    <ImageCarousel
                      images={a.images!}
                      altBase={`${a.name} — ${a.kind}`}
                      className="h-full min-h-0"
                    />
                  </div>
                </div>
              ) : (
                /* Single-column text-only layout for accommodations without photos */
                <div
                  className={
                    !isRightAlign
                      ? 'max-w-[40rem] ml-0 bg-night/92 border border-cream/25 rounded-xl p-8 md:p-10'
                      : 'max-w-[40rem] ml-auto text-right bg-night/92 border border-cream/25 rounded-xl p-8 md:p-10'
                  }
                >
                  <p className="eyebrow text-amber mb-3">{a.kind}</p>
                  <h3 className="font-display text-display text-cream leading-[0.95]">
                    {a.name}
                  </h3>
                  <p className="editorial mt-6 text-cream">{a.hook}</p>
                  <p className="mt-3 font-sans text-caption text-cream/70">
                    {a.capacity}
                  </p>
                  <a
                    href={a.bookingUrl ?? process.env.NEXT_PUBLIC_FAREHARBOR_URL ?? '#book'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-primary mt-8"
                  >
                    {a.ctaLabel}
                  </a>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
