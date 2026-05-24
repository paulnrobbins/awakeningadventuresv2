'use client';

/**
 * BookingStage — was a 3D card-stack using drei <Html transform>. That
 * API is fragile in production (React 18 + Three.js minified builds
 * frequently crash inside it). Replaced with a no-op in the 3D layer.
 *
 * The booking cards now live entirely in SceneBook's DOM overlay, which
 * is composed on top of the 3D canvas with the same visual outcome —
 * cards float over the dusk world the camera returns to.
 */
export function BookingStage() {
  return null;
}
