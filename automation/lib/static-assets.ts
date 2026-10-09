import fs from 'node:fs';
import path from 'node:path';

export interface StaticAsset { name: string; size: number; symlink?: boolean }
// Workers Free 정적 파일 한도. 초과해도 유료 플랜으로 전환하지 않습니다.
export function staticAssetProblems(files: StaticAsset[]): string[] {
  const problems: string[] = [];
  if (!files.length) problems.push('배포 파일 없음');
  if (files.length > 20_000) problems.push('무료 정적 파일 한도 20,000개 초과');
  for (const file of files) {
    if (file.symlink) problems.push(`심볼릭 링크는 배포하지 않음: ${file.name}`);
    if (!Number.isSafeInteger(file.size) || file.size < 0 || file.size > 25 * 1024 * 1024) problems.push(`파일 크기 한도 25MiB 초과 또는 잘못된 크기: ${file.name}`);
    const parts = file.name.replace(/\\/g, '/').split('/');
    if (parts.some((part) => /^(?:\.env(?:\..*)?|\.git|\.wrangler|_worker\.js)$/i.test(part)) || /(?:\.pem|\.key|service-account.*\.json)$/i.test(file.name)) problems.push(`인증정보 또는 서버 실행 파일 배포 금지: ${file.name}`);
  }
  return problems;
}

export function scanStaticAssets(dir: string): StaticAsset[] {
  const result: StaticAsset[] = [];
  function visit(current: string) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      const name = path.relative(dir, file).replace(/\\/g, '/');
      // 링크를 따라가 다른 폴더의 파일까지 업로드하지 않습니다.
      if (entry.isSymbolicLink()) result.push({ name, size: 0, symlink: true });
      else if (entry.isDirectory()) visit(file);
      else if (entry.isFile()) result.push({ name, size: fs.statSync(file).size });
      else throw new Error(`일반 파일이 아닌 배포 항목: ${name}`);
    }
  }
  visit(dir);
  return result;
}
