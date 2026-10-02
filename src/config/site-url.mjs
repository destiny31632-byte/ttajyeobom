// 사이트 기본 주소. 개인 도메인을 연결하면 이 값(또는 SITE_URL 환경 변수)만 바꾸면 됩니다.
// astro.config.mjs 와 자동화 스크립트(Node)가 함께 사용하므로 순수 JS로 둡니다.
export const DEFAULT_SITE_URL = 'https://ttajyeobom.vercel.app';

/** @returns {string} 끝에 슬래시가 없는 사이트 주소 */
export function resolveSiteUrl(env = process.env) {
  const raw = (env.SITE_URL || DEFAULT_SITE_URL).trim();
  return raw.replace(/\/+$/, '');
}
