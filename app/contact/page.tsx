import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';

export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[58rem]">
          <p className="eyebrow text-cream/55 mb-4">Contact</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Talk to Anthony &amp; Barb.
          </h1>
          <p className="editorial mt-8">
            Email is the fastest path. For bookings, FareHarbor is wired
            on every page — use the “Come and see” button.
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
      </main>
      <Footer />
    </>
  );
}
