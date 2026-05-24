/**
 * Photo registry — the curated set of real documentary photos pulled
 * from StudioWork/Awakening Adventures into /public/images for the
 * build.
 *
 * Each entry names the EXPECTED FILENAME in /public/images and the
 * SOURCE filename in StudioWork. PHOTO-CURATION-HANDOFF.md tells Paul
 * which to copy. PropertyLayout.tsx and Scene components import paths
 * from here so renaming happens in one place.
 */

export type CuratedPhoto = {
  key: string;
  publicPath: string;        // path used by next/image and texture loaders
  source: string;            // path inside StudioWork — for tracking only
  alt: string;
};

export const PHOTOS: Record<string, CuratedPhoto> = {
  stargazerHero: {
    key: 'stargazerHero',
    publicPath: '/images/stargazer-hero.jpg',
    source: 'StudioWork/Awakening Adventures/Stargazer/IMG_7100.jpeg',
    alt: 'Clear plexiglass cabin in a forest clearing at dusk',
  },
  driftwoodHero: {
    key: 'driftwoodHero',
    publicPath: '/images/driftwood-hero.jpg',
    source: 'StudioWork/Awakening Adventures/Driftwood/  (best treehouse shot)',
    alt: 'Driftwood treehouse in the tree canopy',
  },
  homesteadHero: {
    key: 'homesteadHero',
    publicPath: '/images/homestead-hero.jpg',
    source: 'StudioWork/Awakening Adventures/Homestead/  (tent with stove visible)',
    alt: 'Homestead canvas tent with wood-stove chimney',
  },
  sereneSevenHero: {
    key: 'sereneSevenHero',
    publicPath: '/images/serene-seven-hero.jpg',
    source: 'StudioWork/Awakening Adventures/Serene-Seven/sereneseven.webp (used as site hero today)',
    alt: 'Serene Seven tent on the prairie at sunset',
  },
  groundsTrail: {
    key: 'groundsTrail',
    publicPath: '/images/grounds-trail.jpg',
    source: 'StudioWork/Awakening Adventures/Grounds/  (best forest-trail shot)',
    alt: 'Forest trail at the Awakening Adventures property',
  },
  anthonyBarbWelcome: {
    key: 'anthonyBarbWelcome',
    publicPath: '/images/anthony-barb-welcome.jpg',
    source: 'TBD — Paul to select best host photo',
    alt: 'Anthony and Barb welcoming guests at the fire pit',
  },
  firePit: {
    key: 'firePit',
    publicPath: '/images/fire-pit.jpg',
    source: 'StudioWork/Awakening Adventures/Grounds/  (best fire-pit shot)',
    alt: 'Fire pit with chairs around it at dusk',
  },
  pontoonLake: {
    key: 'pontoonLake',
    publicPath: '/images/pontoon-lake.jpg',
    source: 'StudioWork/Awakening Adventures/Boating/  (best sunset pontoon shot)',
    alt: 'Pontoon boat on Watts Bar Lake at sunset',
  },
  perspectivePlatform: {
    key: 'perspectivePlatform',
    publicPath: '/images/perspective-platform.jpg',
    source: 'StudioWork/Awakening Adventures/Grounds/Perspective Platform/',
    alt: 'View from the perspective platform overlook',
  },
};
