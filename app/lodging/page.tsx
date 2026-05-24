import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';
import { ACCOMMODATIONS } from '@/content/accommodations';
import { ImageCarousel } from '@/components/ui/ImageCarousel';

export const metadata = { title: 'Lodging' };

export default function LodgingPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[60rem] mb-20">
          <p className="eyebrow text-cream/75 mb-4">Lodging</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Four places to wake up.
          </h1>
        </header>

        <ul className="space-y-24 md:space-y-32 max-w-[88rem] mx-auto">
          {ACCOMMODATIONS.map((a, i) => {
            const hasImages = a.images && a.images.length > 0;
            const isReverse = i % 2 !== 0;
            return (
              <li
                key={a.id}
                className={
                  hasImages
                    ? 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch'
                    : 'border border-cream/15 rounded-xl p-8 bg-night/85'
                }
              >
                {hasImages ? (
                  <>
                    <div className={`lg:col-span-5 h-full ${isReverse ? 'lg:order-2 lg:col-start-8' : ''}`}>
                      <ImageCarousel
                        images={a.images!}
                        altBase={`${a.name} — ${a.kind}`}
                        className="h-full min-h-0"
                      />
                    </div>
                    <div
                      className={`lg:col-span-6 h-full ${isReverse ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7'}`}
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
                  </>
                ) : (
                  <>
                    <p className="eyebrow text-amber/80 mb-2">{a.kind}</p>
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
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </main>
      <Footer />
    </>
  );
}
