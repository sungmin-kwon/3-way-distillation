// The notebooks (sections) of the site, from SECTIONS in site.config.mjs, with their URLs
// worked out. Plain JavaScript, so astro.config.mjs and the scripts can use it as well as the
// TypeScript code (src/lib/site.ts re-exports it with types).
import { SITE, SECTIONS as SECTION_LIST } from '../../site.config.mjs';

const slash = (s) => (s.endsWith('/') ? s : `${s}/`);

/** The site's base path with a trailing slash, e.g. '/' or '/korean-notes/'. */
export const SITE_BASE = slash(SITE.base ?? '/');

/**
 * Each section with `base`, its path from the domain root ('/3-way-distillation/'), and `url`,
 * its full address. A section whose path is '' is the site root.
 */
export const SECTIONS = SECTION_LIST.map((s) => {
  const rel = s.path ? `${s.path}/` : '';
  return { ...s, base: `${SITE_BASE}${rel}`, url: new URL(rel, SITE.url).href };
});

/** True when the root is a home page listing the sections (no section sits at the root). */
export const HAS_HOME = SECTIONS.every((s) => s.path);

/** The section a tag belongs to, or undefined for an unknown tag. */
export function sectionOfTag(tag) {
  return SECTIONS.find((s) => s.tags.some((t) => t.name === tag));
}

/**
 * The section a note's tags put it in: the section of its first known tag, or the first section
 * for a note without tags. `npm run check` makes sure a note's tags don't span two sections.
 */
export function sectionOfTags(tags = []) {
  for (const t of tags) {
    const s = sectionOfTag(t);
    if (s) return s;
  }
  return SECTIONS[0];
}

/** Every tag name, across all sections. */
export const ALL_TAG_NAMES = SECTIONS.flatMap((s) => s.tags.map((t) => t.name));
