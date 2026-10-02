// Vercel "Ignored Build Step": 사이트에 영향을 주는 파일이 바뀌지 않았으면 빌드를 건너뜁니다.
// (자동화 로그·상태 파일만 커밋된 경우 불필요한 배포를 막아 무료 한도를 아낍니다)
// 종료 코드 0 = 빌드 건너뜀, 1 = 빌드 진행 (Vercel 규칙)
import { execSync } from 'node:child_process';

const SITE_PATHS = ['src', 'public', 'astro.config.mjs', 'package.json', 'package-lock.json', 'vercel.json', 'tsconfig.json'];
const prev = process.env.VERCEL_GIT_PREVIOUS_SHA;

function proceed(reason) {
  console.log(`[ignore-build] 빌드 진행: ${reason}`);
  process.exit(1);
}

if (!prev) proceed('이전 배포 커밋 정보 없음');

try {
  execSync(`git cat-file -e ${prev}^{commit}`, { stdio: 'ignore' });
} catch {
  proceed('이전 배포 커밋이 clone 범위 밖');
}

try {
  execSync(`git diff --quiet ${prev} HEAD -- ${SITE_PATHS.join(' ')}`, { stdio: 'ignore' });
  console.log('[ignore-build] 사이트 파일 변경 없음 → 빌드 건너뜀');
  process.exit(0);
} catch {
  proceed('사이트 파일 변경됨');
}
