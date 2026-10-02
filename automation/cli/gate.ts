// 품질 검수 실행
// 사용: npm run gate -- <slug|all> [--online] [--save] [--json] [--auto]
//   --online : 출처 링크 실제 접속 확인
//   --save   : automation/reports/gate/<slug>.json 저장
//   --auto   : 자동 발행 기준(고위험 YMYL 차단)으로 검사
import path from 'node:path';
import { loadPosts } from '../lib/content.ts';
import { REPORT_DIR } from '../lib/paths.ts';
import { writeJson } from '../lib/fsutil.ts';
import { evidenceNumbers, readResearch } from '../lib/research-file.ts';
import { formatReport, runGate } from '../quality/gate.ts';

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--')) ?? 'all';
const online = args.includes('--online');
const save = args.includes('--save');
const json = args.includes('--json');
const auto = args.includes('--auto');

const all = loadPosts();
const targets = target === 'all' ? all : all.filter((p) => p.slug === target || p.file.endsWith(target));
if (!targets.length) {
  console.error(`검사할 글을 찾지 못했습니다: ${target}`);
  process.exit(2);
}

let failed = 0;
const reports = [];
for (const post of targets) {
  // 조사 기록(automation/research/<slug>.json)이 있으면 본문 숫자의 근거로 사용
  const evidence = evidenceNumbers(readResearch(post.slug));
  const report = await runGate(post, { allPosts: all, online, forAutoPublish: auto, evidenceNumbers: evidence.length ? evidence : undefined });
  reports.push(report);
  if (!report.pass) failed++;
  if (save) writeJson(path.join(REPORT_DIR, 'gate', `${post.slug}.json`), report);
  if (!json) console.log(formatReport(report) + '\n');
}
if (json) console.log(JSON.stringify(reports, null, 2));
console.log(`검수 완료: ${targets.length}개 중 통과 ${targets.length - failed}개, 미달 ${failed}개`);
process.exit(failed ? 1 : 0);
