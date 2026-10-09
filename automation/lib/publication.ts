import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { runGate } from '../quality/gate.ts';
import { readResearch, evidenceNumbers } from './research-file.ts';
import { type PostFile } from './content.ts';
import { ROOT } from './paths.ts';

// Windows와 GitHub Linux의 줄바꿈 차이로 실제 내용이 같은 승인을 무효화하지 않습니다.
export const contentHash = (text: string) => crypto.createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex');
export function reviewProblems(post: PostFile, now = new Date()): string[] {
  const problems: string[] = [];
  const research = readResearch(post.slug);
  if (!research || research.slug !== post.slug || !research.facts?.length) problems.push('조사 기록 없음');
  if (research?.conflicts?.some((c) => c.resolution?.status !== 'resolved')) problems.push('미해결 출처 충돌');
  const file = path.join(ROOT, 'automation', 'reviews', `${post.slug}.json`);
  try {
    const review = JSON.parse(fs.readFileSync(file, 'utf8'));
    const checked = Date.parse(review.checkedAt);
    const age = (now.getTime() - checked) / 86400000;
    if (review.approved !== true || typeof review.reviewer !== 'string' || !review.reviewer.trim() || review.factsVerified !== true) problems.push('사실 검증 승인 없음');
    if (!Number.isFinite(age) || age < 0 || age > 7) problems.push('7일 이내 검증 승인 필요');
    if (review.contentSha256 !== contentHash(fs.readFileSync(post.file, 'utf8'))) problems.push('검증 이후 본문 변경');
    const researchText = fs.readFileSync(path.join(ROOT, 'automation', 'research', `${post.slug}.json`), 'utf8');
    if (review.researchSha256 !== contentHash(researchText)) problems.push('검증 이후 조사 기록 변경');
  } catch { problems.push('검증 승인 기록 없음 또는 형식 오류'); }
  return problems;
}

export async function evaluatePublication(post: PostFile, allPosts: PostFile[], online: boolean) {
  const problems = reviewProblems(post);
  if (!online) problems.push('출처 온라인 확인을 생략한 실행에서는 발행 금지');
  const report = await runGate(post, {
    allPosts, forAutoPublish: true, online,
    evidenceNumbers: evidenceNumbers(readResearch(post.slug)),
  });
  if (!report.pass) problems.push(...report.failures);
  // 응답 없음·차단·서버 오류도 자동 발행에서는 검증 성공으로 처리하지 않습니다.
  if (report.checks.some((c) => c.id.startsWith('sources-') && c.status !== 'pass')) problems.push('출처 검사 미통과');
  return { pass: problems.length === 0, problems, report };
}
