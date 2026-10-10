import { readAdConfig } from '../lib/ads-markup.mjs';
import { CATEGORIES } from './taxonomy';

// import.meta.env 는 Astro 빌드에서만 존재합니다 (Node 스크립트에서 import 하지 마세요 → taxonomy.ts 사용)
const env = (import.meta as any).env ?? {};

/** 문의 이메일: 운영자가 공개해도 되는 주소를 확인한 뒤 여기에 적거나 PUBLIC_CONTACT_EMAIL 로 설정 */
const CONTACT_EMAIL_DEFAULT = '';

export const SITE = {
  name: '따져봄',
  alternateName: 'Ttajyeobom',
  tagline: '사기 전, 신청 전, 바꾸기 전에 숫자로 따져보는 생활 가이드',
  description:
    '스마트폰·가전·생활요금·공공서비스·여행 비용을 공식 자료와 직접 계산한 표로 비교해 정리하는 생활 정보 블로그입니다.',
  lang: 'ko',
  locale: 'ko_KR',
  contactEmail: String(env.PUBLIC_CONTACT_EMAIL || CONTACT_EMAIL_DEFAULT).trim(),
  contactUrl: 'https://github.com/destiny31632-byte/ttajyeobom/issues',
  launchDate: '2026-10-01',
  postsPerPage: 12,
  themeColor: '#0f766e',
};

export const ADS = readAdConfig(env);

export const VERIFICATION = {
  google: String(env.PUBLIC_GSC_VERIFICATION ?? '').trim(),
  naver: String(env.PUBLIC_NAVER_VERIFICATION ?? '2c48bf86a384184afd7428f4ae49d9c3aac1329c').trim(),
  bing: String(env.PUBLIC_BING_VERIFICATION ?? '').trim(),
};

export const ANALYTICS = {
  ga4: /^G-[A-Z0-9]{4,}$/.test(String(env.PUBLIC_GA4_ID ?? '')) ? String(env.PUBLIC_GA4_ID) : '',
  cfBeacon: /^[a-f0-9]{32}$/.test(String(env.PUBLIC_CF_BEACON_TOKEN ?? '')) ? String(env.PUBLIC_CF_BEACON_TOKEN) : '',
};

export const NAV = CATEGORIES.map((c) => ({ href: `/category/${c.slug}/`, label: c.name }));

export const FOOTER_LINKS = [
  { href: '/about/', label: '블로그 소개' },
  { href: '/author/editor/', label: '작성자 소개' },
  { href: '/editorial-policy/', label: '편집 원칙·작성 방식' },
  { href: '/contact/', label: '문의' },
  { href: '/privacy/', label: '개인정보처리방침' },
  { href: '/terms/', label: '이용약관' },
  { href: '/disclaimer/', label: '면책조항' },
];
