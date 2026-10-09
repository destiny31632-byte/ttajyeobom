import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadPosts, writePost } from '../lib/content.ts';
import { evaluatePublication, contentHash } from '../lib/publication.ts';
import { ROOT } from '../lib/paths.ts';
import { requireEditorialSlot } from '../lib/editorial-budget.ts';
import { kstIso } from '../lib/time.ts';

// 예약이 겹쳐도 발행 한도 확인과 파일 변경을 동시에 수행하지 않습니다.
const lockDir = path.join(ROOT, 'automation', 'state');
const lockFile = path.join(lockDir, 'publication.lock');
let lock: number | undefined;
if (process.argv.includes('--apply')) {
  fs.mkdirSync(lockDir, { recursive: true });
  lock = fs.openSync(lockFile, 'wx');
}
try {

const slug = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
const apply = process.argv.includes('--apply');
if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error('사용: npm run publish:draft -- <slug> [--apply]');
const all = loadPosts();
requireEditorialSlot(all);
const post = all.find((p) => p.slug === slug);
if (!post || post.data.draft !== true) throw new Error('발행 대상은 draft: true인 기존 초안이어야 합니다.');
const result = await evaluatePublication(post, all, !process.argv.includes('--offline'));
console.log(JSON.stringify({ slug, apply, pass: result.pass, problems: result.problems }, null, 2));
if (!result.pass) throw new Error('사실·품질 검증 실패: 초안을 발행하지 않습니다.');
if (apply) {
  const original = fs.readFileSync(post.file, 'utf8');
  const reviewFile = path.join(ROOT, 'automation', 'reviews', `${post.slug}.json`);
  const originalReview = fs.readFileSync(reviewFile, 'utf8');
  try {
    post.data.draft = false;
    post.data.pubDate = kstIso();
    post.data.firstPublishedAt = post.data.pubDate;
    if (post.data.updatedDate) post.data.updatedDate = post.data.pubDate;
    writePost(post);
    const verified = spawnSync(process.execPath, [requireNpm(), 'run', 'verify'], { cwd: ROOT, stdio: 'inherit' });
    if (verified.status !== 0) throw new Error('전체 검증 실패: 초안을 복구합니다.');
    // 발행 상태와 실제 발행일만 전환합니다. 기존 사실 검증 날짜는 연장하지 않습니다.
    const review = JSON.parse(originalReview);
    review.publishedFromSha256 = contentHash(original);
    review.contentSha256 = contentHash(fs.readFileSync(post.file, 'utf8'));
    fs.writeFileSync(reviewFile, JSON.stringify(review, null, 2) + '\n', 'utf8');
    console.log('로컬 발행 상태 변경 및 전체 검증 완료. 원격 배포는 별도입니다.');
  } catch (error) {
    fs.writeFileSync(post.file, original);
    fs.writeFileSync(reviewFile, originalReview);
    throw error;
  }
}
} finally {
  if (lock !== undefined) {
    fs.closeSync(lock);
    fs.unlinkSync(lockFile);
  }
}

function requireNpm(): string {
  const npm = process.env.npm_execpath;
  if (!npm) throw new Error('npm run publish:draft로 실행해야 합니다.');
  return npm;
}
