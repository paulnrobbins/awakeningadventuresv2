/**
 * Camera override registry — small singleton that lets Scene components
 * tell the global CameraRig "go here right now" instead of waiting for
 * the progress-based keyframe lerp.
 *
 * The CameraRig reads `currentOverride` every frame. If it's non-null,
 * the rig lerps toward that target instead of using its progress
 * keyframes. When the override clears, the rig returns to progress
 * lerp seamlessly.
 *
 * Why this exists: Lenis's smoothed progress lags behind the user's
 * scroll, AND the global progress→section mapping is fragile (any
 * change to a section's height shifts every subsequent keyframe).
 * ScrollTrigger fires on actual DOM-relative scroll events, so binding
 * the camera target directly to a ScrollTrigger callback gives instant,
 * perfectly-synced camera moves that don't depend on getting the
 * page-height math right.
 *
 * Pattern: every Scene component creates a ScrollTrigger on its own
 * <section> and calls `setCameraOverride(TARGETS[id])` from onEnter +
 * onEnterBack. The most-recently-entered scene's override is active.
 * SceneStay creates one trigger per accommodation article so each card
 * gets its own camera position. SceneHero is the exception — its
 * camera comes from the Hero keyframe in CameraRig because Hero has
 * its own entrance choreography.
 */

export type CameraOverride = {
  pos: [number, number, number];
  target: [number, number, number];
};

let current: CameraOverride | null = null;

export function setCameraOverride(o: CameraOverride | null) {
  current = o;
}

export function getCameraOverride(): CameraOverride | null {
  return current;
}

/**
 * Per-scene mount flags — DOM-driven flags that gate which 3D stages
 * get mounted into the world. Each flag is set true when its
 * corresponding DOM section enters the viewport (via ScrollTrigger
 * onEnter/onEnterBack) and false when it leaves (onLeave/onLeaveBack).
 * WorldScene subscribes and conditionally mounts the matching 3D
 * components, so the GPU only pays for what's currently on-screen and
 * the mount/unmount timing matches what the visitor is actually
 * reading — no more "object appears for a second then disappears"
 * because of mistuned progress windows.
 *
 * Each flag follows the same pattern: setter, subscribe (with
 * immediate sync), and one internal listener set. New flags follow
 * the same template — adding one is a copy-paste of the lake block.
 */

// --- Lake -----------------------------------------------------------
let lakeActive = false;
const lakeListeners = new Set<(v: boolean) => void>();

export function setLakeActive(v: boolean) {
  if (lakeActive === v) return;
  lakeActive = v;
  lakeListeners.forEach((fn) => fn(v));
}

export function isLakeActive(): boolean {
  return lakeActive;
}

export function subscribeLakeActive(fn: (v: boolean) => void): () => void {
  lakeListeners.add(fn);
  fn(lakeActive);
  return () => { lakeListeners.delete(fn); };
}

// --- Forest (Trails scene) -----------------------------------------
let forestActive = false;
const forestListeners = new Set<(v: boolean) => void>();

export function setForestActive(v: boolean) {
  if (forestActive === v) return;
  forestActive = v;
  forestListeners.forEach((fn) => fn(v));
}

export function subscribeForestActive(fn: (v: boolean) => void): () => void {
  forestListeners.add(fn);
  fn(forestActive);
  return () => { forestListeners.delete(fn); };
}

// --- Welcome (fire pit) ---------------------------------------------
let welcomeActive = false;
const welcomeListeners = new Set<(v: boolean) => void>();

export function setWelcomeActive(v: boolean) {
  if (welcomeActive === v) return;
  welcomeActive = v;
  welcomeListeners.forEach((fn) => fn(v));
}

export function subscribeWelcomeActive(fn: (v: boolean) => void): () => void {
  welcomeListeners.add(fn);
  fn(welcomeActive);
  return () => { welcomeListeners.delete(fn); };
}

// --- Primitive Camp (back-corner clearing) -------------------------
let primitiveCampActive = false;
const primitiveCampListeners = new Set<(v: boolean) => void>();

export function setPrimitiveCampActive(v: boolean) {
  if (primitiveCampActive === v) return;
  primitiveCampActive = v;
  primitiveCampListeners.forEach((fn) => fn(v));
}

export function subscribePrimitiveCampActive(fn: (v: boolean) => void): () => void {
  primitiveCampListeners.add(fn);
  fn(primitiveCampActive);
  return () => { primitiveCampListeners.delete(fn); };
}

// --- Booking (final card stage) -------------------------------------
let bookActive = false;
const bookListeners = new Set<(v: boolean) => void>();

export function setBookActive(v: boolean) {
  if (bookActive === v) return;
  bookActive = v;
  bookListeners.forEach((fn) => fn(v));
}

export function subscribeBookActive(fn: (v: boolean) => void): () => void {
  bookListeners.add(fn);
  fn(bookActive);
  return () => { bookListeners.delete(fn); };
}

/**
 * Camera-position table — single source of truth for where the camera
 * lives when each named scene/card is active. Scene components import
 * from here and call setCameraOverride(SCENE_TARGETS[id]) inside their
 * ScrollTrigger callbacks.
 *
 * Coordinates match the world layout in components/three/PropertyLayout
 * and components/three/PrimitiveCamp. When a scene moves, update its
 * entry HERE; the Scene component picks up the change automatically.
 *
 * The previous KEYFRAMES table in CameraRig.tsx now mirrors these for
 * the rare cases when no override is set (Hero entrance, between-scene
 * gaps).
 */
export const SCENE_TARGETS: Record<string, CameraOverride> = {
  // Hero — opening aerial. Used for the first 1-2 seconds before
  // SceneProperty's trigger fires. SceneHero deliberately does NOT
  // call setCameraOverride; this entry is here only for reference.
  hero: { pos: [22, 22, 32], target: [0, 0, -10] },

  // Property — mid-descent toward the cabins as the editorial copy
  // reads. SceneProperty's onEnter sets this.
  property: { pos: [12, 14, 22], target: [0, 0.8, -4] },

  // Stay cards — each article in SceneStay has a ScrollTrigger that
  // sets the matching override when it becomes the active sticky card.
  stargazer: { pos: [-3.0, 1.8, 4.0], target: [0, 1.2, 0] },
  driftwood: { pos: [16, 4.0, -6.0], target: [22, 4.0, -16] },
  // Homestead — card on LEFT half; look-target 1m east of the tent at
  // [-22, 0, -6] so the tent renders ~25% left of frame, behind the card.
  homestead: { pos: [-16, 2.0, 1.0], target: [-21, 1.0, -6] },
  // Serene Seven — card on RIGHT half; eye-level vantage east of the
  // tent at [-26, 0, -24], target shifted further west so the tent
  // renders RIGHT of frame, behind the card.
  'serene-seven': { pos: [-22, 2.4, -16], target: [-30, 1.5, -25] },
  // Primitive Camp — card on LEFT half; camera in front of the camp
  // scene at world [-12, 0, -32], target 1m east of the camp's X so
  // the fire ring + pup tent render ~36% left of frame, behind the
  // card. The PrimitiveCamp 3D scene mounts via setPrimitiveCampActive.
  'primitive-camp': { pos: [-9, 1.6, -25], target: [-11, 0.6, -32] },

  // Shower — card on LEFT half says "Shower in the trees". Driftwood
  // treehouse at world [22, 0, -16] needs to render LEFT of frame so
  // it sits behind the card. Camera pulled WEST + closer; target
  // shifted ~4m east of the treehouse.
  shower: { pos: [10, 4.5, -2.0], target: [26, 3.5, -14] },

  // Trails — eye-level view down the central trail corridor. The
  // rock bridge in ForestScene sits in the foreground at relative
  // z=+5 → world z=-11, framed naturally by this shot. ForestScene
  // mounts via setForestActive.
  trails: { pos: [0, 2.0, -3], target: [0, 1.8, -18] },

  // Lake — at the shore, dock leading the eye out to the moored
  // pontoon. LakeStage sits at world [0, 0, -30]: shore at world
  // z=-28, dock from z=-30 to z=-38, moored pontoon at world
  // [4.8, 0.05, -37]. The previous z=-32 placement put the camera
  // INSIDE the water area; this pulls back to z=-23 (7m in front of
  // the shore) so the dock leads from the foreground out to the
  // pontoon ~14m away, with the lake stretching to the horizon
  // behind. Boat + dock both clearly visible, no "you're already in
  // the water" feel.
  lake: { pos: [-3, 1.8, -23], target: [3, 0.4, -40] },

  // Welcome — sitting at the fire pit at world [-2, 0, -8]. Lowered
  // to seated-at-fire height with target dropped to flame-base so
  // embers/flame anchor the lower half of the frame, behind the
  // centered "Hosted by us, Anthony and Barb" card. WelcomeStage
  // mounts via setWelcomeActive.
  welcome: { pos: [-2.6, 1.0, -5.6], target: [-2, 0.35, -7.8] },

  // Groups — full pull-back showing the entire property at late
  // afternoon. WelcomeStage stays mounted through this scene so the
  // fire pit reads as one of the visible light sources in the wide
  // shot.
  groups: { pos: [14, 16, 20], target: [-2, 0.5, -6] },

  // Book — return to a composition close to the original hero so
  // the visitor reads the final "Come and see" against the same
  // anchor they entered with. BookingStage mounts via setBookActive.
  book: { pos: [0, 1.4, 6.0], target: [0, 1.0, 0] },
};

/**
 * Backward-compat alias — older imports still reference STAY_TARGETS.
 * Subset of SCENE_TARGETS limited to the Stay/Shower/Lake/Trails keys
 * the old API exposed.
 */
export const STAY_TARGETS: Record<string, CameraOverride> = {
  stargazer: SCENE_TARGETS.stargazer,
  driftwood: SCENE_TARGETS.driftwood,
  homestead: SCENE_TARGETS.homestead,
  'serene-seven': SCENE_TARGETS['serene-seven'],
  'primitive-camp': SCENE_TARGETS['primitive-camp'],
  shower: SCENE_TARGETS.shower,
  lake: SCENE_TARGETS.lake,
  trails: SCENE_TARGETS.trails,
};
