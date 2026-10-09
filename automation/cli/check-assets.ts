import path from 'node:path';
import { ROOT } from '../lib/paths.ts';
import { scanStaticAssets, staticAssetProblems } from '../lib/static-assets.ts';
try {
  const files = scanStaticAssets(path.join(ROOT, 'dist'));
  const problems = staticAssetProblems(files);
  if (problems.length) {
    problems.forEach((problem) => console.error(problem));
    process.exitCode = 1;
  } else console.log(`무료 정적 호스팅 파일 검사 통과: ${files.length}/20,000개, 총 ${(files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)}MiB`);
} catch (error) {
  console.error(`배포 파일 검사 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  process.exitCode = 1;
}
