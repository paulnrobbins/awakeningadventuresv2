# Maintaining the Awakening Adventures site

The site looks like an immersive 3D world but the editable parts are in plain text files. If you need to change a price, swap a photo, update a CTA, fix a typo in Anthony's bio — you're editing one of three small files.

This doc covers the most common edits. None of them require touching the 3D world or the scroll choreography.

## Edit accommodation details

File: `content/accommodations.ts`

This is the source of truth for all four lodging options. Each entry looks like:

```ts
{
  id: 'stargazer',
  name: 'Stargazer',
  kind: 'Clear plexiglass cabin',
  hook: 'A glass house under the Tennessee night sky. You sleep beneath the stars without the cold floor.',
  capacity: 'Sleeps 2',
  heroImage: '/images/stargazer-hero.jpg',
  ctaLabel: 'Book the Stargazer',
}
```

To rename a cabin, change `name`. To rewrite the hook, change `hook`. To change the CTA label that appears on the card and the booking scene, change `ctaLabel`. Save, push to Vercel, the change goes live.

## Edit testimonials

File: `content/reviews.ts`

Three testimonials are pulled verbatim from the existing site. To add a fourth, copy the shape of an existing one. To rotate which one appears in the Welcome scene, change which `find()` lookup in `components/sections/SceneWelcome.tsx` picks the testimonial — currently it looks for `'Sabrina'`. Change the string.

## Swap a photo

1. Drop the new file into `public/images/` with the same name (e.g. `stargazer-hero.jpg`)
2. Make sure it's under 400 KB — the readme has compression instructions
3. Push to Vercel

The 3D billboards re-load the texture automatically.

## Change the booking link

If Anthony moves FareHarbor accounts:

1. Open Vercel → Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_FAREHARBOR_URL` with the new embed URL
3. Redeploy: `vercel --prod` (or push any commit to trigger a deploy)

Every CTA on the site reads from that one variable.

## Change the headline tagline

File: `components/sections/SceneHero.tsx`

The three hero lines are inside an `<h1>`. Edit the text inside the `<span>` blocks. The animation timing will still work as long as you keep three lines — if you go to two or four, you'll also need to update the GSAP timeline above to match.

## Add a new page to the nav

Files: `components/layout/Nav.tsx` (top nav) + `components/sections/Footer.tsx` (footer nav)

Add an entry to the `NAV_LINKS` array. Then create a new file at `app/your-page-name/page.tsx` matching the shape of the existing simple pages (`app/contact/page.tsx` is the cleanest template).

## What NOT to touch unless you know what you're doing

These files run the 3D world. Edits here will usually break things if you're guessing:

- Anything under `components/three/`
- `app/page.tsx` — composing the scenes is intentional
- `tailwind.config.ts` and `styles/tokens.css` — the color and type lock lives here
- `lib/gsap.ts`, `lib/lenis.ts`, `lib/sound.ts` — the libraries that drive motion
- `next.config.js`

If you need to change something in those files and you're not sure how, message Paul.

## Updating sound assets

Sound cues live in `public/sound/` as MP3 files. The filenames in `lib/sound.ts` are the contract — if you replace `crickets.mp3`, the new file plays instantly. Free sources: Freesound.org (CC0 / CC-BY), Pixabay Sounds, BBC Sound Effects.

Keep cues short for one-shots (under 4 seconds), and looped cues should be at least 30 seconds long so the seam isn't audible.

## Edit the OG image

File: `app/opengraph-image.tsx`

The image is generated at build time from this React component. To change the headline or styling, edit the JSX. To use a real photo instead of styled type, replace this file with a static JPG at `public/og-image.jpg` and update the metadata in `app/layout.tsx` to point at it.
