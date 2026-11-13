# notebooks

Source for Sungmin's notebooks, published at <https://sungmin-kwon.github.io/>:

- [notes from the 3-way distiller](https://sungmin-kwon.github.io/3-way-distillation/): chemical
  engineering, language models and quantum computing.
- [working notes](https://sungmin-kwon.github.io/working-notes/): study and research notes from
  graduate school in data science (statistics, genetics, health data). Until 2026-11 these lived
  in their own repository, `working-notes`, now archived; its history was merged in here.
- [marginalia](https://sungmin-kwon.github.io/marginalia/): history and other topics outside
  science, argued from the sources, with its own version of the bar in `WRITING.md`.
- [purgatorial thoughts](https://sungmin-kwon.github.io/purgatorial-thoughts/): notes from
  any notebook that don't yet clear the bar in `WRITING.md`, kept without tags until they
  are reworked.

The root of the site is a home page that lists them. The Korean notebook, 사회학 개론, is a
separate repository ([korean-notes](https://github.com/sungmin-kwon/korean-notes)).

It is a static [Astro](https://astro.build) site: Markdown in, plain HTML and CSS out.
The only client-side JavaScript is the find box on the index.

The Korean site is built from the same code. [`SHARED.md`](SHARED.md) lists which files are
shared and how to keep them in sync.

## Writing a note

For voice, structure, accuracy rules and a self-check list (written so that any model can follow
them), see [`WRITING.md`](WRITING.md).

Every note is one Markdown file in `src/content/notes/`, whichever notebook it belongs to. Its
tags decide the notebook, and the file name becomes its URL inside that notebook
(`soft-targets.md` with tag `ml/llm` → `/3-way-distillation/notes/soft-targets/`). A note
without tags goes to purgatorial thoughts.

The only required fields are `date` and, outside purgatorial thoughts, `tags`:

```md
---
date: 2026-11-12
tags: [cheme]
---
Two or three sentences. A note without a title is a short note and is shown in full on the index.
```

A longer note adds a title and, optionally, more:

```md
---
title: Forward vs. reverse KL
date: 2026-11-12
updated: 2026-11-20      # optional
tags: [ml/llm]           # one notebook's tags; the lists are in site.config.mjs
summary: One line shown under the title on the index.
distillate: The boiled-down version, shown at the top of the note.
rough: true              # unfinished thinking; shows a "rough" mark
draft: true              # unfinished, not published at all
hidden: true             # finished but withheld from the site; see ADMIN.md
model: [Claude Opus 5.5] # model(s) that wrote or revised it; kept in the source, never shown on the site
reviewed_by: [Claude Opus 5.5] # optional: model(s) that did a separate review pass; never shown
---
```

- **Math:** `$inline$`, and display math with `$$` alone on the line above and below (KaTeX).
- **No links between notes.** Each note stands on its own (see `WRITING.md`); `npm run check`
  rejects a link to another note. Links to a heading in the same note (`#section`) are fine.
- **Footnotes:** `text[^1]` and `[^1]: the footnote`.
- **Figures:** inline `<svg>` works. Use `style="stroke: var(--accent)"` (or `--ink`, `--muted`)
  instead of fixed colors so it follows dark mode.

## Maintaining the notebooks

These steps are for whoever looks after the site. A drafting model doesn't need them, so they
live here rather than in `WRITING.md`.

- **Moving a note to purgatorial thoughts.** Sungmin decides; a reviewer only recommends it.
  Replace the note's tags with `tags: []` (a note without tags belongs to that notebook), and in
  the same change add a redirect from its old URL to `SITE.redirects` in `site.config.mjs`, or
  the old URL breaks. To bring a reworked note back, restore its tags and turn the redirect
  around.
- **Unhiding a note.** Delete its `hidden: true` line, run `npm run build` (which also refreshes
  `ADMIN.md`), check that the note renders, and commit both files.
- **Reference notes.** When a new note becomes a better model of style and depth, add it to the
  list at the end of `WRITING.md`. The hidden `how-spirits-distillation-works.md` (real VLE data,
  numerically integrated runs, corrections of common myths) can go back on the list when it is
  unhidden.
- **Known traps.** When a review finds a new kind of mistake, add a row to the traps table in
  `WRITING.md` section 7 (see `REVIEWING.md`).

## Commands

```sh
npm install
npm run dev      # local dev server at http://localhost:4321/
npm run build    # static site into dist/ (regenerates ADMIN.md first)
npm run admin    # just regenerate ADMIN.md, the list of all notes including hidden ones
npm run check    # the mechanical checks from WRITING.md (CI runs it on pull requests)
npm run preview  # serve dist/
npm run og-card  # redraw the link-preview cards (needs Playwright)
npm run sync -- ../korean-notes   # copy the shared files from the Korean site; see SHARED.md
```

## Layout

```
site.config.mjs         the site's URL and home page, and each notebook (section): path, title,
                        tags, colors, About text; plus redirects and the Korean site
src/content/notes/      the notes
src/content.config.ts   note frontmatter schema
src/pages/[...section]/ each notebook's index, notes/[id], tags/[tag], about and rss.xml
                        (the index route also builds the home page at /)
src/pages/              404 and search.json, one each for the whole site
src/components/Home.astro        the home page
src/components/NoteIndex.astro   the dated list, tag filter and find box
src/layouts/Base.astro  page shell and masthead
src/lib/notes.ts        loading, grouping, tags, URL helpers
src/lib/sections.mjs    the notebooks with their URLs, and which notebook a tag is in
src/lib/site.ts         typed view of site.config.mjs
scripts/                ADMIN.md generator, note linter, shared-file sync, and the frontmatter reader
ADMIN.md                generated list of every note, visible or hidden; not deployed
src/styles/site.css     all styling; light and dark follow the system setting
```

## Hosting

GitHub Pages, deployed by `.github/workflows/pages.yml` on every push to `main`
(pull requests only build). In the repo settings, Pages → Source must be **GitHub Actions**.

The repository is named `sungmin-kwon.github.io`, which makes it GitHub's user site, served at the
domain root (`base: '/'` in `site.config.mjs`). Each notebook is a path under it. The Korean site
is a separate project site at `/korean-notes/`, which GitHub serves from its own repository.
Build internal links with `href()` and `sectionHref()` from `src/lib/notes.ts`. Each notebook's
favicon and link-preview card are `public/<path>/favicon.svg` and `og.png`; the home page's are
`public/favicon.svg` and `og.png`. For a custom domain, set `url` to it.

## License

The code is MIT-licensed (see `LICENSE`). The writing in `src/content/` is © Sungmin Kwon and
licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): share and adapt it
with credit.
