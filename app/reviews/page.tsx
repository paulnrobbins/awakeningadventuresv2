import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';
import { ReviewMarquee } from '@/components/ui/ReviewMarquee';
import { REVIEWS } from '@/content/reviews';

export const metadata = {
  title: 'Reviews',
  description:
    "What guests say about staying at Awakening Adventures — verbatim reviews from Airbnb, Hipcamp, and Google, hosted by Anthony and Barb in Grandview, TN.",
};

export default function ReviewsPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[68rem]">
          <p className="eyebrow text-cream/55 mb-4">Reviews</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            What guests say after they stay.
          </h1>
          <p className="editorial mt-8 text-cream">
            Verbatim from Airbnb, Hipcamp, and Google. Hipcamp doesn&rsquo;t
            offer an embeddable review widget, so the marquee below pulls
            from a curated set of real guest quotes. Click through to the
            originals to see the full reviews + leave one yourself.
          </p>
        </header>

        {/* Animated marquee — two rows of guest quotes scrolling
            in opposite directions. */}
        <section className="mt-12 -mx-section-x">
          <ReviewMarquee />
        </section>

        {/* Full quote list — every review in long form */}
        <section className="mt-20 max-w-[80rem]">
          <p className="eyebrow text-amber mb-6">Every review, full text</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {REVIEWS.map((r, i) => (
              <li
                key={i}
                className="border border-cream/15 rounded-xl p-8 bg-night/40"
              >
                <p
                  className="font-display text-amber"
                  aria-label={`${r.rating} stars`}
                >
                  {'★'.repeat(r.rating)}
                </p>
                {r.title ? (
                  <h3 className="font-display text-title text-cream mt-2 leading-tight">
                    {r.title}
                  </h3>
                ) : null}
                <blockquote className="font-sans text-body text-cream/90 mt-3 leading-[1.6]">
                  &ldquo;{r.body}&rdquo;
                </blockquote>
                <p className="mt-4 eyebrow text-cream/65">
                  {r.author} &middot; {r.stay}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Live review platforms — go-to spots for guests to leave their own */}
        <section className="mt-20 max-w-[60rem]">
          <p className="eyebrow text-amber mb-4">Leave a review</p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <li>
              <a
                href="https://www.hipcamp.com/en-US/land/tennessee-awakening-adventures-9mxhzp0q"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary w-full justify-center inline-flex"
              >
                On Hipcamp
              </a>
            </li>
            <li>
              <a
                href="https://www.google.com/search?q=Awakening+Adventures+Grandview+TN"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary w-full justify-center inline-flex"
              >
                On Google
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/profile.php?id=100091124260581"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary w-full justify-center inline-flex"
              >
                On Facebook
              </a>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
