import { getNotes, plainText } from '../lib/notes';

// id -> lowercased searchable text, loaded by the index's find box.
export async function GET() {
  const notes = await getNotes();
  const index: Record<string, string> = {};
  for (const n of notes) {
    index[n.id] = [n.data.title, n.data.summary, n.data.distillate, n.data.tags.join(' '), plainText(n.body)]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
