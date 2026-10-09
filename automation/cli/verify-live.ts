import { loadPosts } from '../lib/content.ts';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DIST_DIR } from '../lib/paths.ts';
import { waitForBuild } from '../lib/live-build.ts';

const raw = process.env.SITE_URL;
if (!raw) throw new Error('SITE_URL을 실제 운영 주소로 설정해야 합니다.');
const site = new URL(raw);
if (site.protocol !== 'https:') throw new Error('운영 사이트는 HTTPS를 사용해야 합니다.');
// 예약 점검은 현재 배포 내부의 일치 여부를 확인합니다. 배포 직후에는 로컬 빌드와 대조합니다.
const monitor = process.argv.includes('--deployed');
const local = monitor ? undefined : JSON.parse(fs.readFileSync(path.join(DIST_DIR, 'build.json'), 'utf8'));
const actual = await waitForBuild(async () => {
  const url = new URL('/build.json', site);
  if (local) url.searchParams.set('build', local.buildId);
  const response = await fetch(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('라이브 빌드 정보가 없습니다.');
  const manifest = await response.json() as { buildId: string; pages: Record<string, string> };
  if (!/^[a-f0-9]{64}$/.test(manifest.buildId) || !manifest.pages) throw new Error('라이브 빌드 정보 형식이 잘못됐습니다.');
  return manifest;
}, local?.buildId, process.argv.includes('--wait'));
const expected = local ?? actual;
const posts = loadPosts({ includeDrafts: false });
for (const route of ['/', '/contact/', '/privacy/', '/search/', '/sitemap.xml', '/rss.xml', ...posts.map((p) => `/posts/${p.slug}/`)]) {
  const url = new URL(route, site);
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`라이브 확인 실패 ${res.status}: ${route}`);
  if (res.headers.get('x-content-type-options') !== 'nosniff') throw new Error(`보안 헤더 누락: ${route}`);
  const body = await res.text();
  const digest = crypto.createHash('sha256').update(body).digest('hex');
  if (digest !== expected.pages[route]) throw new Error(`배포 내용 불일치: ${route}`);
  if (route === '/' && !body.includes('따져봄')) throw new Error('사이트 이름 불일치');
  if (route.startsWith('/posts/') && (!body.includes('data-pagefind-body') || !body.includes('canonical'))) throw new Error(`글 페이지 형식 불일치: ${route}`);
  if ((route === '/sitemap.xml' || route === '/rss.xml') && !body.includes(site.host)) throw new Error(`운영 주소 불일치: ${route}`);
  console.log(`확인: ${route}`);
}
const missing = await fetch(new URL('/__healthcheck_missing_page__/', site), { signal: AbortSignal.timeout(15000) });
if (missing.status !== 404) throw new Error('없는 페이지의 HTTP 404 응답이 잘못됐습니다.');
console.log(`라이브 확인 완료: ${posts.length}개 글`);
