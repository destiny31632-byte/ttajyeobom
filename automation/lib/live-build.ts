import { setTimeout as sleep } from 'node:timers/promises';

export async function waitForBuild<T extends { buildId: string }>(
  read: () => Promise<T>, expectedId: string | undefined, wait: boolean,
  delay: () => Promise<unknown> = () => sleep(3000),
): Promise<T> {
  const attempts = wait && expectedId ? 6 : 1;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const actual = await read();
    if (!expectedId || actual.buildId === expectedId) return actual;
    if (attempt + 1 < attempts) {
      console.log(`배포 반영 대기: ${attempt + 1}/${attempts}`);
      await delay();
    }
  }
  throw new Error('라이브 사이트의 빌드가 로컬 검증 빌드와 다릅니다.');
}
