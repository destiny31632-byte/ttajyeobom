// 글(Markdown + YAML frontmatter) 읽기/쓰기
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { POSTS_DIR } from './paths.ts';
import { listFiles } from './fsutil.ts';

export interface SourceMeta {
  title: string;
  url: string;
  publisher: string;
  type: 'government' | 'official' | 'primary' | 'press' | 'expert' | 'reference';
  accessed: string;
  note?: string;
}

export interface ImageMeta {
  src: string;
  alt: string;
  caption?: string;
  kind: 'own-chart' | 'own-diagram' | 'commons' | 'public-domain' | 'cc' | 'official';
  author?: string;
  license: string;
  licenseUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  dataSource?: string;
}

export interface Frontmatter {
  title: string;
  description: string;
  pubDate: string;
  updatedDate?: string;
  category: string;
  tags: string[];
  cluster: string;
  targetQuery: string;
  secondaryQueries?: string[];
  author?: string;
  draft?: boolean;
  featured?: boolean;
  ymyl?: 'none' | 'low' | 'medium' | 'high';
  volatility?: 'low' | 'medium' | 'high';
  reviewBy?: string;
  summary?: string[];
  ogImage?: string;
  sources: SourceMeta[];
  images?: ImageMeta[];
  generation?: { method: 'kiro-assisted' | 'pipeline' | 'manual'; model?: string; runId?: string };
  [key: string]: unknown;
}

export interface PostFile {
  slug: string;
  file: string;
  data: Frontmatter;
  body: string;
}

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/** YAML 이 날짜를 Date 로 바꾸는 경우를 대비해 문자열로 정규화 */
function normalizeDates(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalizeDates);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalizeDates(v)]));
  }
  return value;
}

export function parsePost(raw: string, file: string): PostFile {
  const m = raw.match(FM_RE);
  if (!m) throw new Error(`frontmatter 가 없습니다: ${file}`);
  const parsed = YAML.parse(m[1]);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`frontmatter 는 항목별 객체여야 합니다: ${file}`);
  }
  const data = normalizeDates(parsed) as Frontmatter;
  const slug = path.basename(file).replace(/\.md$/, '');
  return { slug, file, data, body: m[2].replace(/^\s+/, '') };
}

export function serializePost(data: Frontmatter, body: string): string {
  const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
  const yaml = YAML.stringify(clean, { lineWidth: 0 }).trimEnd();
  return `---\n${yaml}\n---\n\n${body.trim()}\n`;
}

export function readPost(file: string): PostFile {
  return parsePost(fs.readFileSync(file, 'utf8'), file);
}

export function writePost(post: PostFile): void {
  fs.writeFileSync(post.file, serializePost(post.data, post.body), 'utf8');
}

export function loadPosts(opts: { includeDrafts?: boolean; dir?: string } = {}): PostFile[] {
  const { includeDrafts = true, dir = POSTS_DIR } = opts;
  const posts: PostFile[] = [];
  for (const file of listFiles(dir, '.md')) {
    try {
      const p = readPost(file);
      if (!includeDrafts && p.data.draft) continue;
      posts.push(p);
    } catch (e) {
      // 일부 글이 빠진 채 품질 검사가 성공하는 것을 막습니다.
      throw new Error(`글을 읽지 못했습니다 (${file}): ${(e as Error).message}`);
    }
  }
  return posts.sort((a, b) => String(b.data.pubDate).localeCompare(String(a.data.pubDate)));
}

/** 본문의 Markdown 제목 목록 */
export function extractHeadings(body: string): { depth: number; text: string }[] {
  const out: { depth: number; text: string }[] = [];
  let inCode = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^```/.test(line.trim())) inCode = !inCode;
    if (inCode) continue;
    const m = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (m) out.push({ depth: m[1].length, text: m[2].trim() });
  }
  return out;
}

export function extractLinks(body: string): { text: string; href: string }[] {
  const out: { text: string; href: string }[] = [];
  const re = /(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) out.push({ text: m[1], href: m[2] });
  return out;
}

export function extractImages(body: string): { alt: string; src: string; title?: string }[] {
  const out: { alt: string; src: string; title?: string }[] = [];
  const re = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) out.push({ alt: m[1], src: m[2], title: m[3] });
  return out;
}

/** Markdown 표 개수 (헤더 구분선 기준) */
export function countTables(body: string): number {
  return (body.match(/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/gm) ?? []).length;
}
