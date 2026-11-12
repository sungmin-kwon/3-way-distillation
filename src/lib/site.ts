// Typed view of site.config.mjs at the repo root, where the site's own settings live, and of
// its sections (the notebooks), whose URLs src/lib/sections.mjs works out.
import { SITE, FAMILY } from '../../site.config.mjs';
import {
  HAS_HOME as HOME,
  SECTIONS as SECTION_LIST,
  SITE_BASE as BASE,
  sectionOfTag as ofTag,
  sectionOfTags as ofTags,
} from './sections.mjs';

export interface Tag {
  name: string;
  /** URL form of the tag, for a name that isn't in Latin letters. */
  slug?: string;
  era?: string;
  blurb: string;
  description: string;
}

type Palette = Record<string, string>;

/** A notebook: its own path, title, tags and look (SECTIONS in site.config.mjs). */
export interface Section {
  /** Path under the site, without slashes ('working-notes'), or '' for the site root. */
  path: string;
  /** Path from the domain root, with slashes: '/working-notes/'. */
  base: string;
  /** Full address: 'https://…/working-notes/'. */
  url: string;
  title: string;
  description: string;
  blurb: string;
  distillateLabel: string;
  allowAffiliation?: boolean;
  /** True for the section that holds notes without tags. */
  untagged?: boolean;
  /** Paragraphs of the About page; '{tags}' stands for the tag list. */
  about?: string[];
  aboutDescription?: string;
  /** Last paragraph of the About page; 'rough' in it is shown as the rough mark. */
  howToRead?: string;
  palette?: { light?: Palette; dark?: Palette };
  tags: Tag[];
}

export const SECTIONS: readonly Section[] = SECTION_LIST;
/** True when the site root is a home page that lists the sections. */
export const HAS_HOME: boolean = HOME;
export const SITE_BASE: string = BASE;
export const sectionOfTag: (tag: string) => Section | undefined = ofTag;
export const sectionOfTags: (tags?: readonly string[]) => Section = ofTags;

/** Title and description of the home page (or of the site, with a single section). */
export const SITE_TITLE: string = SITE.title;
export const SITE_DESCRIPTION: string = SITE.description;
export const SITE_LANG: string = SITE.lang;
export const NOT_FOUND: string = SITE.notFound;
/** Every tag, across the sections. */
export const TAGS: readonly Tag[] = SECTIONS.flatMap((s) => s.tags);
export const SITE_URL: string = SITE.url;
/** Notes per page on the index and the tag pages (SITE.pageSize, default 10). */
export const PAGE_SIZE: number = Math.max(1, Math.floor(SITE.pageSize ?? 10));
/** A notebook in the family list. `lang` is only needed when it differs from this site's. */
export interface FamilySite {
  title: string;
  url: string;
  blurb: string;
  lang?: string;
}
/** Notebooks on other sites (FAMILY in site.config.mjs). */
export const SITE_FAMILY: readonly FamilySite[] = FAMILY;
/** Heading of the family list, in the header menu and the footer. */
export const SITE_FAMILY_LABEL: string = SITE.familyLabel ?? 'part of a family of {notebooks}';
/** The page that lists every notebook, which the braced words of the label link to. */
export const SITE_FAMILY_HOME: string | undefined = SITE.familyHome;
/** The family label split around its braced words: [before, linked, after]. */
export function familyLabelParts(): [string, string, string] {
  const m = SITE_FAMILY_LABEL.match(/^(.*)\{(.+)\}(.*)$/);
  return m ? [m[1], m[2], m[3]] : [SITE_FAMILY_LABEL, '', ''];
}

/**
 * The notebooks to list from a page: the home page (when there is one), this site's sections and
 * the notebooks on other sites, without the one the page is in. On the home page, `current` is
 * undefined and every section is listed. The header menu and the footer pass `withHome` false:
 * they reach the home page through the label instead (familyLabelParts).
 */
export function familyFrom(current?: Section, withHome = true): FamilySite[] {
  const home: FamilySite[] =
    withHome && HAS_HOME && current ? [{ title: SITE_TITLE, url: SITE_URL, blurb: SITE.blurb ?? SITE_DESCRIPTION }] : [];
  const sections = SECTIONS.filter((s) => s.path !== current?.path).map((s) => ({
    title: s.title,
    url: s.url,
    blurb: s.blurb,
  }));
  return [...home, ...sections, ...SITE_FAMILY];
}

/**
 * Web fonts: an optional stylesheet URL (e.g. Google Fonts) and the font stacks for body text
 * and for the monospace metadata. Defaults to IBM Plex Sans and Mono.
 */
const fonts: { stylesheet?: string; sans?: string; mono?: string } = SITE.fonts ?? {};
export const FONT_STYLESHEET: string =
  fonts.stylesheet ??
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&display=swap';

/**
 * Family titles in another script, e.g. the Korean site's title on the English sites. They would
 * otherwise fall back to a system font (Apple SD Gothic Neo, Malgun Gothic…) that looks nothing
 * like the Korean site itself. So load IBM Plex Sans KR, the font the Korean site uses, cut down
 * by Google Fonts' `text=` to just the letters of those titles (a few kB). site.css lists
 * 'IBM Plex Sans KR' after the Latin Plex fonts, so the browser takes only those letters from it.
 */
const FAMILY_FONTS: Record<string, string> = { ko: 'IBM Plex Sans KR' };
const foreignFonts = Object.entries(FAMILY_FONTS).flatMap(([lang, family]) => {
  if (lang === SITE_LANG) return [];
  const text = [...new Set(SITE_FAMILY.filter((s) => s.lang === lang).flatMap((s) => [...s.title]))]
    .filter((c) => c.trim())
    .join('');
  if (!text) return [];
  const name = family.replace(/ /g, '+');
  return [`https://fonts.googleapis.com/css2?family=${name}:wght@400;600&text=${encodeURIComponent(text)}&display=swap`];
});
/** Extra stylesheets for family titles in another script (empty on the site in that language). */
export const FAMILY_FONT_STYLESHEETS: readonly string[] = foreignFonts;
const fontVars = [fonts.sans && `--sans: ${fonts.sans};`, fonts.mono && `--mono: ${fonts.mono};`].filter(Boolean);
/** CSS that sets this site's font stacks over the shared ones. Empty if it keeps the defaults. */
export const FONT_CSS: string = fontVars.length ? `html:root { ${fontVars.join(' ')} }` : '';

const vars = (p: Palette = {}) => Object.entries(p).map(([k, v]) => `--${k}: ${v};`).join(' ');

/**
 * CSS that applies a palette (a section's, or SITE.palette for the home page) on top of the
 * shared stylesheet. It uses site.css's selectors for light, system dark and toggled dark (dark
 * on screen only, so print stays light), with `html` added so it wins over site.css whatever
 * order the two load in. Empty if there is no palette.
 */
export function paletteCss(palette: { light?: Palette; dark?: Palette } = {}): string {
  return [
    palette.light && `html:root { ${vars(palette.light)} }`,
    palette.dark && `@media screen and (prefers-color-scheme: dark) { html:root:not([data-theme='light']) { ${vars(palette.dark)} } }`,
    palette.dark && `@media screen { html:root[data-theme='dark'] { ${vars(palette.dark)} } }`,
  ]
    .filter(Boolean)
    .join('\n');
}

/** The home page's palette (SITE.palette). */
export const HOME_PALETTE: { light?: Palette; dark?: Palette } = SITE.palette ?? {};

export const TAG_NAMES = TAGS.map((t) => t.name) as [string, ...string[]];
