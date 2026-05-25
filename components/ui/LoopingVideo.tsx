'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface LoopingVideoProps {
  /** Video src (single file). For back-to-back use DualLoopingVideo. */
  src: string;
  /** Static poster shown before play + when reduced-motion is on. */
  poster?: string;
  /** Optional aria-friendly text describing what's in the video. */
  alt?: string;
  /** Aspect ratio class, e.g. "aspect-[16/9]" or "aspect-[4/3]". */
  aspect?: string;
  /** Wrapper className passthrough. */
  className?: string;
  /** object-fit value. Default "cover". */
  fit?: 'cover' | 'contain';
}

/**
 * Muted, autoplaying, looping inline video.
 *
 * Replaces photo carousels across the site. Per the Awakening Adventures
 * brief, every accommodation / scene video on lodging, adventures, and
 * sanctuary pages renders through this component so behavior stays
 * uniform — same playsInline, same muted-attribute belt-and-suspenders,
 * same reduced-motion fallback to a poster image.
 *
 * The <video> element renders with multiple muted attributes (one in
 * JSX, one via DOM property) because some browsers (iOS Safari) require
 * the property to be set programmatically before play() will succeed in
 * an autoplay context.
 */
export function LoopingVideo({
  src,
  poster,
  alt,
  aspect = 'aspect-[16/9]',
  className,
  fit = 'cover',
}: LoopingVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    // Belt-and-suspenders: set muted via DOM as well as attribute.
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    // Some browsers refuse to autoplay until play() is invoked.
    const tryPlay = () => v.play().catch(() => { /* user-gesture required, will resume on interaction */ });
    tryPlay();
  }, [reduced, src]);

  if (reduced) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-xl bg-cream/15',
          aspect,
          className,
        )}
      >
        {poster ? (
          <img
            src={poster}
            alt={alt ?? ''}
            loading="lazy"
            className={cn(
              'absolute inset-0 w-full h-full',
              fit === 'cover' ? 'object-cover' : 'object-contain',
            )}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl bg-cream/15',
        aspect,
        className,
      )}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
        className={cn(
          'absolute inset-0 w-full h-full',
          fit === 'cover' ? 'object-cover' : 'object-contain',
        )}
      />
    </div>
  );
}

interface DualLoopingVideoProps extends Omit<LoopingVideoProps, 'src'> {
  /** First video src. Plays first. */
  srcA: string;
  /** Second video src. Plays after the first ends, then loops back to A. */
  srcB: string;
}

/**
 * Two videos played back-to-back, looping the pair.
 *
 * Browsers cannot natively loop a sequence of files. This component
 * keeps two preloaded <video> elements stacked and swaps which one is
 * visible + playing on each `ended` event. Both are muted + inline +
 * lazy, so the only overhead vs a single LoopingVideo is one extra
 * (cheap) video decoder being warm.
 *
 * Use only when concatenation isn't possible at build time. For the
 * Awakening Adventures site we concatenate in FFmpeg before deploying,
 * so most "back to back" videos use the single LoopingVideo component
 * with a pre-concatenated source.
 */
export function DualLoopingVideo({
  srcA,
  srcB,
  poster,
  alt,
  aspect = 'aspect-[16/9]',
  className,
  fit = 'cover',
}: DualLoopingVideoProps) {
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);
  const [showingB, setShowingB] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const a = refA.current;
    const b = refB.current;
    if (!a || !b) return;

    a.muted = b.muted = true;
    a.defaultMuted = b.defaultMuted = true;
    a.playsInline = b.playsInline = true;

    const onAEnd = () => {
      setShowingB(true);
      b.currentTime = 0;
      b.play().catch(() => {});
    };
    const onBEnd = () => {
      setShowingB(false);
      a.currentTime = 0;
      a.play().catch(() => {});
    };

    a.addEventListener('ended', onAEnd);
    b.addEventListener('ended', onBEnd);
    a.play().catch(() => {});

    return () => {
      a.removeEventListener('ended', onAEnd);
      b.removeEventListener('ended', onBEnd);
    };
  }, [reduced, srcA, srcB]);

  if (reduced) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-xl bg-cream/15',
          aspect,
          className,
        )}
      >
        {poster ? (
          <img
            src={poster}
            alt={alt ?? ''}
            loading="lazy"
            className={cn(
              'absolute inset-0 w-full h-full',
              fit === 'cover' ? 'object-cover' : 'object-contain',
            )}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl bg-cream/15',
        aspect,
        className,
      )}
    >
      <video
        ref={refA}
        src={srcA}
        poster={poster}
        muted
        autoPlay
        playsInline
        preload="auto"
        aria-label={alt}
        className={cn(
          'absolute inset-0 w-full h-full transition-opacity duration-300',
          fit === 'cover' ? 'object-cover' : 'object-contain',
          showingB ? 'opacity-0' : 'opacity-100',
        )}
      />
      <video
        ref={refB}
        src={srcB}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className={cn(
          'absolute inset-0 w-full h-full transition-opacity duration-300',
          fit === 'cover' ? 'object-cover' : 'object-contain',
          showingB ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
}
