'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Footer sits outside the 3D world. Plain HTML, prairie-cream on near-black.
 *
 * Anti-AI-tell: no "© 2026 All Rights Reserved" filler — just what matters.
 * No "Made with love" hedge. Real attribution to Anthony & Barb, real
 * social handles from the snapshot.
 */
export function Footer() {
  return (
    <footer className="relative z-[var(--z-content)] border-t border-cream/10 bg-night text-cream film-grain">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <p className="font-display text-title leading-[0.95]">
              Awakening<br />Adventures
            </p>
            <p className="mt-6 font-sans text-body text-cream/70 max-w-[36ch]">
              42 acres of Tennessee woodland beauty, God&rsquo;s presence,
              tents, treehouses, and adventures.
            </p>
            <p className="mt-3 font-sans text-caption text-cream/55">
              Grandview, Tennessee · twenty minutes from the Watts Bar Lake marina.
            </p>
          </div>

          <nav aria-label="Sections" className="space-y-2">
            <p className="eyebrow text-cream/60">On the property</p>
            <ul className="space-y-1 font-sans text-body">
              <li><Link href="/" className="hover:text-amber transition-colors">Home</Link></li>
              <li><Link href="/sanctuary" className="hover:text-amber transition-colors">Sanctuary</Link></li>
              <li><Link href="/lodging" className="hover:text-amber transition-colors">Lodging</Link></li>
              <li><Link href="/adventures" className="hover:text-amber transition-colors">Adventures</Link></li>
              <li><Link href="/groups" className="hover:text-amber transition-colors">Group retreats</Link></li>
              <li><Link href="/about" className="hover:text-amber transition-colors">About us</Link></li>
              <li><Link href="/contact" className="hover:text-amber transition-colors">Contact</Link></li>
              <li><Link href="/tree-platform-builders" className="hover:text-amber transition-colors">Need a Tree Platform built? Hire us.</Link></li>
            </ul>
          </nav>

          <div className="space-y-2">
            <p className="eyebrow text-cream/60">Find us</p>
            <ul className="space-y-1 font-sans text-body">
              <li>
                <a href="https://www.instagram.com/awakeningadventuresllc/" target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/profile.php?id=100091124260581" target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/channel/UC6VQyUQ04iDKEAAq5ZmQOew" target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors">
                  YouTube
                </a>
              </li>
              <li>
                <a href="https://www.hipcamp.com/en-US/land/tennessee-awakening-adventures-9mxhzp0q" target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors">
                  Highly Rated on Hipcamp
                </a>
              </li>
            </ul>
            <Link
              href="/lodging"
              className={cn(
                'mt-6 inline-flex items-center gap-2',
                'font-display text-lede text-amber',
                'transition-transform duration-500 ease-cinematic',
              )}
            >
              Book your stay
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href="https://awakeningadventuresllc.com/home/contact/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'mt-4 inline-flex items-center gap-2',
                'font-display text-lede text-cream',
                'border border-amber/70 rounded-full px-5 py-2',
                'transition-colors duration-500 ease-cinematic',
                'hover:bg-amber hover:text-night hover:border-amber',
              )}
            >
              Donate
              <span aria-hidden="true">♡</span>
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-caption text-cream/50">
          <p>Awakening Adventures LLC · Grandview, TN</p>
          <p>Hosted by Anthony &amp; Barb. Site built by Kingdom Digital Services.</p>
        </div>
      </div>
    </footer>
  );
}
