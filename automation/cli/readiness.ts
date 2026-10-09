// 로컬 준비 상태만 확인합니다. 외부 계정 접속·AI 호출·발행은 하지 않습니다.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, POSTS_DIR, RESEARCH_DIR } from '../lib/paths.ts';
import { readPost } from '../lib/content.ts';

let blockers = 0;
const check = (ok: boolean, message: string) => {
  console.log(`${ok ? '확인' : '미완료'}: ${message}`);
  if (!ok) blockers++;
};
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
for (const [name, command] of Object.entries(pkg.scripts) as [string, string][]) {
  const script = command.match(/^node\s+(\S+)/)?.[1];
  if (script) check(fs.existsSync(path.join(ROOT, script)), `${name} 실행 파일`);
}
check(fs.existsSync(path.join(ROOT, 'tests', 'automation.test.ts')), '자동화 회귀 테스트');
for (const file of fs.readdirSync(POSTS_DIR).filter((name) => name.endsWith('.md'))) {
  try {
    const post = readPost(path.join(POSTS_DIR, file));
    const researchFile = path.join(RESEARCH_DIR, `${post.slug}.json`);
    const research = JSON.parse(fs.readFileSync(researchFile, 'utf8'));
    check(research.slug === post.slug && Array.isArray(research.facts) && research.facts.length > 0,
      `${post.slug}: 조사 기록 (사실 정확성은 별도 검증 필요)`);
  } catch {
    check(false, `${file}: 글 또는 조사 기록을 읽을 수 없음`);
  }
}
try {
  const remotes = execFileSync('git', ['remote'], { cwd: ROOT, encoding: 'utf8' }).trim();
  check(Boolean(remotes), 'Git 원격 저장소 연결');
} catch { check(false, 'Git 상태 확인'); }
const workflows = path.join(ROOT, '.github', 'workflows');
check(fs.existsSync(workflows) && fs.readdirSync(workflows).some((name) => /\.ya?ml$/.test(name)), '예약 자동화 워크플로');
check(fs.existsSync(path.join(ROOT, 'COSTS.md')), '비용·무료 한도 보호 문서');
console.log(`\n미완료 ${blockers}건. 이 점검은 배포·계정 승인·공식 자료 검증 성공을 의미하지 않습니다.`);
process.exitCode = blockers ? 1 : 0;
