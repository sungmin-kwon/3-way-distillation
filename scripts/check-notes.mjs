// Mechanical checks on the notes in src/content/notes/, for the rules in WRITING.md that a
// script can test. Run with `npm run check`. Exits 1 if any note fails, and prints each
// problem as file:line: message. Passing it is necessary, not sufficient: it can't check
// facts, numbers, or how a page looks.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NOTES_DIR, readNotes } from './notes-meta.mjs';
import { SITE, TAGS as TAG_LIST } from '../site.config.mjs';

const TAGS = TAG_LIST.map((t) => t.name);
const problems = [];
const notes = readNotes();
const ids = new Set(notes.map((n) => n.id));

for (const note of notes) {
  const text = readFileSync(join(NOTES_DIR.pathname, `${note.id}.md`), 'utf8');
  const lines = text.split(/\r?\n/);
  const report = (i, msg) => problems.push(`${note.file}:${i + 1}: ${msg}`);
  const d = note.data;

  // Frontmatter.
  if (!d.date) report(0, 'frontmatter has no `date`');
  if (!d.model) report(0, 'frontmatter has no `model` (list every model that wrote or revised the note)');
  for (const t of Array.isArray(d.tags) ? d.tags : []) {
    if (!TAGS.includes(t)) report(0, `unknown tag "${t}" (allowed: ${TAGS.join(', ')})`);
  }
  if (d.title && !d.distillate) report(0, 'a long note (with a title) needs a `distillate`');
  if (typeof d.distillate === 'string' && /\[[^\]]*\]\(|note:|\*\*|`/.test(d.distillate)) {
    report(0, 'the distillate is plain text: no links, `note:` targets, bold or code');
  }

  // Body, skipping frontmatter and fenced code blocks.
  const fmEnd = lines.indexOf('---', 1);
  let inCode = false;
  let inSources = false;
  for (let i = fmEnd + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(```|~~~)/.test(line)) { inCode = !inCode; continue; }
    if (inCode) continue;

    if (/^#\s/.test(line)) report(i, 'no H1 in the body; sections are ##');
    if (/^##\s+Limits\b/i.test(line)) report(i, 'no "## Limits" section; put each caveat in the section it qualifies');
    if (/^##\s/.test(line)) inSources = /^##\s+(Sources|참고\s?문헌)\s*$/.test(line);

    // Display math: `$$` must be alone on its line.
    if (/\$\$/.test(line) && line.trim() !== '$$') {
      report(i, '`$$` must be alone on its own line, above and below the formula');
    }

    // A caption straight after </svg> is swallowed into the HTML block.
    if (/<\/svg>\s*$/.test(line) && lines[i + 1] !== undefined && lines[i + 1].trim() !== '') {
      report(i + 1, 'leave a blank line between </svg> and the caption');
    }

    // Prose checks: strip inline code and inline math first.
    const prose = line.replace(/`[^`]*`/g, '').replace(/\$[^$]*\$/g, '');
    if (!inSources && !/^\[\^/.test(line)) {
      if (/(^|[^\w.'’-])(?<!\b(?:Type|Phase|Class|Stage|Grade|Part|Table|Figure|Appendix|War)\s)(I|I'm|I’m|I've|I’ve|I'll|I’ll|I'd|I’d|me|my|mine|myself)(?=[^\w.'’-]|$)/.test(prose)) {
        report(i, 'no first-person singular ("I", "me", "my"); use "we" only if unavoidable');
      }
      // Quoted speech (an interview excerpt, say) may use the first person, so it is skipped.
      const unquoted = prose.replace(/"[^"]*"|“[^”]*”/g, '');
      if (SITE.lang === 'ko' && /(^|[\s(‘])(나는|내가|나의|나를|나도|저는|제가|저의|저를|저도)(?=[\s,.!?)’]|$)/.test(unquoted)) {
        report(i, 'no first-person singular ("나는", "제가"); write around it, or use "우리" only if unavoidable');
      }
      if (/—/.test(prose)) report(i, 'no em dash in body text; use a comma, colon, or new sentence');
    }
    if (!SITE.allowAffiliation && /\b(my|our)\s+(lab|labs|group|advisor|supervisor|PI|hospital|university|institute|employer|company|team)\b/i.test(prose)) {
      report(i, 'no affiliation: don\'t name or point to a lab, hospital, university or employer');
    }

    // Links between notes.
    for (const m of line.matchAll(/\]\(([^)]*)\)/g)) {
      const target = m[1];
      if (target.startsWith('note:')) {
        const id = target.slice(5).split('#')[0];
        if (!ids.has(id)) report(i, `note:${id} does not exist`);
      } else if (/^(\.\.?\/|\/notes\/)/.test(target)) {
        report(i, `link between notes must be note:<file-name>, not "${target}"`);
      }
    }

    // Every entry in a Sources list carries a link.
    if (inSources && /^\s*[-*]\s/.test(line) && !/\]\(https?:\/\//.test(line)) {
      report(i, 'every entry in ## Sources (## 참고문헌) needs a link (doi.org, arXiv, or an official page)');
    }
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s) in notes. See WRITING.md.`);
  process.exit(1);
}
console.log(`check-notes: ${notes.length} notes, no problems found.`);
