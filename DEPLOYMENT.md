# Deploying Awakening Adventures

You are self-deploying this site under Kingdom Digital Services. This doc walks you from a clean clone to a live URL.

## Prerequisites

- Node 20 or newer
- A Vercel account (free tier is fine for this site)
- The DNS for `awakeningadventuresllc.com` accessible (whoever holds the WordPress account today — Anthony, or his current host)

## First-time setup

From inside this folder:

```bash
npm install
npm run build       # confirms a production build runs clean
```

If that succeeds, you're ready to ship.

## Push to Vercel

```bash
npm install -g vercel
vercel login
vercel
```

Vercel will ask which scope to deploy to, what to call the project, and whether to set up env vars. Answer:

- Project name: `awakening-adventures`
- Framework preset: Next.js (auto-detected)
- Root directory: `./`

When prompted for environment variables, paste these in:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_FAREHARBOR_URL` | `https://fareharbor.com/embeds/book/awakeningadventures/?full-items=yes` |
| `NEXT_PUBLIC_ASSET_CDN` | leave blank for now |

Vercel will build and deploy. You'll get a `*.vercel.app` URL within ~2 minutes.

## Point the domain

In Vercel, go to the project → Settings → Domains → Add → enter `awakeningadventuresllc.com` and `www.awakeningadventuresllc.com`.

Vercel will tell you what DNS records to add. The two needed are:

- `A` record on `@` pointing to `76.76.21.21`
- `CNAME` record on `www` pointing to `cname.vercel-dns.com`

Add these wherever the DNS lives today (Anthony's WordPress host control panel, or a registrar like GoDaddy/Namecheap). Propagation usually finishes within an hour.

The WordPress site keeps running on the old host until you cut DNS. When you switch the records, the new site goes live. Old WordPress stays online but unreachable through the domain — Anthony can keep the WordPress account or cancel it.

## Large assets (HDRIs, big GLBs)

This is only needed once the Hyper3D Stargazer arrives, or if any HDRI in `public/hdri/` exceeds ~5 MB.

1. Sign up for Cloudflare R2 (free tier covers this build comfortably)
2. Create a bucket called `awakening-adventures-assets`
3. Upload your large `.glb` and `.hdr` files into folders matching `models/` and `hdri/`
4. Enable the bucket's public domain (Cloudflare gives you a `*.r2.dev` URL)
5. Set the Vercel env var `NEXT_PUBLIC_ASSET_CDN` to that R2 URL
6. Trigger a new deploy: `vercel --prod`

The code in `lib/three.ts` already reads from the CDN env var when set and falls back to `/public` when blank, so the swap is invisible to the rest of the site.

## Subsequent deploys

```bash
git push           # if Vercel is wired to your GitHub repo, this auto-deploys
# OR
vercel --prod      # manual production push
```

## What lives where

- `awakeningadventures` FareHarbor account — Anthony controls bookings, refunds, payouts. The site only links to it.
- DNS — wherever the domain registrar sits. Vercel does not register domains for you.
- Email (`support@awakeningadventuresllc.com`) — set up separately (Google Workspace, Fastmail, etc.). The site references it but doesn't host it.
- Analytics — `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env var is wired; sign up at plausible.io and paste the domain to start collecting. Optional.
