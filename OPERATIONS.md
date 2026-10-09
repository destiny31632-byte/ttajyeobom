# 따져봄 운영

## 현재 구현된 작업

- `npm run verify`: 빌드·테스트·페이지·무료 정적 파일 검사. 실패하면 배포하지 않습니다.
- `npm run assets:check`: 정적 파일 20,000개·개별25MiB 한도 검사. 인증 파일·실행 Worker·외부 심볼릭 링크도 배포에서 차단합니다.
- `npm run gate -- all --online`: 출처 접속과 콘텐츠 검사. 링크가 열린다는 사실은 주장 정확성을 증명하지 않습니다.
- `npm run sources:audit`: 공식 원문 접근, 해시, 수치 대조 보조 검사. 숫자가 같아도 조건과 의미는 따로 대조해야 합니다.
- `npm run publication:check`: 공개할 모든 글의 실제 사실 검증 승인과 유효기간 점검. 승인 없는 기존 글도 원격 배포에서 차단합니다.
- `npm run readiness`: 누락 실행 파일·원격 연결·조사 기록·예약 실행·비용 문서 점검.
- `npm run pipeline:daily -- --collect --online`: 기존 글 점검 및 한국 관심 주제 후보 수집. 외부 AI 호출이나 발행은 하지 않습니다.
- `npm run pipeline:weekly -- --online`: 재확인 기한과 출처 점검.
- `npm run links:update`: 같은 주제의 내부 링크 후보를 보고서에 저장. 문장·본문은 변경하지 않습니다.
- `npm run publish:draft -- <slug>`: 초안 발행 가능 여부 확인. `--apply`를 붙이면 통과한 초안의 로컬 상태만 변경하며 전체 검증 실패 시 원본을 복구합니다.

## 발행 승인

초안에는 `draft: true`를 유지합니다. 중요한 숫자와 주장을 실제 공식 원문과 대조한 후 `automation/reviews/<slug>.json`에 아래 항목을 기록합니다. 승인 이후 본문이나 조사 기록이 바뀌면 재검증해야 합니다.

```json
{
  "approved": true,
  "factsVerified": true,
  "reviewer": "검증한 담당자",
  "checkedAt": "실제 검증 시각(ISO 8601)",
  "contentSha256": "Markdown 파일 전체의 SHA-256",
  "researchSha256": "조사 JSON 파일 전체의 SHA-256"
}
```

해시는 Windows CRLF를 LF로 통일한 전체 파일로 계산합니다. 허위 검증 날짜·승인 기록을 만들지 않습니다. 검증일 7일 초과, 해결 안 된 출처 충돌, 공식 출처 접속 실패, 고위험 주제는 자동 발행하지 않습니다. 콘텐츠 검수 통과와 광고 심사 통과는 별개입니다.

## PC 없이 예약 점검

GitHub 공개 저장소의 `.github/workflows/scheduled.yml`이 매일 한국 오전 9시 30분과 일요일 오전 10시에 점검합니다. 예약 실행은 지연될 수 있습니다. 이 작업은 GitHub 서버에서 돌며 PC를 켤 필요가 없습니다. 실행 기록과 7일간 보관한 보고서는 Actions에서 확인합니다. 수동 실행의 mode를 weekly로 선택하면 주간 원문 검사까지 실행합니다. 보고서가 로컬에 저장돼 있어도 클라우드 실행 기록과 같지 않습니다.

## 호스팅

수익형 사이트이므로 Vercel Hobby에 광고를 켜지 않습니다. Cloudflare 계정에 로그인한 뒤 무료 Workers Static Assets를 사용합니다. 호스팅 계정과 무료 플랜을 실제 확인하기 전 배포하지 않습니다. Workers Paid 전환, DB/유료 서버 추가, 도메인 구매는 하지 않습니다.

GitHub 예약 점검과 이 대화의 Codex 개발 재개는 다른 기능입니다. 로컬 Codex 재개에는 PC와 앱이 필요합니다. 기존 Azure 서버로 개발 에이전트를 옮기려면 실제 무료 잔액·메모리·로그인 방식부터 확인해야 하며 로컬 인증 토큰을 임의로 복제하지 않습니다.

## 현재 미완료

무료 AI 공급자의 실제 계정 연결, 무인 조사·사실 재검증, 자동 배포 계정 연결, AdSense 게시자 설정·검색 소유 인증이 남아 있습니다. 기존 9개 글은 2026-10-09 공식 자료 대조와 발행 승인을 마쳤으며 7일이 지나거나 본문이 바뀌면 재검증해야 합니다. 키나 계정이 없어도 검수·후보 수집은 실행되지만 이를 자동 수익화 완성으로 보고하지 않습니다.

무료 Gemini 공급자 인터페이스와 초안 생성기는 구현되어 있습니다. `--generate`는 `automation/briefs/ready/<slug>.json`에 조사 브리프가 있고 공급자 프로젝트 Free tier·결제 계정 미연결을 확인했을 때만 사용합니다. 브리프에는 slug, title, category, cluster, targetQuery, tags, checkedAt, sources, facts가 필요합니다. 자동화는 조사하지 않은 날짜를 오늘로 바꾸지 않습니다. 생성 결과는 항상 초안이며 승인 기록이 없으면 발행할 수 없습니다.

현재 AI 기본값은 비활성화입니다. 하루 최대 2회, 월 최대 40회·예약 토큰 400,000 한도입니다. 요청당 30,000을 미리 예약하므로 실제로는 토큰 보호 한도가 먼저 작동할 수 있습니다. 실패 시 환원하거나 재시도하지 않습니다. 이 기록은 `automation/state/ai-usage.json`에 저장되므로 AI를 클라우드 예약 실행에 연결하기 전 상태를 영속화해야 합니다. 현재 GitHub 예약 점검은 AI 호출 옵션 없이 실행됩니다.

배포 저장소 변수에는 SITE_URL, PUBLIC_CONTACT_EMAIL 또는 PUBLIC_CONTACT_URL, CLOUDFLARE_FREE_CONFIRMED를 설정합니다. 공개 이메일이 없으면 이 저장소의 공개 GitHub Issues를 문의 경로로 사용합니다. 계정 로그인 이메일은 공개하지 않습니다. Cloudflare 계정 토큰과 계정 ID는 GitHub Secrets에만 저장하고 대화나 공개 파일에 기록하지 않습니다.

## Cloudflare 계정 연결 이후

Codex Cloudflare 연결과 Wrangler 로그인이 같은 인증은 아닙니다. 대시보드의 이메일 인증을 완료하고 Workers Free 플랜과 workers.dev 주소를 실제로 확인한 뒤, 운영자가 공개를 허용한 문의 주소로 빌드합니다. 인증 토큰이나 계정 이메일을 사이트 공개 설정으로 자동 복사하지 않습니다. 연결 도구에 결제 조회 권한이 없으면 대시보드에서 플랜을 확인합니다. 파일 업로드 성공만으로 배포 성공을 보고하지 않고 원격 사이트와 build.json 해시 검증까지 마칩니다.

2026-10-10 운영 주소: https://ttajyeobom.destiny31632.workers.dev . Workers Free $0 플랜을 대시보드에서 확인하고 정적 자산만 배포했습니다. 실행 Worker 코드·DB·유료 플랜은 없습니다. 첫 배포는 연결 도구로 수행했고 로컬 검증 빌드와 원격 페이지 해시를 대조했습니다. GitHub의 Cloudflare 배포 Secrets는 아직 없으므로 무인 재배포가 연결된 상태는 아닙니다.

정기 점검의 `verify-live.ts --deployed`는 현재 공개 빌드의 홈·글·문의·개인정보·검색·RSS·사이트맵과 404·보안 헤더를 확인합니다. 이는 공개 빌드 자체의 일치 검사이며 최신 저장소 버전이 배포됐다는 증거는 아닙니다. 배포 직후에는 옵션 없이 실행해 로컬 빌드 ID와 내용까지 대조합니다.
