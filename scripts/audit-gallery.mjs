/**
 * Gallery image audit.
 *
 * `tsc` and the route smoke test both pass while a gallery silently renders
 * zero photographs, so this asserts on the rendered HTML directly: the crop
 * tiles must actually reach the page, and the placeholder captions must be
 * visible to a human rather than quietly dropped.
 *
 * Run with: node scripts/audit-gallery.mjs
 */
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, '.gallery-audit');

async function main() {  await rm(OUT, { recursive: true, force: true });

  await build({
    root,
    configFile: false,
    logLevel: 'error',
    build: {
      ssr: 'scripts/smoke.routes.tsx',
      outDir: OUT,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: 'routes.mjs' } },
      minify: false,
    },
  });

  const { renderCase } = await import(pathToFileURL(path.join(OUT, 'routes.mjs')).href);
  const html = renderCase('/gallery');

  const count = (re) => (html.match(re) || []).length;

  /**
   * Unique file names, not raw occurrences.
   *
   * Every tile emits its URL twice - once in `srcSet` and once in `src` - and
   * the `.jpg` fallback of a strip crop adds a third. Counting raw matches
   * would make this audit assert on string multiplicity, which breaks the
   * moment someone legitimately changes a `<picture>`. What matters is that
   * each distinct crop file is actually referenced.
   */
  const unique = (re) => new Set(html.match(re) || []).size;

  const imgTags = count(/<img/g);
  const crops = unique(/\/images\/site\/campus-[a-d]-(?:portrait|zoom|strip)\.(?:webp|jpg)/g);
  const baseFrames = unique(/\/images\/site\/campus-[a-d]-(?:square|wide)\.(?:webp|jpg)/g);
  const placeholders = count(/Awaiting a photograph/g);

  console.log(`  img tags rendered    : ${imgTags}`);
  console.log(`  unique crop files    : ${crops}`);
  console.log(`  unique base frames   : ${baseFrames}`);
  console.log(`  placeholder captions : ${placeholders}`);

  const problems = [];
  // 15 tiles: 4 base frames + 11 crops. Fewer means a crop or frame failed to
  // resolve, which is exactly what a URL typo looks like.
  if (crops !== 11) problems.push(`expected 11 distinct crop files, found ${crops}`);
  // 4 photos x 2 files each (square + wide, both listed in the srcSet).
  if (baseFrames !== 8) problems.push(`expected 8 distinct base frame files, found ${baseFrames}`);
  // 15 published tiles + 2 placeholders + 4 PageHero images.
  if (imgTags < 17) problems.push(`expected at least 17 rendered tiles, found ${imgTags}`);
  if (placeholders < 2) problems.push(`expected 2 visible placeholders, found ${placeholders}`);

  await rm(OUT, { recursive: true, force: true });

  if (problems.length) {
    console.log('\n' + problems.map((p) => `  FAIL  ${p}`).join('\n'));
    process.exit(1);
  }
  console.log('\nGallery renders every published photograph and crop.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
