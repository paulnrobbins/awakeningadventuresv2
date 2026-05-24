'use client';

import { useEffect, useState } from 'react';
import { sound } from '@/lib/sound';
import { cn } from '@/lib/utils';

/**
 * Tier 3 World-Building Pattern 5 requires a mute toggle visible within
 * the first 2 seconds. This is the only UI surface that exposes audio
 * state, so it's intentionally a permanent fixed pill in the corner —
 * never hides on scroll.
 *
 * The icon is drawn inline (no icon library) so we don't haul lucide-react
 * for a single glyph. Two paths render based on muted state.
 */
export function MuteToggle({ className }: { className?: string }) {
  const [muted, setMuted] = useState<boolean>(sound.isMuted());

  useEffect(() => sound.subscribe(setMuted), []);

  const handleClick = () => {
    sound.setMuted(!muted);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={muted ? 'Unmute ambient sound' : 'Mute ambient sound'}
      aria-pressed={!muted}
      className={cn(
        'fixed bottom-6 right-6 z-[var(--z-nav)]',
        'flex items-center gap-2 px-3 py-2 rounded-full',
        'border border-cream/30 backdrop-blur-md bg-night/40',
        'transition-colors duration-500 ease-cinematic',
        'hover:border-amber hover:text-amber text-cream',
        className,
      )}
    >
      {muted ? (
        // muted icon — speaker with a slash
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        // playing icon — speaker with two arcs
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
      <span className="eyebrow">{muted ? 'Sound off' : 'Sound on'}</span>
    </button>
  );
}
