/**
 * Submit button audit.
 *
 * The lock icon used to be passed as a child of `<Button>`, which wrapped
 * everything in a single span. That span was the button's only flex item, so
 * the container's `gap-2` never applied between icon and label, and the label
 * had no way to shrink. Both are invisible to `tsc` and to the route smoke test
 * — the page renders perfectly while looking wrong — so the markup itself is
 * what gets asserted here.
 *
 * Run with: node scripts/audit-submit-button.mjs
 */
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, '.button-audit');

const PORTALS = ['student', 'parent', 'teacher', 'admin'];

/** The whole `<button type="submit">…</button>` element for one page. */
function submitButton(html) {
  const at = html.indexOf('type="submit"');
  if (at === -1) return null;
  const open = html.lastIndexOf('<button', at);
  const end = html.indexOf('</button>', at);
  return html.slice(open, end === -1 ? undefined : end + '</button>'.length);
}

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
      rollupOptions: { output: { entryFileNames: 'routes.mjs' } },
      minify: false,
    },
  });

  const { renderCase } = await import(pathToFileURL(path.join(OUT, 'routes.mjs')).href);
  const problems = [];

  for (const portal of PORTALS) {
    const html = renderCase(`/login/${portal}`);
    const tag = submitButton(html);

    if (!tag) {
problems.push(`${portal}: no submit button rendered`);
      continue;
    }

    if (!/whitespace-nowrap/.test(tag)) problems.push(`${portal}: button lost whitespace-nowrap`);

    const label = (tag.match(/min-w-0 truncate">([^<]*)/) || [])[1];
    const svgSibling = /<svg[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/svg>\s*<span[^>]*min-w-0 truncate/.test(tag);
    if (!svgSibling) problems.push(`${portal}: lock icon is not a sibling of the label span`);

    console.log(
      `  ${portal.padEnd(8)} label="${(label ?? '?').trim()}"  nowrap=${/whitespace-nowrap/.test(tag)}  icon-sibling=${svgSibling}`
    );
  }

  await rm(OUT, { recursive: true, force: true });

  if (problems.length) {
    console.log('\n' + problems.map((p) => `  FAIL  ${p}`).join('\n'));
    process.exit(1);
  }
  console.log('\nAll four submit buttons are single-line with a separated icon.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
