import { getNotes, isShort, isoDate, label, noteHref, plainText, readingMinutes } from '../lib/notes';
import { UI, minutes, monthHeading, shortDate } from '../lib/i18n';

// Every published note, newest first, loaded by the find box on the index and tag pages. The
// lists are split into pages, so the find box searches this rather than the rows on the page,
// and draws its matches from it: `text` is what it searches, the rest is what a row shows.
export async function GET() {
  const notes = await getNotes();
  const index = notes.map((n) => {
    const meta = [...n.data.tags];
    if (isShort(n)) meta.unshift(UI.shortNote);
    return {
      id: n.id,
      href: noteHref(n),
      title: label(n),
      summary: n.data.summary ?? '',
      date: isoDate(n.data.date),
      day: shortDate(n.data.date),
      month: monthHeading(n.data.date),
      tags: n.data.tags,
      rough: Boolean(n.data.rough),
      meta: meta.join(' · '),
      minutes: isShort(n) ? '' : minutes(readingMinutes(n)),
      text: [n.data.title, n.data.summary, n.data.distillate, n.data.tags.join(' '), plainText(n.body)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    };
  });
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
