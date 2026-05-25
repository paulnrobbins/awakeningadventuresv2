/**
 * Shared adventure CTAs — used by SceneLake (home scroll) AND
 * app/adventures/page.tsx so the labels + booking URLs can never drift
 * apart. Editing here updates both surfaces.
 *
 * File name remains excursions.ts (rather than adventures.ts) so existing
 * imports keep working — the underlying data is the same.
 */

export const PONTOON_BOOKING_URL =
  'https://fareharbor.com/embeds/book/awakeningadventures/items/562474/calendar/2026/05/?flow=1217241&language=en-us&full-items=yes&back=https://awakeningadventuresllc.com/island-sunset-pontoon-boat-excursions-on-watts-bar-lake/&g4=yes';

export const ISLAND_CAMP_BOOKING_URL =
  'https://fareharbor.com/embeds/book/awakeningadventures/items/562299/?full-items=yes&flow=1217241';

export const ISLAND_CAMP_EMAIL =
  'mailto:support@awakeningadventuresllc.com?subject=Watts%20Bar%20Lake%20Island%20Camping%20Trip&body=Hi%20Anthony%2C%0A%0AI%27d%20like%20to%20book%20an%20island%20camping%20trip%20on%20Watts%20Bar%20Lake.%20A%20few%20details%3A%0A%0ADates%20I%27m%20considering%3A%0AGroup%20size%3A%0AAdd-ons%20%28paddleboard%20%2F%20kayak%29%3A%0AQuestions%3A%0A%0AThanks%21';

export const PRAYER_HIKE_EMAIL =
  'mailto:support@awakeningadventuresllc.com?subject=Guided%20Prayer%20Hike%20Sign-Up&body=Hi%20Anthony%2C%0A%0AI%27d%20like%20to%20sign%20up%20for%20a%20guided%20prayer%20hike.%0A%0AWhich%20hike%3A%20%28property%20walk%20%2F%20Windlass%20Cave%20%2F%20Grassy%20Cove%20%2F%20other%29%0AHow%20many%20people%3A%0APreferred%20date%20%2F%20time%3A%0APhone%20number%3A%0A%0AThanks%21';

/** Single source of truth for the CTA labels used on both surfaces. */
export const EXCURSION_CTAS = {
  pontoon: {
    label: 'Book a Boat Tour',
    url: PONTOON_BOOKING_URL,
  },
  islandCamping: {
    label: 'Book island camping',
    url: ISLAND_CAMP_BOOKING_URL,
  },
  islandCampingEmail: {
    label: 'Or email Anthony first',
    url: ISLAND_CAMP_EMAIL,
  },
  prayerHike: {
    label: 'Email to sign up for a hike',
    url: PRAYER_HIKE_EMAIL,
  },
} as const;
