# Shared files

Each site is one of a family of notebook sites built from the same code:

- [notes from the 3-way distiller](https://github.com/sungmin-kwon/3-way-distillation)
- [working notes](https://github.com/sungmin-kwon/working-notes)

A third site, in Korean, is planned. To keep a fix from having to be made three times, every
setting that differs between the sites lives in `site.config.mjs`, and the rest of the code is
the same file in every repo.

## Shared: identical in every site

Copy these unchanged. `scripts/sync-shared.mjs` holds the same list.

- `.github/workflows/pages.yml`, `.gitignore`, `LICENSE`, `tsconfig.json`, `astro.config.mjs`
- `REVIEWING.md`, `SHARED.md`
- `scripts/` (the ADMIN.md generator, the note linter, the frontmatter reader, the sync script)
- `src/content.config.ts`, `src/env.d.ts`
- `src/layouts/`, `src/components/`, `src/lib/`, `src/styles/`
- every page in `src/pages/` except `about.astro`
- `package.json` and `package-lock.json`, apart from their `name`

## Shared in part: same text, with site-specific sections

- `WRITING.md`. The voice, frontmatter, accuracy and workflow rules are the same everywhere.
  These parts belong to one site: the opening paragraph, hard rule 7 and the affiliation bullet
  in section 1 (the distiller names no institution; working notes may name the school), the tag list
  in section 2, the short-note example in section 3, the code language in section 6, the
  known-traps table in section 7, and the reference notes. A rule change in a shared section
  should be made in every site's copy by hand.

## Site-specific: never copied

- `site.config.mjs`: title, description, URL and base path, language, tags, the label of the
  distillate box, the 404 line, whether notes may name an affiliation, redirects, and the sibling
  sites shown on About.
- `src/pages/about.astro`: the About text and the "Currently" list.
- `public/favicon.svg` and `README.md`.
- `src/content/notes/` and the generated `ADMIN.md`.

## Making a shared change

1. Make the change in one site, in a PR as usual.
2. After it merges, in each other site run `npm run sync -- ../<that site's checkout>`, check
   `git diff`, run `npm run check` and `npm run build`, and open a PR with the result.
3. If the change needs a new setting, add it to every site's `site.config.mjs` in the same PRs.

The Korean site will need a few more settings (fonts, `lang: 'ko'`, and probably its own
`WRITING.md`), but the same split applies.
