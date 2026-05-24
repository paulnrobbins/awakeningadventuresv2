import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/sections/Footer';

export const metadata = { title: 'Field notes' };

/**
 * Field-notes page — placeholder. The existing site has a WordPress blog;
 * Phase 5 decides whether to (a) keep WordPress for posts and embed via
 * RSS, (b) migrate posts to MDX in /content/blog, or (c) drop blog
 * entirely. Anthony's call.
 */
export default function BlogPage() {
  return (
    <>
      <Nav />
      <main className="scene">
        <header className="max-w-[60rem]">
          <p className="eyebrow text-cream/55 mb-4">Field notes</p>
          <h1 className="font-display text-display text-cream leading-[0.95]">
            Notes from the property.
          </h1>
          <p className="editorial mt-8">
            Anthony writes occasionally — what the season looks like,
            what guests are saying, what is opening up on the lake.
          </p>
          <p className="font-sans text-caption text-cream/45 mt-12">
            Migrating posts from the WordPress blog next phase.
          </p>
        </header>
      </main>
      <Footer />
    </>
  );
}
