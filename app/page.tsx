'use client';

import { WorldCanvasClient } from '@/components/three/WorldCanvasClient';
import { Nav } from '@/components/layout/Nav';
import { PreloadGate } from '@/components/layout/PreloadGate';
import { MuteToggle } from '@/components/ui/MuteToggle';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ErrorCatcher } from '@/components/ui/ErrorCatcher';
import { useMounted } from '@/hooks/useMounted';

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
 */
export default function HomePage() {
  const mounted = useMounted();

  return (
    <>
      <PreloadGate />
      {mounted && <WorldCanvasClient />}
      <Nav />
      <main className="relative z-[var(--z-content)]">
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
      {mounted && <MuteToggle />}
      {mounted && <CustomCursor />}
      {mounted && <ErrorCatcher />}
    </>
  );
}
