// Lets notes link to each other with `[text](note:some-note-id)`.
// The link is rewritten to the note's real URL, so it works on the
// note's own page and when a short note is shown in full on the index.
export function remarkNoteLinks({ base = '/' } = {}) {
  const prefix = base.endsWith('/') ? base : `${base}/`;
  const walk = (node) => {
    if ((node.type === 'link' || node.type === 'definition') && typeof node.url === 'string') {
      const m = node.url.match(/^note:([A-Za-z0-9_-]+)(#.*)?$/);
      if (m) node.url = `${prefix}notes/${m[1]}/${m[2] ?? ''}`;
    }
    if (Array.isArray(node.children)) node.children.forEach(walk);
  };
  return (tree) => walk(tree);
}
