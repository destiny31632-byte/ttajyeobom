import { describe, expect, it } from 'vitest';
import { calc, buildCalcTable } from '../automation/lib/calc.ts';
import { kstDate, kstIso, kstMonth } from '../automation/lib/time.ts';
import { adMarkup, adLoaderSrc, readAdConfig } from '../src/lib/ads-markup.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPosts, parsePost } from '../automation/lib/content.ts';

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
