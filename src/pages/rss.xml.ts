import type { APIContext } from 'astro';
import { getNotes, label, noteHref, href } from '../lib/notes';
import { SITE_DESCRIPTION, SITE_LANG, SITE_TITLE } from '../lib/site';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET({ site }: APIContext) {
  const notes = await getNotes();
  const origin = site ?? new URL('http://localhost:4321/');
  const abs = (path: string) => new URL(path, origin).toString();

  const items = notes
    .map((n) => {
      const url = abs(noteHref(n));
      const description = n.data.summary ?? n.data.distillate ?? label(n, 280);
      return [
        '    <item>',
        `      <title>${esc(label(n))}</title>`,
        `      <link>${esc(url)}</link>`,
        `      <guid isPermaLink="true">${esc(url)}</guid>`,
        `      <pubDate>${n.data.date.toUTCString()}</pubDate>`,
        `      <description>${esc(description)}</description>`,
        ...n.data.tags.map((t) => `      <category>${esc(t)}</category>`),
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_TITLE)}</title>
    <link>${esc(abs(href()))}</link>
    <description>${esc(SITE_DESCRIPTION)}</description>
    <language>${esc(SITE_LANG)}</language>
    <atom:link href="${esc(abs(href('rss.xml')))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
