// 본문 텍스트 검사 도구: 반복, 금지 표현, 오탈자, 원문 복제(표절) 위험, 숫자 근거
import { splitSentences, stripMarkdown } from '../../src/lib/shared/korean.ts';

export function findPatterns(text: string, patterns: string[]): { pattern: string; count: number; sample: string }[] {
  const out: { pattern: string; count: number; sample: string }[] = [];
  for (const p of patterns) {
    const re = new RegExp(p, 'giu');
    const matches = [...text.matchAll(re)];
    if (matches.length) {
      const m = matches[0];
      const start = Math.max(0, (m.index ?? 0) - 15);
      out.push({ pattern: p, count: matches.length, sample: text.slice(start, (m.index ?? 0) + m[0].length + 15).replace(/\s+/g, ' ') });
    }
  }
  return out;
}

/** 같은 문장이 반복되는지 (정규화 후 완전 일치) */
export function duplicateSentences(md: string): { sentence: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const s of splitSentences(stripMarkdown(md))) {
    const key = s.replace(/[^\p{L}\p{N}]/gu, '');
    if (key.length < 15) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, c]) => c > 1).map(([sentence, count]) => ({ sentence: sentence.slice(0, 60), count }));
}

/** 같은 어구로 시작하는 문장이 지나치게 많은지 (기계적인 문체 신호) */
export function repeatedOpeners(md: string, minRun = 4): string[] {
  const sentences = splitSentences(stripMarkdown(md));
  const flagged = new Set<string>();
  let run = 1;
  for (let i = 1; i < sentences.length; i++) {
    const a = sentences[i - 1].split(' ').slice(0, 2).join(' ');
    const b = sentences[i].split(' ').slice(0, 2).join(' ');
    if (a && a === b) {
      run++;
      if (run >= minRun) flagged.add(b);
    } else run = 1;
  }
  return [...flagged];
}

/** 6어절 n-gram 이 3회 이상 반복되는 비율 (채우기용 반복 문구 탐지) */
export function phraseRepetitionRatio(md: string, n = 6): { ratio: number; top: { phrase: string; count: number }[] } {
  const words = stripMarkdown(md).split(/\s+/).filter(Boolean);
  if (words.length < n * 4) return { ratio: 0, top: [] };
  const counts = new Map<string, number>();
  for (let i = 0; i <= words.length - n; i++) {
    const g = words.slice(i, i + n).join(' ');
    counts.set(g, (counts.get(g) ?? 0) + 1);
  }
  const repeated = [...counts.entries()].filter(([, c]) => c >= 3);
  const covered = repeated.reduce((s, [, c]) => s + c, 0);
  return {
    ratio: covered / Math.max(1, words.length - n + 1),
    top: repeated.sort((a, b) => b[1] - a[1]).slice(0, 3).map(([phrase, count]) => ({ phrase, count })),
  };
}

const compact = (s: string) => s.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

/**
 * 원문 복제 위험: 원문에서 가져온 연속 구간 길이와 포함 비율.
 * 출처 원문(조사 단계에서 수집한 텍스트)과 본문을 비교합니다.
 */
export function copyRisk(article: string, sources: string[], window = 20): { maxRun: number; containment: number; sample?: string } {
  const a = compact(stripMarkdown(article));
  if (!a.length || !sources.length) return { maxRun: 0, containment: 0 };
  const shingles = new Set<string>();
  for (const src of sources) {
    const s = compact(src);
    for (let i = 0; i + window <= s.length; i++) shingles.add(s.slice(i, i + window));
  }
  let maxRun = 0;
  let run = 0;
  let hits = 0;
  let total = 0;
  let sampleAt = -1;
  for (let i = 0; i + window <= a.length; i++) {
    total++;
    if (shingles.has(a.slice(i, i + window))) {
      hits++;
      run = run ? run + 1 : window;
      if (run > maxRun) {
        maxRun = run;
        sampleAt = i;
      }
    } else run = 0;
  }
  return {
    maxRun,
    containment: total ? hits / total : 0,
    sample: sampleAt >= 0 ? a.slice(Math.max(0, sampleAt - maxRun + window), sampleAt + window).slice(0, 80) : undefined,
  };
}

const UNIT = '(?:원|만\\s?원|천\\s?원|억\\s?원|달러|유로|엔|%|퍼센트|kWh|kW|W|와트|GB|MB|TB|mAh|Wh|km|㎞|kg|g|℃|도|년|개월|일|시간|분|초|회|개|명|배|건|대|장|번|원\\/kWh)';
const NUMBER_RE = new RegExp(`(\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.(\\d+))?\\s?${UNIT}`, 'gu');

/** 본문에서 단위가 붙은 숫자 표현 추출 (사실 검증 대상) */
export function extractNumericClaims(md: string): string[] {
  const text = stripMarkdown(md);
  const out: string[] = [];
  for (const m of text.matchAll(NUMBER_RE)) {
    const n = Number(m[1].replace(/,/g, '') + (m[2] ? `.${m[2]}` : ''));
    const unit = m[0].replace(/[\d,.\s]/g, '');
    // 연도, 작은 개수 표현(3가지·5단계 등)은 사실 검증 대상에서 제외
    if (unit === '년' && n >= 1990 && n <= 2100) continue;
    if (['개', '번', '회', '장', '건', '대', '명'].includes(unit) && n <= 10) continue;
    out.push(m[0].replace(/\s+/g, ''));
  }
  return out;
}

export function normalizeNumber(s: string): string {
  return s.replace(/[,\s]/g, '').replace(/퍼센트/g, '%');
}
