// Gives each section heading (h2, h3) of a note a small link to itself, so a section can be
// linked to directly, e.g. note:reading-a-mccabe-thiele-diagram#the-q-line.
//
// It also hands the note page a plain-text list of the h2 sections for the contents list
// (`sections` in the note's remarkPluginFrontmatter). Astro's own heading list can't be used for
// that, because it runs KaTeX's output together into text like "1/dk1/\sqrt{d_k}".
//
// Astro adds the heading ids only after the user's rehype plugins have run, so this plugin runs
// Astro's own id step first; Astro then keeps those ids. The link has no text of its own (the
// "#" is drawn by CSS). Visually hidden headings (the "Footnotes" heading GFM adds) are skipped.
import { rehypeHeadingIds } from '@astrojs/markdown-remark';

// Plain text of a heading. Math becomes the text of its MathML, with √ for a square root;
// KaTeX's TeX annotation and its visual HTML copy are skipped.
const plainText = (node) => {
  if (node.type === 'text') return node.value;
  if (node.type !== 'element') return '';
  const cls = node.properties?.className ?? [];
  if (cls.includes('heading-link') || cls.includes('katex-html') || node.tagName === 'annotation') return '';
  const inner = (node.children ?? []).map(plainText).join('');
  return node.tagName === 'msqrt' ? `√${inner}` : inner;
};

const isSection = (node, tags) =>
  node.type === 'element' &&
  tags.includes(node.tagName) &&
  !(node.properties?.className ?? []).includes('sr-only');

export function rehypeSectionLinks({ label = 'Link to this section' } = {}) {
  const addIds = rehypeHeadingIds();
  return (tree, file) => {
    addIds(tree, file);
    const walk = (node) => {
      if (isSection(node, ['h2', 'h3'])) {
        const id = node.properties?.id;
        if (typeof id === 'string' && id) {
          node.children.push({
            type: 'element',
            tagName: 'a',
            properties: { className: ['heading-link'], href: `#${id}`, ariaLabel: label },
            children: [],
          });
        }
        return;
      }
      if (Array.isArray(node.children)) node.children.forEach(walk);
    };
    walk(tree);
    const sections = [];
    const collect = (node) => {
      if (isSection(node, ['h2'])) {
        sections.push({ slug: node.properties.id, text: plainText(node).replace(/\s+/g, ' ').trim() });
        return;
      }
      if (Array.isArray(node.children)) node.children.forEach(collect);
    };
    collect(tree);
    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.sections = sections;
  };
}
