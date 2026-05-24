import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';

export const metadata = {
  title: 'Sanctuary',
  description:
    'Cumberland Plateau Forest Sanctuary — 42 acres of refuge to seek the Lord. Trees, wildlife, trails, a prayer shelter with a natural stone altar, a treehouse shower, and a perspective platform built into two red oaks.',
};

const THINGS_WE_LOVE = [
  'Full moons',
  'Stargazing by the campfire on the prairie',
  'When the upper-level wind blows above but you don’t feel it below',
  'Fellowship with guests',
  'The manifestation of the Holy Spirit',
  'Endless nearby recreation',
  'The cool convection of the forest',
  'Watching the fireflies in the forest and on the prairie',
];

const TREES = [
  'Sourwood', 'Red Oak', 'White Oak', 'Sassafras', 'Hickory',
  'Loblolly', 'Hemlock', 'Red Maple', 'Dogwood', 'Sugar Maple',
  'Sweet Gum', 'Winged Elm', 'Pines', 'Holly', 'Mountain Laurel',
  'Big Leaf Magnolia', 'Wild Cherry', 'Persimmon',
];

const WILDLIFE = [
  'Deer', 'Red-Tail Hawks', 'Woodpeckers', 'Armadillo', 'Wild Turkey',
  'Skink', 'Red Fox', 'Geese', 'Eastern Box Turtle', 'Whippoorwill',
  'Grey Squirrels', 'Barred Owl', 'Frogs',
];

export default function SanctuaryPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[68rem]">
          <p className="eyebrow text-cream/75 mb-4">Cumberland Plateau Forest Sanctuary</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Forty-two acres of refuge to seek the Lord our God.
          </h1>
          <p className="editorial mt-8 text-cream">
            Sojourners, stewarding what the Lord has provided. A place to relax,
            be still, and take in the peace and quiet. Set aside the noise and
            distraction of the world to practice listening prayer. Experience
            God in a real, tangible way.
          </p>
        </header>

        {/* Things we love */}
        <section className="mt-16 max-w-[68rem]">
          <h2 className="font-display text-title text-cream">Things we love</h2>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {THINGS_WE_LOVE.map((line, i) => (
              <li key={i} className="flex items-start gap-3">
                <span aria-hidden="true" className="font-display text-amber mt-1">·</span>
                <span className="font-sans text-body text-cream">{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Treehouse Shower */}
        <section className="mt-20 max-w-[72rem]">
          <h2 className="font-display text-title text-cream">Best treehouse shower in Tennessee</h2>
          <p className="editorial mt-4 text-cream">
            Shower ten feet off the ground standing next to a live tree, with
            the view of the canopy above. All-natural toiletries are provided
            and the hot water is endless and on-demand.
          </p>
          <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n} className="aspect-[3/4] rounded-md overflow-hidden border border-cream/15 bg-cream/10">
                <img
                  src={`/images/shower/${n}.jpg`}
                  alt={`Treehouse shower — view ${n}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </li>
            ))}
          </ul>
        </section>

        {/* Outdoor Kitchen */}
        <section className="mt-20 max-w-[68rem]">
          <h2 className="font-display text-title text-cream">Outdoor kitchen</h2>
          <p className="editorial mt-4 text-cream">
            A shared kitchen for all guests. Three-burner propane stove,
            Blackstone griddle, sink with hot running water, and the pots, pans,
            and dishes to feed up to twenty-five. When the whole property is
            booked for a group, the kitchen becomes yours exclusively.
          </p>
        </section>

        {/* Trees + Wildlife */}
        <section className="mt-20 max-w-[80rem] grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-title text-cream">Trees</h2>
            <p className="editorial mt-4 text-cream">
              The forest holds an unusual mix for the Plateau. Among others
              you&rsquo;ll find:
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 font-sans text-body text-cream/90">
              {TREES.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-title text-cream">Wildlife</h2>
            <p className="editorial mt-4 text-cream">
              Listen long enough and you&rsquo;ll hear most of them. Watch long
              enough and you&rsquo;ll see most of them too:
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 font-sans text-body text-cream/90">
              {WILDLIFE.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Trails */}
        <section className="mt-20 max-w-[80rem]">
          <h2 className="font-display text-title text-cream">Trails</h2>
          <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <li key={n} className="aspect-[4/3] rounded-md overflow-hidden border border-cream/15 bg-cream/10">
                <img
                  src={`/images/grounds/${n}.jpg`}
                  alt={`Trails on the property — view ${n}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </li>
            ))}
          </ul>
          <p className="editorial mt-6 text-cream">
            Over five miles of walking trails wind across the property, featuring
            a wet-weather creek with a rock-bridge crossing. There&rsquo;s also a
            curated{' '}
            <a
              href="https://awakeningadventuresllc.com/guided-spiritual-prayer-hikes-near-grandviewtn/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-amber transition-colors"
            >
              prayer walk
            </a>{' '}
            laid out with intentional stops. Pull the trail map from{' '}
            <a
              href="https://www.alltrails.com/explore/map/2022-06-18-21-16-big-neck-loop-5a16bce?u=i"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-amber transition-colors"
            >
              AllTrails
            </a>{' '}
            before you arrive.
          </p>
        </section>

        {/* New Perspective Tree Platform */}
        <section className="mt-20 max-w-[80rem]">
          <h2 className="font-display text-title text-cream">New perspective tree platform</h2>
          <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <li key={n} className="aspect-[4/3] rounded-md overflow-hidden border border-cream/15 bg-cream/10">
                <img
                  src={`/images/perspective/${n}.jpg`}
                  alt={`Perspective tree platform — view ${n}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </li>
            ))}
          </ul>
          <p className="editorial mt-6 text-cream">
            An 8&times;16 platform nestled in two red oaks, just inside the
            forest. At eye level you&rsquo;re looking out at twenty-two feet
            above ground. A two-stage bridge gets you up to it. Favorite times
            are when the sun first lights the canopy in the morning, and again
            when it sets behind the ridge in the evening.
          </p>
        </section>

        {/* Prayer Shelter */}
        <section className="mt-20 max-w-[68rem]">
          <h2 className="font-display text-title text-cream">Prayer shelter</h2>
          <p className="editorial mt-4 text-cream">
            Inspired by Luke 6:12 — &ldquo;Now it came to pass in those days
            that Jesus went out to the mountain to pray, and continued all night
            in prayer to God.&rdquo; There&rsquo;s a natural unhewn-stone altar,
            built the way Exodus 20:25 talks about. Tucked into the back corner
            of the sanctuary forest for maximum quiet and solitude. Seek God
            alone or with a small group.
          </p>
        </section>

        <a
          href={process.env.NEXT_PUBLIC_FAREHARBOR_URL ?? '#book'}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-primary mt-16"
        >
          Come and see
        </a>
      </main>
      <Footer />
    </>
  );
}
