'use client';

import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

/**
 * Image carousel — used inside accommodation cards to show multiple
 * photos of the same place. Keyboard nav (arrows), dot indicators,
 * prev/next buttons, and an auto-advance timer that pauses on hover.
 *
 * Images that fail to load (file missing) are silently skipped — the
 * carousel always renders the next available image.
 */
interface ImageCarouselProps {
  images: string[];
  /** alt text base — number appended per slide */
  altBase: string;
  /** ms between auto-advance ticks. 0 disables auto-advance. */
  autoAdvanceMs?: number;
  className?: string;
}

export function ImageCarousel({
  images,
  altBase,
  autoAdvanceMs = 5000,
  className,
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState<Set<number>>(new Set());

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-advance
  useEffect(() => {
    if (!autoAdvanceMs || paused || images.length < 2) return;
    const t = setInterval(next, autoAdvanceMs);
    return () => clearInterval(t);
  }, [autoAdvanceMs, paused, next, images.length]);

  // Keyboard nav when focused
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  if (images.length === 0) return null;

  return (
    <div
      className={cn(
        // Default sizing is responsive — parent can override via className.
        // The minHeight ensures the carousel never collapses if the
        // sibling text card is very short.
        'relative w-full overflow-hidden rounded-xl bg-cream/10 border border-cream/15',
        'min-h-[26rem] md:min-h-[32rem]',
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-label={`${altBase} — image carousel, ${images.length} photos`}
    >
      {/* Slides — stacked, with the active one fading in */}
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${altBase} — photo ${i + 1} of ${images.length}`}
          loading={i === 0 ? 'eager' : 'lazy'}
          onError={() => setFailed((s) => new Set(s).add(i))}
          className={cn(
            'absolute inset-0 w-full h-full object-cover',
            'transition-opacity duration-700 ease-cinematic',
            i === index && !failed.has(i) ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden={i !== index}
        />
      ))}

      {/* Soft top-and-bottom gradient so the dot indicators + arrows
          have readable contrast over any photo */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 100%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 100%)' }}
      />

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2',
              'w-10 h-10 rounded-full flex items-center justify-center',
              'bg-night/85 backdrop-blur-md border border-cream/30',
              'text-cream hover:text-amber hover:border-amber',
              'transition-colors duration-300 ease-cinematic',
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'w-10 h-10 rounded-full flex items-center justify-center',
              'bg-night/85 backdrop-blur-md border border-cream/30',
              'text-cream hover:text-amber hover:border-amber',
              'transition-colors duration-300 ease-cinematic',
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'rounded-full transition-all duration-300 ease-cinematic',
                i === index
                  ? 'w-6 h-2 bg-amber'
                  : 'w-2 h-2 bg-cream/60 hover:bg-cream',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
