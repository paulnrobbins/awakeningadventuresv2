/**
 * Sound layer. Howler is lazy-loaded and sound is fully opt-in —
 * nothing fetches until the user explicitly clicks the mute toggle to
 * unmute. This prevents 404 cascades when sound files aren't yet
 * dropped into /public/sound, which was triggering Howler's
 * audio-pool-exhausted error path and crashing the React tree.
 *
 * No music bed by policy (Phase 1 brief).
 */

export type SceneSoundKey =
  | 'ambient-forest'
  | 'ambient-lake'
  | 'crickets'
  | 'fire-crackle'
  | 'water-lap'
  | 'pontoon-distant'
  | 'bird-call'
  | 'wind-trees'
  | 'ui-whoosh'
  | 'rain'
  | 'owl-hoot'
  | 'footsteps-leaves'
  | 'whippoorwill';

interface CueConfig {
  src: string[];
  loop?: boolean;
  volume?: number;
  rate?: number;
  html5?: boolean;
}

const CUE_REGISTRY: Record<SceneSoundKey, CueConfig> = {
  'ambient-forest':   { src: ['/sound/ambient-forest.mp3'],   loop: true, volume: 0.18, html5: true },
  'ambient-lake':     { src: ['/sound/ambient-lake.mp3'],     loop: true, volume: 0.18, html5: true },
  'crickets':         { src: ['/sound/crickets.mp3'],         loop: true, volume: 0.12, html5: true },
  'fire-crackle':     { src: ['/sound/fire-crackle.mp3'],     loop: true, volume: 0.22 },
  'water-lap':        { src: ['/sound/water-lap.mp3'],        loop: true, volume: 0.15 },
  'pontoon-distant':  { src: ['/sound/pontoon-distant.mp3'],  loop: false, volume: 0.10 },
  'bird-call':        { src: ['/sound/bird-call.mp3'],        loop: false, volume: 0.20 },
  'wind-trees':       { src: ['/sound/wind-trees.mp3'],       loop: true, volume: 0.10, html5: true },
  'ui-whoosh':        { src: ['/sound/ui-whoosh.mp3'],        loop: false, volume: 0.35 },

  // Six guest-uploaded sounds — all CC0 from Freesound.org
  'rain':             { src: ['/sound/rain.mp3'],             loop: true,  volume: 0.14, html5: true },
  'owl-hoot':         { src: ['/sound/owl-hoot.mp3'],         loop: false, volume: 0.25 },
  'footsteps-leaves': { src: ['/sound/footsteps-leaves.mp3'], loop: true,  volume: 0.12 },
  'whippoorwill':     { src: ['/sound/whippoorwill.mp3'],     loop: true,  volume: 0.10, html5: true },
};

type HowlInstance = InstanceType<NonNullable<typeof HowlerLib>['Howl']>;

let HowlerLib: typeof import('howler') | null = null;
const cues = new Map<SceneSoundKey, HowlInstance>();
let muted = true;
const subscribers = new Set<(muted: boolean) => void>();

async function getHowler(): Promise<typeof import('howler') | null> {
  if (HowlerLib) return HowlerLib;
  if (typeof window === 'undefined') return null;
  try {
    HowlerLib = await import('howler');
    // Browser autoplay policy: Howler's global mute defaults to false,
    // but we start the SITE muted. Apply Howler.mute(true) once the
    // lib loads so any cue that starts before the user unmutes plays
    // silently. setMuted() later flips it.
    HowlerLib.Howler.mute(true);
    return HowlerLib;
  } catch (err) {
    console.warn('[sound] howler.js failed to load:', err);
    return null;
  }
}

async function ensureCue(key: SceneSoundKey): Promise<HowlInstance | null> {
  const existing = cues.get(key);
  if (existing) return existing;
  const lib = await getHowler();
  if (!lib) return null;
  const cfg = CUE_REGISTRY[key];
  try {
    const howl = new lib.Howl({
      src: cfg.src,
      loop: cfg.loop ?? false,
      volume: cfg.volume ?? 0.2,
      rate: cfg.rate ?? 1,
      html5: cfg.html5 ?? false,
      preload: true,
      onloaderror: () => { /* silent — file missing is expected */ },
      onplayerror: () => { /* silent — autoplay gesture not yet given */ },
    });
    cues.set(key, howl);
    return howl;
  } catch (err) {
    console.warn('[sound] cue construction failed for', key, err);
    return null;
  }
}

export const sound = {
  /**
   * One-shot play. Always loads + plays the cue; Howler's global mute
   * controls whether you hear it. After the user unmutes, future
   * play() calls are audible immediately.
   */
  play(key: SceneSoundKey): void {
    ensureCue(key).then((howl) => {
      if (!howl) return;
      try { howl.play(); } catch { /* ignore */ }
    });
  },

  stop(key: SceneSoundKey) {
    const c = cues.get(key);
    try { c?.stop(); } catch { /* ignore */ }
  },

  /**
   * Fade a cue from one volume to another. Cue is loaded + started
   * regardless of mute state — Howler's global mute handles output.
   * When the user unmutes mid-scene, any cue that was already faded
   * up becomes audible at its current volume instantly.
   */
  fade(key: SceneSoundKey, from: number, to: number, durationMs = 1200) {
    ensureCue(key).then((howl) => {
      if (!howl) return;
      try {
        if (!howl.playing()) howl.play();
        howl.fade(from, to, durationMs);
      } catch { /* ignore */ }
    });
  },

  preload(keys: SceneSoundKey[]) {
    keys.forEach((k) => { ensureCue(k); });
  },

  setMuted(next: boolean) {
    muted = next;
    getHowler().then((lib) => {
      try { lib?.Howler.mute(next); } catch { /* ignore */ }
    });
    subscribers.forEach((cb) => cb(next));
  },

  isMuted(): boolean {
    return muted;
  },

  subscribe(cb: (muted: boolean) => void) {
    subscribers.add(cb);
    return () => { subscribers.delete(cb); };
  },
};
