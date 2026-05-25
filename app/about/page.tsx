import Link from 'next/link';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';

export const metadata = {
  title: 'About Us',
  description:
    'Awakening Adventures is a 42-acre forest sanctuary in Grandview, TN, hosted by Anthony and Barb. Built as a place to come away with God — listening prayer, treehouses, trails, and the mountain prayer shelter.',
};

const YOUTUBE_ID = 'fwesejwJyk8';

// Anthony's LISTEN acronym — kept exactly as he wrote it in the blog.
// Not paraphrased. The acronym IS the story.
const LISTEN = [
  { letter: 'L', word: 'Look to Jesus' },
  { letter: 'I', word: 'Inside the secret place' },
  { letter: 'S', word: 'Surrendered' },
  { letter: 'T', word: 'To hear His voice and be' },
  { letter: 'E', word: 'Effective in prayer' },
  { letter: 'N', word: 'Never doubting' },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[68rem]">
          <p className="eyebrow text-cream/55 mb-4">About Us</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            We built a forest sanctuary<br />so guests could come away with God.
          </h1>
          <p className="editorial mt-8 text-cream">
            42 wooded acres on the Cumberland Plateau, 20 minutes from
            Watts Bar Lake. Seven beds across four dwellings — the Driftwood
            treehouse, the Stargazer clear cabin, the Homestead glamping
            tent, the Serene Seven prairie tent — plus three and a half
            miles of trail, a 50-foot observation platform, a perspective
            platform up in two red oaks, and the mountain prayer shelter
            tucked into the back corner of the sanctuary. Hosted, by us,
            Anthony and Barb. Family dogs Chief and White Paw will be
            happy to greet you.
          </p>
        </header>

        {/* YouTube video — embedded with cookie-less privacy domain so we
            don't ship tracking on a property whose mission is silence. */}
        <section className="mt-16 max-w-[80rem]">
          <div
            className="relative w-full rounded-xl overflow-hidden border border-cream/20"
            style={{ aspectRatio: '16 / 9' }}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1`}
              title="Awakening Adventures — meet the hosts"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </section>

        {/* Why we built this — Anthony's mission framing, in his voice */}
        <section className="mt-24 max-w-[68rem] grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-7">
            <p className="eyebrow text-amber mb-4">Why we built this</p>
            <h2 className="font-display text-display text-cream leading-[1.0]">
              Because God is the Greatest Adventure of ALL.
            </h2>
            <p className="editorial mt-8 text-cream">
              We opened the property to give visitors a quiet retreat close
              to nature — a sanctuary where silence helps you sort your
              life and renew purpose. The whole place is built around
              listening prayer. Away from the noise. Away from the
              distractions.
            </p>
            <p className="editorial mt-4 text-cream">
              We believe we can all learn something from one another. We
              love guest interaction, and we also respect guest privacy and
              the need for solitude. Walk the trails. Sit at the fire pit.
              Climb to the perspective platform. Come and pray. Stay as
              short or as long as you need.
            </p>
          </div>

          <aside className="md:col-span-5">
            <p className="eyebrow text-amber mb-4">Listen</p>
            <p className="font-sans text-body text-cream/85 mb-6">
              Anthony&rsquo;s framing for listening prayer:
            </p>
            <ul className="space-y-3">
              {LISTEN.map(({ letter, word }) => (
                <li key={letter} className="flex items-baseline gap-4">
                  <span className="font-display text-lede text-amber w-6">
                    {letter}
                  </span>
                  <span className="font-sans text-body text-cream">{word}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {/* Anthony's testimony — verbatim. The rough edges are the point. */}
        <section className="mt-24 max-w-[60rem]">
          <p className="eyebrow text-amber mb-4">From Anthony</p>
          <blockquote className="font-display text-lede text-cream leading-[1.5] border-l-2 border-amber pl-6 italic">
            &ldquo;I&rsquo;ve personally experienced the presence of God and the
            inner voice of Jesus speaking to my heart while sitting by the
            fire at the mountain prayer shelter. The chuckle turned into
            joyful laughter, joyful crying with tear-filled eyes. I
            couldn&rsquo;t help but hoot, holler and shout Hallelujah for
            the joy was overflowing!&rdquo;
          </blockquote>
          <p className="editorial mt-6 text-cream">
            Following Jesus is listening. Come to the mountain to pray and
            get answers — Jesus did. The mountain prayer shelter is named
            for Luke 6:12, when Jesus went out to the mountain to pray and
            continued all night in prayer to God.
          </p>
        </section>

        {/* Scripture index — verses we keep coming back to */}
        <section className="mt-24 max-w-[68rem]">
          <p className="eyebrow text-amber mb-4">Verses we keep coming back to</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 font-sans text-body text-cream">
            <li><span className="text-amber">John 10:27</span> &mdash; My sheep hear my voice.</li>
            <li><span className="text-amber">Isaiah 55:1&ndash;3</span> &mdash; Incline your ear, listen, eat what is good.</li>
            <li><span className="text-amber">Luke 10:42</span> &mdash; Mary chose the one thing needed.</li>
            <li><span className="text-amber">John 15:4&ndash;5</span> &mdash; Abide in the vine.</li>
            <li><span className="text-amber">Luke 6:12&ndash;16</span> &mdash; Jesus went to the mountain to pray.</li>
            <li><span className="text-amber">Matthew 11:28&ndash;29</span> &mdash; Come to me, all who are weary.</li>
          </ul>
        </section>

        {/* CTA row — to the lodging page (the conversion path) AND to contact */}
        <section className="mt-24 max-w-[68rem] flex flex-col md:flex-row gap-6 md:gap-12 items-start">
          <Link href="/lodging" className="cta-primary inline-flex">
            Come and see
          </Link>
          <Link href="/contact" className="cta-primary inline-flex">
            Reach out
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
