// 정적 페이지 목록 (sitemap, readiness 검사, 푸터가 함께 참고)
export const STATIC_PAGES = [
  { href: '/about/', title: '블로그 소개', updated: '2026-10-10' },
  { href: '/author/editor/', title: '작성자 소개', updated: '2026-10-10' },
  { href: '/editorial-policy/', title: '편집 원칙·작성 방식', updated: '2026-10-10' },
  { href: '/contact/', title: '문의', updated: '2026-10-01' },
  { href: '/privacy/', title: '개인정보처리방침', updated: '2026-10-01' },
  { href: '/terms/', title: '이용약관', updated: '2026-10-01' },
  { href: '/disclaimer/', title: '면책조항', updated: '2026-10-10' },
];

/** 현재 사이트를 서비스하는 호스팅 사업자 (빌드 환경으로 자동 판별) */
export function hostingProvider() {
  const env = typeof process !== 'undefined' ? process.env : {};
  if (env.CF_PAGES || env.WORKERS_CI || env.HOSTING_PROVIDER === 'cloudflare') {
    return {
      name: 'Cloudflare, Inc.',
      country: '미국',
      privacyUrl: 'https://www.cloudflare.com/privacypolicy/',
    };
  }
  return {
    name: 'Vercel Inc.',
    country: '미국',
    privacyUrl: 'https://vercel.com/legal/privacy-policy',
  };
}
