import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkNoteLinks } from './src/lib/remark-note-links.mjs';
import { unpublishedIds } from './scripts/notes-meta.mjs';
import { SITE } from './site.config.mjs';

// The URL, sub-path and any redirects come from site.config.mjs.
const { url: site, base, redirects = {} } = SITE;

export default defineConfig({
  output: 'static',
  site,
  base,
  redirects,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, [remarkNoteLinks, { base, unpublished: unpublishedIds() }]],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
