// Draws the 1200×630 cards that link previews (KakaoTalk, Slack, Messages) show: one for each
// section, public/<path>/og.png, shown for every page in it, and with a home page also
// public/og.png for the home page. Each is drawn from the title, description, favicon and light
// palette in site.config.mjs. Run it again after changing any of those:
//
//   npm run og-card                 every card
//   npm run og-card -- working-notes  one section's card ('/' for the home page's)
//
// It needs Playwright with Chromium, which isn't a dependency of the site:
//   npm i --no-save playwright && npx playwright install chromium
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const dir = process.cwd();
const { SITE } = await import(new URL('../site.config.mjs', import.meta.url).href);
const { SECTIONS, HAS_HOME } = await import(new URL('../src/lib/sections.mjs', import.meta.url).href);

// Each card: the folder under public/ ('' for the root), and the title, description, palette and
// address it shows.
const cards = [
  ...(HAS_HOME ? [{ folder: '', title: SITE.title, description: SITE.description, palette: SITE.palette, url: SITE.url }] : []),
  ...SECTIONS.map((s) => ({ folder: s.path, title: s.title, description: s.description, palette: s.palette, url: s.url })),
];
const only = process.argv[2]?.replace(/^\/+|\/+$/g, '');
const chosen = only === undefined ? cards : cards.filter((c) => c.folder === only);
if (!chosen.length) throw new Error(`og-card: no section at "${process.argv[2]}"`);

const b = await chromium.launch();
for (const card of chosen) {
const svg = fs.readFileSync(path.join(dir, 'public', card.folder, 'favicon.svg'), 'utf8');
const p = card.palette?.light ?? {};
const paper = p.paper ?? '#f6f4ee';
const ink = p.ink ?? '#1b1a17';
const muted = p.muted ?? '#5c574d';
const rule = p.rule ?? '#d5cfc1';
const accent = p.accent ?? '#9a4a1c';
const ko = SITE.lang === 'ko';
const fontUrl = ko
  ? 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans+KR:wght@400;600&display=block'
  : 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;600&display=block';
const sans = ko ? "'IBM Plex Sans KR'" : "'IBM Plex Sans'";
const host = new URL(card.url).host + new URL(card.url).pathname.replace(/\/$/, '');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const html = `<!doctype html><html lang="${SITE.lang}"><head><meta charset="utf-8">
<link rel="stylesheet" href="${fontUrl}">
<style>
  html,body{margin:0}
  body{width:1200px;height:630px;background:${paper};color:${ink};font-family:${sans},sans-serif;
    box-sizing:border-box;padding:84px 96px;display:flex;flex-direction:column;word-break:keep-all}
  .mark{width:88px;height:88px}
  .mark svg{width:100%;height:100%}
  h1{font-family:'IBM Plex Mono',${sans},monospace;font-weight:500;font-size:56px;line-height:1.2;margin:40px 0 0;
    padding-bottom:28px;border-bottom:2px solid ${ink}}
  p{font-size:34px;line-height:1.45;margin:28px 0 0;color:${muted};max-width:960px}
  .url{margin-top:auto;font-family:'IBM Plex Mono',monospace;font-size:24px;color:${accent}}
</style></head><body>
<div class="mark">${svg}</div>
<h1>${esc(card.title)}</h1>
<p>${esc(card.description)}</p>
<div class="url">${esc(host)}</div>
</body></html>`;

const pg = await b.newPage({ viewport: { width: 1200, height: 630 } });
await pg.setContent(html, { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
const out = path.join('public', card.folder, 'og.png');
await pg.screenshot({ path: path.join(dir, out) });
await pg.close();
console.log(`og-card: wrote ${out}`);
}
await b.close();
