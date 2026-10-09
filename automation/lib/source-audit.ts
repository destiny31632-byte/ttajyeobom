/** 공식 출처의 접근·수치 점검. 의미가 일치하는지는 별도로 검증합니다. */
export function isOfficialSource(url: URL): boolean {
  const domains = ['go.kr', 'safedriving.or.kr', 'koroad.or.kr', 'energy.or.kr', 'gov.kr', 'korea.kr', 'kepco.co.kr',
    'microsoft.com', 'apple.com', 'samsung.com', 'google.com'];
  return url.protocol === 'https:' && !url.username && !url.password &&
    domains.some((domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`));
}

export function missingSourceNumbers(value: string, text: string): string[] {
  const numbers = (input: string) => new Set((input.match(/\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/g) ?? []).map((n) => String(Number(n.replace(/,/g, '')))));
  const found = numbers(text);
  return [...numbers(value)].filter((number) => !found.has(number));
}
