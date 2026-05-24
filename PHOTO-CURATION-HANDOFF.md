# Photo curation handoff

The site references 9 curated photos from `StudioWork/Awakening Adventures/`. Each gets copied into `public/images/` under a specific filename so the code's import paths stay stable as you swap photos in and out.

The build runs without these — the photo billboards in Scene 2 and the future hero plates in Scene 6 just don't render. Drop them in when ready.

## Folder map

```
public/images/
  ├── stargazer-hero.jpg          ← Stargazer/ best 3/4 exterior (IMG_7100.jpeg works)
  ├── driftwood-hero.jpg          ← Driftwood/ best treehouse shot
  ├── homestead-hero.jpg          ← Homestead/ tent with stove visible
  ├── serene-seven-hero.jpg       ← Serene-Seven/sereneseven.webp
  ├── grounds-trail.jpg           ← Grounds/ best forest-trail shot
  ├── anthony-barb-welcome.jpg    ← TBD — your pick of the host photo
  ├── fire-pit.jpg                ← Grounds/ best fire-pit shot
  ├── pontoon-lake.jpg            ← Boating/ best sunset pontoon shot
  └── perspective-platform.jpg    ← Grounds/Perspective Platform/
```

## How to curate (the criteria that matter)

For each slot:

1. **Read the alt-text** in `content/photos.ts` — that's the visual story the photo needs to carry
2. **Pick the photo where the subject is unambiguous** — for the Driftwood slot, choose the shot where you can clearly tell it's a treehouse, not a generic wood structure
3. **Prefer dusk / golden hour over harsh midday** — the world is dusk-into-night; midday photos fight the atmosphere
4. **Prefer wider compositions over close-ups** — these get displayed at ~3m wide in 3D space; tight crops look wrong
5. **Avoid photos with people in them EXCEPT for the welcome slot** — the brand is the place; photos with strangers in them push the visitor out

## Recommended starting set

Based on what I saw in the Stargazer/ folder, these are strong defaults — you can swap any of them later:

| Slot | Suggested source |
|---|---|
| stargazer-hero.jpg | `Stargazer/IMG_7100.jpeg` (3/4 angle, daylight) |
| anthony-barb-welcome.jpg | (your pick — I haven't browsed these folders) |
| serene-seven-hero.jpg | `Serene-Seven/sereneseven.webp` (already used as site hero — proven) |

## Compress before committing

The raw iPhone JPEGs are 3-5 MB each. The page loads 9 of them — that's 30+ MB without compression. Run them through:

```bash
# inside the project root
# install sharp once
npm i --no-save sharp

# then for each photo
npx sharp -i ~/your-raw-photo.jpeg \
  -o public/images/stargazer-hero.jpg \
  resize 1600 -- format jpeg quality 82
```

Or use the macOS Preview "Export → quality slider at ~70%" — equivalent quality, no terminal.

Target: each photo under 400 KB.

## Confirming it worked

Run `npm run dev`, scroll to the property scene (after the hero). You should see two photo billboards floating in the world space behind the editorial paragraph — one on the trail side, one near where Anthony & Barb's welcome moment will live. They tilt slightly forward, have a soft drop shadow, and breathe with a micro yaw movement.

If you see them — great. If you see one with a question mark or a black square, the path is wrong or the file isn't where it should be.
