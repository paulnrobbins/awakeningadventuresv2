'use client';

import dynamic from 'next/dynamic';

/**
 * Client-only mount point for the 3D world. R3F + drei reach for
 * `document` and `window` in places that can't survive an SSR pass, so
 * the entire Canvas tree is dynamically loaded after hydration.
 *
 * The page still SSRs cleanly — Nav, every Scene's DOM content, the
 * Footer, the loader gate — all server-rendered. The world layers in
 * after first paint.
 */
export const WorldCanvasClient = dynamic(
  () => import('./WorldCanvas').then((m) => m.WorldCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        className="fixed inset-0 z-[var(--z-world)]"
        style={{ background: 'linear-gradient(180deg, #C8D4C0 0%, #EFEAD8 70%)' }}
        aria-hidden="true"
      />
    ),
  },
);
