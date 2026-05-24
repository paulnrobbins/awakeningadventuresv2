/**
 * Scroll-score configuration — DAYTIME edition.
 *
 * Each scene maps to a daytime location on the property: arrival at
 * the Stargazer in late-morning forest light, sanctuary pull-back in
 * dappled mid-morning, side-scroll through the four accommodations
 * in clear midday, descent into the trail interior with light shafts,
 * emergence at Watts Bar Lake in bright midday, fire pit at warm
 * golden hour, group pull-back at late afternoon, booking under
 * bright sky.
 *
 * HDRI filenames are all Poly Haven daytime captures.
 * Fog colors are warm paper / sage tints — no near-black.
 */

import type { SceneSoundKey } from '@/lib/sound';

export type SceneConfig = {
  id:
    | 'arrival'
    | 'sanctuary'
    | 'stay'
    | 'trails'
    | 'lake'
    | 'welcome'
    | 'groups'
    | 'book';
  label: string;
  hdri: string;
  ambient: SceneSoundKey;
  fog: string;
  fogNear: number;
  fogFar: number;
};

export const SCENES: SceneConfig[] = [
  {
    id: 'arrival',
    label: 'Arrive',
    hdri: 'kiara_1_dawn_2k.hdr',           // soft early-morning warmth
    ambient: 'wind-trees',
    fog: '#E8E0CF',                          // warm haze, not black
    // fogNear/fogFar widened for drone-altitude establishing shot.
    // Camera sits ~110m from origin at the opening aerial; the
    // previous 12/80 range made everything past 80m fully fogged
    // (the "white cloud" blocking the view). 80/400 keeps the
    // property crystal clear in the foreground while the horizon
    // still fades into warm atmosphere.
    fogNear: 80,
    fogFar: 400,
  },
  {
    id: 'sanctuary',
    label: 'The property',
    hdri: 'kloofendal_43d_clear_2k.hdr',   // clear midday sky
    ambient: 'ambient-forest',
    fog: '#D8DBC4',                          // bright paper-sage
    // Bumped near/far so the descent from aerial still reads
    // clear as the camera passes through the sanctuary fog scene
    // on its way down to the Stargazer.
    fogNear: 60,
    fogFar: 260,
  },
  {
    id: 'stay',
    label: 'Stay',
    hdri: 'kloofendal_43d_clear_2k.hdr',
    ambient: 'crickets',
    fog: '#D8DBC4',
    fogNear: 25,
    fogFar: 130,
  },
  {
    id: 'trails',
    label: 'Walk the trails',
    hdri: 'forest_slope_2k.hdr',           // inside-forest filtered light
    ambient: 'ambient-forest',
    fog: '#C8CCB0',                          // soft forest interior
    fogNear: 6,
    fogFar: 55,
  },
  {
    id: 'lake',
    label: 'On the water',
    hdri: 'kloofendal_43d_clear_2k.hdr',   // bright lake sky
    ambient: 'ambient-lake',
    fog: '#D6DCC8',                          // hazy lake horizon
    fogNear: 40,
    fogFar: 220,
  },
  {
    id: 'welcome',
    label: 'Welcome',
    hdri: 'kiara_1_dawn_2k.hdr',           // soft warm daylight
    ambient: 'fire-crackle',
    fog: '#E0DCC8',                          // neutral warm cream (no orange/brown)
    fogNear: 12,
    fogFar: 70,
  },
  {
    id: 'groups',
    label: 'Set apart',
    hdri: 'kiara_1_dawn_2k.hdr',
    ambient: 'crickets',
    fog: '#E8E0CF',                          // golden hour pull-back
    fogNear: 50,
    fogFar: 240,
  },
  {
    id: 'book',
    label: 'Come and see',
    hdri: 'kloofendal_43d_clear_2k.hdr',
    ambient: 'wind-trees',
    fog: '#E8E0CF',
    fogNear: 12,
    fogFar: 90,
  },
];
