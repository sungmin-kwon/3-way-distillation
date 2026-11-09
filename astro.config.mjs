import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkNoteLinks } from './src/lib/remark-note-links.mjs';

// GitHub Pages project site. If this ever moves to a domain root,
// set `site` to that domain and remove `base`.
const site = 'https://sungmin-kwon.github.io/3-way-distillation/';
const base = '/3-way-distillation/';

export default defineConfig({
  output: 'static',
  site,
  base,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, [remarkNoteLinks, { base }]],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
