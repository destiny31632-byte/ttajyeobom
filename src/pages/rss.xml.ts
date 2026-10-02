import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config/site';
import { getCategory } from '../config/taxonomy';
import { getPublishedPosts, postUrl } from '../lib/posts';

// 전문(全文) 대신 요약만 내보내 콘텐츠 무단 복제를 줄입니다.
export async function GET(context: APIContext) {
  const posts = (await getPublishedPosts()).filter((p) => !p.data.draft).slice(0, 50);
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    trailingSlash: true,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: postUrl(p),
      categories: [getCategory(p.data.category)?.name ?? p.data.category, ...p.data.tags],
      author: undefined,
    })),
    customData: `<language>ko-KR</language>`,
  });
}
