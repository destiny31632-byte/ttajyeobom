import { getCollection, type CollectionEntry } from 'astro:content';
import { TfIdfIndex } from './shared/similarity';
import { readingMinutes } from './shared/korean';
import popularData from '../data/popular.json';
import clustersData from '../data/clusters.json';

export type Post = CollectionEntry<'posts'>;

let cache: Post[] | null = null;

/** 발행된 글 (최신순). 개발 서버에서는 초안도 함께 보여 줍니다. */
export async function getPublishedPosts(): Promise<Post[]> {
  if (cache && import.meta.env.PROD) return cache;
  const all = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  cache = all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return cache;
}

export const postUrl = (post: Post | string) => `/posts/${typeof post === 'string' ? post : post.id}/`;

export function tagSlug(tag: string): string {
  return tag.trim().replace(/\s+/g, '-');
}

export const tagUrl = (tag: string) => `/tags/${encodeURIComponent(tagSlug(tag))}/`;

export const categoryUrl = (slug: string) => `/category/${slug}/`;

export function lastModified(post: Post): Date {
  return post.data.updatedDate && post.data.updatedDate > post.data.pubDate ? post.data.updatedDate : post.data.pubDate;
}

export function readingTime(post: Post): number {
  return readingMinutes(post.body ?? '');
}

export async function getTagCounts(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();
  for (const p of posts) for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'ko'));
}

/** 이전 글(더 오래된 글) / 다음 글(더 최신 글) */
export async function getPrevNext(post: Post): Promise<{ prev?: Post; next?: Post }> {
  const posts = await getPublishedPosts();
  const i = posts.findIndex((p) => p.id === post.id);
  if (i === -1) return {};
  return { next: posts[i - 1], prev: posts[i + 1] };
}

let index: TfIdfIndex | null = null;
let indexKey = '';

function docText(p: Post): string {
  const d = p.data;
  return [d.title, d.title, d.description, d.targetQuery, ...d.secondaryQueries, ...d.tags, d.cluster].join(' ');
}

function getIndex(posts: Post[]): TfIdfIndex {
  const key = posts.map((p) => p.id).join('|');
  if (index && key === indexKey) return index;
  index = new TfIdfIndex(3);
  for (const p of posts) index.add(p.id, docText(p));
  indexKey = key;
  return index;
}

/**
 * 관련 글: 같은 주제 묶음(cluster) > 같은 카테고리 > 겹치는 태그 > 텍스트 유사도 순으로 가중치.
 * 키워드 하나가 같다는 이유만으로 연결되지 않도록 최소 점수를 둡니다.
 */
export async function getRelatedPosts(post: Post, limit = 4): Promise<Post[]> {
  const posts = await getPublishedPosts();
  const idx = getIndex(posts);
  const tags = new Set(post.data.tags);
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => {
      const sharedTags = p.data.tags.filter((t) => tags.has(t)).length;
      const score =
        (p.data.cluster === post.data.cluster ? 3 : 0) +
        (p.data.category === post.data.category ? 1.2 : 0) +
        sharedTags * 0.8 +
        idx.similarity(post.id, p.id) * 5;
      return { p, score };
    })
    .filter((x) => x.score >= 1.6)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

/** 인기 글: Search Console 클릭 데이터가 있으면 그 순서, 없으면 추천(featured) 글 */
export async function getPopularPosts(limit = 5): Promise<{ posts: Post[]; basis: 'search' | 'featured' }> {
  const posts = await getPublishedPosts();
  const bySlug = new Map(posts.map((p) => [p.id, p]));
  const ranked = (popularData.slugs ?? []).map((s: string) => bySlug.get(s)).filter(Boolean) as Post[];
  if (ranked.length >= 3) return { posts: ranked.slice(0, limit), basis: 'search' };
  const featured = posts.filter((p) => p.data.featured);
  const rest = posts.filter((p) => !p.data.featured);
  return { posts: [...featured, ...rest].slice(0, limit), basis: 'featured' };
}

export interface Cluster {
  id: string;
  name: string;
  category: string;
  description: string;
}

export function getClusters(): Cluster[] {
  return clustersData as Cluster[];
}

export function clusterName(id: string): string {
  return getClusters().find((c) => c.id === id)?.name ?? id;
}
