# notes from the 3-way distiller

Source for Sungmin's personal notebook, published at
<https://sungmin-kwon.github.io/3-way-distillation/>.

It is a static [Astro](https://astro.build) site: Markdown in, plain HTML and CSS out.
The only client-side JavaScript is the find box on the index.

It is one of a family of sites built from the same code. The sibling is
[working notes](https://github.com/sungmin-kwon/working-notes), which took over the genetics and
statistics notes on 2026-11-11 (their old URLs here redirect to it).
[`SHARED.md`](SHARED.md) lists which files are shared and how to keep them in sync.

## Writing a note

For voice, structure, accuracy rules and a self-check list (written so that any model can follow
them), see [`WRITING.md`](WRITING.md).

Every note is one Markdown file in `src/content/notes/`. The file name becomes its URL
(`src/content/notes/soft-targets.md` → `/notes/soft-targets/`).

The only required field is `date`:

```md
---
date: 2026-11-12
---
Two or three sentences. A note without a title is a short note and is shown in full on the index.
```

A longer note adds a title and, optionally, more:

```md
---
title: Forward vs. reverse KL
date: 2026-11-12
updated: 2026-11-20      # optional
tags: [ml/llm]           # cheme, ml/llm or qi/qc; the list is in site.config.mjs
summary: One line shown under the title on the index.
distillate: The boiled-down version, shown at the top of the note.
rough: true              # unfinished thinking; shows a "rough" mark
draft: true              # unfinished, not published at all
hidden: true             # finished but withheld from the site; see ADMIN.md
model: [Claude Opus 5.5] # model(s) that wrote or revised it; kept in the source, never shown on the site
reviewed_by: [Claude Opus 5.5] # optional: model(s) that did a separate review pass; never shown
---
```

- **Math:** `$inline$` and `$$display$$` (KaTeX).
- **Links between notes:** `[text](note:other-note-id)`. The note that is linked to lists the
  linking note under "Linked from".
- **Footnotes:** `text[^1]` and `[^1]: the footnote`.
- **Figures:** inline `<svg>` works. Use `style="stroke: var(--accent)"` (or `--ink`, `--muted`)
  instead of fixed colors so it follows dark mode.

## Commands

```sh
npm install
npm run dev      # local dev server at http://localhost:4321/3-way-distillation/
npm run build    # static site into dist/ (regenerates ADMIN.md first)
npm run admin    # just regenerate ADMIN.md, the list of all notes including hidden ones
npm run check    # the mechanical checks from WRITING.md (CI runs it on pull requests)
npm run preview  # serve dist/
npm run sync -- ../working-notes   # copy the shared files from a sibling site; see SHARED.md
```

## Layout

```
site.config.mjs         this site's title, description, URL, tags, redirects and sibling sites
src/content/notes/      the notes
src/content.config.ts   note frontmatter schema
src/pages/              index, notes/[id], tags/[tag], about, 404, rss.xml, search.json
src/components/NoteIndex.astro   the dated list, tag filter and find box
src/layouts/Base.astro  page shell and masthead
src/lib/notes.ts        loading, grouping, tags, backlinks, URL helpers
src/lib/remark-note-links.mjs    turns note: links into real URLs (plain text if the note is hidden)
src/lib/site.ts         typed view of site.config.mjs
scripts/                ADMIN.md generator, note linter, shared-file sync, and the frontmatter reader
ADMIN.md                generated list of every note, visible or hidden; not deployed
src/styles/site.css     all styling; light and dark follow the system setting
```

## Hosting

GitHub Pages, deployed by `.github/workflows/pages.yml` on every push to `main`
(pull requests only build). In the repo settings, Pages → Source must be **GitHub Actions**.

The site lives under the `/3-way-distillation/` sub-path, set by `base` in `site.config.mjs`.
Always build internal links with `href()` from `src/lib/notes.ts` so the prefix is kept.
For a custom domain, set `url` to it and `base` to `/`.

## License

The code is MIT-licensed (see `LICENSE`). The writing in `src/content/` is © Sungmin Kwon and
licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): share and adapt it
with credit.
