import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { postSchema } from './lib/shared/post-schema.ts';

// 스키마 정의는 src/lib/shared/post-schema.ts 한 곳에서 관리합니다 (자동 품질 검수와 공유).
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: postSchema,
});

export const collections = { posts };
