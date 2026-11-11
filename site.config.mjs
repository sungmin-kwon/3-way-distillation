// Everything that makes this site differ from the others in the family is here, so the
// layout, pages, scripts and styles can be copied between the sites unchanged.
// See SHARED.md for which files are shared and which belong to one site.
// Plain JavaScript, so astro.config.mjs, the scripts and the TypeScript code can all read it.

export const SITE = {
  title: 'working notes',
  description:
    'Notes from my graduate study and research in data science: statistics, genetics and methods, written to be looked up later.',
  // GitHub Pages project site. For a custom domain, set url to it and base to '/'.
  url: 'https://sungmin-kwon.github.io/working-notes/',
  base: '/working-notes/',
  lang: 'en',
  // Heading of the box that shows a long note's `distillate` field.
  distillateLabel: 'In short',
  // Line on the 404 page.
  notFound: 'This page doesn’t exist, or it has moved.',
  // false: `npm run check` rejects "my lab", "our university" and the like in notes.
  // This site may name the school and its courses (WRITING.md, section 1).
  allowAffiliation: true,
  // Old paths (without the base) that send readers elsewhere, e.g. notes that moved to a
  // sibling site: { '/notes/old-id': 'https://…/notes/old-id/' }.
  redirects: {},
};

/**
 * The tags, in display order. A note may only use these (the content schema and
 * `npm run check` both enforce it). Add a tag here before using it in a note.
 * `era` is optional; when present it is shown next to the tag (past, present, future).
 */
export const TAGS = [
  {
    name: 'stats',
    blurb: 'probability and statistics, the language the other notes are written in.',
    description:
      'Probability and statistics: distributions, estimation and hypothesis testing, the common machinery underneath the other notes.',
  },
  {
    name: 'genes',
    blurb: 'genetics, genomics and the clinical data around them.',
    description:
      'Genetics, genomics and the clinical data around them: GWAS, polygenic scores, Mendelian randomization, medical codes and EHR/CDW infrastructure.',
  },
];

/** The sites in the family, listed on each About page. `url` is the site's root. */
export const FAMILY = [
  {
    title: 'notes from the 3-way distiller',
    url: 'https://sungmin-kwon.github.io/3-way-distillation/',
    blurb: 'a notebook on things that interest me: chemical engineering, language models and quantum computing.',
  },
  {
    title: 'working notes',
    url: 'https://sungmin-kwon.github.io/working-notes/',
    blurb: 'study and research notes from graduate school in data science, mostly statistics and genetics.',
  },
];
