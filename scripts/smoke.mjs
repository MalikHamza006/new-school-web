/**
 * Route render smoke test.
 *
 * Bundles every page with Vite in SSR mode and renders each route inside the
 * real layout. This catches the class of bug that `tsc` cannot: crashes and
 * undefined lookups that only surface when a component actually executes.
 *
 * Run with: npm run smoke
 */
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, '.smoke');

async function main() {
  await rm(OUT, { recursive: true, force: true });

  await build({
    root,
    configFile: false,
    logLevel: 'error',
    build: {
      ssr: 'scripts/smoke.routes.tsx',
      outDir: OUT,
      emptyOutDir: true,
      // Keep the output as plain ESM so Node can import it directly.
      rollupOptions: { output: { entryFileNames: 'routes.mjs' } },
      minify: false,
    },
  });

  const { buildCases, renderCase } = await import(
    pathToFileURL(path.join(OUT, 'routes.mjs')).href
  );

  let failed = 0;

  for (const { path: route, label, role } of buildCases()) {
    try {
      const html = renderCase(route, role);
      const kb = (html.length / 1024).toFixed(1);

      // A page that renders "empty" is a silent failure, not a pass.
      if (html.length < 2000) {
        console.log(`  WARN  ${route.padEnd(26)} ${label.padEnd(20)} only ${kb} kB`);
        failed += 1;
        continue;
      }

      console.log(`  ok    ${route.padEnd(26)} ${label.padEnd(20)} ${kb.padStart(7)} kB`);
    } catch (error) {
      failed += 1;
      console.log(`  FAIL  ${route.padEnd(26)} ${label}`);
      console.log(`        ${error?.message ?? error}`);
    }
  }

  await rm(OUT, { recursive: true, force: true });

  console.log(
    failed === 0
      ? '\nAll routes rendered.'
      : `\n${failed} route(s) failed.`
  );
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
