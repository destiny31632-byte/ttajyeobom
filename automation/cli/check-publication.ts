import { loadPosts } from '../lib/content.ts';
import { reviewProblems } from '../lib/publication.ts';
let failed = 0;
for (const post of loadPosts({ includeDrafts: false })) {
  const problems = reviewProblems(post);
  if (problems.length) failed++;
  console.log(`${problems.length ? '미완료' : '확인'}: ${post.slug}${problems.length ? ' — ' + problems.join('; ') : ''}`);
}
console.log(`공개 글 발행 승인 미완료: ${failed}개`);
process.exitCode = failed ? 1 : 0;
