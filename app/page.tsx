'use client';

import { WorldCanvasClient } from '@/components/three/WorldCanvasClient';
import { Nav } from '@/components/layout/Nav';
import { PreloadGate } from '@/components/layout/PreloadGate';
import { MuteToggle } from '@/components/ui/MuteToggle';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ErrorCatcher } from '@/components/ui/ErrorCatcher';
import { useMounted } from '@/hooks/useMounted';
import { useSupports3D } from '@/hooks/useSupports3D';

import { SceneHero } from '@/components/sections/SceneHero';
import { SceneProperty } from '@/components/sections/SceneProperty';
import { SceneStay } from '@/components/sections/SceneStay';
import { SceneShower } from '@/components/sections/SceneShower';
import { SceneTrails } from '@/components/sections/SceneTrails';
import { SceneLake } from '@/components/sections/SceneLake';
import { SceneWelcome } from '@/components/sections/SceneWelcome';
import { SceneGroups } from '@/components/sections/SceneGroups';
import { SceneBook } from '@/components/sections/SceneBook';
import { Footer } from '@/components/sections/Footer';

/**
 * Home — the inhabitable world, top to bottom.
 *
 * The 3D canvas + mute toggle + custom cursor are all gated behind a
 * `mounted` flag so they only render after first client mount. This
 * eliminates the entire category of hydration mismatch crashes and
 * lets the DOM scenes ship cleanly even if the 3D world fails.
 *
 * 3D support gate: `useSupports3D()` probes the device on first paint.
 * Older Android phones / software-renderer browsers / sub-2GB devices
 * return `false`, and the Canvas never mounts — a static gradient
 * backdrop renders in its place. The DOM scenes (cards + photos +
 * videos) stand on their own; the visitor still sees the site, just
 * without the inhabitable world. Per the Three Foundations: a stable
 * fallback beats a crashing world every time.
 */
export default function HomePage() {
  const mounted = useMounted();
  const supports3D = useSupports3D();

  return (
    <>
      <PreloadGate />
      {mounted && supports3D === true && <WorldCanvasClient />}
      {mounted && supports3D === false && (
        <div
          className="fixed inset-0 z-[var(--z-world)]"
          style={{ background: 'linear-gradient(180deg, #C8D4C0 0%, #EFEAD8 70%)' }}
          aria-hidden="true"
        />
      )}
      <Nav />
      <main className="home-text relative z-[var(--z-content)]">
        <SceneHero />
        <SceneProperty />
        <SceneStay />
        <SceneShower />
        <SceneTrails />
        <SceneLake />
        <SceneWelcome />
        <SceneGroups />
        <SceneBook />
      </main>
      <Footer />
      {mounted && supports3D === true && <MuteToggle />}
      {mounted && supports3D === true && <CustomCursor />}
      {mounted && <ErrorCatcher />}
    </>
  );
}
