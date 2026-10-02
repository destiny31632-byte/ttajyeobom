// 빌드 결과물(dist) 검사: 깨진 내부 링크·앵커·자산, canonical, 메타 태그, JSON-LD, sitemap, robots, 중복 제목/설명
import fs from 'node:fs';
import path from 'node:path';
import { parseHTML } from 'linkedom';
import { DIST_DIR } from '../lib/paths.ts';
import { listFiles } from '../lib/fsutil.ts';

export interface DistIssue {
  level: 'fail' | 'warn';
  page: string;
  message: string;
}

export interface DistReport {
  pages: number;
  indexable: number;
  failures: DistIssue[];
  warnings: DistIssue[];
  externalLinks: string[];
  sitemapUrls: number;
  stats: { maxHtmlKb: number; avgHtmlKb: number; scriptsPerPage: number };
}

function pageUrlFromFile(file: string): string {
  const rel = path.relative(DIST_DIR, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel;
}

function resolveToFile(urlPath: string): string | null {
  let p = urlPath.split('#')[0].split('?')[0];
  try {
    p = decodeURIComponent(p);
  } catch {
    /* 그대로 */
  }
  if (!p.startsWith('/')) return null;
  const candidates = p.endsWith('/') ? [p + 'index.html'] : path.extname(p) ? [p] : [p + '/index.html', p + '.html'];
  for (const c of candidates) {
    const f = path.join(DIST_DIR, ...c.split('/').filter(Boolean));
    if (fs.existsSync(f)) return f;
  }
  return null;
}

export function checkDist(siteUrl: string): DistReport {
  if (!fs.existsSync(DIST_DIR)) throw new Error('dist 폴더가 없습니다. 먼저 npm run build 를 실행하세요.');
  const site = new URL(siteUrl);
  const files = listFiles(DIST_DIR, '.html').filter((f) => !f.includes(`${path.sep}pagefind${path.sep}`));
  const failures: DistIssue[] = [];
  const warnings: DistIssue[] = [];
  const fail = (page: string, message: string) => failures.push({ level: 'fail', page, message });
  const warn = (page: string, message: string) => warnings.push({ level: 'warn', page, message });
  const external = new Set<string>();
  const titles = new Map<string, string[]>();
  const descs = new Map<string, string[]>();
  const indexablePages = new Set<string>();
  const noindexPages = new Set<string>();
  const anchorCache = new Map<string, Set<string>>();
  let totalKb = 0;
  let maxKb = 0;
  let scriptCount = 0;

  const idsOf = (file: string): Set<string> => {
    if (!anchorCache.has(file)) {
      const { document } = parseHTML(fs.readFileSync(file, 'utf8'));
      anchorCache.set(file, new Set([...document.querySelectorAll('[id]')].map((e: any) => e.getAttribute('id'))));
    }
    return anchorCache.get(file)!;
  };

  for (const file of files) {
    const url = pageUrlFromFile(file);
    const html = fs.readFileSync(file, 'utf8');
    const kb = Buffer.byteLength(html) / 1024;
    totalKb += kb;
    maxKb = Math.max(maxKb, kb);
    if (kb > 250) warn(url, `HTML 크기 ${kb.toFixed(0)}KB (250KB 초과)`);
    const { document } = parseHTML(html);
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
    const noindex = /noindex/i.test(robots) || url === '/404.html';
    (noindex ? noindexPages : indexablePages).add(url);

    if (document.documentElement.getAttribute('lang') !== 'ko') fail(url, 'html lang="ko" 없음');
    if (!document.querySelector('meta[name="viewport"]')) fail(url, 'viewport 메타 태그 없음 (모바일)');
    const title = document.querySelector('title')?.textContent?.trim() ?? '';
    if (!title) fail(url, 'title 없음');
    const desc = document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '';
    if (!desc) fail(url, 'meta description 없음');
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
    if (!noindex) {
      if (!canonical) fail(url, 'canonical 없음');
      else {
        try {
          const c = new URL(canonical);
          if (c.host !== site.host) fail(url, `canonical 호스트 불일치: ${canonical}`);
          if (decodeURI(c.pathname) !== decodeURI(url)) fail(url, `canonical 경로 불일치: ${c.pathname}`);
        } catch {
          fail(url, `canonical 형식 오류: ${canonical}`);
        }
      }
      if (title) titles.set(title, [...(titles.get(title) ?? []), url]);
      if (desc) descs.set(desc, [...(descs.get(desc) ?? []), url]);
      if (!document.querySelector('meta[property="og:image"]')) warn(url, 'og:image 없음');
    }
    const h1s = document.querySelectorAll('h1').length;
    if (h1s !== 1 && !noindex) warn(url, `H1 ${h1s}개 (1개 권장)`);

    for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        JSON.parse((s as any).textContent ?? '');
      } catch {
        fail(url, 'JSON-LD 파싱 실패');
      }
    }
    scriptCount += document.querySelectorAll('script[src]').length;

    for (const img of document.querySelectorAll('img')) {
      const src = (img as any).getAttribute('src') ?? '';
      if (!(img as any).hasAttribute('alt')) fail(url, `img alt 속성 없음: ${src}`);
      if (!(img as any).getAttribute('width') || !(img as any).getAttribute('height')) warn(url, `img width/height 없음 (레이아웃 흔들림): ${src}`);
    }

    const refs: string[] = [];
    for (const a of document.querySelectorAll('a[href]')) refs.push((a as any).getAttribute('href'));
    for (const el of document.querySelectorAll('img[src], script[src], source[src]')) refs.push((el as any).getAttribute('src'));
    for (const el of document.querySelectorAll('link[href]')) {
      const rel = (el as any).getAttribute('rel') ?? '';
      if (/canonical|alternate|sitemap/.test(rel)) continue;
      refs.push((el as any).getAttribute('href'));
    }
    for (const el of document.querySelectorAll('source[srcset]')) refs.push(((el as any).getAttribute('srcset') ?? '').split(/\s+/)[0]);

    for (const ref of refs) {
      if (!ref) continue;
      if (ref.startsWith('#')) {
        const id = decodeURIComponent(ref.slice(1));
        if (id && !idsOf(file).has(id)) fail(url, `없는 앵커: ${ref}`);
        continue;
      }
      if (/^(mailto:|tel:|data:)/.test(ref)) continue;
      let abs: URL;
      try {
        abs = new URL(ref, new URL(url, site));
      } catch {
        fail(url, `잘못된 링크: ${ref}`);
        continue;
      }
      if (abs.host !== site.host) {
        if (/^https?:$/.test(abs.protocol)) external.add(abs.href.split('#')[0]);
        continue;
      }
      if (abs.pathname.startsWith('/pagefind/')) continue; // 빌드 마지막 단계에서 생성
      const target = resolveToFile(abs.pathname);
      if (!target) {
        fail(url, `깨진 내부 링크: ${ref}`);
        continue;
      }
      if (!path.extname(abs.pathname) && !abs.pathname.endsWith('/')) warn(url, `끝 슬래시 없는 내부 링크(리디렉션 발생): ${ref}`);
      if (abs.hash && target.endsWith('.html')) {
        const id = decodeURIComponent(abs.hash.slice(1));
        if (id && !idsOf(target).has(id)) fail(url, `대상 페이지에 없는 앵커: ${ref}`);
      }
    }
  }

  for (const [t, pages] of titles) if (pages.length > 1) (pages.some((p) => p.startsWith('/posts/') && !p.startsWith('/posts/page/')) ? fail : warn)(pages.join(', '), `제목 중복: ${t}`);
  for (const [d, pages] of descs) if (pages.length > 1) (pages.some((p) => p.startsWith('/posts/') && !p.startsWith('/posts/page/')) ? fail : warn)(pages.join(', '), `설명 중복: ${d.slice(0, 40)}…`);

  // sitemap.xml
  let sitemapUrls = 0;
  const sitemapFile = path.join(DIST_DIR, 'sitemap.xml');
  if (!fs.existsSync(sitemapFile)) fail('/sitemap.xml', 'sitemap.xml 없음');
  else {
    const xml = fs.readFileSync(sitemapFile, 'utf8');
    if (!xml.startsWith('<?xml') || !xml.includes('<urlset')) fail('/sitemap.xml', 'sitemap 형식 오류');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    sitemapUrls = locs.length;
    const inSitemap = new Set<string>();
    for (const loc of locs) {
      let u: URL;
      try {
        u = new URL(loc);
      } catch {
        fail('/sitemap.xml', `잘못된 URL: ${loc}`);
        continue;
      }
      if (u.host !== site.host) fail('/sitemap.xml', `다른 호스트 URL: ${loc}`);
      const p = decodeURI(u.pathname);
      inSitemap.add(p);
      if (!resolveToFile(u.pathname)) fail('/sitemap.xml', `존재하지 않는 페이지: ${loc}`);
      if (noindexPages.has(p)) fail('/sitemap.xml', `noindex 페이지 포함: ${loc}`);
    }
    for (const p of indexablePages) {
      if (/^\/posts\/(?!page\/)[^/]+\/$/.test(p) && !inSitemap.has(decodeURI(p))) fail('/sitemap.xml', `발행 글 누락: ${p}`);
    }
  }

  // robots.txt
  const robotsFile = path.join(DIST_DIR, 'robots.txt');
  if (!fs.existsSync(robotsFile)) fail('/robots.txt', 'robots.txt 없음');
  else {
    const robots = fs.readFileSync(robotsFile, 'utf8');
    if (!robots.includes(`Sitemap: ${new URL('/sitemap.xml', site).href}`)) fail('/robots.txt', 'Sitemap 줄이 없거나 주소가 다름');
    if (/^Disallow:\s*\/\s*$/m.test(robots)) fail('/robots.txt', '사이트 전체 크롤링 차단(Disallow: /)');
  }

  return {
    pages: files.length,
    indexable: indexablePages.size,
    failures,
    warnings,
    externalLinks: [...external].sort(),
    sitemapUrls,
    stats: { maxHtmlKb: +maxKb.toFixed(1), avgHtmlKb: +(totalKb / Math.max(1, files.length)).toFixed(1), scriptsPerPage: +(scriptCount / Math.max(1, files.length)).toFixed(2) },
  };
}

/** 외부 링크 접속 확인 (동시 6개, 404/410/DNS 실패만 실패로 처리) */
export async function checkExternal(urls: string[], concurrency = 6): Promise<{ url: string; status: number }[]> {
  const results: { url: string; status: number }[] = [];
  const queue = [...urls];
  const headers = { 'User-Agent': 'Mozilla/5.0 (compatible; ttajyeobom-linkcheck/1.0)', Accept: 'text/html,*/*' };
  async function worker() {
    for (;;) {
      const url = queue.shift();
      if (!url) return;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      let status = 0;
      try {
        let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal, headers });
        if (res.status >= 400) res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal, headers });
        status = res.status;
      } catch {
        status = 0;
      } finally {
        clearTimeout(timer);
      }
      results.push({ url, status });
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results.sort((a, b) => a.url.localeCompare(b.url));
}
