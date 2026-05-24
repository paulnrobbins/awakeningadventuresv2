# Hyper3D handoff — Stargazer cabin GLB

Phase 3 ships with a procedural Stargazer (Three.js primitives matching the real cabin's gable + wood-stud + plexiglass + slat-roof structure). The site is fully shippable on the procedural version. If you want to upgrade to a real geometry-from-photos model via Hyper3D, this is the packet.

## Reference photos (already on your machine)

```
~/Desktop/Kingdom-Digital-Services/StudioWork/Awakening Adventures/Stargazer/
  ├── IMG_7100.jpeg     ← 3/4 exterior, canonical angle (USE)
  ├── IMG_7126.jpeg     ← front face, gable + framing detail (USE)
  └── IMG_7117.jpeg     ← interior, roof slats + scale (USE)
```

Upload all three to Hyper3D as multi-image input. Quality scales sharply with the second and third photos.

## Hyper3D prompt (paste into the create flow)

```
A small one-room glamping cabin built into a forest hillside. Wood-framed
gable-roofed greenhouse style structure, approximately 14 feet long by
8 feet wide by 9 feet tall at the peak. All four walls are clear
plexiglass panels between vertical wood stud posts spaced roughly every
3 feet. The roof is built from translucent bamboo or thin wood slats
running along the length, with a wooden ridge beam at the peak and a
narrow red ridge cap. The cabin sits on a raised wood deck about 8
inches off the ground. The front face has a wooden door with a clear
plexiglass panel. Inside there is a simple bed and small wood furniture.
Wood finish is medium-warm pine, slightly weathered.

Photorealistic. Daylight reference. PBR materials. Output as web-ready
GLB. Target under 2 MB after Draco compression.
```

## Settings

| Setting | Value |
|---|---|
| Mode | Multi-image fusion |
| Output | GLB |
| Texture resolution | 2K (PBR set — albedo, normal, roughness) |
| Topology | Quad-based, retopologize for web |
| Polycount target | < 80,000 triangles (hero object) |
| Texture compression | Will run through gltf-transform → WebP after download |

## After Hyper3D delivers

1. Download the .glb to `~/Downloads/stargazer-raw.glb`
2. Run the compression script (already in package.json):
   ```bash
   cd ~/Desktop/Kingdom-Digital-Services/Websites/awakening-adventures
   npx @gltf-transform/cli optimize ~/Downloads/stargazer-raw.glb public/models/stargazer.glb --compress draco --texture-compress webp
   ```
3. In `components/three/StargazerCabin.tsx`, swap the `<ProceduralStargazer />` line inside the `StargazerCabin` component for `<GlbStargazer interiorGlow={interiorGlow} />`. Same file already exports both — it's a one-line change.
4. `npm run dev` and verify the GLB renders at the expected scale (cabin should be ~4m long in world space).

## If Hyper3D output looks off

Two failure modes are common:
- **Scale wrong** — the cabin renders tiny or massive. Fix: in `StargazerCabin.tsx`, adjust the `scale` prop where the GLB component is used. Real cabin is 4.2m × 2.5m × 2.8m peak.
- **Wood looks plastic** — Hyper3D's PBR is sometimes too clean. Fix: open the .glb in Blender, increase roughness on the wood material to 0.78–0.85, drop metalness to 0.

The procedural fallback stays in the codebase regardless. If Hyper3D delivery slips for any reason, the site ships on procedural without any rework.
