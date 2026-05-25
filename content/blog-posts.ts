/**
 * Posts pulled from awakeningadventuresllc.com/blog and split by kind.
 *
 * Devotionals → /devotionals
 * Other → /blog
 *
 * Each entry links back to the live WordPress URL for the full read.
 * When Anthony writes a new post, append it here in the right bucket
 * (manual cadence until we wire up the WordPress webhook → Vercel
 * deploy hook for auto-rebuilds).
 */

export type BlogPost = {
  title: string;
  url: string;
  excerpt: string;
  date: string;
  /** Sort key — ISO date if known. */
  iso?: string;
};

export const DEVOTIONALS: BlogPost[] = [
  {
    title: 'Listening to Jesus: The Foundation of Wholehearted Discipleship',
    url: 'https://awakeningadventuresllc.com/2026/04/09/listening-to-jesus-the-foundation-of-wholehearted-discipleship/',
    excerpt:
      "A long-form teaching anchored in John 10 (the Good Shepherd) and John 15 (the Vine and branches), explaining why hearing Jesus' voice is the heart of discipleship. Walks through signs you are hearing Jesus, obstacles that block clear hearing, practical steps to listen (dedicated time, Scripture, silence, testing impressions, obedience), and how intimacy with Christ transforms identity, productivity, and joy.",
    date: 'April 9, 2026',
    iso: '2026-04-09',
  },
  {
    title: 'New Perspective: A Spiritual Retreat to Hear God',
    url: 'https://awakeningadventuresllc.com/2024/02/08/what-is-a-listening-prayer-getaway/',
    excerpt:
      'The listening prayer getaway is an invitation to come to Jesus, incline your ear, and listen to Him carefully (Isaiah 55:1-3, John 10:27). The New Perspective platform in the forest sanctuary is a tranquil place to let go of distractions, rest in the Spirit, and hear what Jesus is saying. Anthony shares a personal testimony of joyful laughter, tears, and Hallelujahs experienced at the mountain prayer shelter, plus the LISTEN acrostic for practicing listening prayer.',
    date: 'February 8, 2024',
    iso: '2024-02-08',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title:
      'Serene Grandview Tennessee Waterfall Hike: Your Weekend Getaway from Knoxville, Nashville, Chattanooga',
    url: 'https://awakeningadventuresllc.com/2026/04/12/serene-grandview-tennessee-waterfall-hike-your-weekend-getaway-knoxville-nashville-chattanooga/',
    excerpt:
      "A three-night itinerary centered on Awakening Adventures at 265 Neck Rd, Grandview, TN — a calm Cumberland Plateau home base for visitors driving in from Knoxville, Nashville, or Chattanooga. Covers the property's 42 acres, the Driftwood Treehouse, Stargazer Clear Cabin, and Homestead Tent, plus a day-by-day plan that includes Piney Falls, the Cumberland Trail, the New Perspective Platform, the outdoor kitchen, packing tips, and nearby dining at Nick's Lakeside Grill and Ayala's in Spring City.",
    date: 'April 12, 2026',
    iso: '2026-04-12',
  },
  {
    title: 'Cumberland Plateau Hiking Adventure: Your Treehouse Basecamp Guide',
    url: 'https://awakeningadventuresllc.com/2026/03/19/cumberland-plateau-hiking-adventure-your-treehouse-basecamp-guide/',
    excerpt:
      'A detailed 3-night basecamp guide for East Tennessee hiking using the Awakening Adventures Treehouse Glampground as your hub. Profiles top trails in Fall Creek Falls State Park (Woodland Trail, Cane Creek Falls, Piney Falls) and South Cumberland State Park (Foster Falls, Fiery Gizzard, Greeter Falls), plus Black Mountain and Stone Door. Includes a day-by-day itinerary, seasonal timing, gear lists, safety and wildlife tips, photography pointers, and rest-day attractions like Cumberland Caverns and nearby dining in Grandview, Spring City, Dayton, and Crossville.',
    date: 'March 19, 2026',
    iso: '2026-03-19',
  },
];
