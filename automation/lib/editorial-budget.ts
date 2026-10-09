import type { PostFile } from './content.ts';
import { kstDate } from './time.ts';

export const DAILY_POST_LIMIT = 2;

export function editorialBudget(posts: PostFile[], now = new Date()) {
  const date = kstDate(now);
  const published = posts.filter((post) => {
    if (post.data.draft === true) return false;
    const timestamp = new Date(String(post.data.firstPublishedAt ?? post.data.pubDate));
    if (!Number.isFinite(timestamp.getTime())) throw new Error(`발행 날짜 확인 불가: ${post.slug}`);
    return kstDate(timestamp) === date;
  }).map((post) => post.slug);
  return { date, limit: DAILY_POST_LIMIT, published, remaining: Math.max(0, DAILY_POST_LIMIT - published.length) };
}

export function requireEditorialSlot(posts: PostFile[], now = new Date()) {
  const budget = editorialBudget(posts, now);
  if (budget.remaining === 0) throw new Error(`한국 시간 ${budget.date}의 신규 발행 한도 ${budget.limit}개에 도달했습니다.`);
  return budget;
}
