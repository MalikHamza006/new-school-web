/**
 * Image optimisation script.
 *
 * The official photographs were downloaded from the school's own website at
 * full resolution (one PNG alone was 1.2 MB). This script produces web-ready
 * derivatives so the site does not ship multi-megabyte heroes:
 *
 *   - resize to the largest size the layout can actually display
 *   - re-encode as WebP (with a JPEG fallback for older browsers)
 *   - emit a tiny blurred LQIP for the CSS placeholder background
 *
 * Sources live in `assets/official/`, deliberately outside `public/`, so the
 * multi-megabyte originals are never copied into the build output. Only the
 * optimised derivatives in `public/images/site/` are published.
 *
 * Run with: npm run images
 */
import { mkdir, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'assets/official');
const OUT = path.join(root, 'public/images/site');
/** LQIP strings feed the codegen step; they are not a runtime asset. */
const LQIP_OUT = path.join(root, 'assets/lqip.json');

/**
 * Every hero is cropped to a 16:9 band and emitted at three widths so the
 * browser can pick the smallest one that fits, via srcset.
 */
const TARGETS = [
  { src: 'hero-3.jpg', name: 'campus-a', focal: 'centre', content: true },
  { src: 'hero-4.jpg', name: 'campus-b', focal: 'centre', content: true },
  { src: 'hero-1.png', name: 'campus-c', focal: 'centre', content: true },
  { src: 'hero-2.png', name: 'campus-d', focal: 'attention', content: true },
  { src: 'logo.png', name: 'logo', logo: true },
];

const HERO_SIZES = [
  { suffix: 'lg', width: 1600, height: 900 },
  { suffix: 'md', width: 960, height: 540 },
  { suffix: 'sm', width: 640, height: 360 },
];

/**
 * Content crops, used by the gallery, campus and about sections.
 *
 * 4:3 suits the gallery grid and facility cards; 1:1 suits portrait-ish slots
 * and the masonry column.
 */
const CONTENT_SIZES = [
  { suffix: 'wide', width: 1200, height: 900 },
  { suffix: 'square', width: 900, height: 900 },
  { suffix: 'thumb', width: 480, height: 360 },
];

/**
 * Detail crops — differently framed views of the same official photographs.
 *
 * The school has published four photographs. Showing those four tiles in a
 * fifteen-tile gallery repeats the identical frame over and over, which reads
 * as a broken gallery rather than a small one. These variants are a second,
 * third and fourth *crop* of each photograph: zoomed in, reframed, and at
 * different aspect ratios, so the gallery has visual variety.
 *
 * Every one of them is still a real photograph of this school. That distinction
 * matters: a variant is a crop, whereas borrowing a stock classroom photo would
 * be a different school's building presented as ours, and inventing
 * "sports day" captions would be a guess stated as fact.
 *
 * Zoom is kept modest (1.25x - 1.6x) on purpose. The sources are only 949x720
 * to 1414x2000, so an aggressive zoom would upscale a phone-camera-sized JPEG
 * and fill the gallery with soft, smeared tiles - technically more pictures,
 * visibly worse than four sharp ones. `scale` below also clamps every output so
 * nothing is ever enlarged past its source.
 */
const VARIANT_SIZES = [
  /** Tall slice, window pushed to the upper third - reads as a different shot. */
  { suffix: 'portrait', width: 600, height: 800, zoom: 1.4, fx: 0.5, fy: 0.34 },
  /** Close-in detail, window offset sideways. */
  { suffix: 'zoom', width: 700, height: 700, zoom: 1.6, fx: 0.62, fy: 0.5 },
  /** Wide letterbox band, window dropped towards the foreground. */
  { suffix: 'strip', width: 1200, height: 450, zoom: 1.25, fx: 0.5, fy: 0.6 },
];

const LOGO_WIDTH = 520;

/** Brand colours used to recolour the logo for dark backgrounds. */
const INVERSE = {
  white: [255, 255, 255],
  gold: [232, 197, 92],
};

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

/**
 * Builds a white-and-gold variant of the official logo for use on dark
 * backgrounds.
 *
 * The school's artwork is navy lettering with gold accents on a transparent
 * background. Navy lettering is invisible over a navy hero, and CSS filters
 * (`brightness-0 invert-1`) would flatten the gold to white too. Recolouring
 * the pixels here keeps the real artwork and preserves the gold.
 *
 * Gold is detected by hue (warm, red-dominant, low blue) so that antialiased
 * edges blend correctly between white and gold.
 */
async function buildInverseLogo(target) {
  const input = path.join(SRC, target.src);
  const meta = await sharp(input).metadata();
  const width = Math.min(LOGO_WIDTH, meta.width ?? LOGO_WIDTH);

  const pipeline = sharp(input).rotate().resize({ width, withoutEnlargement: true });
  const { data, info } = await pipeline
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = info.channels;
  for (let i = 0; i < data.length; i += pixels) {
    if (data[i + 3] === 0) continue; // fully transparent

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Gold-ish: clearly warm and blue-poor. #D4A72C -> 212/167/44.
    const isGold = r > 90 && b < r * 0.62 && g > b * 1.4;
    const [nr, ng, nb] = isGold ? INVERSE.gold : INVERSE.white;

    data[i] = nr;
    data[i + 1] = ng;
    data[i + 2] = nb;
  }

  const webp = path.join(OUT, `${target.name}-inverse.webp`);
  await sharp(data, { raw: info })
    .webp({ quality: 92, effort: 6, alphaQuality: 100 })
    .toFile(webp);

  const png = path.join(OUT, `${target.name}-inverse.png`);
  await sharp(data, { raw: info })
    .png({ compressionLevel: 9 })
    .toFile(png);

  return {
    name: `${target.name}-inverse`,
    source: target.src,
    files: [webp, png],
    sizes: [
      { file: path.basename(webp), size: (await stat(webp)).size },
      { file: path.basename(png), size: (await stat(png)).size },
    ],
    lqip: null,
  };
}

async function buildHero(target) {
  const input = path.join(SRC, target.src);
  const meta = await sharp(input).metadata();
  const files = [];
  const outputs = [];

  for (const size of HERO_SIZES) {
    // Never upscale past the source, but always crop to the target ratio.
    const width = Math.min(size.width, meta.width ?? size.width);

    const base = sharp(input)
      .rotate()
      .resize({
        width,
        height: size.height,
        fit: 'cover',
        position: target.focal ?? 'centre',
        withoutEnlargement: false,
      });

    const webp = path.join(OUT, `${target.name}-${size.suffix}.webp`);
    await base.clone().webp({ quality: 78, effort: 6 }).toFile(webp);
    outputs.push(webp);

    // A JPEG fallback for the largest size is enough for legacy browsers.
    if (size.suffix === 'lg') {
      const jpeg = path.join(OUT, `${target.name}-${size.suffix}.jpg`);
      await base
        .clone()
        .flatten({ background: '#0B1F3A' })
        .jpeg({ quality: 78, progressive: true, mozjpeg: true })
        .toFile(jpeg);
      outputs.push(jpeg);
    }
  }

  files.push(...outputs);

  // LQIP: 16px wide base64 JPEG used as the blur-up placeholder.
  const lqip = await sharp(input)
    .rotate()
    .resize({ width: 16 })
    .flatten({ background: '#0B1F3A' })
    .jpeg({ quality: 40 })
    .toBuffer();

  return {
    name: target.name,
    source: target.src,
    files,
    sizes: await Promise.all(
      outputs.map(async (f) => ({ file: path.basename(f), size: (await stat(f)).size }))
    ),
    lqip: `data:image/jpeg;base64,${lqip.toString('base64')}`,
  };
}

/**
 * Crops each photograph for in-page content slots (gallery grid, facility
 * cards, about section). Emits WebP at three aspect ratios plus a JPEG
 * fallback for the widest crop.
 */
async function buildContent(target) {
  const input = path.join(SRC, target.src);
  const meta = await sharp(input).metadata();
  const files = [];
  const outputs = [];

  for (const size of CONTENT_SIZES) {
    // Never upscale: a 949px source cropped to 949px still looks correct and
    // costs far fewer bytes than an invented 1200px.
    const scale = Math.min(1, (meta.width ?? size.width) / size.width);
    const width = Math.round(size.width * scale);
    const height = Math.round(size.height * scale);

    const base = sharp(input).rotate().resize({
      width,
      height,
      fit: 'cover',
      position: target.focal ?? 'centre',
      withoutEnlargement: false,
    });

    const webp = path.join(OUT, `${target.name}-${size.suffix}.webp`);
    await base.clone().webp({ quality: 76, effort: 6 }).toFile(webp);
    outputs.push(webp);

    if (size.suffix === 'wide') {
      const jpeg = path.join(OUT, `${target.name}-${size.suffix}.jpg`);
      await base
        .clone()
        .flatten({ background: '#0B1F3A' })
        .jpeg({ quality: 76, progressive: true, mozjpeg: true })
        .toFile(jpeg);
      outputs.push(jpeg);
    }
  }

  files.push(...outputs);

  return {
    name: target.name,
    source: target.src,
    files,
    sizes: await Promise.all(
      outputs.map(async (f) => ({ file: path.basename(f), size: (await stat(f)).size }))
    ),
    lqip: null,
  };
}

/**
 * Emits the differently framed detail crops described in `VARIANT_SIZES`.
 *
 * The zoom is done in two steps rather than with a single `resize`, because
 * `fit: 'cover'` alone cannot zoom: it only ever *shrinks* the overflow. So the
 * frame is first blown up past the target, then a window of the target size is
 * extracted out of it. `fx`/`fy` choose where in the oversized frame that
 * window sits, which is what makes each crop a different composition rather
 * than the same centre crop at a different size.
 */
async function buildVariants(target) {
  const input = path.join(SRC, target.src);
  const meta = await sharp(input).metadata();
  const outputs = [];

  for (const variant of VARIANT_SIZES) {
    // Clamp so the zoom never upscales past what the source can actually
    // resolve. `zoom` raises the ceiling, `scale` lowers it.
    const scale = Math.min(1, (meta.width ?? variant.width) / (variant.width * variant.zoom));
    const w = Math.max(1, Math.round(variant.width * scale));
    const h = Math.max(1, Math.round(variant.height * scale));
    const zoomedW = Math.round(w * variant.zoom);
    const zoomedH = Math.round(h * variant.zoom);

    const zoomed = await sharp(input)
      .rotate()
      .resize({ width: zoomedW, height: zoomedH, fit: 'cover', position: 'centre' })
      .toBuffer();

    // Clamped again because a tall crop can leave a frame smaller than the
    // window on one axis, and `extract` throws on a negative origin.
    const left = Math.max(0, Math.min(zoomedW - w, Math.round((zoomedW - w) * variant.fx)));
    const top = Math.max(0, Math.min(zoomedH - h, Math.round((zoomedH - h) * variant.fy)));

    const webp = path.join(OUT, `${target.name}-${variant.suffix}.webp`);
    await sharp(zoomed)
      .extract({ left, top, width: w, height: h })
      .webp({ quality: 78, effort: 6 })
      .toFile(webp);
    outputs.push(webp);

    // A JPEG twin for the widest variant only; the two small ones are never
    // large enough to be worth doubling the file count for.
    if (variant.suffix === 'strip') {
      const jpeg = path.join(OUT, `${target.name}-${variant.suffix}.jpg`);
      await sharp(zoomed)
        .extract({ left, top, width: w, height: h })
        .flatten({ background: '#0B1F3A' })
        .jpeg({ quality: 78, progressive: true, mozjpeg: true })
        .toFile(jpeg);
      outputs.push(jpeg);
    }
  }

  return {
    name: target.name,
    source: target.src,
    files: outputs,
    sizes: await Promise.all(
      outputs.map(async (f) => ({ file: path.basename(f), size: (await stat(f)).size }))
    ),
    lqip: null,
  };
}

async function buildLogo(target) {
  const input = path.join(SRC, target.src);
  const meta = await sharp(input).metadata();
  const width = Math.min(LOGO_WIDTH, meta.width ?? LOGO_WIDTH);

  const webp = path.join(OUT, `${target.name}.webp`);
  await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 90, effort: 6, alphaQuality: 100 })
    .toFile(webp);

  const output = await sharp(webp).metadata();
  const png = path.join(OUT, `${target.name}.png`);
  await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(png);

  return {
    name: target.name,
    source: target.src,
    files: [webp, png],
    width: output.width,
    height: output.height,
    sizes: [
      { file: path.basename(webp), size: (await stat(webp)).size },
      { file: path.basename(png), size: (await stat(png)).size },
    ],
    lqip: null,
  };
}

async function main() {
  const available = new Set(await readdir(SRC));
  const targets = TARGETS.filter((t) => available.has(t.src));

  const missing = TARGETS.filter((t) => !available.has(t.src)).map((t) => t.src);
  if (missing.length) {
    console.warn(`! skipped missing sources: ${missing.join(', ')}`);
  }

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const manifest = [];

  for (const target of targets) {
    if (target.logo) {
      const logo = await buildLogo(target);
      manifest.push(logo);
      console.log(
        `âœ“ ${logo.name.padEnd(15)} from ${logo.source.padEnd(22)} ` +
          logo.sizes.map((s) => `${s.file} ${kb(s.size)}`).join('  ')
      );

      const inverse = await buildInverseLogo(target);
      manifest.push(inverse);
      console.log(
        `âœ“ ${inverse.name.padEnd(15)} from ${inverse.source.padEnd(22)} ` +
          inverse.sizes.map((s) => `${s.file} ${kb(s.size)}`).join('  ')
      );
      continue;
    }

    const hero = await buildHero(target);
    manifest.push(hero);
    console.log(
      `âœ“ ${hero.name.padEnd(15)} from ${hero.source.padEnd(22)} ` +
        hero.sizes.map((s) => `${s.file} ${kb(s.size)}`).join('  ')
    );

    if (target.content) {
      const content = await buildContent(target);
      manifest.push(content);
      console.log(
        `âœ“ ${(content.name + '-crops').padEnd(15)} from ${content.source.padEnd(22)} ` +
          content.sizes.map((s) => `${s.file} ${kb(s.size)}`).join('  ')
      );

      const variants = await buildVariants(target);
      manifest.push(variants);
      console.log(
        `âœ“ ${(variants.name + '-variants').padEnd(15)} from ${variants.source.padEnd(22)} ` +
          variants.sizes.map((s) => `${s.file} ${kb(s.size)}`).join('  ')
      );
    }
  }

  // The LQIP strings are tiny, so they are inlined into a manifest module
  // rather than fetched at runtime.
  const lqipMap = Object.fromEntries(manifest.map((m) => [m.name, m.lqip]));
  const { writeFile } = await import('node:fs/promises');
  await writeFile(LQIP_OUT, JSON.stringify(lqipMap, null, 2), 'utf8');

  const total = manifest.reduce(
    (sum, m) => sum + m.sizes.reduce((s, f) => s + f.size, 0),
    0
  );
  console.log(`\n${manifest.length} image sets, ${kb(total)} total`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
