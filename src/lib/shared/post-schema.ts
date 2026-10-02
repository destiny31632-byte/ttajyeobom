// 글 frontmatter 스키마 — Astro 콘텐츠 컬렉션과 자동화 품질 검수가 같은 정의를 사용합니다.
import { z } from 'astro/zod';
import { CATEGORY_SLUGS, IMAGE_KINDS, SOURCE_TYPES, YMYL_LEVELS } from '../../config/taxonomy.ts';

// 출처: 중요 수치·변경 가능한 정보의 근거. 조회일(accessed)을 반드시 남깁니다.
export const sourceSchema = z.object({
  title: z.string().min(2),
  url: z.url(),
  publisher: z.string().min(1),
  type: z.enum(SOURCE_TYPES),
  accessed: z.coerce.date(),
  note: z.string().optional(),
});

// 이미지 메타데이터: 라이선스가 불명확하면 사용하지 않습니다.
export const imageMetaSchema = z.object({
  src: z.string().startsWith('/images/'),
  alt: z.string().min(5),
  caption: z.string().optional(),
  kind: z.enum(IMAGE_KINDS),
  author: z.string().optional(),
  license: z.string().min(2),
  licenseUrl: z.url().optional(),
  sourceUrl: z.url().optional(),
  sourceName: z.string().optional(),
  dataSource: z.string().optional(),
});

export const postSchema = z.object({
  title: z.string().min(10).max(80),
  description: z.string().min(40).max(200),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  category: z.enum(CATEGORY_SLUGS),
  tags: z.array(z.string().min(1)).min(2).max(10),
  cluster: z.string().min(2),
  targetQuery: z.string().min(2),
  secondaryQueries: z.array(z.string()).default([]),
  author: z.string().default('editor'),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  ymyl: z.enum(YMYL_LEVELS).default('low'),
  volatility: z.enum(['low', 'medium', 'high']).default('medium'),
  reviewBy: z.coerce.date().optional(),
  /** 본문 상단 '핵심 요약' 상자 */
  summary: z.array(z.string().min(5)).max(6).optional(),
  /** SNS 공유 이미지 (/images/... png·jpg). 없으면 사이트 기본 이미지 */
  ogImage: z.string().startsWith('/images/').optional(),
  sources: z.array(sourceSchema).min(1),
  images: z.array(imageMetaSchema).default([]),
  generation: z
    .object({
      method: z.enum(['kiro-assisted', 'pipeline', 'manual']),
      model: z.string().optional(),
      runId: z.string().optional(),
    })
    .default({ method: 'manual' }),
});

export type PostData = z.infer<typeof postSchema>;
