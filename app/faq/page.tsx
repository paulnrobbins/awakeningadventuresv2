import Link from 'next/link';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';

export const metadata = {
  title: 'FAQ',
  description:
    'Answers to common questions about staying at Awakening Adventures — lodging types, pets, trails, weather, group bookings, cell service, kitchen, and more.',
};

type FAQ = {
  q: string;
  /** Plain string OR an array of inline strings + link objects.
   *  Lets specific answers carry real outbound links without needing
   *  dangerouslySetInnerHTML. */
  a: string | (string | { text: string; href: string })[];
};

const FAQS: FAQ[] = [
  {
    q: 'What types of lodging are available on the property?',
    a: 'The property offers a mix of cabins, a cozy treehouse, and glamping tent platforms, plus a primitive tent campsite. Each option includes basic comforts like beds, heating, and private outdoor spaces.',
  },
  {
    q: 'How close is the property to major cities like Knoxville, Nashville, and Chattanooga?',
    a: 'The retreat sits within a reasonable drive of Knoxville, Nashville, and Chattanooga, making it an easy weekend trip. Drive times vary, but most guests arrive within an hour or two depending on traffic.',
  },
  {
    q: 'Are pets allowed on the grounds?',
    a: 'Dogs are welcome in all lodging types. Bring leashes and waste bags. Some areas are kept pet-free to protect wildlife and other guests.',
  },
  {
    q: 'What hiking trails and waterfall spots can we reach from the property?',
    a: 'Minutes from the land you’ll find several trails that lead to Piney Falls, Ozone Falls, and overlooks on Black Mountain. The Cumberland Trail and other scenic paths offer varied distances and difficulty levels for day hikes.',
  },
  {
    q: 'Is the property suitable for groups or just couples?',
    a: 'The site is flexible for solo travelers, couples, and small groups. There’s space for camping and group gatherings around the evening campfire. Larger groups should reserve multiple units in advance.',
  },
  {
    q: 'What amenities are included during the stay?',
    a: 'Amenities typically include comfortable beds, hot showers, basic kitchen facilities or an outdoor kitchen, a coffee station, and private parking. Many spots offer privacy and outdoor seating to enjoy nature.',
  },
  {
    q: 'Do I need special gear for hiking and exploring waterfalls?',
    a: 'Pack sturdy shoes, layered clothing, rain gear for sudden weather changes, a refillable water bottle, and a small daypack. For waterfall access, traction-friendly footwear helps on slippery rocks.',
  },
  {
    q: 'How private are the cabins and glamping sites?',
    a: 'Units are spaced to maximize privacy, often tucked among trees. Outdoor living areas feel secluded, helping guests relax without frequent interruptions from neighbors.',
  },
  {
    q: 'Are restrooms and showers available year-round?',
    a: 'Yes, most accommodations include indoor showers and restrooms that operate year-round. Some seasonal sites may rely on composting or shared facilities — confirm before booking if this matters to you.',
  },
  {
    q: 'Can I cook my own meals on site?',
    a: [
      'Many units feature a kitchenette or full kitchen. There is also an outdoor kitchen option for grilling and communal meals. Bring basics and ',
      { text: 'local groceries', href: 'https://www.facebook.com/p/Farmstead-68-61574815305572/' },
      ' are available in nearby towns.',
    ],
  },
  {
    q: 'What should I know about weather and trail conditions?',
    a: [
      'Weather can change quickly on the Cumberland Plateau. Check forecasts before arrival, plan for rain, and avoid slick trails after heavy storms. Hosts often provide ',
      {
        text: 'Cumberland Trail State Park updates',
        href: 'https://friendsofthecumberlandtrail.org/trail-alerts-and-hours/',
      },
      ' and safety tips.',
    ],
  },
  {
    q: 'Is cell service and Wi-Fi available at the retreat?',
    a: 'Cell coverage varies by carrier and exact location on the property. Most treehouses provide Wi-Fi, but many guests enjoy limited connectivity as part of the nature retreat. Plan accordingly if you need consistent service.',
  },
  {
    q: 'Are there nearby dining options and attractions?',
    a: 'Local towns offer restaurants, cafes, and markets a short drive away. Regional attractions include state parks, scenic overlooks, and visitor centers where you can learn about local history and ecology.',
  },
  {
    q: 'Is camping allowed on the land and are there tent sites?',
    a: [
      'Yes, there are designated tent sites for those who prefer ',
      {
        text: 'traditional camping',
        href: 'https://www.hipcamp.com/en-US/land/tennessee-awakening-adventures-9mxhzp0q/sites/603949?siteId=603949&adults=1&children=0',
      },
      '. Sites have space for a fire ring when permitted and are close to trailheads for quick access to hikes.',
    ],
  },
  {
    q: 'How do I book and what is the cancellation policy?',
    a: [
      'Reservations are made through the ',
      {
        text: 'property’s booking platform',
        href: 'https://awakeningadventuresllc.com/home/awakening-adventures-lodging-gallery/',
      },
      ' or a listed host. Cancellation policies vary by unit and season; review terms at booking and contact the host with questions before finalizing plans.',
    ],
  },
  {
    q: 'Are children welcome and are there family-friendly activities?',
    a: 'Families are welcome. Trails range in difficulty so you can choose family-friendly loops. Outdoor activities like creek wading, nature walks, and evening campfires are great for kids. Supervision is required near water and steep areas. There are also multiple swings around the main camp area.',
  },
  {
    q: 'What safety measures are in place for exploring waterfalls?',
    a: 'Guests are asked to stay on marked trails, avoid cliff edges, and exercise caution on wet rocks. Hosts provide maps and guidance; bring a first-aid kit and hike with a partner when possible.',
  },
  {
    q: 'Can I celebrate a small event or gather with a group on-site?',
    a: 'Small gatherings are allowed with prior approval. There are communal spaces for evenings and meals, but amplified music and large parties are restricted to preserve tranquility for all guests.',
  },
  {
    q: 'Where can I find trail maps and local guide recommendations?',
    a: 'Hosts supply trail maps and can suggest routes based on ability and time. Visitor centers in nearby towns also offer maps, guided programs, and up-to-date trail conditions.',
  },
  {
    q: 'What makes this retreat special compared to a typical cabin rental?',
    a: 'The property blends curated outdoor living — like treehouse stays and tranquil mornings — with access to waterfalls, rugged trails, and an outdoor kitchen. It emphasizes solitude, natural beauty, and simple comforts to recharge.',
  },
  {
    q: 'Is there heat and A/C?',
    a: 'All of our units have some form of heating and air. Contact us so we can accommodate you in the best way possible.',
  },
];

function renderAnswer(a: FAQ['a']) {
  if (typeof a === 'string') return a;
  return a.map((chunk, i) =>
    typeof chunk === 'string' ? (
      <span key={i}>{chunk}</span>
    ) : (
      <a
        key={i}
        href={chunk.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 hover:text-amber transition-colors"
      >
        {chunk.text}
      </a>
    ),
  );
}

export default function FAQPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[68rem]">
          <p className="eyebrow text-cream/55 mb-4">Frequently asked</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Questions guests ask before they come.
          </h1>
          <p className="editorial mt-8 text-cream">
            If something isn&rsquo;t answered here, just{' '}
            <Link href="/contact" className="underline underline-offset-4 hover:text-amber">
              reach out
            </Link>{' '}
            &mdash; we&rsquo;ll write back the same day.
          </p>
        </header>

        <section className="mt-16 max-w-[68rem]">
          <ul className="divide-y divide-cream/15 border-t border-b border-cream/15">
            {FAQS.map((item, i) => (
              <li key={i}>
                <details className="group">
                  <summary
                    className="
                      flex items-start justify-between gap-6
                      cursor-pointer list-none
                      py-6
                      font-display text-lede text-cream
                      transition-colors duration-300
                      hover:text-amber
                    "
                  >
                    <span>{item.q}</span>
                    <span
                      aria-hidden="true"
                      className="
                        shrink-0 mt-2 text-amber
                        transition-transform duration-300
                        group-open:rotate-45
                      "
                    >
                      +
                    </span>
                  </summary>
                  <p className="font-sans text-body text-cream/85 leading-[1.62] pb-6 pr-12 max-w-[60rem]">
                    {renderAnswer(item.a)}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 max-w-[60rem] flex flex-col md:flex-row gap-6">
          <Link href="/lodging" className="cta-primary inline-flex">
            See all five places
          </Link>
          <Link href="/contact" className="cta-primary inline-flex">
            Ask Anthony directly
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
