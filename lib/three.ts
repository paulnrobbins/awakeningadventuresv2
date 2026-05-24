/**
 * Shared Three.js helpers — loaders, draco config, asset URL helpers.
 *
 * The 3D-web-experience skill prescribes Draco + WebP texture compression
 * for every web-bound GLB. This module exposes a single configured loader
 * so every Scene component pulls models the same way.
 */

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

// Draco decoder hosted on Google CDN — no need to ship the WASM blob with
// our deploy. Pinned version matches three@0.169.
const DRACO_DECODER_URL = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

let cachedGltf: GLTFLoader | null = null;

export function getGltfLoader(): GLTFLoader {
  if (cachedGltf) return cachedGltf;

  const draco = new DRACOLoader();
  draco.setDecoderPath(DRACO_DECODER_URL);

  const gltf = new GLTFLoader();
  gltf.setDRACOLoader(draco);

  // KTX2 (basis universal) gets attached when a Renderer is available —
  // see Phase 3 where this is finalized in WorldCanvas.tsx. The two-step
  // setup is required because KTX2 needs a WebGLRenderer to detect
  // device-supported transcode targets.

  cachedGltf = gltf;
  return gltf;
}

/** Attach KTX2 once we have an actual renderer. Called from WorldCanvas. */
export function attachKtx2(renderer: THREE.WebGLRenderer) {
  const loader = getGltfLoader();
  // Idempotent — skip if a KTX2Loader has already been attached to this GLTF loader.
  if ((loader as unknown as { ktx2Loader?: unknown }).ktx2Loader) return;

  const ktx2 = new KTX2Loader()
    .setTranscoderPath('https://unpkg.com/three@0.169.0/examples/jsm/libs/basis/')
    .detectSupport(renderer);
  loader.setKTX2Loader(ktx2);
}

/**
 * Resolve a model URL — small models live in /public/models, large ones
 * are referenced via the asset CDN env var. The env var stays empty in
 * dev and gets set in Vercel for production deploys.
 */
export function modelUrl(filename: string): string {
  const cdn = process.env.NEXT_PUBLIC_ASSET_CDN;
  if (cdn && cdn.length > 0) {
    return `${cdn.replace(/\/$/, '')}/models/${filename}`;
  }
  return `/models/${filename}`;
}

/** Same pattern for HDRIs. */
export function hdriUrl(filename: string): string {
  const cdn = process.env.NEXT_PUBLIC_ASSET_CDN;
  if (cdn && cdn.length > 0) {
    return `${cdn.replace(/\/$/, '')}/hdri/${filename}`;
  }
  return `/hdri/${filename}`;
}

// Color helpers — DAYTIME PALETTE
// Variable names retained from the night build so component imports
// don't break. Roles flip — `night` is now the light paper background
// (used as fog/scrim color), `cream` is the dark forest ink (used in
// text-mapped 3D contexts), `amber` unchanged, `forest` is the sage
// daylight foliage tint.
export const brandColors = {
  night: new THREE.Color('#F5EFE2'),   // paper / morning haze
  cream: new THREE.Color('#1F2E1F'),   // forest ink
  amber: new THREE.Color('#C77A3A'),   // fire-amber accent (unchanged)
  forest: new THREE.Color('#7B9377'),  // sage daylight foliage
};
