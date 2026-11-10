// Lets notes link to each other with `[text](note:some-note-id)`.
// The link is rewritten to the note's real URL, so it works on the
// note's own page and when a short note is shown in full on the index.
// A link to a note that isn't published (hidden or draft) has no page to go to,
// so it is replaced by its text; it comes back when that note is published.
export function remarkNoteLinks({ base = '/', unpublished = new Set() } = {}) {
  const prefix = base.endsWith('/') ? base : `${base}/`;
  const target = (url) => (typeof url === 'string' ? url.match(/^note:([A-Za-z0-9_-]+)(#.*)?$/) : null);
  const walk = (node) => {
    if (!Array.isArray(node.children)) return;
    node.children = node.children.flatMap((child) => {
      const m = (child.type === 'link' || child.type === 'definition') && target(child.url);
      if (m && unpublished.has(m[1])) {
        if (child.type === 'definition') return [];
        walk(child);
        return child.children ?? [];
      }
      if (m) child.url = `${prefix}notes/${m[1]}/${m[2] ?? ''}`;
      walk(child);
      return [child];
    });
  };
  return (tree) => walk(tree);
}
