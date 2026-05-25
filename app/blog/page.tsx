import Link from 'next/link';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';
import { BLOG_POSTS } from '@/content/blog-posts';

export const metadata = {
  title: 'Blog',
  description:
    'Trip-planning guides, hiking itineraries, and property notes from Awakening Adventures — Grandview, TN.',
};

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[68rem]">
          <p className="eyebrow text-cream/55 mb-4">The Blog</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Notes from the property.
          </h1>
          <p className="editorial mt-8 text-cream">
            Property guides, weekend itineraries, hiking recommendations, and
            things we&rsquo;ve learned hosting on 42 acres in Grandview, TN.
          </p>
        </header>

        <ul className="mt-16 max-w-[80rem] grid grid-cols-1 lg:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
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
                Read the post
              </a>
            </li>
          ))}
        </ul>

        <section className="mt-20 max-w-[60rem]">
          <p className="font-sans text-body text-cream/75">
            Looking for scripture and listening-prayer reflections instead?{' '}
            <Link href="/devotionals" className="underline underline-offset-4 hover:text-amber">
              Devotionals
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
