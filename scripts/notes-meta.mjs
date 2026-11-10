// Reads the frontmatter of every note without going through Astro, so that
// astro.config.mjs and scripts/admin-index.mjs can see which notes are published.
// It understands the flat frontmatter the notes use: `key: value`, quoted strings,
// booleans and one-line `[a, b]` lists. The real schema is in src/content.config.ts.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const NOTES_DIR = new URL('../src/content/notes/', import.meta.url);

function scalar(raw) {
  const v = raw.trim();
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v.startsWith('"') && v.endsWith('"')) return JSON.parse(v);
  if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1).replace(/''/g, "'");
  return v;
}

export function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data = {};
  if (!m) return data;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rest] = kv;
    const value = /^["']/.test(rest) ? rest : rest.replace(/\s+#.*$/, '');
    data[key] = /^\[.*\]$/.test(value.trim())
      ? value.trim().slice(1, -1).split(',').map(scalar).filter((x) => x !== '')
      : scalar(value);
  }
  return data;
}

/** Every note file, with its id, frontmatter and publication status. */
export function readNotes() {
  const dir = NOTES_DIR.pathname;
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const data = parseFrontmatter(readFileSync(join(dir, file), 'utf8'));
      const status = data.draft === true ? 'draft' : data.hidden === true ? 'hidden' : 'visible';
      return { id: file.replace(/\.md$/, ''), file: `src/content/notes/${file}`, data, status };
    })
    .sort((a, b) => String(b.data.date).localeCompare(String(a.data.date)) || a.id.localeCompare(b.id));
}

/** Ids of notes that are not on the public site (hidden or draft). */
export function unpublishedIds() {
  return new Set(readNotes().filter((n) => n.status !== 'visible').map((n) => n.id));
}
