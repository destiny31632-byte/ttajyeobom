import { describe, expect, it, vi } from 'vitest';
import { calc, buildCalcTable } from '../automation/lib/calc.ts';
import { kstDate, kstIso, kstMonth } from '../automation/lib/time.ts';
import { adMarkup, adLoaderSrc, readAdConfig } from '../src/lib/ads-markup.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPosts, parsePost } from '../automation/lib/content.ts';
import { eligibleTopic } from '../automation/lib/pipeline.ts';
import { contentHash, reviewProblems } from '../automation/lib/publication.ts';
import { reserveCall } from '../automation/lib/ai-budget.ts';
import { GeminiFreeProvider } from '../automation/lib/ai-provider.ts';
import { isOfficialSource, missingSourceNumbers, decodeSource } from '../automation/lib/source-audit.ts';
import { deploymentProblems } from '../automation/lib/deploy-settings.ts';

describe('상업용 무료 배포 준비', () => {
  it('기본 개발 주소와 무료 플랜 미확인 상태를 배포하지 않는다', () => {
    expect(deploymentProblems({}).length).toBe(3);
    expect(deploymentProblems({ SITE_URL: 'https://ttajyeobom.vercel.app', PUBLIC_CONTACT_EMAIL: 'test@example.com', CLOUDFLARE_FREE_CONFIRMED: 'true' }).length).toBe(2);
  });
  it('확인된 공개 연락처와 명시적인 정적 호스팅 주소를 허용한다', () => {
    expect(deploymentProblems({ SITE_URL: 'https://ttajyeobom.worker-subdomain.workers.dev', PUBLIC_CONTACT_EMAIL: 'editor@ttajyeobom.test', CLOUDFLARE_FREE_CONFIRMED: 'true' })).toEqual([]);
  });
});

describe('공식 원문 점검', () => {
  it('정부 사이트 EUC-KR 본문과 UTF-8 문서를 올바르게 읽는다', () => {
    expect(decodeSource(new Uint8Array([0xc1, 0xa4, 0xba, 0xce]), 'text/html; charset=EUC-KR')).toBe('정부');
    expect(decodeSource(new TextEncoder().encode('정부'), 'text/html; charset=UTF-8')).toBe('정부');
    expect(() => decodeSource(new Uint8Array([1]), 'text/html; charset=not-a-real-encoding')).toThrow();
  });
  it('정부24·정책브리핑·한국전력 공식 주소를 허용하고 위장 주소를 거부한다', () => {
    for (const host of ['www.gov.kr', 'www.korea.kr', 'cyber.kepco.co.kr', 'www.safedriving.or.kr']) {
      expect(isOfficialSource(new URL(`https://${host}/`))).toBe(true);
    }
    for (const raw of ['https://gov.kr.example.com/', 'https://fakegov.kr/', 'https://unverified.or.kr/', 'http://www.gov.kr/', 'https://user@www.gov.kr/']) {
      expect(isOfficialSource(new URL(raw))).toBe(false);
    }
  });
  it('다른 숫자의 일부분을 근거로 처리하지 않으며 쉼표를 정규화한다', () => {
    expect(missingSourceNumbers('1원 2.7% 21,000원', '2026년 3.7% 21000원')).toEqual(['1', '2.7']);
    expect(missingSourceNumbers('2026-09-01, 2.70%', '2026년 9월 1일, 2.7%')).toEqual([]);
  });
});

describe('무료 호출 예산', () => {
  it('비활성화된 공급자는 네트워크를 호출하지 않는다', async () => {
    const previous = process.env.AI_DISABLED;
    process.env.AI_DISABLED = 'true';
    const request = vi.spyOn(globalThis, 'fetch');
    try {
      await expect(new GeminiFreeProvider().generate('test')).rejects.toThrow('AI 호출 비활성화');
      expect(request).not.toHaveBeenCalled();
    } finally {
      request.mockRestore();
      if (previous === undefined) delete process.env.AI_DISABLED;
      else process.env.AI_DISABLED = previous;
    }
  });
  it('손상된 월별 기록을 0으로 간주하지 않는다', () => {
    expect(() => reserveCall({ day: '2026-10-09', month: '2026-10' } as any, '2026-10-09', 10000)).toThrow('예산 기록 손상');
  });
  it('하루 호출 제한을 넘으면 재시도하지 않는다', () => {
    let state = reserveCall(null, '2026-10-09', 10000);
    state = reserveCall(state, '2026-10-09', 10000);
    expect(() => reserveCall(state, '2026-10-09', 10000)).toThrow();
    const next = reserveCall(state, '2026-10-10', 10000);
    expect(next.dailyCalls).toBe(1);
    expect(next.monthlyCalls).toBe(3);
  });
  it('날짜가 바뀌어도 월 한도를 초기화하지 않는다', () => {
    const state = { day: '2026-10-08', month: '2026-10', dailyCalls: 1, monthlyCalls: 40, reservedTokens: 400000 };
    expect(() => reserveCall(state, '2026-10-09', 10000)).toThrow();
    expect(reserveCall(state, '2026-11-01', 10000).monthlyCalls).toBe(1);
  });
});

describe('발행 보호', () => {
  it('관심도가 높아도 차단·민감 주제는 후보에서 제외한다', () => {
    const policy = { blockTopics: ['카지노'], sensitiveTitle: ['살인'], ymylHigh: ['코인 투자'] };
    expect(eligibleTopic('카지노 할인', policy)).toBe(false);
    expect(eligibleTopic('코인 투자 추천', policy)).toBe(false);
    expect(eligibleTopic('스마트폰 배터리 관리', policy)).toBe(true);
  });
  it('검증 승인 기록이 없는 글을 발행하지 않는다', () => {
    const post = loadPosts()[0];
    const originalRead = fs.readFileSync;
    const mock = vi.spyOn(fs, 'readFileSync').mockImplementation(((file: any, ...args: any[]) => {
      if (String(file).includes(`${path.sep}reviews${path.sep}`)) throw new Error('missing review');
      return (originalRead as any)(file, ...args);
    }) as any);
    try { expect(reviewProblems(post)).toContain('검증 승인 기록 없음 또는 형식 오류'); }
    finally { mock.mockRestore(); }
  });
  it('본문 해시가 다른 승인과 기한이 지난 승인을 거부한다', () => {
    const post = loadPosts()[0];
    const originalRead = fs.readFileSync;
    const mock = vi.spyOn(fs, 'readFileSync').mockImplementation(((file: any, ...args: any[]) => {
      if (String(file).includes(`${path.sep}reviews${path.sep}`)) return JSON.stringify({ approved: true, factsVerified: true,
        reviewer: 'test', checkedAt: '2026-09-01T00:00:00Z', contentSha256: 'wrong', researchSha256: 'wrong' });
      return (originalRead as any)(file, ...args);
    }) as any);
    try {
      const problems = reviewProblems(post, new Date('2026-10-09T09:00:00Z'));
      expect(problems).toContain('7일 이내 검증 승인 필요');
      expect(problems).toContain('검증 이후 본문 변경');
      expect(problems).toContain('검증 이후 조사 기록 변경');
    } finally { mock.mockRestore(); }
  });
  it('본문이나 근거가 달라지면 승인에 사용한 해시가 달라진다', () => {
    expect(contentHash('비용 100원')).not.toBe(contentHash('비용 1000원'));
    expect(contentHash('비용 100원\r\n조건: 성인\r\n')).toBe(contentHash('비용 100원\n조건: 성인\n'));
  });
});

describe('글 검사 누락 방지', () => {
  it.each(['plain text', '---\n- list\n---\n본문', '---\nnull\n---\n본문'])('잘못된 글 형식을 거부한다', (raw) => {
    expect(() => parsePost(raw, 'bad.md')).toThrow();
  });
  it('깨진 글 하나가 있어도 전체 검사를 실패시킨다', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ttajyeobom-test-'));
    const file = path.join(dir, 'broken.md');
    try {
      fs.writeFileSync(file, '---\ntitle: [broken\n---\n본문');
      expect(() => loadPosts({ dir })).toThrow(/broken\.md/);
    } finally {
      fs.unlinkSync(file);
      fs.rmdirSync(dir);
    }
  });
});

describe('콘텐츠 계산', () => {
  it('단가와 사용량으로 비용을 계산하고 표에 같은 결과를 기록한다', () => {
    const table = buildCalcTable({
      constants: { price: 120 },
      columns: [{ header: '사용량', input: 'usage' }, { header: '요금', expr: 'usage * price', format: 'won' }],
      rows: [{ inputs: { usage: 250 } }],
    });
    expect(table.values).toEqual([250, 30000]);
    expect(table.markdown).toContain('30,000원');
  });
  it('연산 우선순위와 할인 계산을 유지한다', () => {
    expect(calc('1000 * (1 - discount / 100)', { discount: 15 })).toBe(850);
    expect(calc('2 ^ 3 ^ 2')).toBe(512);
    expect(calc('-2 ^ 2')).toBe(-4);
  });
  it.each(['1 / 0', '1 % 0', 'missing + 1', 'process.exit()', 'constructor(1)', 'toString(1)'])('잘못된 식을 차단한다: %s', (expression) => {
    expect(() => calc(expression)).toThrow();
  });
  it('상속받은 변수를 계산 근거로 사용하지 않는다', () => {
    expect(() => calc('price', Object.create({ price: 100 }))).toThrow();
  });
});

describe('자동 발행 날짜', () => {
  it('한국 자정 경계에서 날짜와 월을 함께 바꾼다', () => {
    expect(kstDate(new Date('2026-09-30T14:59:59Z'))).toBe('2026-09-30');
    const midnight = new Date('2026-09-30T15:00:00Z');
    expect(kstDate(midnight)).toBe('2026-10-01');
    expect(kstMonth(midnight)).toBe(10);
    expect(kstIso(midnight)).toBe('2026-10-01T00:00:00+09:00');
  });
});

describe('광고 설정', () => {
  it.each(['', 'invalid', 'ca-pub-123" onclick="alert(1)'])('잘못된 게시자 ID에는 광고나 로더를 출력하지 않는다', (client) => {
    const config = readAdConfig({ PUBLIC_ADSENSE_CLIENT: client });
    expect(adMarkup('article-top', config)).toBe('');
    expect(adLoaderSrc(config)).toBe('');
  });
  it('게시자만 설정하고 슬롯을 비우면 빈 광고 상자를 만들지 않는다', () => {
    const config = readAdConfig({ PUBLIC_ADSENSE_CLIENT: 'ca-pub-1234567890123456' });
    expect(config.enabled).toBe(true);
    expect(adMarkup('in-article', config)).toBe('');
  });
});
