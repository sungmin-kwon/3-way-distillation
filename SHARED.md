# Shared files

Two repositories are built from the same code:

- [sungmin-kwon.github.io](https://github.com/sungmin-kwon/sungmin-kwon.github.io): the English
  notebooks, notes from the 3-way distiller and working notes, as two sections of one site with a
  home page at the root. (Until 2026-11 these were two repositories, `3-way-distillation` and
  `working-notes`.)
- [korean-notes](https://github.com/sungmin-kwon/korean-notes): 인문학 개론, in Korean, a site
  with a single section at its root.

To keep a fix from having to be made twice, every setting that differs between them lives in
`site.config.mjs`, and the rest of the code is the same file in both.

## How one codebase serves both

`site.config.mjs` has `SITE` (the URL, base path, language, home page, redirects) and `SECTIONS`,
the notebooks. Each section has a `path`, its own title, tags, colors, distillate label,
affiliation rule and About text. With more than one section, every section has a path and the
site root is a home page (`HAS_HOME` in `src/lib/sections.mjs`). With a single section at path
`''`, as on the Korean site, that section is the root and there is no home page. A section
with `untagged: true` (purgatorial thoughts here) holds the notes that have no tags; without
one, untagged notes go to the first section. The routes in
`src/pages/[...section]/` build each section's pages under its path, and the home page when
there is one.

## Shared: identical in both

Copy these unchanged. `scripts/sync-shared.mjs` holds the same list.

- `.github/workflows/pages.yml`, `.gitignore`, `LICENSE`, `tsconfig.json`, `astro.config.mjs`
- `REVIEWING.md`, `SHARED.md`
- `scripts/` (the ADMIN.md generator, the note linter, the frontmatter reader, the link-preview
  card, the sync script)
- `src/content.config.ts`, `src/env.d.ts`
- `src/layouts/`, `src/components/`, `src/lib/` (including `i18n.ts`, the interface text in
  English and Korean, and `sections.mjs`), `src/styles/`
- every page in `src/pages/`, including `src/pages/[...section]/`
- `package.json` and `package-lock.json`, apart from their `name`

## Shared in part: same text, with site-specific sections

- `WRITING.md`. The voice, frontmatter, accuracy and workflow rules are the same everywhere.
  These parts belong to one site: the opening section, hard rule 7 and the affiliation bullets
  in section 1, the tag list in section 2, the short-note example in section 3, the code language
  in section 6, the known-traps table in section 7, and the reference notes. The Korean site's
  copy adds section 1a on Korean prose. A rule change in a shared section should be made in both
  copies by hand.

## Site-specific: never copied

- `site.config.mjs`: everything above, plus web fonts, the 404 line, the number of notes per page,
  the label of the family list (its braced words link to `familyHome`, the page that lists every
  notebook) and the notebooks on the other site (`FAMILY`). When a notebook
  is added, add it to the other site's `FAMILY`.
- `public/`: each section's favicon and link-preview card at `public/<path>/favicon.svg` and
  `og.png` (`public/favicon.svg` and `og.png` for the home page, or for a single section at the
  root). `npm run og-card` redraws the cards from `site.config.mjs` and the favicons.
- `README.md`, `STYLE-KO.md` (Korean site), `src/content/notes/` and the generated `ADMIN.md`.

## Making a shared change

1. Make the change in one site, in a PR as usual.
2. After it merges, in the other site run `npm run sync -- ../<that site's checkout>`, check
   `git diff`, run `npm run check` and `npm run build`, and open a PR with the result.
3. If the change needs a new setting, add it to both `site.config.mjs` files in the same PRs.
4. `sync` only copies; a shared file that was renamed or removed has to be deleted by hand in
   the other site.

## The Korean site

`lang: 'ko'` in `site.config.mjs` switches the interface text and date formats to Korean
(`src/lib/i18n.ts`) and turns on Korean line breaking in `site.css` (`word-break: keep-all`, for
`:lang(ko)`). The Korean site also sets its own `fonts` (IBM Plex Sans KR) and gives its tags a
Latin `slug` for their URLs. Its `WRITING.md` keeps the shared rules and adds a section on Korean
prose (section 1a), and `STYLE-KO.md` is its Korean style sheet.
