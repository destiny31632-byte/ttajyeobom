export interface AffiliateItem {
  title: string;
  description: string;
  productName: string;
  link: string;
  badge?: string;
}

export const AFFILIATE_MAP: Record<string, AffiliateItem> = {
  'humidifier-types-electricity-cleaning-guide': {
    title: '세균 걱정 없는 가열식·복합식 대용량 가습기',
    description: '100℃ 고온 살균과 저소음 분무, 자동 습도 조절을 지원하는 인기 가습기 모음입니다.',
    productName: '대용량 가열식·복합식 가습기 인기 모음',
    link: 'https://link.coupang.com/a/ia5hLVFB92',
    badge: '가습기 추천',
  },
  'chrome-password-passkey-storage-guide': {
    title: '패스키 보안 강화 필수 장비',
    description: '구글 계정과 비밀번호를 하드웨어 단계에서 안전하게 보호하는 FIDO2 인증 보안키입니다.',
    productName: 'FIDO2 하드웨어 보안키 모음',
    link: 'https://link.coupang.com/a/ia494rDrwa',
    badge: '보안 추천',
  },
  'windows-backup-file-history-restore-guide': {
    title: '파일 히스토리 백업 전용 외장 드라이브',
    description: '윈도우 자동 백업을 걸어두기 적합한 빠른 전송 속도와 내구성을 갖춘 포터블 외장 SSD입니다.',
    productName: '삼성·샌디스크 포터블 외장 SSD',
    link: 'https://link.coupang.com/a/ia476ONN0e',
    badge: '백업 추천',
  },
  'windows-storage-cleanup-safe-order-guide': {
    title: 'C드라이브 용량 확보를 위한 대용량 저장소',
    description: 'PC 저장공간 부족 경고를 해결하고 사진·동영상을 분리 보관할 수 있는 외장 저장장치입니다.',
    productName: '고속 포터블 외장 SSD 모음',
    link: 'https://link.coupang.com/a/ia476ONN0e',
    badge: '저장용량 추천',
  },
  'smartphone-battery-80-percent-charging-guide': {
    title: '배터리 수명 보호를 위한 GaN 멀티 고속 충전기',
    description: '과전압·과열 방지 회로와 정밀 PPS 전력 제어를 지원하는 질화갈륨(GaN) 고속 충전기입니다.',
    productName: 'GaN 65W/100W 초고속 멀티 충전기',
    link: 'https://link.coupang.com/a/ia5bO7lgSO',
    badge: '충전기 추천',
  },
  'chrome-memory-saver-tab-reload-guide': {
    title: 'PC 메모리 및 작업 효율 개선 드라이브',
    description: '크롬 브라우저 캐시 분리와 대용량 작업 파일 보관에 적합한 초고속 외장 SSD입니다.',
    productName: '포터블 고속 외장 SSD',
    link: 'https://link.coupang.com/a/ia476ONN0e',
    badge: '작업 효율',
  },
  'winter-heating-cost-saving-guide': {
    title: '겨울철 체감온도 상승과 난방비 절감 가습기',
    description: '적정 실내 습도(40~60%)를 유지해 난방 효율을 높이고 호흡기를 보호하는 가열·복합식 가습기입니다.',
    productName: '대용량 가열식·복합식 가습기',
    link: 'https://link.coupang.com/a/ia5hLVFB92',
    badge: '난방비 절감',
  },
  '2026-household-electricity-bill-calculation-guide': {
    title: '누진 구간 방지를 위한 대기전력 차단 플러그',
    description: '스마트폰 앱으로 소비 전력을 실시간 모니터링하고 불필요한 대기전력을 자동 차단하는 스마트 플러그입니다.',
    productName: '소비전력 측정 스마트 플러그',
    link: 'https://link.coupang.com/a/ia5fHJ4NfE',
    badge: '전기세 절약',
  },
  '2026-driver-license-renewal-guide': {
    title: '안전 운전 필수 차량용 거치대 & 고속 충전기',
    description: '적성검사 갱신 후 안전한 주행 환경을 돕는 차량용 무선 고속 충전 거치대입니다.',
    productName: '차량용 맥세이프 고속 충전 거치대',
    link: 'https://link.coupang.com/a/ia5bO7lgSO',
    badge: '차량 추천',
  },
  'windows-10-esu-2027-extension-guide': {
    title: '윈도우 11 업그레이드 및 PC 교체 대비 백업 드라이브',
    description: '지원 종료 전 시스템 이미지와 중요 개인 데이터를 안전하게 복제해 둘 수 있는 외장 드라이브입니다.',
    productName: '대용량 포터블 외장 SSD 1TB/2TB',
    link: 'https://link.coupang.com/a/ia476ONN0e',
    badge: '데이터 보호',
  },
};

const DEFAULT_AFFILIATE: AffiliateItem = {
  title: '따져봄 추천 생활·IT 용품',
  description: '품질과 실용성을 꼼꼼히 따져보고 엄선한 쿠팡 로켓배송 베스트셀러 모음입니다.',
  productName: '쿠팡 인기 추천 상품 보러가기',
  link: 'https://link.coupang.com/a/ia40fGVkGW',
  badge: '쿠팡 추천',
};

export function getAffiliateForPost(slug: string): AffiliateItem {
  return AFFILIATE_MAP[slug] || DEFAULT_AFFILIATE;
}
