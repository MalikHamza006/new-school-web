/**
 * Generates the favicon set from the school's real logo.
 *
 * Why a script instead of an inline SVG: an earlier version of this site used
 * a hand-drawn geometric mark in the favicon. That mark is not the school's
 * logo, and a browser tab showing a different emblem to the one in the navbar
 * reads as an impostor site. So the tab icon is now derived from the actual
 * artwork.
 *
 * The inverse (white-and-gold) artwork is used rather than the original, because
 * the original is navy-on-transparent and would disappear against the navy
 * tile. The full wordmark is kept instead of cropping to the emblem, so no part
 * of the logo can be clipped by accident.
 *
 * Usage:  node scripts/make-favicon.mjs
 * Then:   npm run build
 */

import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');

// White-and-gold recolour of the real logo, produced by `npm run images`.
const SOURCE = path.join(PUBLIC, 'images/site/logo-inverse.png');

const NAVY = { r: 0x0b, g: 0x1f, b: 0x3a, alpha: 1 };

/** Icon sizes browsers and mobile platforms actually request. */
const SIZES = [32, 180, 512];

async function buildFavicons() {
  const { width, height } = await sharp(SOURCE).metadata();
  const ratio = width / height;

  for (const size of SIZES) {
    // Draw the wordmark at 92% of the tile so it fills the width without
    // touching the rounded edge.
    const innerWidth = Math.round(size * 0.92);
    const innerHeight = Math.round(innerWidth / ratio);

    const artwork = await sharp(SOURCE)
      .resize({ width: innerWidth, height: innerHeight, fit: 'inside' })
      .png()
      .toBuffer();

    const file = path.join(PUBLIC, `favicon-${size}.png`);
    await sharp({
      create: { width: size, height: size, channels: 4, background: NAVY },
    })
      .composite([
        {
          input: artwork,
          top: Math.round((size - innerHeight) / 2),
          left: Math.round((size - innerWidth) / 2),
        },
      ])
      .png()
      .toFile(file);

    console.log(`✓ favicon-${size}.png   logo drawn at ${innerWidth}x${innerHeight} on navy`);
  }
}

async function buildManifest() {
  const manifest = {
    name: 'Spectral Model School & College',
    short_name: 'Spectral',
    description:
      'Spectral Model School & College, Qazi Park, Shahdara, Lahore.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0B1F3A',
    theme_color: '#0B1F3A',
    icons: [
      {
        src: '/favicon-180.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/favicon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };

  const file = path.join(PUBLIC, 'manifest.webmanifest');
  await writeFile(file, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`✓ manifest.webmanifest`);

  // Sanity check: index.html must actually link the manifest, otherwise the
  // file above is dead weight in public/.
  const html = await readFile(path.join(ROOT, 'index.html'), 'utf8');
  if (!html.includes('manifest.webmanifest')) {
    console.warn('! index.html does not link manifest.webmanifest');
  }
}

await buildFavicons();
await buildManifest();
