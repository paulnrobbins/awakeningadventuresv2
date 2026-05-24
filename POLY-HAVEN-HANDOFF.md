# Poly Haven HDRI handoff — DAYTIME edition

The site now ships in daytime mode. The `EnvironmentRig` swaps HDRIs per scene via `content/scenes.ts`. If a file isn't in `public/hdri/` the Suspense boundary catches it and the scene renders with just the ambient + directional + hemisphere lighting (still daytime, just less atmospheric).

For the real Tennessee-forest feel, drop these into `public/hdri/`. All four are free, CC0 (public domain), no attribution required.

## Files needed

| Filename | Scene(s) | Why this one |
|---|---|---|
| `kiara_1_dawn_2k.hdr` | 0 Arrival · 5 Welcome · 6 Groups | Warm early-morning / golden-hour outdoor light. Sells "first light over the property" and "warm late afternoon at the fire pit" |
| `kloofendal_43d_clear_2k.hdr` | 1 Sanctuary · 2 Stay · 4 Lake · 7 Book | Clear midday sky. Crisp shadows and the bright daylight feel needed for property pull-back, accommodation reveals, and lake horizon |
| `forest_slope_2k.hdr` | 3 Trails | Inside-the-forest HDRI with filtered light shafts through trees — perfect for the trail descent scene |

## How to download

The fastest path is the per-file download page. URLs:

- https://polyhaven.com/a/kiara_1_dawn
- https://polyhaven.com/a/kloofendal_43d_clear
- https://polyhaven.com/a/forest_slope

On each page choose **HDRI · 2K · .hdr**. (4K is overkill for web, 1K is too soft.)

Drop the files into `~/Desktop/Kingdom-Digital-Services/Websites/awakening-adventures/public/hdri/`.

## Once they're in place

`npm run dev` — the world's lighting jumps from "rendered" to "real Tennessee at midday." The Stargazer's plexiglass picks up real-world sky reflections, the cabin wood gets accurate warm color, the lake scene reads as bright open water.

## File sizes

Each 2K HDRI is roughly 6–12 MB. They will commit to git if you drop them straight in — that's fine for now while we're shipping. To move them to Cloudflare R2 + the `NEXT_PUBLIC_ASSET_CDN` env var, the code in `lib/three.ts` already supports the swap with zero changes — just set the env var in Vercel.
