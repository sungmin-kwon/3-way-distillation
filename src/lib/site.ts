export const SITE_TITLE = 'notes from the 3-way distiller';
export const SITE_DESCRIPTION =
  'My notebook on things that interest me, boiled down to the essentials.';

/**
 * The tags, in display order (eras: past, present, future). A note may only use these
 * (the content schema enforces it). Add a tag here before using it in a note.
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
    name: 'genes',
    era: 'present',
    blurb: 'genetics and genomics, what I work with now.',
    description: 'Genetics, genomics and the clinical data around them: GWAS, polygenic scores, Mendelian randomization, EHR/CDW infrastructure.',
  },
  {
    name: 'qi/qc',
    era: 'future',
    blurb: 'quantum information and computing, something I’d like to learn properly someday.',
    description: 'Quantum information and computing: qubits, entanglement and what they make possible. Learning in progress.',
  },
] as const;

export type TagName = (typeof TAGS)[number]['name'];
export const TAG_NAMES = TAGS.map((t) => t.name) as [TagName, ...TagName[]];
