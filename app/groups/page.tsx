import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';
import { LoopingVideo } from '@/components/ui/LoopingVideo';
import { FULL_PROPERTY_BOOKING_URL } from '@/content/accommodations';

export const metadata = { title: 'Group retreats' };

const AMENITIES: { label: string; href?: string }[] = [
  { label: '4 forest dwellings to choose from on 42 acres' },
  { label: 'RV spot — included only with whole-property bookings' },
  { label: 'Large primitive camping site — extra capacity for groups who want to camp out' },
  { label: 'Private treehouse shower' },
  { label: 'Mountain prayer shelter' },
  {
    label: '3+ miles of trails on the property',
    href: 'https://awakeningadventuresllc.com/guided-spiritual-prayer-hikes-near-grandviewtn/',
  },
  { label: 'Campfire wood and 10+ fire pits to choose from for your gathering' },
  { label: 'Centralized outdoor kitchen, dining area and fire-pit pagoda' },
  { label: 'Hammocks and tree swings scattered around' },
  {
    label: 'Groups receive discounts on Island Sunset Pontoon Boat Cruises — or a custom lake-day picnic experience',
    href: 'https://awakeningadventuresllc.com/island-sunset-pontoon-boat-excursions-on-watts-bar-lake/',
  },
];

export default function GroupsPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[80rem]">
          <p className="eyebrow text-cream/75 mb-4">Set apart</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Reserve the whole forty-two acres for your small church.
          </h1>
          <p className="editorial mt-8 text-cream max-w-[60rem]">
            Pastors and small-group leaders book the property end to end.
            We help you build the schedule, or we get out of the way so
            you can build your own. Two-night minimum on group bookings.
          </p>

          {/* Property loop — all 10 walkthrough videos concatenated.
              Gives leaders a moving sense of the whole 42 acres in one
              place. */}
          <div className="mt-12 max-w-[28rem] mx-auto">
            <LoopingVideo
              src="/videos/forty-two.mp4"
              alt="The whole 42-acre property — cabins, trails, kitchen, lake, prayer shelter"
              aspect="aspect-[9/16]"
            />
          </div>
        </header>

        <section className="mt-16 max-w-[68rem]">
          <p className="eyebrow text-amber mb-6">What&rsquo;s included</p>
          <ul className="space-y-3">
            {AMENITIES.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span aria-hidden="true" className="font-display text-amber mt-1">·</span>
                <span className="font-sans text-body text-cream">
                  {a.href ? (
                    <a
                      href={a.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-amber transition-colors"
                    >
                      {a.label}
                    </a>
                  ) : (
                    a.label
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* === Whole-property extras + camp-out option ============== */}
        {/* The RV spot is whole-property-only — surfaced here for
            retreat leaders. The primitive camping site is bookable on
            its own too (see the lodging page), but it's also the way
            to scale a group past the four dwellings, so it gets a
            section here as well. */}

        <section className="mt-20 max-w-[88rem]">
          <p className="eyebrow text-amber mb-3">Whole-property add-on</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 aspect-[4/3] rounded-xl overflow-hidden border border-cream/15 bg-cream/10">
              <img
                src="/images/groups/rv-spot.webp"
                alt="The RV spot on the property — available only with whole-property bookings"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-5">
              <h2 className="font-display text-title text-cream leading-tight">
                RV spot.
              </h2>
              <p className="editorial mt-4 text-cream">
                A dedicated RV parking site with hookups, included when
                you reserve the whole 42 acres. Park, plug in, and use it
                as the home base for your group&rsquo;s leadership while
                everyone else is in the cabins, tents, or primitive
                campsite.
              </p>
              <p className="font-sans text-caption text-cream/70 mt-3">
                Available only with whole-property bookings.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-20 max-w-[88rem]">
          <p className="eyebrow text-amber mb-3">Camp-out option for larger groups</p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 lg:order-2 aspect-[4/3] rounded-xl overflow-hidden border border-cream/15 bg-cream/10">
              <img
                src="/images/groups/primitive-camping.webp"
                alt="Large primitive camping site in the forest clearing"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 lg:order-1">
              <h2 className="font-display text-title text-cream leading-tight">
                Large primitive camping site.
              </h2>
              <p className="editorial mt-4 text-cream">
                A wide clearing deeper in the forest — bring your own
                tents, hammocks, and gear. Fire ring, picnic logs, and
                room to spread out. Ideal for a youth group, a men&rsquo;s
                retreat overflow, or anyone who&rsquo;d rather sleep on
                the ground than under a roof.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-16 flex flex-col md:flex-row gap-8">
          <a
            href={FULL_PROPERTY_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary"
          >
            Reserve the whole 42 acres
          </a>
          <a
            href="mailto:support@awakeningadventuresllc.com"
            className="cta-primary"
          >
            Talk to Anthony first
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
