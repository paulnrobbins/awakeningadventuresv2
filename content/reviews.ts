/**
 * Real guest reviews — verbatim from Airbnb / Hipcamp / Google.
 * Dates intentionally omitted per Paul's direction so quotes stay timeless.
 *
 * This list is the source of truth for:
 *   - SceneWelcome (picks the lead host-quote)
 *   - Any future "Reviews" page (full list)
 *
 * The marquee in components/ui/ReviewMarquee.tsx maintains its own
 * trimmed list of one-line quotes — those are also drawn from this set.
 */

export type Review = {
  author: string;
  stay: 'Stargazer' | 'Driftwood' | 'Homestead' | 'Serene Seven' | 'Sanctuary Forest';
  title?: string;
  body: string;
  rating: 5;
};

export const REVIEWS: Review[] = [
  {
    author: 'Mike',
    stay: 'Driftwood',
    body: 'My wife and I had an amazing time. Anthony and Barb were amazing hosts and made sure we had everything we needed during our stay. The Driftwood treehouse was very cozy. They truly have a special property that we will be back to enjoy.',
    rating: 5,
  },
  {
    author: 'Kali',
    stay: 'Driftwood',
    body: 'I really enjoyed my stay at the Driftwood Cabin. The hosts were lovely and very accommodating. You can tell a lot of heart and soul was put into the creation of their campground and it made it all the more special. I brought my dog and she had an amazing time on the property and with their friendly pups. Peaceful getaway in a small corner of the mountains with lots of trails to explore and views to take in. Thank you so much for having us.',
    rating: 5,
  },
  {
    author: 'Victoria',
    stay: 'Driftwood',
    body: 'The treehouse was such a fun alternative to the mediocre hotels along I-40 as my kids and I drove across Tennessee. Anthony and Barb were incredibly kind and welcoming. They also responded very quickly, confirming our reservation within minutes for the same night. Everything was a breeze.',
    rating: 5,
  },
  {
    author: 'Joshua',
    stay: 'Driftwood',
    body: 'Absolutely loved our stay. Hosts were responsive and helpful. Beautiful property with lots of trails. Plenty of firewood on-site. The shower house was really clean and very well stocked with all kinds of soaps and shampoos. Flexible checkout. Was able to clean the room out of our belongings then stayed for awhile to walk the trails. Barely scratched the surface of available trails to walk. Will definitely stay there again sometime.',
    rating: 5,
  },
  {
    author: 'Nathan M.',
    stay: 'Driftwood',
    title: 'Unique getaway',
    body: 'Get away from busy life and stay in a unique, comfortable, and enjoyable treehouse. Camping-style living but very comfortable in the treehouse with good AC. Grilled out and had a campfire. Slept well.',
    rating: 5,
  },
  {
    author: 'Missina',
    stay: 'Driftwood',
    body: 'Very nice people and a really cool little place.',
    rating: 5,
  },

  {
    author: 'Lesily P.',
    stay: 'Homestead',
    body: 'Our little family loved our stay and we had so much fun hiking together and camping. The hosts were very welcoming and made us feel very comfortable. We highly recommend for a nice camping trip especially with kids and pets. We will be back.',
    rating: 5,
  },
  {
    author: 'Leanne K.',
    stay: 'Homestead',
    body: 'Such a beautiful peaceful property. Barb and Anthony were very accommodating and kind. My son fell in love with their dogs. I can’t believe how amazing the treehouse showers are.',
    rating: 5,
  },
  {
    author: 'Georgia',
    stay: 'Homestead',
    body: 'Our stay was an absolute peaceful blast. Barb and Anthony’s hospitality was so wonderful, everything was setup well and easy. We cooked every meal outside and took plenty of walks. Our toddlers loved it too. It felt like a good chill fireside hangout yet also plenty of privacy when wanted. And the shower house is something truly spectacular.',
    rating: 5,
  },
  {
    author: 'Chana C.',
    stay: 'Homestead',
    body: 'Peaceful place to enjoy books and friendly owners. Had a great experience and beautiful surroundings in nature. The treehouse showers were amazing and had everything we needed for our family to reconnect with nature.',
    rating: 5,
  },
  {
    author: 'Nicholas A.',
    stay: 'Homestead',
    body: 'Had a great overnight stay on a long-distance work trip. Super cool showers and comfortable amenities for a nice experience.',
    rating: 5,
  },

  {
    author: 'Sarina',
    stay: 'Serene Seven',
    body: 'What a great experience from start to finish. We booked last minute and were approved to stay quickly. We were greeted by the sweetest host who had a wealth of knowledge of the area. The bed was so cozy nuzzled in the middle of the forest. It made for the best waking experience.',
    rating: 5,
  },
  {
    author: 'Amy',
    stay: 'Serene Seven',
    body: 'My fiancé and I had the best time here. It was EXACTLY what we were looking for. We walked the property, relaxed, played Yahtzee, enjoyed the fire, and slept like a rock. Highly recommend this place for a relax and recharge.',
    rating: 5,
  },
  {
    author: 'Lea',
    stay: 'Serene Seven',
    body: 'This is one of the first camping outdoor Airbnbs I’ve booked in a while, and it absolutely exceeded all expectations. Hosts were absolutely amazing and worked with me with anything I needed. Our service animal Pablo had so much fun exploring the woods. The bathhouse was out of this world, a shower to remember. A great fire and the best retreat anyone could ask for.',
    rating: 5,
  },
  {
    author: 'Jami',
    stay: 'Serene Seven',
    body: 'Barb and her husband were so sweet and accommodating. Seriously the best Airbnb I have stayed at and I will definitely be back. There were so many waterfalls nearby to check out that are breathtaking.',
    rating: 5,
  },
  {
    author: 'Jeremy',
    stay: 'Serene Seven',
    body: 'We loved our stay. The treehouse was cozy and comfortable and everyone was super nice. This was the perfect getaway for a much-needed relaxing weekend.',
    rating: 5,
  },
  {
    author: 'Bettyann',
    stay: 'Serene Seven',
    body: 'It was amazing to stay in this cute little glamping tent. Everything you could possibly need was provided. The view is great and the host was quick to respond to our last-minute travel requests. We will definitely be staying here in the future.',
    rating: 5,
  },
  {
    author: 'Rose',
    stay: 'Serene Seven',
    body: 'We wish we could have stayed longer but everything was just perfect from the scenery, trails, and the sound of nature.',
    rating: 5,
  },
  {
    author: 'Bryan',
    stay: 'Serene Seven',
    body: 'I had a great stay there. My only complaint was that I only had to stay one night — I wish I could have been there a week.',
    rating: 5,
  },
  {
    author: 'Jaime',
    stay: 'Serene Seven',
    body: 'Serene was the perfect way to describe it.',
    rating: 5,
  },
  {
    author: 'Swanhilda',
    stay: 'Serene Seven',
    body: 'Great for the soul and to hear nature.',
    rating: 5,
  },
  {
    author: 'Ridge H.',
    stay: 'Serene Seven',
    body: 'We had an amazing time. A great way to get away.',
    rating: 5,
  },

  {
    author: 'Katie',
    stay: 'Stargazer',
    body: 'This getaway was exactly what I was looking for and I would definitely go back.',
    rating: 5,
  },
  {
    author: 'Isabella',
    stay: 'Stargazer',
    body: 'Clean and cute. Loved hearing the crickets all night.',
    rating: 5,
  },
  {
    author: 'Paula',
    stay: 'Stargazer',
    body: 'We enjoyed it very much. Will definitely return.',
    rating: 5,
  },
  {
    author: 'Jared',
    stay: 'Stargazer',
    body: 'Wonderful experience.',
    rating: 5,
  },

  {
    author: 'Krystal H.',
    stay: 'Sanctuary Forest',
    body: 'Neat experience.',
    rating: 5,
  },
];
