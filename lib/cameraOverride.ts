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
 * This is the cleanest fix for the "1 behind" problem in SceneStay:
 * Lenis's smoothed progress lags behind the user's scroll, so any
 * progress-keyframe scheme will be slightly off. ScrollTrigger fires
 * on actual scroll events, so binding the camera target directly to a
 * ScrollTrigger callback gives instant, perfectly-synced camera moves.
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
 * Lake-stage mount flag — SceneLake calls setLakeActive(true) when its
 * DOM section enters the viewport and (false) when it leaves. WorldScene
 * reads this every render and mounts LakeStage + drifting pontoon ONLY
 * while the DOM section is on screen. Eliminates the "text says lake
 * but the world is still in the forest" drift from progress-only
 * scoping.
 */
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
  // Immediate sync so subscribers don't miss the current value
  fn(lakeActive);
  return () => { lakeListeners.delete(fn); };
}

/**
 * Named overrides keyed by accommodation id — Scene components import
 * this map and call setCameraOverride(STAY_TARGETS[id]) on card enter.
 * Keeping the position table here keeps the camera positions for the
 * Stay-walk co-located with the override mechanism.
 */
export const STAY_TARGETS: Record<string, CameraOverride> = {
  stargazer:    { pos: [-3.0, 1.8,  4.0], target: [0,   1.2,   0] },
  driftwood:    { pos: [16,   4.0, -6.0], target: [22,  4.0, -16] },
  homestead:    { pos: [-15,  2.4,  2.0], target: [-22, 1.2,  -6] },
  // Serene Seven — pushed further west and significantly higher so
  // the camera sits above any possible canopy line in the western
  // corridor. Sightline drops down onto the tent against open sky +
  // distant ridge, never through green foliage.
  'serene-seven': { pos: [-28, 6.5, -14], target: [-26, 1.0, -24] },
  shower:       { pos: [14,   3.6, 16],   target: [20,  3.0,   8] },
  // Lake scene — for SceneLake to use via override. Standing on the
  // shore looking down the dock toward the moored pontoon.
  lake:         { pos: [-7,   3.2, -22],  target: [2,   0.4, -40] },
  // Trails — pulled back, centered between prayer shelter (left at
  // x=-5) and perspective platform (right at x=+5). Both read clearly
  // with the central trail marker as the foreground anchor.
  trails:       { pos: [0,    2.0,  -3],  target: [0,   1.8, -18] },
};
