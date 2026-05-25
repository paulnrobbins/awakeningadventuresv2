import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';
import { LoopingVideo } from '@/components/ui/LoopingVideo';

export const metadata = { title: 'Contact' };

// Random photo cluster — pulled from across the property so the
// contact page feels like the property itself, not a sterile form.
const PHOTO_CLUSTER = [
  { src: '/images/stargazer/1.jpg', alt: 'Stargazer cabin at dusk' },
  { src: '/images/driftwood/1.jpg', alt: 'Driftwood treehouse in the canopy' },
  { src: '/images/sanctuary/prayer-shelter.webp', alt: 'Mountain prayer shelter' },
  { src: '/images/sanctuary/rock-bridge.webp', alt: 'Rock bridge on the trail' },
  { src: '/images/homestead/1.jpg', alt: 'Homestead glamping tent' },
  { src: '/images/serene-seven/1.jpg', alt: 'Serene Seven tent on the prairie' },
];

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[58rem]">
          <p className="eyebrow text-cream/55 mb-4">Contact</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            We&rsquo;d love to talk to you!
          </h1>
          <p className="editorial mt-8">
            Reach out if you have any questions, concerns or comments.
            Email is the fastest path — we&rsquo;ll get back to you within a day.
          </p>
        </header>

        <dl className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[60rem]">
          <div>
            <dt className="eyebrow text-cream/55">Email</dt>
            <dd className="font-sans text-body text-cream mt-2">
              <a href="mailto:support@awakeningadventuresllc.com" className="underline underline-offset-4 hover:text-amber">
                support@awakeningadventuresllc.com
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-cream/55">Property</dt>
            <dd className="font-sans text-body text-cream mt-2">
              Grandview, TN<br />Cumberland Plateau
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-cream/55">Lake</dt>
            <dd className="font-sans text-body text-cream mt-2">
              Watts Bar Lake marina<br />20 minutes from the property
            </dd>
          </div>
        </dl>

        {/* 42-acre looping property video — soft proof of life. */}
        <section className="mt-20 max-w-[88rem]">
          <p className="eyebrow text-amber mb-4">A little of what you&rsquo;d see</p>
          <div className="max-w-[26rem] mx-auto">
            <LoopingVideo
              src="/videos/forty-two.mp4"
              alt="A walk through the 42-acre property"
              aspect="aspect-[9/16]"
            />
          </div>
        </section>

        {/* Photo cluster — visual letterhead, not a gallery */}
        <section className="mt-20 max-w-[88rem]">
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {PHOTO_CLUSTER.map((p, i) => (
              <li
                key={i}
                className="aspect-square overflow-hidden rounded-lg border border-cream/15 bg-cream/10"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-12 max-w-[60rem] font-sans text-body text-cream/80">
          Or come walk it with us &mdash;{' '}
          <a href="/lodging" className="underline underline-offset-4 hover:text-amber">
            see all five places to stay
          </a>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
