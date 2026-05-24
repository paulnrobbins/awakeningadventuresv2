import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-night text-cream film-grain">
      <p className="eyebrow text-cream/55 mb-4">Off the trail</p>
      <h1 className="font-display text-hero text-amber leading-[0.88]">
        404
      </h1>
      <p className="editorial mt-8 mx-auto">
        You stepped past the property line. There’s nothing out here yet.
      </p>
      <Link href="/" className="cta-primary mt-12">
        Back to the property
      </Link>
    </main>
  );
}
