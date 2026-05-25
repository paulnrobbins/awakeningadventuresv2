import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';
import { LoopingVideo } from '@/components/ui/LoopingVideo';
import {
  PONTOON_BOOKING_URL,
  ISLAND_CAMP_BOOKING_URL,
  ISLAND_CAMP_EMAIL,
  PRAYER_HIKE_EMAIL,
} from '@/content/excursions';

export const metadata = {
  title: 'Adventures',
  description:
    'Sunset pontoon tours and Watts Bar Dam lock tours on Watts Bar Lake, primitive island camping with water-taxi service, and guided spiritual prayer hikes on the Cumberland Plateau.',
};

export default function AdventuresPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[68rem] mb-12">
          <p className="eyebrow text-cream/75 mb-4">Adventures</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Watts Bar Lake. Twenty minutes from the property.
          </h1>
          <p className="editorial mt-8 text-cream">
            Sunset pontoon tours, primitive island camping trips, and guided
            prayer hikes on the Cumberland Plateau. Captain Anthony at the
            helm, USCG-licensed, hosting since 2022.
          </p>
        </header>

        {/* $50 discount call-out */}
        <aside
          className="
            max-w-[80rem] mt-12 mb-16
            border border-amber/60 rounded-xl
            bg-amber/10 backdrop-blur-sm
            p-6 md:p-8
          "
        >
          <p className="eyebrow text-amber mb-2">For lodging guests</p>
          <p className="font-display text-title text-cream leading-tight">
            $50 off every adventure when you book lodging with us.
          </p>
          <p className="editorial mt-3 text-cream">
            Stay a night at the Stargazer, Driftwood, Homestead, Serene Seven,
            or the primitive camping site and your sunset pontoon trip or
            island camping trip is $50 off. Mention your reservation when
            booking.
          </p>
        </aside>

        {/* === Boat tours ============================================= */}
        <section id="boat-tours" className="max-w-[88rem] mt-20 scroll-mt-32">
          {/* Looping muted video — 6 boat-tour clips concatenated back-to-back.
              Portrait 9/16. Constrained to a phone-shaped column on desktop so
              the portrait container doesn't span the full section width. */}
          <div className="mb-10 max-w-sm mx-auto">
            <LoopingVideo
              src="/videos/boat-tours.mp4"
              alt="Sunset pontoon excursions on Watts Bar Lake"
              aspect="aspect-[9/16]"
            />
          </div>

          <p className="eyebrow text-amber mb-3">On the water</p>
          <h2 className="font-display text-display text-cream leading-[0.95]">
            Sunset pontoon excursions on Watts Bar Lake.
          </h2>
          <p className="editorial mt-6 text-cream max-w-[60rem]">
            Watts Bar is one of the South&rsquo;s largest lakes — 72 miles
            long, 39,000 acres, 771 miles of shoreline. You&rsquo;ll see at
            least six islands on a half-day tour and more on the full day.
            Cruises run rain or shine; half the boat has a covered roof. Max
            of six passengers, emergency bathroom on board, USCG-licensed
            captain.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[80rem]">
            <div className="bg-night/85 border border-cream/20 rounded-xl p-6 md:p-8">
              <p className="eyebrow text-amber mb-2">What&rsquo;s included</p>
              <ul className="space-y-2">
                {[
                  'USCG-licensed captain at the helm',
                  'Cold filtered water and snacks',
                  'At least one marina stop available',
                  'Sunscreen and towels on board (just in case)',
                  'Emergency bathroom on the boat',
                  'Full day departs around 12–1 PM ET (varies by season)',
                  'Gas included in every quoted price',
                ].map((line, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span aria-hidden="true" className="font-display text-amber mt-1">·</span>
                    <span className="font-sans text-body text-cream">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-night/85 border border-cream/20 rounded-xl p-6 md:p-8">
              <p className="eyebrow text-amber mb-2">Pricing</p>
              <ul className="space-y-3 font-sans text-body text-cream">
                <li className="flex justify-between border-b border-cream/15 pb-2">
                  <span>Hourly</span>
                  <span className="font-display text-lede text-cream">$125/hr</span>
                </li>
                <li className="flex justify-between border-b border-cream/15 pb-2">
                  <span>Half day</span>
                  <span className="font-display text-lede text-cream">$400</span>
                </li>
                <li className="flex justify-between border-b border-cream/15 pb-2">
                  <span>Full day</span>
                  <span className="font-display text-lede text-cream">$600</span>
                </li>
                <li className="flex justify-between pt-2">
                  <span className="text-amber">Lodging-guest discount</span>
                  <span className="font-display text-lede text-amber">$50 off</span>
                </li>
              </ul>
              <p className="font-sans text-caption text-cream/70 mt-4">
                Two-person minimum. Gas included. Free refund minus booking
                fee if we cancel due to severe weather.
              </p>
            </div>
          </div>

          {/* Watts Bar Dam Lock Tour sub-section */}
          <div className="mt-12 max-w-[80rem]">
            <p className="eyebrow text-amber mb-2">Bonus tour</p>
            <h3 className="font-display text-title text-cream leading-tight">
              Watts Bar Dam Lock Tour — a giant water elevator.
            </h3>
            <p className="editorial mt-4 text-cream">
              We cast off from the Spring City marina, meander through the
              islands as the engine warms, then motor toward Dickey&rsquo;s
              Bluff (cliff jumping optional). We radio the lockmaster, and
              if we can lock through, we drop 65–70 feet inside the concrete
              chamber — about 45 minutes to change lakes. You&rsquo;ll see
              the nuclear plant cooling towers up close from the water on the
              way down to Chickamauga Lake. Sunset return into the marina is
              breathtaking. 15–20 miles round trip, three to four hours.
            </p>
            <p className="font-sans text-caption text-cream/70 mt-3">
              Up to six total passengers. Suggested: hat, sunglasses, weather-appropriate
              attire, change of clothes in case you get wet.
            </p>
          </div>

          <a
            href={PONTOON_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary mt-12"
          >
            Book a Boat Tour
          </a>
        </section>

        {/* === Island camping ======================================== */}
        <section id="island-camping" className="max-w-[88rem] mt-32 scroll-mt-32">
          {/* Looping muted video — 3 island-camping clips back-to-back
              (IMG_5715 clipped to first 9 seconds). Plus the new multiple-
              tents photo Paul saved into /public/images/island-camping/.
              Portrait 9/16 video; the photo below stays 16/9 landscape. */}
          <div className="mb-8 max-w-sm mx-auto">
            <LoopingVideo
              src="/videos/island-camping.mp4"
              alt="Primitive island camping on Watts Bar Lake — multiple campsites"
              aspect="aspect-[9/16]"
            />
          </div>
          <div className="mb-10 aspect-[16/9] rounded-xl overflow-hidden border border-cream/15 bg-cream/10">
            <img
              src="/images/island-camping/multiple-tents.webp"
              alt="Watts Bar Lake island camping — multiple tents on the island"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="eyebrow text-amber mb-3">Sleep on an island</p>
          <h2 className="font-display text-display text-cream leading-[0.95]">
            Watts Bar Lake island camping outfitter.
          </h2>
          <p className="editorial mt-6 text-cream max-w-[60rem]">
            You bring the desire; we provide the equipment and the
            water-taxi pontoon to get you there. Skip the crowded
            campgrounds. You&rsquo;ll choose from available campsites on the
            various islands. Current setups accommodate 2–6 people with
            multiple tent options for different sleeping arrangements.
            Dogs ride free.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[80rem]">
            <div className="bg-night/85 border border-cream/20 rounded-xl p-6 md:p-8">
              <p className="eyebrow text-amber mb-2">What you get</p>
              <ul className="space-y-2">
                {[
                  'Water-taxi service to and from the island',
                  'All camping gear set up on site',
                  'Tents to fit 2–6 people in various arrangements',
                  'Sample setup ready when you arrive — Island life',
                  'Pet-friendly — dogs ride for free',
                ].map((line, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span aria-hidden="true" className="font-display text-amber mt-1">·</span>
                    <span className="font-sans text-body text-cream">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-night/85 border border-cream/20 rounded-xl p-6 md:p-8">
              <p className="eyebrow text-amber mb-2">Pricing</p>
              <ul className="space-y-3 font-sans text-body text-cream">
                <li className="flex justify-between border-b border-cream/15 pb-2">
                  <span>Equipment rental (1–6 nights)</span>
                  <span className="font-display text-lede text-cream">$195</span>
                </li>
                <li className="flex justify-between border-b border-cream/15 pb-2">
                  <span>Paddleboard add-on</span>
                  <span className="font-display text-lede text-cream">+$35</span>
                </li>
                <li className="flex justify-between border-b border-cream/15 pb-2">
                  <span>Kayak add-on</span>
                  <span className="font-display text-lede text-cream">+$50</span>
                </li>
                <li className="flex justify-between pt-2">
                  <span>Water taxi (included)</span>
                  <span className="font-display text-lede text-cream">$95/hr</span>
                </li>
              </ul>
              <p className="font-sans text-caption text-cream/70 mt-4">
                Same equipment price whether you stay one night or six. Water
                taxi has a one-hour minimum each way and is bundled into the
                trip price. One hour from Chattanooga or Knoxville,
                two hours from Nashville.
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-[60rem]">
            <p className="eyebrow text-amber mb-2">Pack light — please limit to</p>
            <ul className="font-sans text-body text-cream grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {[
                '1 backpack each',
                '1 tote per group',
                '1 cooler per group',
                'Clothing for weather + activities',
                'Sunscreen and bug spray',
                'Water shoes',
                'Personal flashlight',
              ].map((line, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span aria-hidden="true" className="font-display text-amber mt-1">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="font-sans text-caption text-cream/70 mt-4">
              Food, clothing, and sleeping bags are yours to bring.
            </p>
          </div>

          <div className="mt-12 flex flex-col md:flex-row gap-6">
            <a
              href={ISLAND_CAMP_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary"
            >
              Book island camping
            </a>
            <a href={ISLAND_CAMP_EMAIL} className="cta-primary">
              Or email Anthony first
            </a>
          </div>
        </section>

        {/* === Prayer hikes ========================================== */}
        <section id="prayer-hikes" className="max-w-[88rem] mt-32 scroll-mt-32">
          {/* Looping muted trail video (IMG_7078 from Grounds).
              Portrait 9/16, constrained to a phone-shaped column on desktop. */}
          <div className="mb-10 max-w-sm mx-auto">
            <LoopingVideo
              src="/videos/trails.mp4"
              alt="Trails and forest — guided spiritual prayer hike footage"
              aspect="aspect-[9/16]"
            />
          </div>
          {/* Hidden remnant of the old photo strip removed in this pass.
              The video covers the same ground (literally) more effectively. */}
          <ul className="hidden">
            {[
              '/images/grounds/1.jpg',
              '/images/perspective/1.jpg',
              '/images/grounds/2.jpg',
              '/images/perspective/2.jpg',
            ].map((src, n) => (
              <li key={n}>
                <img
                  src={src}
                  alt={`Prayer hike trails and perspective platform — view ${n + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </li>
            ))}
          </ul>

          <p className="eyebrow text-amber mb-3">On foot, on the trail</p>
          <h2 className="font-display text-display text-cream leading-[0.95]">
            Guided spiritual prayer hikes.
          </h2>
          <p className="editorial mt-6 text-cream max-w-[60rem]">
            Led by Anthony — a child of God who loves the Creator and His
            creation, sharing the joy that hiking brings so others can
            experience God in a fresh new way. Hikes are led by the Holy
            Spirit, sometimes themed, fluid rather than rigid, focused time
            with God on the trail.
          </p>

          <blockquote className="mt-8 max-w-[60rem] border-l-2 border-amber pl-6 italic font-display text-lede text-cream/90">
            &ldquo;Let us draw near with a true heart in full assurance of
            faith&hellip; and let us consider one another in order to stir up
            love and good works, not forsaking the assembling of ourselves
            together, as is the manner of some, but exhorting one another, and
            so much the more as you see the Day approaching.&rdquo;
            <footer className="not-italic eyebrow text-amber mt-3">Hebrews 10:22–25</footer>
          </blockquote>

          {/* Three hike options */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[88rem]">
            <article className="bg-night/85 border border-cream/20 rounded-xl p-6">
              <p className="eyebrow text-amber mb-2">Curated prayer walk</p>
              <h3 className="font-display text-title text-cream leading-tight">
                A New Perspective
              </h3>
              <p className="editorial mt-3 text-cream text-sm">
                Horseshoe Ridge Loop — a short hike to the top of the bluff
                with six stops along the way, each with a bench to sit on.
              </p>
              <dl className="mt-5 space-y-2 font-sans text-caption text-cream/85">
                <div className="flex justify-between"><dt className="text-cream/55">Where</dt><dd>The property</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">Distance</dt><dd>.7 mile loop</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">Difficulty</dt><dd>Moderate</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">Ascent</dt><dd>242 ft</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">When</dt><dd>Anytime</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">Cost</dt><dd>Free</dd></div>
              </dl>
            </article>

            <article className="bg-night/85 border border-cream/20 rounded-xl p-6">
              <p className="eyebrow text-amber mb-2">Cumberland Trail</p>
              <h3 className="font-display text-title text-cream leading-tight">
                Windlass Cave
              </h3>
              <p className="editorial mt-3 text-cream text-sm">
                A variety of forest land etched with beautiful moss-covered
                boulders. Unique trees and stream crossings. The pinnacle —
                where three streams converge and disappear into the cave.
              </p>
              <dl className="mt-5 space-y-2 font-sans text-caption text-cream/85">
                <div className="flex justify-between"><dt className="text-cream/55">Where</dt><dd>Brady Mountain trailhead</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">Distance</dt><dd>3.2 mi total</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">Difficulty</dt><dd>Moderate</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">Ascent</dt><dd>342 ft total</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">Capacity</dt><dd>First 8 to register</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">Cost</dt><dd>Free-will donation</dd></div>
              </dl>
            </article>

            <article className="bg-night/85 border border-cream/20 rounded-xl p-6">
              <p className="eyebrow text-amber mb-2">Cumberland Trail</p>
              <h3 className="font-display text-title text-cream leading-tight">
                Grassy Cove
              </h3>
              <p className="editorial mt-3 text-cream text-sm">
                Follow Brady Mountain ridge out to an amazing overlook of
                Grassy Cove — the largest sinkhole in North America. Nearly
                all uphill to the overlook, downhill on the return.
                Beautiful old trees throughout.
              </p>
              <dl className="mt-5 space-y-2 font-sans text-caption text-cream/85">
                <div className="flex justify-between"><dt className="text-cream/55">Where</dt><dd>Brady Mountain trailhead</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">Distance</dt><dd>4.6 mi total</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">Difficulty</dt><dd>Moderate</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">Ascent</dt><dd>500 ft to bluff</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">Capacity</dt><dd>First 12 to register</dd></div>
                <div className="flex justify-between"><dt className="text-cream/55">Cost</dt><dd>Free-will donation</dd></div>
              </dl>
            </article>
          </div>

          {/* What to bring */}
          <div className="mt-10 max-w-[60rem]">
            <p className="eyebrow text-amber mb-2">What to bring</p>
            <ul className="font-sans text-body text-cream grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {[
                'Your rested self',
                'Enough water to stay hydrated',
                'Your Bible (a phone app is lightest)',
                'Clothes for the day’s weather — cooler in the forest',
              ].map((line, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span aria-hidden="true" className="font-display text-amber mt-1">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <a href={PRAYER_HIKE_EMAIL} className="cta-primary mt-12">
            Email to sign up for a hike
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
