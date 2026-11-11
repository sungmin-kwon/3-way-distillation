// Copies the shared files (listed in SHARED.md) from a sibling site's checkout into this one.
// Usage: npm run sync -- ../3-way-distillation
// It only overwrites files; review the result with `git diff` before committing.
// package.json and package-lock.json are copied with this site's own "name" kept.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

export const SHARED = [
  '.github/workflows/pages.yml',
  '.gitignore',
  'LICENSE',
  'REVIEWING.md',
  'SHARED.md',
  'astro.config.mjs',
  'tsconfig.json',
  'scripts/admin-index.mjs',
  'scripts/check-notes.mjs',
  'scripts/notes-meta.mjs',
  'scripts/sync-shared.mjs',
  'src/components/FamilyMenu.astro',
  'src/components/NoteIndex.astro',
  'src/content.config.ts',
  'src/env.d.ts',
  'src/layouts/Base.astro',
  'src/lib/i18n.ts',
  'src/lib/notes.ts',
  'src/lib/remark-note-links.mjs',
  'src/lib/site.ts',
  'src/pages/404.astro',
  'src/pages/index.astro',
  'src/pages/notes/[id].astro',
  'src/pages/rss.xml.ts',
  'src/pages/search.json.ts',
  'src/pages/tags/[tag].astro',
  'src/styles/site.css',
];
const KEEP_NAME = ['package.json', 'package-lock.json'];

const from = process.argv[2];
if (!from || !existsSync(join(from, 'site.config.mjs'))) {
  console.error('Usage: npm run sync -- <path to a sibling site checkout>');
  process.exit(1);
}
const here = resolve(new URL('..', import.meta.url).pathname);
if (resolve(from) === here) {
  console.error('Run this from the site to update, with the path of the site to copy from.');
  process.exit(1);
}
let changed = 0;

for (const f of SHARED) {
  const src = join(from, f);
  const dst = join(here, f);
  if (!existsSync(src)) { console.warn(`missing in ${from}: ${f}`); continue; }
  if (existsSync(dst) && readFileSync(src).equals(readFileSync(dst))) continue;
  mkdirSync(dirname(dst), { recursive: true });
  copyFileSync(src, dst);
  console.log(`updated ${f}`);
  changed++;
}

for (const f of KEEP_NAME) {
  const dst = join(here, f);
  const ours = JSON.parse(readFileSync(dst, 'utf8'));
  const theirs = JSON.parse(readFileSync(join(from, f), 'utf8'));
  theirs.name = ours.name;
  if (theirs.packages?.['']) theirs.packages[''].name = ours.name;
  const out = `${JSON.stringify(theirs, null, 2)}\n`;
  if (out === readFileSync(dst, 'utf8')) continue;
  writeFileSync(dst, out);
  console.log(`updated ${f} (kept name "${ours.name}")`);
  changed++;
}

console.log(changed ? `${changed} file(s) updated. WRITING.md is not synced; see SHARED.md.` : 'Shared files already match.');
