# 비용과 사용량 보호

2026-10-09 확인. 목표는 도메인을 제외한 월 고정비 0원입니다.

| 구성 | 선택·현황 | 비용 보호 |
| --- | --- | --- |
| 소스·예약 점검 | GitHub 공개 저장소, 표준 Ubuntu runner 예정 | 공개 저장소의 Actions 실행 분은 무료. 작업당 10~15분 제한, 동시 실행 방지. 아티팩트 업로드 없음 |
| 정적 호스팅 | Cloudflare Workers Static Assets 무료 플랜 준비 | 정적 자산 요청 무료·무제한. Worker 서버 코드 없음. 무료 플랜 정적 파일 20,000개 제한. 로그인과 실제 배포 미완료 |
| Vercel Hobby | 수익화 호스팅으로 사용하지 않음 | 비상업 전용이며 AdSense 포함 광고는 상업 이용으로 분류됨. 자동 유료 업그레이드 금지 |
| 외부 AI API | 미연결 | 일간 실행에서 외부 AI를 호출하지 않음. 자동 과금 없음. 무료 자격·쿼터를 검증하고 명시적으로 연결하기 전 글 자동 생성 금지 |
| Azure 기존 VM | Azure for Students, Standard_B1s | 잔여 학생 크레딧 확인 불가. 메모리 여유 약 223MB, 기존 서비스 여러 개. 추가 배포하지 않음 |
| 도메인·DB·CMS | 구입/추가 없음 | 무료 제공 주소와 저장소 파일만 사용 |

예상 예약 실행은 하루 1회 + 주 1회, 최대 약 570분/월입니다. 공개 저장소 표준 runner 무료 조건을 사용합니다. 모델이 만들어 주는 개발 작업과 콘텐츠 생성 API는 별개의 사용량입니다. Codex는 5시간·주간 잔여가 5% 미만이면 중단하며 리셋/추가 크레딧을 사용하지 않습니다. 조회가 안 되면 중단합니다.

외부 무료 AI를 연결하더라도 실패 시 유료 제공자로 전환하지 않습니다. 현재는 콘텐츠 생성 자체가 차단되어 있으며, 자동 점검과 트렌드 후보 수집만 동작합니다. 계정 로그인 또는 환경 변수 존재만으로 무료 과금 차단이 증명되지는 않습니다.

자료: [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [Cloudflare Static Assets](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/), [Cloudflare limits](https://developers.cloudflare.com/workers/platform/limits/), [Vercel 상업 이용 기준](https://vercel.com/docs/limits/fair-use-guidelines).
