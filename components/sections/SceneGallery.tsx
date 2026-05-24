'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ACCOMMODATIONS } from '@/content/accommodations';

/**
 * Singular exterior image of each property, between the Groups review
 * marquee and the Book scene. The visitor has already heard about the
 * places — this gives them a clean "here's what each one actually
 * looks like from the outside" panel before the booking decision.
 */
type Tile = {
  id: string;
  label: string;
  kind: string;
  src: string;
  href: string;
};

const TILES: Tile[] = ACCOMMODATIONS
  .filter((a) => a.images && a.images.length > 0)
  .map((a) => ({
    id: a.id,
    label: a.name,
    kind: a.kind,
    src: a.images![0],
    href: a.bookingUrl ?? process.env.NEXT_PUBLIC_FAREHARBOR_URL ?? '#book',
  }));

// Append the shower house since it's a property amenity worth showing
TILES.push({
  id: 'shower',
  label: 'Treehouse shower',
  kind: 'Included with every stay',
  src: '/images/shower/1.jpg',
  href: '/sanctuary#shower',
});

export function SceneGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('[data-gallery-anim]');

    if (reduced) {
      items.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    const trig = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 75%',
      end: 'bottom 30%',
      toggleActions: 'play reverse play reverse',
      onEnter: () => gsap.to(items, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }),
      onLeaveBack: () => gsap.to(items, { opacity: 0, y: 24, duration: 0.6, ease: 'power2.in' }),
    });
    gsap.set(items, { opacity: 0, y: 24 });

    return () => { trig.kill(); };
  }, [reduced]);

  return (
    <section
      ref={ref}
      id="gallery"
      className="scene"
      data-scene="gallery"
    >
      <div className="relative z-[var(--z-content)] max-w-[88rem] mx-auto">
        <p data-gallery-anim className="eyebrow text-cream/75 mb-4 text-center">
          Places to wake up
        </p>
        <h2
          data-gallery-anim
          className="font-display text-display text-cream leading-[0.95] text-center max-w-[28ch] mx-auto"
        >
          Pick the one that calls you.
        </h2>

        <ul className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {TILES.map((t) => (
            <li key={t.id} data-gallery-anim>
              <a
                href={t.href}
                target={t.href.startsWith('http') ? '_blank' : undefined}
                rel={t.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="
                  group block relative aspect-[3/4] overflow-hidden rounded-xl
                  border border-cream/25 bg-night/40
                  transition-all duration-500 ease-cinematic
                  hover:border-amber hover:-translate-y-1
                  hover:shadow-[0_20px_60px_-20px_rgba(199,122,58,0.45)]
                "
              >
                <img
                  src={t.src}
                  alt={`${t.label} — exterior`}
                  loading="lazy"
                  className="
                    absolute inset-0 w-full h-full object-cover
                    transition-transform duration-700 ease-cinematic
                    group-hover:scale-105
                  "
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.72) 100%)',
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-4 text-cream">
                  <p className="eyebrow text-amber">{t.kind}</p>
                  <p className="font-display text-title leading-tight mt-1">{t.label}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
