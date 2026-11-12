// Ranks the existing notes by how much they overlap with one note, so that a reviewer reads only
// the few that might repeat it (WRITING.md, section 9; REVIEWING.md, step 2). Run after drafting:
//
//   npm run similar -- <note-id>          e.g. npm run similar -- moments-of-a-distribution
//   npm run similar -- <note-id> 8        show 8 notes instead of 5
//
// It compares vocabulary only (TF-IDF over words and two-word phrases, cosine similarity), and
// prints each candidate's title, notebook, score and section headings. It reads no note in
// full into anyone's context. A high score means "look at this one", not "this overlaps":
// whether two notes really repeat each other is the reviewer's call.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NOTES_DIR, readNotes } from './notes-meta.mjs';
import { sectionOfTags } from '../src/lib/sections.mjs';

const [id, countArg] = process.argv.slice(2);
const count = Number(countArg) || 5;
const notes = readNotes();
if (!id || !notes.some((n) => n.id === id)) {
  console.error('Usage: npm run similar -- <note-id> [count]   (the file name without .md)');
  process.exit(1);
}

// Words too common to say anything about a topic.
const STOP = new Set(
  `a about above after again all also an and any are as at be because been before being between
  both but by can could did do does doing down each few for from further had has have having here
  how if in into is it its itself just more most no nor not now of off on once only or other our
  out over own same so some such than that the their them then there these they this those through
  to too under until up very was we were what when where which while who why will with would you
  your one two three per each note notes example worked figure table see section case cases
  gives give given uses use used using make makes made`.split(/\s+/),
);

/** The note's prose: no frontmatter, code, SVG, display math or link targets. */
function prose(text) {
  return text
    .replace(/^---[\s\S]*?\n---/, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/^## Sources[\s\S]*$/m, ' ')
    .toLowerCase();
}

function terms(text) {
  const words = prose(text)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w));
  const out = new Map();
  const add = (t) => out.set(t, (out.get(t) ?? 0) + 1);
  words.forEach((w, i) => {
    add(w);
    if (i > 0) add(`${words[i - 1]} ${w}`);
  });
  return out;
}

const docs = notes.map((n) => {
  const text = readFileSync(join(NOTES_DIR.pathname, `${n.id}.md`), 'utf8');
  const headings = [...text.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1]).filter((h) => h !== 'Sources');
  return { ...n, tf: terms(text), headings };
});

const df = new Map();
for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
const idf = (t) => Math.log((docs.length + 1) / ((df.get(t) ?? 0) + 1)) + 1;

for (const d of docs) {
  d.vec = new Map([...d.tf].map(([t, f]) => [t, (1 + Math.log(f)) * idf(t)]));
  d.norm = Math.sqrt([...d.vec.values()].reduce((s, v) => s + v * v, 0));
}

const target = docs.find((d) => d.id === id);
const cosine = (a, b) => {
  let dot = 0;
  for (const [t, v] of a.vec) dot += v * (b.vec.get(t) ?? 0);
  return dot / (a.norm * b.norm || 1);
};
const shared = (a, b) =>
  [...a.vec]
    .filter(([t]) => b.vec.has(t) && df.get(t) <= Math.max(2, docs.length / 4))
    .sort((x, y) => y[1] * b.vec.get(y[0]) - x[1] * b.vec.get(x[0]))
    .slice(0, 8)
    .map(([t]) => t);

const ranked = docs
  .filter((d) => d.id !== id)
  .map((d) => ({ d, score: cosine(target, d) }))
  .sort((a, b) => b.score - a.score)
  .slice(0, count);

console.log(`Notes closest to ${id} (cosine similarity of vocabulary, 0 to 1):\n`);
for (const { d, score } of ranked) {
  const notebook = sectionOfTags(Array.isArray(d.data.tags) ? d.data.tags : []).title;
  const status = d.status === 'visible' ? '' : ` [${d.status}]`;
  console.log(`${score.toFixed(2)}  ${d.data.title ?? '(short note)'}  (${d.id}, ${notebook})${status}`);
  if (d.headings.length) console.log(`      sections: ${d.headings.join(' · ')}`);
  console.log(`      shared terms: ${shared(target, d).join(', ')}\n`);
}
