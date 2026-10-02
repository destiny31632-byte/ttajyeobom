// ads.txt — 애드센스 게시자 ID(PUBLIC_ADSENSE_CLIENT)가 설정됐을 때만 생성됩니다.
import { ADS } from '../config/site';

export function getStaticPaths() {
  return ADS.enabled ? [{ params: { txt: 'ads' } }] : [];
}

export function GET() {
  const pub = ADS.client.replace(/^ca-/, '');
  return new Response(`google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
