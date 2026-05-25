import Link from 'next/link';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';
import { DEVOTIONALS } from '@/content/blog-posts';

export const metadata = {
  title: 'Devotionals',
  description:
    "Listening prayer, Bible study, and scripture reflections from Anthony — devotionals written from the forest sanctuary on the Cumberland Plateau.",
};

export default function DevotionalsPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[68rem]">
          <p className="eyebrow text-cream/55 mb-4">Devotionals</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Come away with God.
          </h1>
          <p className="editorial mt-8 text-cream">
            Reflections on listening prayer, scripture, and the practice of
            quieting yourself to hear Jesus. Written by Anthony from the
            mountain prayer shelter and the New Perspective platform.
          </p>
        </header>

        <ul className="mt-16 max-w-[80rem] grid grid-cols-1 lg:grid-cols-2 gap-8">
          {DEVOTIONALS.map((post) => (
            <li
              key={post.url}
              className="border border-cream/15 rounded-xl p-8 md:p-10 hover:border-amber/60 transition-colors duration-500"
            >
              <p className="eyebrow text-amber mb-3">{post.date}</p>
              <h2 className="font-display text-title text-cream leading-tight">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber transition-colors"
                >
                  {post.title}
                </a>
              </h2>
              <p className="editorial mt-4 text-cream/85">{post.excerpt}</p>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary mt-8 inline-flex"
              >
                Read the devotional
              </a>
            </li>
          ))}
        </ul>

        <section className="mt-20 max-w-[60rem]">
          <p className="font-sans text-body text-cream/75">
            Want to read more?{' '}
            <Link href="/blog" className="underline underline-offset-4 hover:text-amber">
              The Blog
            </Link>{' '}
            has property guides, hiking itineraries, and trip-planning posts.
            Or visit the original devotional library on{' '}
            <a
              href="https://awakeningadventuresllc.com/blog/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-amber"
            >
              awakeningadventuresllc.com/blog
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
