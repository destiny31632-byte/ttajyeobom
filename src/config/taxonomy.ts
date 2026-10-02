// 카테고리/작성자처럼 사이트와 자동화 파이프라인이 함께 쓰는 순수 데이터.
// (import.meta.env 를 쓰지 않으므로 Node 스크립트에서도 그대로 import 가능)

export interface Category {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  /** 파이프라인이 주제를 분류할 때 참고하는 키워드 */
  keywords: string[];
  /** 광고 친화도 기본값 (0~1) */
  adFriendliness: number;
}

export const CATEGORIES: Category[] = [
  {
    slug: 'it',
    name: 'IT·모바일',
    shortName: 'IT',
    description:
      '스마트폰, PC, 앱, 통신 서비스를 바꾸거나 고치기 전에 확인할 기준과 비용을 정리합니다.',
    keywords: ['아이폰', '갤럭시', '스마트폰', '윈도우', '노트북', '앱', '요금제', '배터리', '업데이트', '인터넷', '와이파이', 'pc'],
    adFriendliness: 0.9,
  },
  {
    slug: 'living',
    name: '생활비 절약',
    shortName: '생활비',
    description:
      '전기·가스요금, 통신비, 쇼핑과 세금처럼 매달 나가는 돈을 직접 계산해 보고 줄이는 방법을 다룹니다.',
    keywords: ['요금', '전기요금', '가스요금', '절약', '할인', '관세', '직구', '소득공제', '환급', '포인트', '구독'],
    adFriendliness: 0.85,
  },
  {
    slug: 'public',
    name: '정부·공공서비스',
    shortName: '공공',
    description:
      '여권, 민원, 지원 제도처럼 공공서비스를 신청할 때 필요한 조건·비용·기간을 공식 자료 기준으로 정리합니다.',
    keywords: ['신청', '발급', '민원', '정부', '지원금', '제도', '정책', '여권', '주민센터', '정부24', '자격'],
    adFriendliness: 0.75,
  },
  {
    slug: 'home',
    name: '가전·살림',
    shortName: '가전',
    description:
      '가전제품 선택 기준, 유지비, 관리법을 비교표와 계산으로 정리해 후회 없는 선택을 돕습니다.',
    keywords: ['가전', '에어컨', '난방', '보일러', '가습기', '제습기', '청소기', '세탁기', '냉장고', '전기장판', '살림'],
    adFriendliness: 0.9,
  },
  {
    slug: 'travel',
    name: '여행·교통',
    shortName: '여행',
    description:
      '공항, 항공, 해외 데이터, 교통카드처럼 이동에 드는 시간과 비용을 미리 따져볼 수 있게 정리합니다.',
    keywords: ['여행', '공항', '항공', '로밍', 'esim', '유심', '교통카드', 'ktx', '주차', '환전', '비자'],
    adFriendliness: 0.85,
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as [string, ...string[]];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export interface Author {
  id: string;
  name: string;
  role: string;
  shortBio: string;
  bio: string[];
  focus: string[];
}

// 작성자 정보는 사실만 적습니다. 실명/사진/경력은 운영자가 직접 확인한 내용으로만 추가하세요.
export const AUTHORS: Record<string, Author> = {
  editor: {
    id: 'editor',
    name: '따져봄 에디터',
    role: '운영자 · 편집 책임',
    shortBio:
      '공식 자료를 먼저 확인하고, 계산이 필요한 부분은 직접 표로 만들어 비교합니다. 글 작성에는 AI 도구를 활용하며 출처 확인과 자동 품질 검수를 거쳐 발행합니다.',
    bio: [
      '따져봄을 운영하며 주제 선정, 자료 확인 기준, 발행 여부를 책임집니다.',
      '정부·공공기관과 제조사 공식 문서를 1차 자료로 삼고, 언론 보도는 교차 확인용으로 씁니다. 숫자가 들어가는 내용은 계산 과정과 기준일을 함께 적습니다.',
      '초안 작성과 자료 정리에 AI 도구를 사용합니다. 대신 모든 글은 출처 확인, 중복·반복 검사, 맞춤법 점검 같은 자동 검수 절차를 통과해야 발행됩니다.',
      '사실과 다른 내용을 발견하면 문의 페이지로 알려 주세요. 확인 후 본문을 고치고 수정일을 갱신합니다.',
    ],
    focus: ['스마트폰·PC 사용 비용', '전기·가스 등 생활 요금 계산', '공공서비스 신청 절차', '가전 선택 기준', '여행·교통 비용'],
  },
};

export const DEFAULT_AUTHOR_ID = 'editor';

export type YmylLevel = 'none' | 'low' | 'medium' | 'high';
export const YMYL_LEVELS: [YmylLevel, ...YmylLevel[]] = ['none', 'low', 'medium', 'high'];

export const SOURCE_TYPES = [
  'government',
  'official',
  'primary',
  'press',
  'expert',
  'reference',
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  government: '정부·공공기관',
  official: '공식 문서',
  primary: '원자료',
  press: '언론 보도',
  expert: '전문 매체',
  reference: '참고 자료',
};

export const IMAGE_KINDS = ['own-chart', 'own-diagram', 'commons', 'public-domain', 'cc', 'official'] as const;

/** 상업적 사이트에서 쓸 수 있는 라이선스만 허용 (NC/ND 제외) */
export const ALLOWED_IMAGE_LICENSES = [
  'CC0',
  'CC0 1.0',
  'Public domain',
  'PD',
  'CC BY 2.0',
  'CC BY 2.5',
  'CC BY 3.0',
  'CC BY 4.0',
  'CC BY-SA 2.0',
  'CC BY-SA 2.5',
  'CC BY-SA 3.0',
  'CC BY-SA 4.0',
  'KOGL Type 1',
  '자체 제작 (CC BY 4.0)',
];
