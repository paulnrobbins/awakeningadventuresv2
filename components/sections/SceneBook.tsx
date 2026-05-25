'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sound } from '@/lib/sound';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ACCOMMODATIONS, FULL_PROPERTY_BOOKING_URL } from '@/content/accommodations';
import { LoopingVideo } from '@/components/ui/LoopingVideo';

/**
 * Scene 8 — Come and see.
 *
 * Each card is a real photo of the accommodation with the booking info
 * laid over the bottom. The exterior photo IS the card — no transparent
 * cards over the 3D world, no risk of "Driftwood card showing Stargazer
 * in the background." Each card visually represents the one place it
 * books, full stop.
 *
 * Layout: 2 columns on tablet, 3 columns on desktop. The whole-property
 * card spans the full row at the end as a wider hero-style tile.
 */
export function SceneBook() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fired = useRef(false);
  const fareHarbor = process.env.NEXT_PUBLIC_FAREHARBOR_URL ?? '#';

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('[data-book-anim]');

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
          duration: 1.0,
          stagger: 0.08,
          ease: 'power3.out',
        });
        if (!fired.current) {
          sound.fade('crickets', 0.28, 0.18, 1400);
          sound.fade('wind-trees', 0.1, 0.18, 1400);
          fired.current = true;
        }
      },
      onLeaveBack: () => {
        gsap.to(items, { opacity: 0, y: 24, duration: 0.6, ease: 'power2.in' });
        fired.current = false;
      },
    });

    gsap.set(items, { opacity: 0, y: 24 });

    return () => { trig.kill(); };
  }, [reduced]);

  return (
    <section
      id="book"
      ref={ref}
      className="scene flex flex-col items-center justify-center text-center"
      data-scene="book"
    >
      <div className="relative z-[var(--z-content)] max-w-[88rem] w-full">
        <p data-book-anim className="eyebrow text-cream/85 mb-6">
          Reserve a night
        </p>
        <h2 data-book-anim className="font-display text-hero text-amber leading-[0.88]">
          Come and see.
        </h2>

        {/* Five accommodation cards — 3 on top, 2 centered on bottom.
            Each card hosts either a looping muted video walkthrough
            (a.video) or, for the primitive-camp card which has no
            walkthrough yet, the first hero image. */}
        {(() => {
          const top = ACCOMMODATIONS.slice(0, 3);
          const bottom = ACCOMMODATIONS.slice(3);
          const renderCard = (a: typeof ACCOMMODATIONS[number]) => {
            const cover = a.images?.[0] ?? a.heroImage;
            const href = a.bookingUrl ?? fareHarbor;
            return (
              <li key={a.id} className="group">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={a.ctaLabel}
                  className="
                    flex flex-col h-full rounded-xl overflow-hidden
                    bg-white border border-[rgba(31,46,31,0.18)]
                    shadow-[0_10px_30px_-12px_rgba(31,46,31,0.35)]
                    transition-all duration-500 ease-cinematic
                    hover:-translate-y-1
                    hover:shadow-[0_20px_60px_-20px_rgba(199,122,58,0.55)]
                    hover:border-amber
                    focus-visible:border-amber
                  "
                  style={{ backgroundColor: '#ffffff' }}
                >
                  {/* Video (or image fallback) — top of the card */}
                  {a.video ? (
                    <LoopingVideo
                      src={a.video}
                      poster={cover}
                      alt={`${a.name} — ${a.kind} walkthrough`}
                      aspect="aspect-[4/3]"
                      className="rounded-none"
                    />
                  ) : (
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-cream/20">
                      <img
                        src={cover}
                        alt={`${a.name} — ${a.kind}`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Card body — solid white with forest-ink text */}
                  <div className="flex flex-col flex-1 p-6">
                    <p className="eyebrow text-amber" style={{ color: '#C77A3A' }}>{a.kind}</p>
                    <h3 className="font-display text-title mt-2 leading-[1.0]" style={{ color: '#1F2E1F' }}>{a.name}</h3>
                    <p className="font-sans text-body mt-3 leading-[1.5]" style={{ color: 'rgba(31,46,31,0.85)' }}>{a.hook}</p>
                    <p className="font-sans text-caption mt-3" style={{ color: 'rgba(31,46,31,0.6)' }}>{a.capacity}</p>
                    <p
                      className="font-display text-lede text-amber mt-6 inline-flex items-center gap-2 mt-auto pt-6"
                      style={{ color: '#C77A3A' }}
                    >
                      {a.ctaLabel}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-500 ease-cinematic group-hover:translate-x-2"
                      >
                        →
                      </span>
                    </p>
                  </div>
                </a>
              </li>
            );
          };
          return (
            <div data-book-anim className="mt-16 md:mt-20 text-left">
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7"
                aria-label="Accommodations (top row)"
              >
                {top.map(renderCard)}
              </ul>
              {bottom.length > 0 && (
                <ul
                  className="mt-6 md:mt-7 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-7 mx-auto w-full lg:max-w-[66%]"
                  aria-label="Accommodations (bottom row)"
                >
                  {bottom.map(renderCard)}
                </ul>
              )}
            </div>
          );
        })()}

        {/* Whole-property hero card — full width, photo on one side,
            copy on the other. Visually distinct from the four above. */}
        <a
          data-book-anim
          href={FULL_PROPERTY_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Reserve the whole 42 acres for your group"
          className="
            group block mt-10 rounded-xl overflow-hidden
            bg-white border-2 border-amber/70
            shadow-[0_14px_40px_-16px_rgba(199,122,58,0.45)]
            transition-all duration-500 ease-cinematic
            hover:-translate-y-1 hover:border-amber
            hover:shadow-[0_24px_70px_-20px_rgba(199,122,58,0.65)]
            text-left
          "
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            {/* Video half — the looping 42-acre walkthrough (portrait,
                matches the other accommodation cards' orientation). */}
            <div className="md:col-span-5 p-6 md:p-10">
              <LoopingVideo
                src="/videos/forty-two.mp4"
                poster="/images/stargazer/1.jpg"
                alt="The whole 42 acres — walkthrough loop"
                aspect="aspect-[9/16]"
                className="max-w-[22rem] mx-auto"
              />
            </div>

            {/* Copy half */}
            <div className="md:col-span-7 flex flex-col justify-center p-8 md:p-12">
              <p className="eyebrow" style={{ color: '#C77A3A' }}>
                Whole property
              </p>
              <h3
                className="font-display text-display mt-3 leading-[0.95]"
                style={{ color: '#1F2E1F' }}
              >
                The Forty-Two.
              </h3>
              <p
                className="font-sans text-body mt-5 leading-[1.5]"
                style={{ color: 'rgba(31,46,31,0.85)' }}
              >
                Reserve every cabin, tent, fire pit, and trail on the
                property for your group. Two-night minimum on full-property
                bookings. Sleeps up to ~30 guests across the five places
                to stay.
              </p>
              <p
                className="font-display text-lede text-amber mt-8 inline-flex items-center gap-2"
                style={{ color: '#C77A3A' }}
              >
                Reserve the whole 42 acres
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 ease-cinematic group-hover:translate-x-2"
                >
                  →
                </span>
              </p>
            </div>
          </div>
        </a>

        <p data-book-anim className="font-sans text-body text-cream/85 mt-16 max-w-[44ch] mx-auto">
          Each card opens its own booking page. You can also{' '}
          <a
            href="mailto:support@awakeningadventuresllc.com"
            className="underline underline-offset-4 hover:text-amber transition-colors text-cream"
          >
            email Anthony directly
          </a>{' '}
          if you have questions first.
        </p>
      </div>
    </section>
  );
}
