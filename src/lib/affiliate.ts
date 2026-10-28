export interface RankedProduct {
  rank: number; // 1, 2, 3
  rankBadge: string; // '판매량 1위 🥇', '가성비 1위 🥈', '프리미엄 1위 🥉' 등
  productName: string;
  specSummary: string; // 핵심 스펙 / 따져봄 선택 이유
  tag?: string; // '로켓배송 🚀' 등
  link: string;
}

export interface AffiliateRankingGroup {
  sectionTitle: string; // 예: '창문 단열재 & 외풍 차단 BEST 3'
  sectionSubtitle?: string; // 예: '최근 30일 누적 판매량 및 실구매 리뷰 기준'
  products: RankedProduct[];
}

export const AFFILIATE_RANKING_MAP: Record<string, AffiliateRankingGroup> = {
  'window-insulation-bubble-wrap-vs-thermal-film-draft-stopper-guide': {
    sectionTitle: '창문 단열재 & 외풍 차단 틈새막이 BEST 3',
    sectionSubtitle: '최근 30일 누적 판매량 및 에너지공단 단열 기준 종합',
    products: [
      {
        rank: 1,
        rankBadge: '판매량 1위 🥇',
        productName: '탐사 국내생산 3중 창문 단열 뽁뽁이 에어캡',
        specSummary: '4mm 올록볼록 3중 공기층, 물 분무 3초 부착으로 실내온도 2~3℃ 즉시 상승',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibz0dBOboi',
      },
      {
        rank: 2,
        rankBadge: '시야사수 1위 🥈',
        productName: '3M 고투명 창문 보온 단열필름 시트',
        specSummary: '투명도 85% 시야 유지, 자외선 99% 차단, 거실 통창·베란다 뷰 사수형',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibz0dBOboi',
      },
      {
        rank: 3,
        rankBadge: '외풍봉쇄 1위 🥉',
        productName: '3M 창틀 틈새막이 고밀도 모헤어 문풍지',
        specSummary: '샷시 레일 틈새 칼바람 80% 차단, 복원력 우수 고밀도 브러시 털실',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibz0dBOboi',
      },
    ],
  },
  'indoor-heating-tent-vs-thermal-curtain-comparison-guide': {
    sectionTitle: '실내 방한 난방텐트 & 외풍차단 커튼 BEST 3',
    sectionSubtitle: '최근 30일 누적 판매량 및 보온 유지력 실측 기준',
    products: [
      {
        rank: 1,
        rankBadge: '누적판매 1위 🥇',
        productName: '따수미 시그니처 프리미엄 실내 방한 난방텐트 (1~2인용/퀸)',
        specSummary: '고보온 웜텍스 원단으로 텐트 안 +3~5℃ 급상승, 세탁 가능한 분리형 프레임',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/icXzgyqKVo',
      },
      {
        rank: 2,
        rankBadge: '원터치 1위 🥈',
        productName: '따수미 패브릭 원터치 1~2인용 난방텐트',
        specSummary: '3초 원터치 팝업 설치, 바닥형·침대형 완벽 호환, 원룸 공간 활용 최적',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/icXzgyqKVo',
      },
      {
        rank: 3,
        rankBadge: '냉기차단 1위 🥉',
        productName: '3중 고밀도 암막 방한 단열 아일렛 커튼',
        specSummary: '창문 냉기 차단율 95%, 방음·암막 100%, 바닥 10cm 끌림 시공 최적화',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibz0dBOboi',
      },
    ],
  },
  'mini-heater-convector-radiator-comparison-guide': {
    sectionTitle: '겨울철 보조 난방기구 (온풍기·컨벡터·라디에이터) BEST 3',
    sectionSubtitle: '최근 30일 누적 판매량 및 소비전력 누진세 안전 기준',
    products: [
      {
        rank: 1,
        rankBadge: '급속난방 1위 🥇',
        productName: '신일 PTC 컴팩트 세라믹 전기 온풍기 히터',
        specSummary: '예열 없이 3초 만에 급속 난방, 전도 안전 스위치·과열 방지 센서 탑재',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/icD39Vywyi',
      },
      {
        rank: 2,
        rankBadge: '무소음 1위 🥈',
        productName: '밀(Mill) 북유럽 대류형 전기 컨벡터 히터',
        specSummary: '산소 태우지 않는 자연 대류, 무소음·무취·덜 건조함, 생활방수 IPX4',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/icD39Vywyi',
      },
      {
        rank: 3,
        rankBadge: '잔열유지 1위 🥉',
        productName: '신일 이동식 안전 오일 라디에이터 (7핀/9핀)',
        specSummary: '은은한 복사열로 장시간 훈훈함 유지, 화재 위험 최소화 취침용 난방',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/icD39Vywyi',
      },
    ],
  },
  'electric-heating-blanket-carbon-mat-comparison-guide': {
    sectionTitle: '온열매트 & 탄소 카본매트 BEST 3',
    sectionSubtitle: '최근 30일 누적 판매량 및 EMF 전자파 제로 인증 기준',
    products: [
      {
        rank: 1,
        rankBadge: '탄소매트 1위 🥇',
        productName: '[27년형] 한일의료기 고급형 헤리티지 EMF 탄소 카본매트',
        specSummary: '카본 그래핀 원적외선 방출, 저전압 DC 어댑터로 전자파 제로 & 월 4천 원대',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibMg2cLBW8',
      },
      {
        rank: 2,
        rankBadge: '국민가성비 🥈',
        productName: '일월 순면 온열 전기매트 (분리난방/더블)',
        specSummary: '좌우 분리 개별 온도 제어, 마이콤 절전 회로, 압도적 판매량 국민 브랜드',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibMg2cLBW8',
      },
      {
        rank: 3,
        rankBadge: '프리미엄 1위 🥉',
        productName: '경동나비엔 저소음 초슬림 온수매트',
        specSummary: '1mm 초슬림 고주파 압착, BLDC 모터 무소음 설계, 0.5℃ 정밀 수온 제어',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibMg2cLBW8',
      },
    ],
  },
  'humidifier-types-electricity-cleaning-guide': {
    sectionTitle: '겨울철 실내 가습기 (가열식·초음파·복합식) BEST 3',
    sectionSubtitle: '최근 30일 누적 판매량 및 100℃ 고온 살균·세척 편의 기준',
    products: [
      {
        rank: 1,
        rankBadge: '살균 1위 🥇',
        productName: '르젠 대용량 스팀 가열식 가습기 3L',
        specSummary: '100℃ 끓여서 분무하는 살균 스팀, 밥솥형 분리 세척 스테인리스 수조 탑재',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibzXBqBJGS',
      },
      {
        rank: 2,
        rankBadge: '가성비 1위 🥈',
        productName: '오아 듀얼미스트 대용량 초음파 무소음 가습기',
        specSummary: '소비전력 30W 저전력 전기세 방어, 듀얼 분무 노즐, 간편 상부 급수형',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibzXBqBJGS',
      },
      {
        rank: 3,
        rankBadge: '프리미엄 1위 🥉',
        productName: '조지루시 밥솥형 스팀 가열식 가습기',
        specSummary: '세균 번식 0%, 구연산 간편 세척 모드, 압도적 가습력과 내구성',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibzXBqBJGS',
      },
    ],
  },
  'winter-heating-cost-saving-guide': {
    sectionTitle: '겨울철 난방비 30% 방어 필수템 BEST 3',
    sectionSubtitle: '한국에너지공단 권장 고효율 보온·단열 기구 종합',
    products: [
      {
        rank: 1,
        rankBadge: '단열 1위 🥇',
        productName: '탐사 국내생산 3중 창문 단열 뽁뽁이 에어캡',
        specSummary: '물만 뿌려 부착, 창문 냉기 차단으로 실내 체감온도 2~3℃ 상승',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibz0dBOboi',
      },
      {
        rank: 2,
        rankBadge: '보온 1위 🥈',
        productName: '따수미 시그니처 프리미엄 방한 난방텐트',
        specSummary: '보일러 20도 유지해도 침대 안 훈훈, 가스비 월 3만~5만 원 방어',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/icXzgyqKVo',
      },
      {
        rank: 3,
        rankBadge: '절전 1위 🥉',
        productName: '한일의료기 EMF 탄소 카본매트',
        specSummary: '전자파 없는 카본 원적외선 난방, 하루 8시간 가동 시 월 전기세 4천 원대',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibMg2cLBW8',
      },
    ],
  },
  'overload-protection-high-capacity-power-strip-guide': {
    sectionTitle: '난방기구 화재 예방 누전차단 고용량 멀티탭 BEST 3',
    sectionSubtitle: '16A 4,000W 안전 규격 및 KC 안전인증 통과 기준',
    products: [
      {
        rank: 1,
        rankBadge: '안전 1위 🥇',
        productName: '현대일렉트릭 16A 알루미늄 누전차단 고용량 멀티탭 3구',
        specSummary: '16A 4000W 누전차단기 탑재, 2.5sq 굵은 배선과 알루미늄 외장 화재 원천 차단',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibzUPb8Sjs',
      },
      {
        rank: 2,
        rankBadge: '개별절전 1위 🥈',
        productName: '나노 16A 안전 커버 개별 스위치 고용량 멀티탭',
        specSummary: '대기전력 완벽 차단 양극 차단 스위치, 안전 슬라이드 먼지 보호 커버',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibzUPb8Sjs',
      },
      {
        rank: 3,
        rankBadge: '서지보호 1위 🥉',
        productName: '필립스 서지 프로텍트 스마트 고용량 멀티탭',
        specSummary: '낙뢰 및 과전압 써지 차단 회로 탑재, 고가 가전·PC 수명 보호',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibzUPb8Sjs',
      },
    ],
  },
  '2026-household-electricity-bill-calculation-guide': {
    sectionTitle: '누진세 구간 방지 & 소비전력 측정 스마트 플러그 BEST 3',
    sectionSubtitle: '실시간 전력 모니터링 및 대기전력 자동 차단 기준',
    products: [
      {
        rank: 1,
        rankBadge: '실시간측정 1위 🥇',
        productName: '소비전력 측정 스마트 플러그 16A (IoT 원격 제어)',
        specSummary: '스마트폰 앱으로 소비 전력(W) 실시간 모니터링, 누진 구간 초과 시 자동 알림',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia5fHJ4NfE',
      },
      {
        rank: 2,
        rankBadge: '대기전력차단 🥈',
        productName: '현대일렉트릭 대기전력 자동 차단 절전 멀티탭',
        specSummary: '가전 전원 꺼지면 대기전력 100% 자동 차단, 연간 전기세 10% 절감 효과',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ibzUPb8Sjs',
      },
      {
        rank: 3,
        rankBadge: '타이머제어 🥉',
        productName: '24시간 아날로그/디지털 타이머 콘센트',
        specSummary: '원하는 시간대에만 전력 통전, 전기난로·온수기 불필요한 과소비 방지',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia5fHJ4NfE',
      },
    ],
  },
  'smartphone-battery-80-percent-charging-guide': {
    sectionTitle: '배터리 수명 보호 GaN 초고속 멀티 충전기 BEST 3',
    sectionSubtitle: '정밀 PPS 전력 제어 및 과열 방지 안전 회로 기준',
    products: [
      {
        rank: 1,
        rankBadge: '고속충전 1위 🥇',
        productName: 'GaN 65W/100W 3포트 초고속 멀티 충전기',
        specSummary: '질화갈륨(GaN) 소재 발열 최소화, 노트북·스마트폰 동시 초고속 3포트 지원',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia5bO7lgSO',
      },
      {
        rank: 2,
        rankBadge: '국민정품 🥈',
        productName: '삼성전자 정품 25W/45W PD 초고속 충전기',
        specSummary: '삼성 초고속 충전 2.0 완벽 호환, 배터리 보호 알고리즘 정품 어댑터',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia5bO7lgSO',
      },
      {
        rank: 3,
        rankBadge: '3in1무선 🥉',
        productName: '맥세이프 15W 3in1 무선 고속 충전 스탠드',
        specSummary: '아이폰·애플워치·에어팟 동시 충전, 데스크 정리 및 야간 거치대 겸용',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia5bO7lgSO',
      },
    ],
  },
  'windows-backup-file-history-restore-guide': {
    sectionTitle: '파일 백업 & 복구 전용 초고속 포터블 외장 SSD BEST 3',
    sectionSubtitle: '전송 속도 1,000MB/s 이상 및 충격 방지 내구성 기준',
    products: [
      {
        rank: 1,
        rankBadge: '속도·내구성 1위 🥇',
        productName: '삼성전자 포터블 외장 SSD T7 1TB/2TB',
        specSummary: '최대 1,050MB/s 초고속 전송, 알루미늄 메탈 바디 2m 낙하 충격 보호',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia476ONN0e',
      },
      {
        rank: 2,
        rankBadge: '가성비 1위 🥈',
        productName: '샌디스크 E30 포터블 외장 SSD 1TB',
        specSummary: '안정적인 800MB/s 읽기 속도, 작고 가벼운 휴대성, 파일 히스토리 백업 최적',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia476ONN0e',
      },
      {
        rank: 3,
        rankBadge: '대용량 1위 🥉',
        productName: '씨게이트 원터치 대용량 외장하드 2TB/4TB',
        specSummary: '사진·영상 대규모 자동 백업용 가성비 스토리지, 복구 서비스 2년 지원',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia476ONN0e',
      },
    ],
  },
  'windows-storage-cleanup-safe-order-guide': {
    sectionTitle: 'C드라이브 용량 부족 해결 대용량 외장 드라이브 BEST 3',
    sectionSubtitle: '최근 30일 누적 판매량 및 데이터 안정성 기준',
    products: [
      {
        rank: 1,
        rankBadge: '인기 1위 🥇',
        productName: '삼성전자 포터블 외장 SSD T7 1TB/2TB',
        specSummary: 'C드라이브 다운로드/사진 분리 보관, 고화질 영상 편집 즉시 구동 속도',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia476ONN0e',
      },
      {
        rank: 2,
        rankBadge: '가성비 1위 🥈',
        productName: '샌디스크 E30 포터블 외장 SSD',
        specSummary: '합리적인 가격대의 초경량 외장 SSD, 대용량 파일 분리 이동에 최적',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia476ONN0e',
      },
      {
        rank: 3,
        rankBadge: '초대용량 1위 🥉',
        productName: 'WD New Elements 대용량 포터블 외장하드 2TB/4TB',
        specSummary: 'PC 시스템 이미지 백업 및 묵은 자료 장기 보관용 가성비 스토리지',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia476ONN0e',
      },
    ],
  },
  'chrome-password-passkey-storage-guide': {
    sectionTitle: '계정 보안 & 해킹 방지 FIDO2 하드웨어 보안키 BEST 3',
    sectionSubtitle: 'FIDO2 공식 인증 및 피싱·계정 탈취 원천 차단 기준',
    products: [
      {
        rank: 1,
        rankBadge: '보안 1위 🥇',
        productName: 'FIDO2 하드웨어 보안키 (USB-A/Type-C 듀얼)',
        specSummary: '구글·MS 계정 패스키 완벽 지원, 물리적 터치 없이는 로그인 불가 피싱 차단',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia494rDrwa',
      },
      {
        rank: 2,
        rankBadge: '호환성 1위 🥈',
        productName: '유비키(YubiKey) 5 NFC 보안키',
        specSummary: '전 세계 표준 보안키, 스마트폰 NFC 태그 및 PC USB 직결 원터치 인증',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia494rDrwa',
      },
      {
        rank: 3,
        rankBadge: '스마트카드 🥉',
        productName: 'FIDO U2F 하드웨어 암호화 토큰',
        specSummary: '기업 및 개발자 환경 2차 인증 최적화, 내구성 강화 방수 하우징',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia494rDrwa',
      },
    ],
  },
  '2026-driver-license-renewal-guide': {
    sectionTitle: '안전 운전 필수 차량용 스마트폰 고속 충전 거치대 BEST 3',
    sectionSubtitle: '최근 30일 누적 판매량 및 고속 무선 충전 안정성 기준',
    products: [
      {
        rank: 1,
        rankBadge: '맥세이프 1위 🥇',
        productName: '차량용 맥세이프 무선 고속 충전 거치대 15W',
        specSummary: '강력한 네오디뮴 자석 송풍구 고정, 방지턱 흔들림 없는 원터치 충전',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia5bO7lgSO',
      },
      {
        rank: 2,
        rankBadge: '자동슬라이더 🥈',
        productName: '스마트 센서 자동 오토 슬라이딩 무선 충전 거치대',
        specSummary: 'FOD 스마트 센서 스마트폰 인식 자동 개폐, 무소음 정숙 모터 탑재',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia5bO7lgSO',
      },
      {
        rank: 3,
        rankBadge: '시거잭충전 🥉',
        productName: '차량용 65W 초고속 듀얼 시거잭 충전기',
        specSummary: '내비게이션 실행 중에도 배터리 100% 충전, PD/QC 동시 지원',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia5bO7lgSO',
      },
    ],
  },
  'chrome-memory-saver-tab-reload-guide': {
    sectionTitle: 'PC 메모리 부족 & 크롬 탭 버벅임 해결 스토리지 BEST 3',
    sectionSubtitle: '캐시 분리 및 대용량 작업 파일 보관용 초고속 드라이브',
    products: [
      {
        rank: 1,
        rankBadge: '성능 1위 🥇',
        productName: '삼성전자 포터블 외장 SSD T7 1TB',
        specSummary: '1,050MB/s 고속 전송, 브라우저 다운로드 및 작업 캐시 전용 드라이브',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia476ONN0e',
      },
      {
        rank: 2,
        rankBadge: '가성비 1위 🥈',
        productName: '샌디스크 E30 포터블 외장 SSD',
        specSummary: '합리적인 가격의 고속 외장 스토리지, PC 내장 드라이브 부담 분산',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia476ONN0e',
      },
      {
        rank: 3,
        rankBadge: 'RAM 확장 🥉',
        productName: '삼성전자 DDR4 / DDR5 노트북·데스크탑 메모리 16GB/32GB',
        specSummary: '크롬 탭 50개 이상 동시 쾌적 구동, 시스템 실질 메모리 업그레이드',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia476ONN0e',
      },
    ],
  },
  'windows-10-esu-2027-extension-guide': {
    sectionTitle: '윈도우 11 업그레이드 및 PC 교체 대비 백업 스토리지 BEST 3',
    sectionSubtitle: 'OS 마이그레이션 및 대용량 시스템 이미지 보관 기준',
    products: [
      {
        rank: 1,
        rankBadge: '안정성 1위 🥇',
        productName: '삼성전자 포터블 외장 SSD T7 1TB/2TB',
        specSummary: '윈도우 전체 백업 및 복원 초고속 완료, 암호화 소프트웨어 기본 지원',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia476ONN0e',
      },
      {
        rank: 2,
        rankBadge: '가성비 1위 🥈',
        productName: '샌디스크 E30 포터블 외장 SSD 1TB',
        specSummary: '개인 데이터 백업 전용 외장 SSD, 초경량 컴팩트 디자인',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia476ONN0e',
      },
      {
        rank: 3,
        rankBadge: '대용량 1위 🥉',
        productName: '씨게이트 대용량 포터블 외장하드 2TB/4TB',
        specSummary: '구형 PC의 수년간 누적된 데이터 전수 보관용 대용량 백업 드라이브',
        tag: '로켓배송 🚀',
        link: 'https://link.coupang.com/a/ia476ONN0e',
      },
    ],
  },
};

const DEFAULT_RANKING_GROUP: AffiliateRankingGroup = {
  sectionTitle: '따져봄 추천 쿠팡 생활·IT 베스트셀러 BEST 3',
  sectionSubtitle: '최근 30일 누적 판매량 및 실사용 리뷰 종합 기준',
  products: [
    {
      rank: 1,
      rankBadge: '인기 1위 🥇',
      productName: '쿠팡 로켓배송 실시간 생활·방한 베스트셀러 모음',
      specSummary: '누적 리뷰 수만 개 이상 검증된 당일/익일 로켓배송 인기 상품',
      tag: '로켓배송 🚀',
      link: 'https://link.coupang.com/a/ia40fGVkGW',
    },
    {
      rank: 2,
      rankBadge: '가성비 1위 🥈',
      productName: '쿠팡 탐사(Tamsa) 생활필수품 특가 기획전',
      specSummary: '중간 유통 마진 거품을 뺀 가성비 1위 자체 브랜드 생활용품',
      tag: '로켓배송 🚀',
      link: 'https://link.coupang.com/a/ibz0dBOboi',
    },
    {
      rank: 3,
      rankBadge: '계절특가 🥉',
      productName: '겨울철 난방·방한 가전 실시간 할인 특가전',
      specSummary: '온풍기·전열매트·단열용품 카드 할인 및 로켓와우 추가 혜택',
      tag: '로켓배송 🚀',
      link: 'https://link.coupang.com/a/icXzgyqKVo',
    },
  ],
};

export function getAffiliateRankingForPost(slug: string): AffiliateRankingGroup {
  return AFFILIATE_RANKING_MAP[slug] || DEFAULT_RANKING_GROUP;
}
