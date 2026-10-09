import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadPosts, writePost } from '../lib/content.ts';
import { evaluatePublication, contentHash } from '../lib/publication.ts';
import { ROOT } from '../lib/paths.ts';

const slug = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
const apply = process.argv.includes('--apply');
if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error('사용: npm run publish:draft -- <slug> [--apply]');
const all = loadPosts();
const post = all.find((p) => p.slug === slug);
if (!post || post.data.draft !== true) throw new Error('발행 대상은 draft: true인 기존 초안이어야 합니다.');
const result = await evaluatePublication(post, all, !process.argv.includes('--offline'));
console.log(JSON.stringify({ slug, apply, pass: result.pass, problems: result.problems }, null, 2));
if (!result.pass) process.exit(1);
if (apply) {
  const original = fs.readFileSync(post.file, 'utf8');
  const reviewFile = path.join(ROOT, 'automation', 'reviews', `${post.slug}.json`);
  const originalReview = fs.readFileSync(reviewFile, 'utf8');
  try {
    post.data.draft = false;
    writePost(post);
    const verified = spawnSync(process.execPath, [requireNpm(), 'run', 'verify'], { cwd: ROOT, stdio: 'inherit' });
    if (verified.status !== 0) throw new Error('전체 검증 실패: 초안을 복구합니다.');
    // 승인한 초안의 발행 상태만 전환했습니다. 기존 검증 날짜는 연장하지 않습니다.
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

function requireNpm(): string {
  const npm = process.env.npm_execpath;
  if (!npm) throw new Error('npm run publish:draft로 실행해야 합니다.');
  return npm;
}
