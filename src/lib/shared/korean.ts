// 한국어 텍스트 유틸 (사이트 빌드와 자동화 스크립트가 함께 사용)

/** Markdown 문법과 HTML 태그를 걷어낸 본문 텍스트 */
export function stripMarkdown(md: string): string {
  return md
    .replace(/^---[\s\S]*?---/, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\|/g, ' ')
    .replace(/[*_`~]/g, '')
    .replace(/:?-{3,}:?/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 공백을 제외한 글자 수 (한국어 글 분량 기준) */
export function countChars(md: string): number {
  return stripMarkdown(md).replace(/\s/g, '').length;
}

/** 예상 읽기 시간(분). 한국어 성인 묵독 기준 분당 약 500자로 계산 */
export function readingMinutes(md: string, charsPerMinute = 500): number {
  return Math.max(1, Math.round(countChars(md) / charsPerMinute));
}

/** 문장 단위 분리 (마침표/물음표/느낌표/줄바꿈 기준) */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?。？！])\s+|\n+/u)
    .map((s) => s.trim())
    .filter((s) => s.length >= 8);
}

/** 슬러그 형식 검사: 영문 소문자·숫자·하이픈 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 80;
}
