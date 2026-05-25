/**
 * The four bookable accommodations on the property. Source of truth
 * for SceneStay (the lodging side-scroll) and SceneBook (the booking
 * cards at the end).
 *
 * `images` populates the per-card carousel.
 * `bookingUrl` overrides the env-var default if set — use this when
 *   a specific FareHarbor item URL is known. Falls back to the
 *   NEXT_PUBLIC_FAREHARBOR_URL env var when blank.
 */

export type Accommodation = {
  id: 'stargazer' | 'driftwood' | 'homestead' | 'serene-seven' | 'primitive-camp';
  name: string;
  kind: string;
  hook: string;
  capacity: string;
  bookingId?: string;
  heroImage: string;
  ctaLabel: string;
  /** Optional looping video walkthrough — preferred over the photo carousel
   *  on the lodging page when present. */
  video?: string;
  images?: string[];
  bookingUrl?: string;
};

export const ACCOMMODATIONS: Accommodation[] = [
  {
    id: 'stargazer',
    name: 'Stargazer',
    kind: 'Clear plexiglass cabin',
    hook: 'A clear house under the Tennessee night sky. You sleep beneath the stars without the cold floor.',
    capacity: 'Sleeps 2',
    heroImage: '/images/stargazer-hero.jpg',
    ctaLabel: 'Book the Stargazer',
    video: '/videos/stargazer.mp4',
    images: [
      '/images/stargazer/1.jpg',
      '/images/stargazer/2.jpg',
      '/images/stargazer/3.jpg',
      '/images/stargazer/4.jpg',
      '/images/stargazer/5.jpg',
    ],
    bookingUrl: 'https://awakeningadventuresllc.com/stargazer-unique-glamping-experience/',
  },
  {
    id: 'driftwood',
    name: 'Driftwood',
    kind: 'Treehouse',
    hook: 'Sleep and rest in the trees.',
    capacity: 'Sleeps 2–3',
    heroImage: '/images/driftwood-hero.jpg',
    ctaLabel: 'Book Driftwood',
    video: '/videos/driftwood.mp4',
    images: [
      '/images/driftwood/1.jpg',
      '/images/driftwood/2.jpg',
      '/images/driftwood/3.jpg',
      '/images/driftwood/4.jpg',
      '/images/driftwood/5.jpg',
      '/images/driftwood/6.jpg',
    ],
    bookingUrl: 'https://awakeningadventuresllc.com/driftwood-treehouse-cabin/',
  },
  {
    id: 'homestead',
    name: 'Homestead',
    kind: 'Glamping tent',
    hook: 'Massive glamping tent with 2 beds and a wood stove.',
    capacity: 'Sleeps 2–4',
    heroImage: '/images/homestead-hero.jpg',
    ctaLabel: 'Book Homestead',
    video: '/videos/homestead.mp4',
    images: [
      '/images/homestead/1.jpg',
      '/images/homestead/2.jpg',
      '/images/homestead/3.jpg',
      '/images/homestead/4.jpg',
      '/images/homestead/5.jpg',
      '/images/homestead/6.jpg',
    ],
    bookingUrl: 'https://awakeningadventuresllc.com/homestead-life-grandviewtn/',
  },
  {
    id: 'serene-seven',
    name: 'Serene Seven',
    kind: 'Glamping tent',
    hook: 'Open prairie pitch. The night sky here is the best on the property.',
    capacity: 'Sleeps 1–2',
    heroImage: '/images/serene-seven-hero.jpg',
    ctaLabel: 'Book Serene Seven',
    video: '/videos/serene-seven.mp4',
    images: [
      '/images/serene-seven/1.jpg',
      '/images/serene-seven/2.jpg',
      '/images/serene-seven/3.jpg',
      '/images/serene-seven/4.jpg',
      '/images/serene-seven/5.jpg',
      '/images/serene-seven/6.jpg',
    ],
    bookingUrl: 'https://awakeningadventuresllc.com/serene-seven-romantic-getaway/',
  },
  {
    id: 'primitive-camp',
    name: 'Primitive Camp',
    kind: 'Tent camping site',
    hook: 'Sleep on the ground, fire ring at your feet. Bring your own tent and bedding.',
    capacity: 'Sleeps up to 4',
    heroImage: '/images/groups/primitive-camping.webp',
    ctaLabel: 'Book the Primitive Camp',
    images: [
      '/images/groups/primitive-camping.webp',
      '/images/sanctuary/rock-bridge.webp',
    ],
    bookingUrl:
      'https://www.hipcamp.com/en-US/land/tennessee-awakening-adventures-9mxhzp0q/sites/603949?adults=1&children=0',
  },
];

/**
 * Whole-property booking — used on the Groups page and the home
 * SceneGroups CTA when a small church / pastor / retreat leader wants
 * to reserve the entire 42 acres.
 */
export const FULL_PROPERTY_BOOKING_URL =
  'https://awakeningadventuresllc.com/sanctuary-forest-campground-retreat/';
