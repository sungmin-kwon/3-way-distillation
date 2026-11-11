# Shared files

Each site is one of a family of notebook sites built from the same code:

- [notes from the 3-way distiller](https://github.com/sungmin-kwon/3-way-distillation)
- [working notes](https://github.com/sungmin-kwon/working-notes)
- [근거와 실재](https://github.com/sungmin-kwon/korean-notes), in Korean

To keep a fix from having to be made three times, every
setting that differs between the sites lives in `site.config.mjs`, and the rest of the code is
the same file in every repo.

## Shared: identical in every site

Copy these unchanged. `scripts/sync-shared.mjs` holds the same list.

- `.github/workflows/pages.yml`, `.gitignore`, `LICENSE`, `tsconfig.json`, `astro.config.mjs`
- `REVIEWING.md`, `SHARED.md`
- `scripts/` (the ADMIN.md generator, the note linter, the frontmatter reader, the sync script)
- `src/content.config.ts`, `src/env.d.ts`
- `src/layouts/`, `src/components/`, `src/lib/` (including `i18n.ts`, the interface text in
  English and Korean), `src/styles/`
- every page in `src/pages/` except `about.astro`
- `package.json` and `package-lock.json`, apart from their `name`

## Shared in part: same text, with site-specific sections

- `WRITING.md`. The voice, frontmatter, accuracy and workflow rules are the same everywhere.
  These parts belong to one site: the opening paragraph, hard rule 7 and the affiliation bullet
  in section 1 (the distiller and the Korean site name no institution; working notes may name the school), the tag list
  in section 2, the short-note example in section 3, the code language in section 6, the
  known-traps table in section 7, and the reference notes. A rule change in a shared section
  should be made in every site's copy by hand.

## Site-specific: never copied

- `site.config.mjs`: title, description, URL and base path, language (which picks the interface
  text in `src/lib/i18n.ts`; `ui` overrides single strings), web fonts, tags, the label of the
  distillate box, the 404 line, the number of notes per page, whether notes may name an affiliation, redirects, colors, the label of the
  family list (header menu and footer), and the family of sites (shown there and on About). The family list
  itself should be the same in every site, so a new site is added to every copy.
- `src/pages/about.astro`: the About text and the "Currently" list.
- `public/favicon.svg` and `README.md`.
- `src/content/notes/` and the generated `ADMIN.md`.

## Making a shared change

1. Make the change in one site, in a PR as usual.
2. After it merges, in each other site run `npm run sync -- ../<that site's checkout>`, check
   `git diff`, run `npm run check` and `npm run build`, and open a PR with the result.
3. If the change needs a new setting, add it to every site's `site.config.mjs` in the same PRs.

## The Korean site

`lang: 'ko'` in `site.config.mjs` switches the interface text and date formats to Korean
(`src/lib/i18n.ts`) and turns on Korean line breaking in `site.css` (`word-break: keep-all`, for
`:lang(ko)`). The Korean site also sets its own `fonts` (IBM Plex Sans KR) and gives its tags a
Latin `slug` for their URLs. Its `WRITING.md` keeps the shared rules and adds a section on Korean
prose (section 1a). The code is otherwise the same as the other sites'.
