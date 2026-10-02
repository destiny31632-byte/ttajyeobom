// @ts-check
import path from 'node:path';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { loadEnv } from 'vite';
import { rehypeArticle } from './src/plugins/rehype-article.mjs';
import { readAdConfig } from './src/lib/ads-markup.mjs';
import { resolveSiteUrl } from './src/config/site-url.mjs';

// .env + 실제 환경 변수(Vercel/GitHub Actions)를 함께 읽음
const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env };
const site = resolveSiteUrl(env);
const ads = readAdConfig(env);

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  // Astro 7 기본값('jsx')은 인라인 요소 사이 공백을 지우므로 HTML 규칙을 유지
  compressHTML: true,
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      rehypePlugins: [
        [
          rehypeArticle,
          {
            publicDir: path.resolve('public'),
            siteHost: new URL(site).host,
            ads,
          },
        ],
      ],
    }),
  },
});
