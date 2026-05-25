import Link from 'next/link';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';
import { ACCOMMODATIONS, FULL_PROPERTY_BOOKING_URL } from '@/content/accommodations';
import { LoopingVideo } from '@/components/ui/LoopingVideo';

export const metadata = {
  title: 'Lodging',
  description:
    'Five ways to stay on 42 acres in Grandview, TN — the Stargazer clear cabin, Driftwood treehouse, Homestead glamping tent, Serene Seven prairie tent, and the primitive camping site. Or reserve the whole property for your group.',
};

/**
 * Lodging page — four accommodation cards + one whole-property card.
 *
 * Each accommodation renders a looping muted video walkthrough (per
 * `a.video` in content/accommodations.ts) instead of the old photo
 * carousel. Videos were converted from StudioWork .MOV files via the
 * FFmpeg batch in /scripts; the rotated shower-house pair lives there
 * too (not on this page — it's on /sanctuary).
 */
export default function LodgingPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[60rem] mb-20">
          <p className="eyebrow text-cream/75 mb-4">Lodging</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Five places to wake up.
          </h1>
          <p className="editorial mt-8 text-cream">
            Pick a single stay, or reserve the entire 42 acres for your
            group. Every booking includes the treehouse shower and the run
            of the trails.
          </p>
        </header>

        <ul className="space-y-24 md:space-y-32 max-w-[88rem] mx-auto">
          {ACCOMMODATIONS.map((a, i) => {
            const isReverse = i % 2 !== 0;
            return (
              <li
                key={a.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div
                  className={`lg:col-span-5 ${isReverse ? 'lg:order-2 lg:col-start-8' : ''}`}
                >
                  {a.video ? (
                    <LoopingVideo
                      src={a.video}
                      poster={a.images?.[0] ?? a.heroImage}
                      alt={`${a.name} — ${a.kind} walkthrough`}
                      aspect="aspect-[9/16]"
                      className="max-w-[26rem] mx-auto"
                    />
                  ) : (
                    <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-cream/15 max-w-[26rem] mx-auto">
                      <img
                        src={a.images?.[0] ?? a.heroImage}
                        alt={`${a.name} — ${a.kind}`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div
                  className={`lg:col-span-7 ${isReverse ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-6'}`}
                >
                  <div className="bg-night/90 border border-cream/20 rounded-xl p-8 md:p-10 h-full flex flex-col justify-center">
                    <p className="eyebrow text-amber mb-2">{a.kind}</p>
                    <h2 className="font-display text-title text-cream">{a.name}</h2>
                    <p className="editorial mt-4 text-cream">{a.hook}</p>
                    <p className="mt-3 font-sans text-caption text-cream/70">{a.capacity}</p>
                    <a
                      href={a.bookingUrl ?? process.env.NEXT_PUBLIC_FAREHARBOR_URL ?? '#book'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-primary mt-6"
                    >
                      {a.ctaLabel}
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Whole-property option — distinct tile, amber border, full-width.
            For groups, retreats, family reunions. Includes the RV spot,
            which is only available with the full-property booking
            (covered on /groups). The primitive camping site is bookable
            on its own too — listed as a separate card above. */}
        <section className="mt-32 max-w-[88rem] mx-auto">
          <a
            href={FULL_PROPERTY_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group block rounded-xl overflow-hidden
              bg-night/90 border-2 border-amber/70
              shadow-[0_14px_40px_-16px_rgba(199,122,58,0.45)]
              transition-all duration-500 ease-cinematic
              hover:-translate-y-1 hover:border-amber
              hover:shadow-[0_24px_70px_-20px_rgba(199,122,58,0.65)]
            "
          >
            <div className="grid grid-cols-1 md:grid-cols-12 items-center">
              <div className="md:col-span-5 p-6 md:p-10">
                <LoopingVideo
                  src="/videos/forty-two.mp4"
                  poster="/images/stargazer/1.jpg"
                  alt="The whole 42 acres — walkthrough"
                  aspect="aspect-[9/16]"
                  className="max-w-[24rem] mx-auto"
                />
              </div>
              <div className="md:col-span-7 flex flex-col justify-center p-8 md:p-12">
                <p className="eyebrow text-amber mb-3">Whole property</p>
                <h2 className="font-display text-display text-cream leading-[0.95]">
                  The Forty-Two.
                </h2>
                <p className="editorial mt-6 text-cream">
                  Reserve every cabin, tent, fire pit, and trail for your
                  group. Includes the RV spot, which isn&rsquo;t available
                  on individual stays. Two-night minimum. Sleeps up to
                  ~30 guests across the four dwellings and the primitive
                  camp.
                </p>
                <p
                  className="font-display text-lede text-amber mt-8 inline-flex items-center gap-2"
                >
                  Reserve the whole 42 acres
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-500 ease-cinematic group-hover:translate-x-2"
                  >
                    →
                  </span>
                </p>
              </div>
            </div>
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
