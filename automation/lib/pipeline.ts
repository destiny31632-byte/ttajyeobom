import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import { loadPosts } from './content.ts';
import { readResearch, evidenceNumbers } from './research-file.ts';
import { writeJson } from './fsutil.ts';
import { BRIEF_DIR, REPORT_DIR, CONFIG_DIR } from './paths.ts';
import fs from 'node:fs';
import { kstDate } from './time.ts';
import { runGate } from '../quality/gate.ts';
import { GeminiFreeProvider } from './ai-provider.ts';
import { generateDraft } from './generate-draft.ts';

export function eligibleTopic(title: string, policy: Record<string, string[]>): boolean {
  if (/총기 ?난사|테러|폭행|대통령|장관|차관|정치|국회의원|전쟁|참사/.test(title)) return false;
  return !['blockTopics', 'sensitiveTitle', 'ymylHigh'].some((key) =>
    (policy[key] ?? []).some((pattern) => new RegExp(pattern, 'i').test(title)));
}

async function collectCandidates() {
  // 관심 신호일 뿐 검색량·광고 수익의 측정값으로 제시하지 않습니다.
  const feedUrl = 'https://trends.google.com/trending/rss?geo=KR';
  const response = await fetch(feedUrl, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`트렌드 피드 응답 ${response.status}`);
  const body = await response.text();
  if (body.length > 2_000_000) throw new Error('트렌드 피드 크기 제한 초과');
  const parsed = new XMLParser({ ignoreAttributes: false }).parse(body);
  const raw = parsed?.rss?.channel?.item ?? [];
  const items = Array.isArray(raw) ? raw : [raw];
  const policy = JSON.parse(fs.readFileSync(path.join(CONFIG_DIR, 'policy.json'), 'utf8'));
  return items.map((item) => ({ title: String(item.title ?? ''), url: String(item.link ?? ''),
    observedAt: new Date().toISOString(), source: feedUrl }))
    .filter((item) => item.title && eligibleTopic(item.title, policy))
    .filter((item) => /스마트폰|아이폰|갤럭시|윈도우|노트북|가전|전기요금|난방|여권|운전면허|충전|배터리|해외직구|정부24/.test(item.title))
    .slice(0, 10);
}

export async function runPipeline(kind: 'daily' | 'weekly') {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const online = args.includes('--online');
  let generated: string | null = null;
  if (kind === 'daily' && args.includes('--generate') && !dryRun) generated = await generateDraft(new GeminiFreeProvider());
  const posts = loadPosts();
  const reports = [];
  for (const post of posts) {
    reports.push(await runGate(post, { allPosts: posts, online, forAutoPublish: true,
      evidenceNumbers: evidenceNumbers(readResearch(post.slug)) }));
  }
  const result = { kind, date: kstDate(), dryRun, online, articles: posts.length,
    failed: reports.filter((r) => !r.pass).map((r) => r.slug),
    sourceWarnings: reports.filter((r) => r.checks.some((c) => c.id === 'sources-online' && c.status !== 'pass')).map((r) => r.slug),
    overdue: posts.filter((p) => p.data.reviewBy && String(p.data.reviewBy) < kstDate()).map((p) => p.slug),
    generation: generated ? 'draft-created-review-required' : 'disabled-or-no-approved-brief', generated, published: 0,
    note: generated ? '무료 공급자로 초안 생성. 사실 검증 승인·발행·Git push·배포는 수행하지 않았습니다.' : 'AI 호출·발행·Git push·배포 없음. 후보 선정 및 승인된 초안 발행 기능은 각각 별도로 실행합니다.' };
  if (kind === 'daily' && args.includes('--collect') && !dryRun) {
    const candidates = await collectCandidates();
    writeJson(path.join(BRIEF_DIR, `${kstDate()}.json`), { date: kstDate(), candidates,
      note: '검색량·경쟁도·광고 단가를 추정하지 않은 관심 신호. 공식 자료 조사 후 글 작성 필요.' });
  }
  if (!dryRun) writeJson(path.join(REPORT_DIR, `${kind}-latest.json`), { ...result, reports });
  console.log(JSON.stringify(result, null, 2));
  if (result.failed.length) process.exitCode = 1;
}
