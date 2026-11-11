// Typed view of site.config.mjs at the repo root, where each site's own settings live.
import { SITE, TAGS as TAG_LIST, FAMILY } from '../../site.config.mjs';

export interface Tag {
  name: string;
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
export const SITE_FAMILY: readonly { title: string; url: string; blurb: string }[] = FAMILY;

export const TAG_NAMES = TAGS.map((t) => t.name) as [string, ...string[]];
