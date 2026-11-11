// Interface text and date formats, by site language (SITE.lang in site.config.mjs).
// English and Korean are built in. A site can override single strings with SITE.ui.
// The words a note's author writes (titles, tags, About) are not here; only the chrome.
import { SITE } from '../../site.config.mjs';

export interface Ui {
  skip: string;
  navLabel: string;
  about: string;
  rss: string;
  /** Text of the theme button, which names the theme it switches to. */
  themeName: { light: string; dark: string };
  /** aria-label of the theme button. */
  themeSwitch: string; // '{theme}' is replaced
  filterLabel: string;
  all: string;
  find: string;
  findPlaceholder: string;
  findFailed: string;
  empty: string;
  shortNote: string;
  rough: string;
  permalink: string;
  subscribe: string;
  lastWritten: string;
  updated: string;
  back: string;
  toIndex: string;
  linkedFrom: string;
  neighbours: string;
  /** Heading of the contents list at the top of a long note. */
  contents: string;
  /** aria-label of the link beside each section heading. */
  sectionLink: string;
  notFoundTitle: string;
  notFoundHeading: string;
  backToIndex: string;
  roughTagDescription: string;
  tagDescription: string; // '{tag}' is replaced
  /** aria-label of the page links under the index and tag lists. */
  pagesLabel: string;
  /** Link to the page of more recent notes. */
  newer: string;
  /** Link to the page of earlier notes. */
  older: string;
  /** Header menu that lists the family of sites. */
  family: string;
  /** Words per minute for the reading time. */
  wordsPerMinute: number;
}

const en: Ui = {
  skip: 'Skip to content',
  navLabel: 'Site',
  about: 'about',
  rss: 'rss',
  themeName: { light: 'light', dark: 'dark' },
  themeSwitch: 'Switch to {theme} mode',
  filterLabel: 'Filter by tag',
  all: 'all',
  find: 'find',
  findPlaceholder: 'title or text',
  findFailed: 'Search failed to load.',
  empty: 'Nothing here yet.',
  shortNote: 'note',
  rough: 'rough',
  permalink: 'Permalink',
  subscribe: 'subscribe by rss',
  lastWritten: 'last written',
  updated: 'updated',
  back: '← index',
  toIndex: 'index →',
  linkedFrom: 'Linked from',
  neighbours: 'Neighbouring notes',
  contents: 'Contents',
  sectionLink: 'Link to this section',
  notFoundTitle: 'Not found',
  notFoundHeading: 'Not here',
  backToIndex: 'Back to the index.',
  roughTagDescription: 'Unfinished thinking; may be wrong.',
  tagDescription: 'Notes tagged {tag}.',
  pagesLabel: 'Pages',
  newer: '← newer',
  older: 'older →',
  family: 'notebooks',
  wordsPerMinute: 220,
};

const ko: Ui = {
  skip: '본문으로 건너뛰기',
  navLabel: '사이트',
  about: '소개',
  rss: 'RSS',
  themeName: { light: '밝게', dark: '어둡게' },
  themeSwitch: '{theme} 보기로 바꾸기',
  filterLabel: '태그로 거르기',
  all: '전체',
  find: '찾기',
  findPlaceholder: '제목이나 본문',
  findFailed: '검색 자료를 불러오지 못했습니다.',
  empty: '아직 글이 없습니다.',
  shortNote: '메모',
  rough: '미완',
  permalink: '고유 주소',
  subscribe: 'RSS로 구독',
  lastWritten: '마지막 글',
  updated: '고침',
  back: '← 목록',
  toIndex: '목록 →',
  linkedFrom: '이 글을 가리키는 글',
  neighbours: '앞뒤 글',
  contents: '차례',
  sectionLink: '이 절로 가는 링크',
  notFoundTitle: '찾을 수 없음',
  notFoundHeading: '없는 페이지',
  backToIndex: '목록으로 돌아가기.',
  roughTagDescription: '덜 다듬은 생각입니다. 틀린 곳이 있을 수 있습니다.',
  tagDescription: '{tag} 태그가 붙은 글.',
  pagesLabel: '쪽 넘기기',
  newer: '← 최근 글',
  older: '지난 글 →',
  family: '노트 모음',
  // Korean is counted in 어절 (space-separated words), which read more slowly than English words.
  wordsPerMinute: 180,
};

const BUILT_IN: Record<string, Ui> = { en, ko };
const lang: string = SITE.lang;

export const UI: Ui = { ...(BUILT_IN[lang] ?? en), ...(SITE.ui ?? {}) };

/** 'Switch to dark mode' and the like, for the theme button. */
export const themeSwitch = (theme: 'light' | 'dark') =>
  UI.themeSwitch.replace('{theme}', UI.themeName[theme]);

/** '3 entries', '3편'. */
export function entries(n: number): string {
  if (lang === 'ko') return `글 ${n}편`;
  return `${n} ${n === 1 ? 'entry' : 'entries'}`;
}

/** Status line of the find box: '3 entries match', '3편 찾음'. */
export function matches(n: number): string {
  if (lang === 'ko') return `${n}편 찾음`;
  return `${n} ${n === 1 ? 'entry matches' : 'entries match'}`;
}

/** Where a page sits in a list: 'page 2 of 5', '5쪽 중 2쪽'. */
export function pagePosition(page: number, total: number): string {
  if (lang === 'ko') return `${total}쪽 중 ${page}쪽`;
  return `page ${page} of ${total}`;
}

/** Page part of the browser title: 'page 2', '2쪽'. */
export function pageTitle(page: number): string {
  return lang === 'ko' ? `${page}쪽` : `page ${page}`;
}

/** Reading time: '4 min', '4분'. */
export function minutes(n: number): string {
  return lang === 'ko' ? `${n}분` : `${n} min`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n: number) => String(n).padStart(2, '0');

/** Date in the index's left column: 'Nov 09', '11. 09.' */
export function shortDate(d: Date): string {
  if (lang === 'ko') return `${pad(d.getUTCMonth() + 1)}. ${pad(d.getUTCDate())}.`;
  return `${MONTHS[d.getUTCMonth()]} ${pad(d.getUTCDate())}`;
}

/** Heading over a month of notes: '2026 · NOVEMBER', '2026년 11월'. */
export function monthHeading(d: Date): string {
  if (lang === 'ko') return `${d.getUTCFullYear()}년 ${d.getUTCMonth() + 1}월`;
  const month = d.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' }).toUpperCase();
  return `${d.getUTCFullYear()} · ${month}`;
}
