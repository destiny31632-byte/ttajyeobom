// 글별 조사 기록 (automation/research/<slug>.json)
// - 출처 URL·조회일·핵심 사실을 글과 별도로 보존 → 품질 검수(숫자 근거)와 주기적 재확인(refresh)에 사용
import path from 'node:path';
import { RESEARCH_DIR } from './paths.ts';
import { readJson, writeJson } from './fsutil.ts';

export interface ResearchFact {
  claim: string;
  value?: string;
  sourceUrl: string;
  /** 출처에서 확인한 짧은 근거 (100자 이내, 그대로 복사한 긴 문장 금지) */
  evidence?: string;
  asOf?: string;
}

export interface ResearchCalc {
  table: string;
  formula: string;
  assumptions?: string;
  /** 표에 실린 계산 결과 숫자 (검수용) */
  values: (number | string)[];
}

export interface ResearchFile {
  slug: string;
  checkedAt: string;
  facts: ResearchFact[];
  conflicts?: { topic: string; detail: string; sources: string[] }[];
  calculations?: ResearchCalc[];
  /** 정보가 바뀌었는지 재확인할 때 살펴볼 항목 */
  watch?: string[];
  /** 출처 원문 해시 (refresh 가 변경 감지에 사용) */
  sourceHashes?: Record<string, string>;
}

export const researchPath = (slug: string) => path.join(RESEARCH_DIR, `${slug}.json`);

export function readResearch(slug: string): ResearchFile | null {
  return readJson<ResearchFile | null>(researchPath(slug), null);
}

export function writeResearch(data: ResearchFile): void {
  writeJson(researchPath(data.slug), data);
}

/** 품질 검수용 근거 숫자 목록 */
export function evidenceNumbers(r: ResearchFile | null): string[] {
  if (!r) return [];
  const out: string[] = [];
  const NUM = /\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/g;
  for (const f of r.facts ?? []) {
    for (const s of [f.value ?? '', f.claim, f.evidence ?? '']) for (const m of s.match(NUM) ?? []) out.push(m.replace(/,/g, ''));
  }
  for (const c of r.calculations ?? []) {
    for (const v of c.values ?? []) {
      const n = typeof v === 'number' ? v : Number(String(v).replace(/[^\d.]/g, ''));
      if (Number.isFinite(n)) {
        out.push(String(n));
        out.push(String(Math.round(n)));
        out.push(n.toFixed(1).replace(/\.0$/, ''));
      }
    }
    for (const m of `${c.formula} ${c.assumptions ?? ''}`.match(NUM) ?? []) out.push(m.replace(/,/g, ''));
  }
  return [...new Set(out)];
}
