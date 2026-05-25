import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';
import { LoopingVideo } from '@/components/ui/LoopingVideo';

export const metadata = {
  title: 'Tree Platform Builders',
  description:
    'Hand-built tree platforms and decks across the Cumberland Plateau. On-site evaluation, tree assessment, and proposal — let’s make space to dwell in the trees.',
};

const RATE_LINES = [
  'Time plus materials, billed in 15-minute increments',
  '$50/hr for a 2-man crew on a platform less than 8 feet high',
  '$75/hr for a 2-man crew on a platform 8 to 20 feet high',
  'A small 8×12 platform with handrail averages about 20 hours; a 16×16 about 40 hours',
  'Estimates are $50–$100 payable at consultation and credited on your invoice',
];

const ESTIMATE_INCLUDES = [
  'On-site evaluation',
  'Tree assessment',
  'Project requirements review',
  'Written proposal',
];

type FeaturedBuild = {
  title: string;
  note: string;
  /** Either a still image OR a looping video. Exactly one is set. */
  image?: string;
  video?: string;
};

const FEATURED: FeaturedBuild[] = [
  {
    title: 'Magnolia tree playground',
    note: 'A multi-trunk magnolia turned into a play platform for the grandkids.',
    image: '/images/platform-builds/magnolia-playground.webp',
  },
  {
    title: 'One-tree, two-post platform',
    note: 'A standard build pattern — one anchoring tree paired with two ground posts.',
    image: '/images/platform-builds/tree-with-2-posts.webp',
  },
  {
    title: 'New Perspective',
    note: 'The 8×16 perspective platform built into two red oaks. Visit it on the property.',
    video: '/videos/perspective-platform.mp4',
  },
];

export default function TreePlatformBuildersPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[80rem]">
          <p className="eyebrow text-cream/75 mb-4">A side practice</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Tree Platform Builders.
          </h1>
          <p className="editorial mt-8 text-cream max-w-[60rem]">
            We build tree platforms, decks, and elevated playgrounds across the
            Cumberland Plateau. Every job starts with the trees themselves — a
            real on-site walk, a real tree assessment, and a proposal you can hold
            in your hand before any board gets cut.
          </p>

          {/* Hero photo of the perspective platform — our most ambitious
              build, and the one prospective clients will probably visit. */}
          <div className="mt-12 relative aspect-[21/9] rounded-xl overflow-hidden border border-cream/15 bg-cream/10">
            <img
              src="/images/perspective/4.jpg"
              alt="The 8×16 perspective tree platform built into two red oaks"
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* Rates */}
        <section className="mt-16 max-w-[68rem]">
          <p className="eyebrow text-amber mb-4">Rates &amp; details</p>
          <ul className="space-y-3">
            {RATE_LINES.map((line, i) => (
              <li key={i} className="flex items-start gap-3">
                <span aria-hidden="true" className="font-display text-amber mt-1">·</span>
                <span className="font-sans text-body text-cream">{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Estimate includes */}
        <section className="mt-12 max-w-[60rem]">
          <p className="eyebrow text-amber mb-4">Each estimate includes</p>
          <ul className="space-y-3">
            {ESTIMATE_INCLUDES.map((line, i) => (
              <li key={i} className="flex items-start gap-3">
                <span aria-hidden="true" className="font-display text-amber mt-1">·</span>
                <span className="font-sans text-body text-cream">{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Featured builds */}
        <section className="mt-16 max-w-[88rem]">
          <p className="eyebrow text-amber mb-6">Recent builds</p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED.map((f, i) => (
              <li
                key={i}
                className="bg-night/85 border border-cream/20 rounded-xl overflow-hidden"
              >
                {f.video ? (
                  <LoopingVideo
                    src={f.video}
                    alt={`${f.title} — recent platform build`}
                    aspect="aspect-[4/3]"
                    className="rounded-none"
                  />
                ) : (
                  <div className="aspect-[4/3] overflow-hidden bg-cream/10">
                    <img
                      src={f.image}
                      alt={`${f.title} — recent platform build`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="font-display text-title text-cream leading-tight">
                    {f.title}
                  </h2>
                  <p className="editorial mt-3 text-cream">{f.note}</p>
                </div>
              </li>
            ))}
          </ul>
          <a
            href="https://photos.app.goo.gl/iAwLZSK44ao9qiFu8"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary mt-8 inline-flex"
          >
            See the full photo album on Google Photos
          </a>
        </section>

        {/* CTA */}
        <section className="mt-20 max-w-[60rem]">
          <h2 className="font-display text-title text-cream leading-tight">
            Let&rsquo;s make space to dwell in the trees.
          </h2>
          <p className="editorial mt-4 text-cream">
            Reach out to schedule an on-site consultation. Bring your sketches,
            the dimensions you have in mind, or just the tree you&rsquo;re
            looking at. We&rsquo;ll come walk it with you.
          </p>
          <a
            href="mailto:support@awakeningadventuresllc.com"
            className="cta-primary mt-8"
          >
            Request a consultation
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
