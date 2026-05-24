'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Top nav — subtle paper-cream backdrop with blur so the dark text reads
 * cleanly over any scene the visitor is currently on. Links go to real
 * pages (matching the footer's "On the property" section), not in-page
 * scroll anchors.
 *
 * Mobile drops to a single brand mark + a hamburger that opens a panel
 * with the same link set.
 */
const NAV_LINKS = [
  { href: '/sanctuary', label: 'Sanctuary' },
  { href: '/lodging', label: 'Lodging' },
  { href: '/excursions', label: 'Excursions' },
  { href: '/groups', label: 'Groups' },
  { href: '/contact', label: 'Contact' },
];

export function Nav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-[var(--z-nav)]',
        'border-b border-cream/15',
        'text-cream',
        className,
      )}
      aria-label="Primary"
      style={{
        // Very subtle white-paper veil with heavier blur — keeps the
        // 3D world visible behind it while giving the dark-green text
        // enough background contrast to read against every scene.
        background: 'rgba(255, 255, 255, 0.40)',
        backdropFilter: 'blur(14px) saturate(110%)',
        WebkitBackdropFilter: 'blur(14px) saturate(110%)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.45) inset, 0 6px 20px -12px rgba(31,46,31,0.30)',
      }}
    >
      <div className="flex items-center justify-between px-6 py-4 md:px-10 md:py-5">
        <Link
          href="/"
          className="font-display text-lg tracking-tight leading-none text-cream hover:text-amber transition-colors"
        >
          Awakening Adventures
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7 eyebrow">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-cream transition-colors duration-300 ease-cinematic hover:text-amber"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop booking CTA */}
        <a
          href="/#book"
          className={cn(
            'hidden md:inline-flex eyebrow text-cream',
            'border border-cream/40 px-4 py-2 rounded-full',
            'transition-colors duration-300 ease-cinematic',
            'hover:border-amber hover:text-amber',
          )}
        >
          Come and see
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-full border border-cream/40 text-cream"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t border-cream/15 bg-night/95 backdrop-blur-md px-6 py-6">
          <ul className="space-y-3 font-sans text-body">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-cream hover:text-amber transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/tree-platform-builders"
                onClick={() => setOpen(false)}
                className="text-cream hover:text-amber transition-colors"
              >
                Need a Tree Platform built? Hire us.
              </Link>
            </li>
            <li className="pt-3">
              <a
                href="/#book"
                onClick={() => setOpen(false)}
                className="inline-block eyebrow text-cream border border-cream/40 px-4 py-2 rounded-full hover:border-amber hover:text-amber transition-colors"
              >
                Come and see
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
