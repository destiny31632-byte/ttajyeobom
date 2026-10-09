// 실제 원문 변경과 근거 누락을 찾기 위한 보조 검사. 사실 검증 승인 기록을 만들지 않습니다.
import { parseHTML } from 'linkedom';
import { loadPosts } from '../lib/content.ts';
import { readResearch } from '../lib/research-file.ts';
import { writeJson } from '../lib/fsutil.ts';
import { contentHash } from '../lib/publication.ts';
import { REPORT_DIR } from '../lib/paths.ts';
import path from 'node:path';
import { isOfficialSource, missingSourceNumbers, decodeSource } from '../lib/source-audit.ts';

async function sourceText(raw: string) {
  let url = new URL(raw);
  for (let redirect = 0; redirect < 4; redirect++) {
    if (!isOfficialSource(url)) return { status: 'unsupported-domain', sha256: '', text: '' };
    const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(12000), headers: { 'User-Agent': 'ttajyeobom-source-audit/1.0' } });
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) return { status: 'redirect-without-location', sha256: '', text: '' };
      url = new URL(location, url); continue;
    }
    if (!res.ok) return { status: `http-${res.status}`, sha256: '', text: '' };
    const reader = res.body?.getReader();
    if (!reader) return { status: 'empty', sha256: '', text: '' };
    const chunks: Uint8Array[] = []; let bytes = 0;
    for (;;) {
      const chunk = await reader.read(); if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 2_000_000) { await reader.cancel(); throw new Error('원문 크기 제한 초과'); }
      chunks.push(chunk.value);
    }
    const { document } = parseHTML(decodeSource(Buffer.concat(chunks), res.headers.get('content-type') ?? ''));
    document.querySelectorAll('script,style,nav,footer,header').forEach((e) => e.remove());
    const text = document.body.textContent ?? '';
    return { status: text.trim().length > 100 ? 'retrieved' : 'insufficient-text', sha256: contentHash(text), text };
  }
  return { status: 'too-many-redirects', sha256: '', text: '' };
}

const cache = new Map<string, Awaited<ReturnType<typeof sourceText>>>();
const reports = [];
for (const post of loadPosts({ includeDrafts: false })) {
  const research = readResearch(post.slug);
  const facts = [];
  for (const fact of research?.facts ?? []) {
    if (!cache.has(fact.sourceUrl)) {
      try { cache.set(fact.sourceUrl, await sourceText(fact.sourceUrl)); }
      catch { cache.set(fact.sourceUrl, { status: 'unavailable', sha256: '', text: '' }); }
    }
    const source = cache.get(fact.sourceUrl)!;
    const missingNumbers = missingSourceNumbers(String(fact.value ?? ''), source.text);
    facts.push({ claim: fact.claim, sourceUrl: fact.sourceUrl, retrieval: source.status,
      sourceSha256: source.sha256, missingNumbers,
      needsSemanticReview: true });
  }
  reports.push({ slug: post.slug, facts });
  console.log(`${post.slug}: 조사 ${facts.length}건, 원문 접근 미확인 ${facts.filter((f) => f.retrieval !== 'retrieved').length}건, 수치 대조 필요 ${facts.filter((f) => f.missingNumbers.length).length}건`);
}
writeJson(path.join(REPORT_DIR, 'source-audit.json'), { checkedAt: new Date().toISOString(),
  note: '숫자가 원문에 존재해도 같은 조건의 주장인지 별도 검증 필요. 자동 발행 승인 아님.', reports });
