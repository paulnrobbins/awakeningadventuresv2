'use client';

import { cn } from '@/lib/utils';

/**
 * Two-row infinite-scroll marquee of 5-star review quote cards.
 * Row 1 scrolls right-to-left, Row 2 scrolls left-to-right, at
 * slightly different speeds so they don't pulse in unison.
 *
 * All quotes are verbatim from real guests across Airbnb / Hipcamp.
 * Long reviews are trimmed to the most quotable single line; nothing
 * is fabricated. Dates intentionally omitted per Paul's direction so
 * the cards stay timeless.
 */

type Quote = {
  text: string;
  author: string;
  stay: string;
};

const ROW_A: Quote[] = [
  {
    text: 'Our little family loved our stay and we had so much fun hiking together and camping. The hosts were very welcoming and made us feel very comfortable.',
    author: 'Lesily P.',
    stay: 'Homestead',
  },
  {
    text: 'Such a beautiful peaceful property! I can’t believe how amazing the treehouse showers are!',
    author: 'Leanne K.',
    stay: 'Homestead',
  },
  {
    text: 'I really enjoyed my stay at the Driftwood Cabin. The hosts were lovely and very accommodating. You can tell a lot of heart and soul was put into the creation of their campground.',
    author: 'Kali',
    stay: 'Driftwood',
  },
  {
    text: 'We wish we could have stayed longer — everything was just perfect from the scenery, trails, and the sound of nature.',
    author: 'Rose',
    stay: 'Serene Seven',
  },
  {
    text: 'Anthony and Barb were incredibly kind and welcoming. Everything was a breeze.',
    author: 'Victoria',
    stay: 'Driftwood',
  },
  {
    text: 'Our stay was an absolute peaceful blast. The shower house is something truly spectacular.',
    author: 'Georgia',
    stay: 'Homestead',
  },
  {
    text: 'Clean and cute. Loved hearing the crickets all night.',
    author: 'Isabella',
    stay: 'Stargazer',
  },
  {
    text: 'Peaceful place to enjoy books and friendly owners. The treehouse showers were amazing.',
    author: 'Chana C.',
    stay: 'Homestead',
  },
  {
    text: 'A shower to remember. The best retreat anyone could ask for.',
    author: 'Lea',
    stay: 'Serene Seven',
  },
  {
    text: 'My wife and I had an amazing time. Anthony and Barb were amazing hosts. The Driftwood treehouse was very cozy.',
    author: 'Mike',
    stay: 'Driftwood',
  },
];

const ROW_B: Quote[] = [
  {
    text: 'Get away from busy life and stay in a unique, comfortable, and enjoyable treehouse. Slept well.',
    author: 'Nathan M.',
    stay: 'Driftwood',
  },
  {
    text: 'Serene was the perfect way to describe it.',
    author: 'Jaime',
    stay: 'Serene Seven',
  },
  {
    text: 'Seriously the best Airbnb I have stayed at, and I will definitely be back.',
    author: 'Jami',
    stay: 'Serene Seven',
  },
  {
    text: 'This getaway was exactly what I was looking for, and I would definitely go back.',
    author: 'Katie',
    stay: 'Stargazer',
  },
  {
    text: 'EXACTLY what we were looking for. We walked the property, relaxed, enjoyed the fire, and slept like a rock.',
    author: 'Amy',
    stay: 'Serene Seven',
  },
  {
    text: 'Great for the soul and to hear nature.',
    author: 'Swanhilda',
    stay: 'Serene Seven',
  },
  {
    text: 'Beautiful property with lots of trails. The shower house was really clean and very well stocked.',
    author: 'Joshua',
    stay: 'Driftwood',
  },
  {
    text: 'The bed was so cozy nuzzled in the middle of the forest. It made for the best waking experience.',
    author: 'Sarina',
    stay: 'Serene Seven',
  },
  {
    text: 'Everything you could possibly need was provided. The view is great.',
    author: 'Bettyann',
    stay: 'Serene Seven',
  },
  {
    text: 'My only complaint was that I only had to stay one night — I wish I could have been there a week.',
    author: 'Bryan',
    stay: 'Serene Seven',
  },
];

function Stars() {
  return (
    <span aria-label="5 out of 5 stars" className="text-amber tracking-[0.18em] text-[0.95rem]">
      ★★★★★
    </span>
  );
}

function Card({ q }: { q: Quote }) {
  return (
    <div
      className="flex-shrink-0 w-[20rem] md:w-[24rem] rounded-xl p-6 mx-3 shadow-[0_10px_30px_-12px_rgba(31,46,31,0.35)]"
      style={{ background: '#FFFFFF', border: '1px solid rgba(31,46,31,0.12)' }}
    >
      <Stars />
      <p
        className="font-display text-lede mt-3 leading-snug"
        style={{ color: '#1F2E1F' }}
      >
        &ldquo;{q.text}&rdquo;
      </p>
      <p className="eyebrow text-amber mt-4">
        &mdash; {q.author} <span className="text-amber/55">· {q.stay}</span>
      </p>
    </div>
  );
}

function MarqueeRow({
  items,
  direction = 'left',
  durationSeconds = 60,
}: {
  items: Quote[];
  direction?: 'left' | 'right';
  durationSeconds?: number;
}) {
  // Duplicate the items so the loop seam is invisible
  const loop = [...items, ...items];
  const animationName = direction === 'left' ? 'marquee-left' : 'marquee-right';

  return (
    <div
      className="relative overflow-hidden w-full"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
      }}
    >
      <div
        className="flex w-max"
        style={{
          animation: `${animationName} ${durationSeconds}s linear infinite`,
        }}
      >
        {loop.map((q, i) => (
          <Card key={i} q={q} />
        ))}
      </div>
    </div>
  );
}

export function ReviewMarquee({ className }: { className?: string }) {
  return (
    <div className={cn('relative w-full space-y-4 py-2', className)}>
      <MarqueeRow items={ROW_A} direction="left" durationSeconds={95} />
      <MarqueeRow items={ROW_B} direction="right" durationSeconds={115} />

      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-row {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
