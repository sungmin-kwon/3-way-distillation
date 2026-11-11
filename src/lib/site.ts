// Typed view of site.config.mjs at the repo root, where each site's own settings live.
import { SITE, TAGS as TAG_LIST, FAMILY } from '../../site.config.mjs';

export interface Tag {
  name: string;
  /** URL form of the tag, for a name that isn't in Latin letters. */
  slug?: string;
  era?: string;
  blurb: string;
  description: string;
}

export const SITE_TITLE: string = SITE.title;
export const SITE_DESCRIPTION: string = SITE.description;
export const SITE_LANG: string = SITE.lang;
export const DISTILLATE_LABEL: string = SITE.distillateLabel;
export const NOT_FOUND: string = SITE.notFound;
export const TAGS: readonly Tag[] = TAG_LIST;
export const SITE_URL: string = SITE.url;
/** A site in the family. `lang` is only needed when it differs from this site's. */
export interface FamilySite {
  title: string;
  url: string;
  blurb: string;
  lang?: string;
}
export const SITE_FAMILY: readonly FamilySite[] = FAMILY;
/** Heading of the family list, in the header menu and the footer. */
export const SITE_FAMILY_LABEL: string = SITE.familyLabel ?? 'part of a family of notebooks';

/**
 * Web fonts: an optional stylesheet URL (e.g. Google Fonts) and the font stacks for body text
 * and for the monospace metadata. Defaults to IBM Plex Sans and Mono.
 */
const fonts: { stylesheet?: string; sans?: string; mono?: string } = SITE.fonts ?? {};
export const FONT_STYLESHEET: string =
  fonts.stylesheet ??
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&display=swap';
const fontVars = [fonts.sans && `--sans: ${fonts.sans};`, fonts.mono && `--mono: ${fonts.mono};`].filter(Boolean);
/** CSS that sets this site's font stacks over the shared ones. Empty if it keeps the defaults. */
export const FONT_CSS: string = fontVars.length ? `html:root { ${fontVars.join(' ')} }` : '';

type Palette = Record<string, string>;
const palette: { light?: Palette; dark?: Palette } = SITE.palette ?? {};
const vars = (p: Palette = {}) => Object.entries(p).map(([k, v]) => `--${k}: ${v};`).join(' ');

/**
 * CSS that applies this site's palette on top of the shared stylesheet. It uses site.css's
 * selectors for light, system dark and toggled dark, with `html` added so it wins over
 * site.css whatever order the two load in. Empty if there is no palette.
 */
export const PALETTE_CSS: string = [
  palette.light && `html:root { ${vars(palette.light)} }`,
  palette.dark && `@media (prefers-color-scheme: dark) { html:root:not([data-theme='light']) { ${vars(palette.dark)} } }`,
  palette.dark && `html:root[data-theme='dark'] { ${vars(palette.dark)} }`,
]
  .filter(Boolean)
  .join('\n');

export const TAG_NAMES = TAGS.map((t) => t.name) as [string, ...string[]];
