import { getCollection, type CollectionEntry } from 'astro:content';
import { PAGE_SIZE, TAGS } from './site';
import { UI, monthHeading } from './i18n';

export { shortDate } from './i18n';

export type Note = CollectionEntry<'notes'>;

const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/** A site path with the base prefix, e.g. href('about/') -> '/<base>/about/', with the base from site.config.mjs. */
export function href(path = ''): string {
  return `${BASE}${path.replace(/^\/+/, '')}`;
}

export function noteHref(note: Note): string {
  return href(`notes/${note.id}/`);
}

/**
 * URL-safe form of a tag, e.g. 'ml/llm' -> 'ml-llm'. A tag in site.config.mjs may set its own
 * `slug`, which a tag that isn't in Latin letters (e.g. '근거이론') should do.
 */
export function tagSlug(tag: string): string {
  const own = TAGS.find((t) => t.name === tag)?.slug;
  if (own) return own;
  return tag
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

export function tagHref(tag: string): string {
  return href(`tags/${tagSlug(tag)}/`);
}

/** Number of pages a list of `count` notes takes (at least 1, so an empty list still has a page). */
export function pageCount(count: number): number {
  return Math.max(1, Math.ceil(count / PAGE_SIZE));
}

/** The notes on page `page` (from 1) of a list. */
export function pageOf<T>(list: T[], page: number): T[] {
  return list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
}

/**
 * URL of a page of the index, or of a tag's list when `tag` is set. Page 1 is the plain list
 * ('/', '/tags/cheme/'); later pages add 'page/2/' and so on.
 */
export function listHref(page: number, tag?: string): string {
  const root = tag ? `tags/${tagSlug(tag)}/` : '';
  return href(page > 1 ? `${root}page/${page}/` : root);
}

/** All published notes (not draft, not hidden), newest first. */
export async function getNotes(): Promise<Note[]> {
  const notes = await getCollection('notes', ({ data }) => !data.draft && !data.hidden);
  return notes.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id),
  );
}

export function isShort(note: Note): boolean {
  return !note.data.title;
}

/** Markdown body reduced to plain words, for search, labels and reading time. */
export function plainText(body: string | undefined): string {
  return (body ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The title, or for a short note its first few words. */
export function label(note: Note, max = 60): string {
  if (note.data.title) return note.data.title;
  const text = plainText(note.body).replace(/\$[^$]*\$/g, '…');
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

export function readingMinutes(note: Note): number {
  const words = plainText(note.body).split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / UI.wordsPerMinute));
}

const pad = (n: number) => String(n).padStart(2, '0');

/** '2026-11-09' */
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export interface MonthGroup {
  key: string;
  heading: string;
  notes: Note[];
}

/** Groups notes (already sorted) under '2026 · NOVEMBER' (or '2026년 11월') headings. */
export function groupByMonth(notes: Note[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  for (const note of notes) {
    const d = note.data.date;
    const key = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
    let group = groups.at(-1);
    if (!group || group.key !== key) {
      group = { key, heading: monthHeading(d), notes: [] };
      groups.push(group);
    }
    group.notes.push(note);
  }
  return groups;
}

/**
 * The tags, in their fixed order (as in site.config.mjs), whether or not any
 * published note uses them yet. "rough" is added when any note is rough.
 */
export function allTags(notes: Note[]): string[] {
  const tags: string[] = TAGS.map((t) => t.name);
  if (notes.some((n) => n.data.rough)) tags.push('rough');
  return tags;
}

/** The description of a tag, e.g. for its page. */
export function tagInfo(tag: string) {
  return TAGS.find((t) => t.name === tag);
}

export function hasTag(note: Note, tag: string): boolean {
  return tag === 'rough' ? note.data.rough : (note.data.tags as string[]).includes(tag);
}

/** Notes whose body links to `target` with a `note:` link. */
export function backlinks(target: Note, notes: Note[]): Note[] {
  const pattern = new RegExp(`\\]\\(\\s*note:${target.id}(?:#[^)]*)?\\s*\\)|^\\[[^\\]]+\\]:\\s*note:${target.id}\\b`, 'm');
  return notes.filter((n) => n.id !== target.id && pattern.test(n.body ?? ''));
}
