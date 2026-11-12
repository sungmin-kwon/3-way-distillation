// Everything that is particular to this site, and to each notebook (section) in it, is here, so
// the layout, pages, scripts and styles stay the same as the Korean site's (korean-notes), which
// copies them. See SHARED.md for which files are shared and which belong to one site.
// Plain JavaScript, so astro.config.mjs, the scripts and the TypeScript code can all read it.
//
// The site is a set of notebooks ("sections"). Each section has its own path, title, tags and
// look, and every note belongs to one section through its tags. With more than one section the
// site root (/) is a home page that lists them; with one section at path '' (the Korean site)
// the section is the root.

// Six notes moved from the distiller to working notes on 2026-11-11, and three of them moved on
// to purgatorial thoughts on 2026-11-13; their old distiller paths point to where they are now.
const PURGATORY = new Set(['mendelian-randomization', 'ehrs-fhir-omop-cdw', 'discrete-and-continuous-distributions']);
const notePath = (id) => `/${PURGATORY.has(id) ? 'purgatorial-thoughts' : 'working-notes'}/notes/${id}/`;

export const SITE = {
  // Title and description of the home page that lists the notebooks.
  title: 'notebooks',
  description: 'Four notebooks kept in public: one on things that interest me, one from graduate study, one on history and other things that aren’t science, and one for notes that don’t yet clear the bar.',
  // How the home page is described in the notebooks' About pages.
  blurb: 'all the notebooks, with the latest notes from each.',
  // GitHub Pages user site (repository sungmin-kwon.github.io), served at the domain root.
  url: 'https://sungmin-kwon.github.io/',
  base: '/',
  // Picks the interface text and date formats in src/lib/i18n.ts.
  lang: 'en',
  // Line on the 404 page, which is shared by every section.
  notFound: 'This page doesn’t exist, or it has moved.',
  // Notes per page on the index and the tag pages; older notes go on page/2/, page/3/ and so on.
  pageSize: 10,
  // Heading of the list of the other notebooks (header menu and footer). The words in braces
  // link to `familyHome`, the page that lists every notebook; here, this site's home page.
  familyLabel: 'part of a family of {notebooks}',
  familyHome: 'https://sungmin-kwon.github.io/',
  // Old paths (without the base) that send readers elsewhere: { '/old/path': 'https://…/new/' }.
  // The genes and stats notes moved from the distiller to working notes on 2026-11-11.
  redirects: Object.fromEntries([
    ...[
      'genome-wide-association-studies',
      'mendelian-randomization',
      'polygenic-risk-scores',
      'ehrs-fhir-omop-cdw',
      'medical-codes',
      'discrete-and-continuous-distributions',
    ].map((id) => [`/3-way-distillation/notes/${id}`, notePath(id)]),
    ['/3-way-distillation/tags/genes', '/working-notes/tags/genes/'],
    ['/3-way-distillation/tags/stats', '/working-notes/tags/stats/'],
    // Notes below the bar (WRITING.md) moved to purgatorial thoughts on 2026-11-13.
    ...[
      ['3-way-distillation', 'attention-from-scratch'],
      ['working-notes', 'mendelian-randomization'],
      ['working-notes', 'ehrs-fhir-omop-cdw'],
      ['working-notes', 'discrete-and-continuous-distributions'],
    ].map(([from, id]) => [`/${from}/notes/${id}`, `/purgatorial-thoughts/notes/${id}/`]),
  ]),
  // Colors of the home page and the 404 page, over the shared ones in src/styles/site.css
  // (any of --paper, --ink, --ink-2, --muted, --rule, --code-bg, --accent). Here: plain grey
  // paper and ink, so the home page belongs to neither notebook.
  palette: {
    light: {
      paper: '#f4f4f2',
      ink: '#1a1a1a',
      'ink-2': '#404040',
      muted: '#595959',
      rule: '#d4d4d0',
      'code-bg': '#e8e8e5',
      accent: '#1a1a1a',
    },
    dark: {
      paper: '#151515',
      ink: '#e6e6e3',
      'ink-2': '#c4c4c0',
      muted: '#9d9d98',
      rule: '#333331',
      'code-bg': '#1e1e1d',
      accent: '#f0f0ec',
    },
  },
};

/**
 * The notebooks, in display order. Each one is served under its own `path`
 * (https://sungmin-kwon.github.io/<path>/) with its own tags, colors and labels.
 *
 * - `tags`, in display order. A note may only use the tags of one section (the content schema
 *   and `npm run check` both enforce it); its tags decide which section it is in. `era` is
 *   optional and shown next to the tag. `slug` is optional: the tag's URL, for a name that isn't
 *   in Latin letters.
 * - `distillateLabel`: heading of the box that shows a long note's `distillate` field.
 * - `untagged`: true makes this the section of notes without tags (at most one section).
 * - `allowAffiliation`: false makes `npm run check` reject "my lab", "our university" and the
 *   like in this section's notes.
 * - `palette`: colors over the shared ones, as in SITE.palette. Leave it out for the shared look.
 * - `about`: the About page's paragraphs, as plain text; '{tags}' marks the place for the tag
 *   list. The other notebooks are listed after it. `howToRead`: the About page's last paragraph.
 * - Each section's favicon and link-preview card are public/<path>/favicon.svg and og.png
 *   (`npm run og-card` redraws the cards).
 *
 * Moving a tag to another section changes the URLs of the notes it carries: add the old paths
 * to SITE.redirects in the same change.
 */
export const SECTIONS = [
  {
    path: '3-way-distillation',
    title: 'notes from the 3-way distiller',
    description: 'My notebook on things that interest me, boiled down to the essentials.',
    blurb: 'a notebook on things that interest me: chemical engineering, language models and quantum computing.',
    distillateLabel: 'Distillate',
    allowAffiliation: false,
    about: [
      'I’m Sungmin. This is my notebook, kept in public mostly so that I write things down properly.',
      'The notes fall under three tags: past, present and future.',
      '{tags}',
      'The name comes from the kind of distillation that turns up in all three: separating mixtures in a column, training a small model to imitate a large one, and distilling many noisy entangled pairs into a few good ones. All three are the same move. Take something complex and keep only what matters. That is also what I try to do in each entry here.',
    ],
    aboutDescription: 'Whose notebook this is, what its tags cover, and why it’s called the 3-way distiller.',
    howToRead: 'Entries marked rough are unfinished thinking and may be wrong. Longer entries open with a short distillate, so you can stop there.',
    tags: [
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
    ],
  },
  {
    path: 'working-notes',
    title: 'working notes',
    description:
      'Notes from my graduate study and research in data science: statistics, genetics, health data and methods, written to be looked up later.',
    blurb: 'study and research notes from graduate school in data science, mostly statistics and genetics.',
    distillateLabel: 'In short',
    // These notes may name the school and its courses (WRITING.md, section 1).
    allowAffiliation: true,
    about: [
      'I’m Sungmin. These are my working notes from graduate study and research in data science at Seoul National University: the methods, derivations and worked examples I want to be able to look up again later.',
      'The notes fall under these tags:',
      '{tags}',
    ],
    aboutDescription: 'Whose notes these are, what the tags cover, and the sibling notebooks.',
    howToRead: 'Entries marked rough are unfinished thinking and may be wrong. Longer entries open with a short summary, so you can stop there.',
    // Cooler paper and a fountain-pen blue, against the distiller's warm paper and copper.
    palette: {
      light: {
        paper: '#f2f4f3',
        ink: '#16191c',
        'ink-2': '#3c434a',
        muted: '#535b63',
        rule: '#cdd4d9',
        'code-bg': '#e6eaec',
        accent: '#1458a6',
      },
      dark: {
        paper: '#121518',
        ink: '#e3e8ec',
        'ink-2': '#bcc5cc',
        muted: '#94a0aa',
        rule: '#2f363d',
        'code-bg': '#1a1f24',
        accent: '#6fb0f2',
      },
    },
    tags: [
      {
        name: 'stats',
        blurb: 'probability and statistics, the language the other notes are written in.',
        description:
          'Probability and statistics: distributions, estimation and hypothesis testing, the common machinery underneath the other notes.',
      },
      {
        name: 'genes',
        blurb: 'genetics and genomics, from association studies to polygenic scores and Mendelian randomization.',
        description:
          'Genetics and genomics: genome-wide association studies, polygenic scores and Mendelian randomization.',
      },
      {
        name: 'data',
        blurb: 'health data and how it is stored, coded and shared.',
        description:
          'Health data and its plumbing: EHRs, FHIR, clinical data warehouses, the OMOP common data model, and the medical codes that turn records into phenotypes.',
      },
    ],
  },
  {
    path: 'marginalia',
    title: 'marginalia',
    description: 'Notes written in the margins of what I read: history first, argued from the sources.',
    blurb: 'notes on history and other things outside science, argued from the sources.',
    distillateLabel: 'In short',
    allowAffiliation: false,
    about: [
      'I’m Sungmin. The other notebooks are about mathematics, science and technology. This one is for everything else, starting with history: the questions I keep coming back to when I read, worked out from the sources rather than retold.',
      'The notes fall under these tags:',
      '{tags}',
      'Many of the sources are in classical Chinese or in Korean, and they count as much as the English ones. Quotations are given in the original, then translated.',
    ],
    aboutDescription: 'Whose notebook this is, what it covers, and how it uses its sources.',
    howToRead: 'Entries marked rough are unfinished thinking and may be wrong. Longer entries open with a short summary, so you can stop there.',
    // Rice paper and a pine-green ink, apart from the copper, blue and ember of the others.
    palette: {
      light: {
        paper: '#f4f3ec',
        ink: '#191b17',
        'ink-2': '#3d4239',
        muted: '#555b50',
        rule: '#d3d4c8',
        'code-bg': '#e8e8de',
        accent: '#2c6a4a',
      },
      dark: {
        paper: '#131612',
        ink: '#e4e8e1',
        'ink-2': '#bfc6bb',
        muted: '#97a092',
        rule: '#30362e',
        'code-bg': '#1b201a',
        accent: '#7cc39c',
      },
    },
    tags: [
      {
        name: 'history',
        blurb: 'history, read from the primary sources and the historians who argue over them.',
        description: 'History, argued from the primary sources and from the historians who disagree over them, in Chinese, Korean and English.',
      },
      {
        name: 'language',
        blurb: 'languages and the words people use, read from the sources that record them.',
        description: 'Languages, their history and the words people use, argued from grammars, dictionaries, texts and the linguists who disagree over them.',
      },
    ],
  },
  {
    path: 'purgatorial-thoughts',
    title: 'purgatorial thoughts',
    description: 'Notes that don’t yet clear the bar of the other notebooks, kept here until they are reworked.',
    blurb: 'notes that don’t yet clear the bar: they describe more than they explain.',
    distillateLabel: 'In short',
    // Holds notes from both notebooks, including working notes that name the school.
    allowAffiliation: true,
    // Notes without tags land here (src/lib/sections.mjs). Moving a note in means deleting its
    // tags; moving it back means restoring them.
    untagged: true,
    about: [
      'I’m Sungmin. Every note on this site has to pass a bar: it derives its central result, its example shows something the formula alone doesn’t, it connects its ideas, it says where they break, and it is more than a survey.',
      'The notes here don’t pass it yet. They are mostly accurate, but they describe more than they explain. They wait here, without tags, until they are reworked and go back to their notebook, or are retired.',
    ],
    aboutDescription: 'What this notebook holds, and why its notes are here.',
    howToRead: 'Treat these as drafts. Longer entries open with a short summary, so you can stop there.',
    // Ash-grey paper and an ember accent, apart from the other two notebooks.
    palette: {
      light: {
        paper: '#f3f1ef',
        ink: '#1d1a19',
        'ink-2': '#433d3a',
        muted: '#5e5652',
        rule: '#d6d0cc',
        'code-bg': '#e9e5e2',
        accent: '#a2401c',
      },
      dark: {
        paper: '#171413',
        ink: '#e8e3e0',
        'ink-2': '#c6beb9',
        muted: '#a0958f',
        rule: '#36302d',
        'code-bg': '#201c1a',
        accent: '#f08a5d',
      },
    },
    tags: [],
  },
];

/**
 * Notebooks on other sites, listed after this site's own sections in the header menu, the footer
 * and on About. `url` is the site's root; `lang` is its language when it differs from this site's.
 */
export const FAMILY = [
  {
    title: '사회학 개론',
    url: 'https://sungmin-kwon.github.io/korean-notes/',
    lang: 'ko',
    blurb: '근거이론, 실재론, 음악교육 등을 정리한 노트.',
  },
];
