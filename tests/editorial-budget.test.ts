import { describe, expect, it } from 'vitest';
import { editorialBudget, requireEditorialSlot } from '../automation/lib/editorial-budget.ts';
import type { PostFile } from '../automation/lib/content.ts';

const post = (slug: string, pubDate: string, extra = {}) => ({ slug, data: { pubDate, ...extra } } as PostFile);
const now = new Date('2026-10-10T00:00:00Z');

describe('하루 신규 글 발행 한도', () => {
  it('한국 자정 경계를 적용하고 초안과 기존 글의 수정은 세지 않는다', () => {
    const result = editorialBudget([
      post('today', '2026-10-09T15:00:00Z'),
      post('yesterday', '2026-10-09T14:59:59Z', { updatedDate: now.toISOString() }),
      post('draft', now.toISOString(), { draft: true }),
    ], now);
    expect(result.published).toEqual(['today']);
    expect(result.remaining).toBe(1);
  });
  it('두 글 발행 후 세 번째를 차단하고 다음 날 한도가 돌아온다', () => {
    const posts = [post('one', now.toISOString()), post('two', now.toISOString())];
    expect(() => requireEditorialSlot(posts, now)).toThrow('한도');
    expect(requireEditorialSlot(posts, new Date('2026-10-10T15:00:00Z')).remaining).toBe(2);
  });
  it('이후 수정한 표시 날짜 대신 최초 발행 시각을 우선한다', () => {
    expect(editorialBudget([post('one', '2026-10-11T00:00:00Z', { firstPublishedAt: now.toISOString() })], now).remaining).toBe(1);
  });
  it('기존 발행 날짜를 확인할 수 없으면 한도를 열어주지 않는다', () => {
    expect(() => editorialBudget([post('broken', 'invalid')], now)).toThrow('확인 불가');
  });
});
