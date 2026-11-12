// A section's feed at <section>/rss.xml, and, with a home page, a feed of every section's notes
// at the site root.
import type { APIContext } from 'astro';
import { getNotes, label, noteHref, href, sectionHref, sectionPaths } from '../../lib/notes';
import { HAS_HOME, SITE_DESCRIPTION, SITE_LANG, SITE_TITLE, type Section } from '../../lib/site';

export function getStaticPaths() {
  const home = HAS_HOME ? [{ params: { section: undefined }, props: { section: undefined } }] : [];
  return [...home, ...sectionPaths()];
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET({ site, props }: APIContext) {
  const section = (props as { section?: Section }).section;
  const notes = await getNotes(section);
  const own = (path = '') => (section ? sectionHref(section, path) : href(path));
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
    <title>${esc(section?.title ?? SITE_TITLE)}</title>
    <link>${esc(abs(own()))}</link>
    <description>${esc(section?.description ?? SITE_DESCRIPTION)}</description>
    <language>${esc(SITE_LANG)}</language>
    <atom:link href="${esc(abs(own('rss.xml')))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
