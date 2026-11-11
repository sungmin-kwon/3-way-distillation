import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkNoteLinks } from './src/lib/remark-note-links.mjs';
import { rehypeSectionLinks } from './src/lib/rehype-section-links.mjs';
import { UI } from './src/lib/i18n.ts';
import { unpublishedIds } from './scripts/notes-meta.mjs';
import { SITE } from './site.config.mjs';

// The URL, sub-path and any redirects come from site.config.mjs.
const { url: site, base, redirects = {} } = SITE;

// GitHub's code themes were tuned for white and near-black backgrounds. On the tinted code
// background of every site in the family, a few of their colours fall below the WCAG AA
// contrast ratio for normal text (4.5:1). Swap each for GitHub's own darker or lighter shade of
// the same hue. Ratios are the lowest over the three sites' code backgrounds (site.css and each
// site.config.mjs). Check new colours with a contrast checker before adding a site or a palette.
const CODE_COLOURS = {
  // light theme (`color:` in Shiki's output)
  light: {
    '#D73A49': '#B31D28', // keywords, operators: 3.8 -> 5.5
    '#E36209': '#953800', // parameters, variables: 2.9 -> 6.1
    '#6A737D': '#57606A', // comments: 4.0 -> 5.3
    '#22863A': '#116329', // markup tags, inserted lines: 3.8 -> 6.1
  },
  // dark theme (`--shiki-dark:` in Shiki's output)
  dark: {
    '#6A737D': '#8B949E', // comments: 3.4 -> 5.4
  },
};

const codeContrast = {
  name: 'code-contrast',
  span(node) {
    let style = node.properties.style;
    if (typeof style !== 'string') return;
    style = style.replace(/(^|;)color:(#[0-9A-Fa-f]{6})/, (m, pre, c) =>
      `${pre}color:${CODE_COLOURS.light[c.toUpperCase()] ?? c}`);
    style = style.replace(/--shiki-dark:(#[0-9A-Fa-f]{6})/, (m, c) =>
      `--shiki-dark:${CODE_COLOURS.dark[c.toUpperCase()] ?? c}`);
    node.properties.style = style;
  },
};

export default defineConfig({
  output: 'static',
  site,
  base,
  redirects,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, [remarkNoteLinks, { base, unpublished: unpublishedIds() }]],
      rehypePlugins: [rehypeKatex, [rehypeSectionLinks, { label: UI.sectionLink }]],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      transformers: [codeContrast],
    },
  },
});
