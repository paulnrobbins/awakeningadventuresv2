#!/usr/bin/env node
/**
 * fetch-images.mjs
 *
 * One-shot downloader that pulls the 7 referenced images from the live
 * awakeningadventuresllc.com site into the right /public/images/ folders
 * in this project. Run once after pulling these code changes:
 *
 *   node scripts/fetch-images.mjs
 *
 * Idempotent — re-runs are safe; files that already exist are skipped
 * unless you pass --force.
 *
 * Why a script: the Cowork sandbox can't hot-fetch binaries from arbitrary
 * URLs, so the downloads have to happen on Paul's machine. This script is
 * the cleanest way to do that — one command, zero manual file shuffling.
 */

import { mkdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const FORCE = process.argv.includes('--force');

/**
 * URL → destination path (relative to project root) mapping.
 * Filenames chosen to be web-clean and to match what the components
 * reference. If you ever swap one of these images, update both this
 * map AND the matching <img src> / <video poster> in the components.
 */
const ASSETS = [
  {
    url: 'https://awakeningadventuresllc.com/wp-content/uploads/2023/05/20230526_073219.jpg?strip=info&w=2000',
    dest: 'public/images/sanctuary/prayer-shelter.jpg',
    label: 'Prayer shelter',
  },
  {
    url: 'https://i0.wp.com/awakeningadventuresllc.com/wp-content/uploads/2022/06/rockbridge.jpg?resize=750%2C563&ssl=1',
    dest: 'public/images/sanctuary/rock-bridge.jpg',
    label: 'Rock bridge',
  },
  {
    url: 'https://i0.wp.com/awakeningadventuresllc.com/wp-content/uploads/2022/06/youthcamp.jpg?resize=750%2C422&ssl=1',
    dest: 'public/images/groups/primitive-camping.jpg',
    label: 'Primitive camping',
  },
  {
    url: 'https://i0.wp.com/awakeningadventuresllc.com/wp-content/uploads/2022/06/rv_parking-view.webp?resize=640%2C480&ssl=1',
    dest: 'public/images/groups/rv-spot.webp',
    label: 'RV spot',
  },
  {
    url: 'https://i0.wp.com/awakeningadventuresllc.com/wp-content/uploads/2025/07/multipletents.jpg?resize=1536%2C864&ssl=1',
    dest: 'public/images/island-camping/multiple-tents.jpg',
    label: 'Island camping (multiple tents)',
  },
  {
    url: 'https://i0.wp.com/awakeningadventuresllc.com/wp-content/uploads/2023/12/20230205_174325.jpg?resize=750%2C422&ssl=1',
    dest: 'public/images/platform-builds/magnolia-playground.jpg',
    label: 'Magnolia tree playground',
  },
  {
    url: 'https://i0.wp.com/awakeningadventuresllc.com/wp-content/uploads/2023/12/20230616_163849.jpg?resize=750%2C1333&ssl=1',
    dest: 'public/images/platform-builds/tree-with-2-posts.jpg',
    label: 'Tree with 2 posts platform',
  },
];

async function ensureDir(filePath) {
  await mkdir(dirname(filePath), { recursive: true });
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function fetchAsBuffer(url) {
  const res = await fetch(url, {
    headers: {
      // Some hosts (incl. Jetpack's i0.wp.com) want a real-looking UA.
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
      Accept: 'image/avif,image/webp,image/jpeg,image/*,*/*;q=0.8',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function downloadOne({ url, dest, label }) {
  const full = join(PROJECT_ROOT, dest);
  if (!FORCE && (await exists(full))) {
    console.log(`  ↻ skip   ${label.padEnd(34)} (already exists: ${dest})`);
    return { ok: true, skipped: true };
  }
  await ensureDir(full);
  try {
    const buf = await fetchAsBuffer(url);
    await writeFile(full, buf);
    const kb = (buf.length / 1024).toFixed(1);
    console.log(`  ✓ done   ${label.padEnd(34)} → ${dest}  (${kb} KB)`);
    return { ok: true, skipped: false };
  } catch (err) {
    console.error(`  ✗ FAIL   ${label.padEnd(34)} ${err.message}`);
    return { ok: false, error: err.message };
  }
}

console.log('');
console.log('Awakening Adventures — fetching 7 images into /public/images/');
console.log(FORCE ? '  (--force: re-downloading even if files exist)' : '  (idempotent: existing files are kept; pass --force to overwrite)');
console.log('');

const results = [];
for (const asset of ASSETS) {
  // Serial (not parallel) so the log output is readable.
  results.push(await downloadOne(asset));
}

const okCount = results.filter((r) => r.ok).length;
const failCount = results.length - okCount;

console.log('');
console.log(`Done: ${okCount}/${results.length} ok${failCount ? `, ${failCount} failed` : ''}.`);
if (failCount > 0) {
  process.exit(1);
}
