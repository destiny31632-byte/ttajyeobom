import type { APIContext } from 'astro';
import { CATEGORIES } from '../config/taxonomy';
import { categoryUrl, getPublishedPosts, getTagCounts, lastModified, postUrl, tagUrl } from '../lib/posts';
import { STATIC_PAGES } from '../lib/static-pages';

// 직접 만든 sitemap.xml: 발행 글은 실제 수정일(updatedDate)을 lastmod 로 사용합니다.
// 글이 1개뿐인 태그 페이지처럼 얇은 페이지와 검색/404 페이지는 제외합니다.
export async function GET(context: APIContext) {
  const site = context.site!;
  const posts = (await getPublishedPosts()).filter((p) => !p.data.draft);
  const newest = posts.length ? lastModified(posts[0]) : new Date();
  const abs = (path: string) => new URL(path, site).href;
  const iso = (d: Date) => d.toISOString();

  const entries: { loc: string; lastmod?: string }[] = [];
  entries.push({ loc: abs('/'), lastmod: iso(newest) });
  entries.push({ loc: abs('/posts/'), lastmod: iso(newest) });
  for (const c of CATEGORIES) {
    const list = posts.filter((p) => p.data.category === c.slug);
    if (list.length) entries.push({ loc: abs(categoryUrl(c.slug)), lastmod: iso(lastModified(list[0])) });
  }
  for (const { tag, count } of await getTagCounts()) {
    if (count >= 2) entries.push({ loc: abs(tagUrl(tag)) });
  }
  for (const page of STATIC_PAGES) entries.push({ loc: abs(page.href), lastmod: page.updated });
  for (const p of posts) entries.push({ loc: abs(postUrl(p)), lastmod: iso(lastModified(p)) });

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries
      .map((e) => `  <url><loc>${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`)
      .join('\n') +
    `\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
