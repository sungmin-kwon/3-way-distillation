// Everything that makes this site differ from the others in the family is here, so the
// layout, pages, scripts and styles can be copied between the sites unchanged.
// See SHARED.md for which files are shared and which belong to one site.
// Plain JavaScript, so astro.config.mjs, the scripts and the TypeScript code can all read it.

const WORKING_NOTES = 'https://sungmin-kwon.github.io/working-notes/';
const MOVED = [
  'genome-wide-association-studies',
  'mendelian-randomization',
  'polygenic-risk-scores',
  'ehrs-fhir-omop-cdw',
  'medical-codes',
  'discrete-and-continuous-distributions',
];

export const SITE = {
  title: 'notes from the 3-way distiller',
  description: 'My notebook on things that interest me, boiled down to the essentials.',
  // GitHub Pages project site. For a custom domain, set url to it and base to '/'.
  url: 'https://sungmin-kwon.github.io/3-way-distillation/',
  base: '/3-way-distillation/',
  lang: 'en',
  // Heading of the box that shows a long note's `distillate` field.
  distillateLabel: 'Distillate',
  // Line on the 404 page.
  notFound: 'This page doesn’t exist, or it was boiled off.',
  // Heading of the list of the other sites in FAMILY (header menu and footer line).
  familyLabel: 'part of a family of notebooks',
  // false: `npm run check` rejects "my lab", "our university" and the like in notes.
  allowAffiliation: false,
  // Old paths (without the base) that send readers elsewhere, e.g. notes that moved to a
  // sibling site: { '/notes/old-id': 'https://…/notes/old-id/' }.
  // The genes and stats notes moved to working notes on 2026-11-11.
  redirects: {
    ...Object.fromEntries(MOVED.map((id) => [`/notes/${id}`, `${WORKING_NOTES}notes/${id}/`])),
    '/tags/genes': `${WORKING_NOTES}tags/genes/`,
    '/tags/stats': `${WORKING_NOTES}tags/stats/`,
  },
};

/**
 * The tags, in display order (eras: past, present, future). A note may only use these (the
 * content schema and `npm run check` both enforce it). Add a tag here before using it in a note.
 * `era` is optional; when present it is shown next to the tag.
 */
export const TAGS = [
  {
    name: 'cheme',
    era: 'past',
    blurb: 'chemical engineering, separations and thermodynamics.',
    description: 'Chemical engineering: separations, thermodynamics and the unit operations.',
  },
  {
    name: 'ml/llm',
    era: 'present',
    blurb: 'machine learning and language models, what I work on now.',
    description: 'Machine learning and language models: how they are trained, compressed and served.',
  },
  {
    name: 'qi/qc',
    era: 'future',
    blurb: 'quantum information and computing, something I’d like to learn properly someday.',
    description: 'Quantum information and computing: qubits, entanglement and what they make possible. Learning in progress.',
  },
];

/**
 * The sites in the family, listed in the header menu and footer of every page and on the About page.
 * `url` is the site's root. `lang` is the site's language, so that an entry is marked up in its
 * own language on a site whose language differs (the Korean site lists the English ones). Keep this list the same in every site.
 */
export const FAMILY = [
  {
    title: 'notes from the 3-way distiller',
    url: 'https://sungmin-kwon.github.io/3-way-distillation/',
    lang: 'en',
    blurb: 'a notebook on things that interest me: chemical engineering, language models and quantum computing.',
  },
  {
    title: 'working notes',
    url: 'https://sungmin-kwon.github.io/working-notes/',
    lang: 'en',
    blurb: 'study and research notes from graduate school in data science, mostly statistics and genetics.',
  },
  {
    title: '근거와 실재',
    url: 'https://sungmin-kwon.github.io/korean-notes/',
    lang: 'ko',
    blurb: '근거이론과 실재론을 비롯한 사회과학 방법론 노트, 한국어로.',
  },
];
