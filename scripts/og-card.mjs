// Draws public/og.png, the 1200×630 card that link previews (KakaoTalk, Slack, Messages) show
// for every page of the site, from its title, description, favicon and light palette in
// site.config.mjs. Run it again after changing any of those:
//
//   npm run og-card
//
// It needs Playwright with Chromium, which isn't a dependency of the site:
//   npm i --no-save playwright && npx playwright install chromium
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const dir = process.cwd();
const { SITE } = await import(new URL('../site.config.mjs', import.meta.url).href);
const svg = fs.readFileSync(path.join(dir, 'public/favicon.svg'), 'utf8');
const p = SITE.palette?.light ?? {};
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
const host = new URL(SITE.url).host + new URL(SITE.url).pathname.replace(/\/$/, '');
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
<h1>${esc(SITE.title)}</h1>
<p>${esc(SITE.description)}</p>
<div class="url">${esc(host)}</div>
</body></html>`;

const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1200, height: 630 } });
await pg.setContent(html, { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
await pg.screenshot({ path: path.join(dir, 'public/og.png') });
await b.close();
console.log('og-card: wrote public/og.png');
