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
  | 'ui-whoosh';

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
};

let HowlerLib: typeof import('howler') | null = null;
const cues = new Map<SceneSoundKey, unknown>();
let muted = true;
// Activated by the first user click on the mute toggle. While
// inactive, every sound API call is a silent no-op so missing
// files cannot trigger Howler errors.
let active = false;
const subscribers = new Set<(muted: boolean) => void>();

async function getHowler(): Promise<typeof import('howler') | null> {
  if (HowlerLib) return HowlerLib;
  if (typeof window === 'undefined') return null;
  try {
    HowlerLib = await import('howler');
    return HowlerLib;
  } catch (err) {
    console.warn('[sound] howler.js failed to load:', err);
    return null;
  }
}

async function ensureCue(key: SceneSoundKey) {
  // Hard gate: never instantiate Howl objects until the user has
  // opted in. This is the single most important defensive line —
  // it prevents missing-file fetches from cascading into a crash.
  if (!active) return null;

  const existing = cues.get(key);
  if (existing) return existing as InstanceType<NonNullable<typeof HowlerLib>['Howl']>;
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
      onplayerror: () => { /* silent */ },
    });
    cues.set(key, howl);
    return howl;
  } catch (err) {
    console.warn('[sound] cue construction failed for', key, err);
    return null;
  }
}

export const sound = {
  play(key: SceneSoundKey): void {
    if (muted || !active) return;
    ensureCue(key).then((howl) => { try { howl?.play(); } catch { /* ignore */ } });
  },

  stop(key: SceneSoundKey) {
    const c = cues.get(key) as { stop?: () => void } | undefined;
    try { c?.stop?.(); } catch { /* ignore */ }
  },

  fade(key: SceneSoundKey, from: number, to: number, durationMs = 1200) {
    if (!active) return;
    ensureCue(key).then((howl) => {
      if (!howl) return;
      try {
        if (muted) { howl.volume(0); return; }
        if (!howl.playing()) howl.play();
        howl.fade(from, to, durationMs);
      } catch { /* ignore */ }
    });
  },

  preload(_keys: SceneSoundKey[]) {
    /* deliberately a no-op — sound is fully opt-in via setMuted(false) */
  },

  setMuted(next: boolean) {
    muted = next;
    if (!next) active = true; // first unmute activates the system
    getHowler().then((lib) => { try { lib?.Howler.mute(next); } catch { /* ignore */ } });
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
