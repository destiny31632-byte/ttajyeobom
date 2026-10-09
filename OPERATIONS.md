# 따져봄 운영

## 현재 구현된 작업

- `npm run verify`: 빌드·테스트·페이지 검사. 실패하면 배포하지 않습니다.
- `npm run gate -- all --online`: 출처 접속과 콘텐츠 검사. 링크가 열린다는 사실은 주장 정확성을 증명하지 않습니다.
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

허위 검증 날짜·승인 기록을 만들지 않습니다. 검증일 7일 초과, 해결 안 된 출처 충돌, 공식 출처 접속 실패, 고위험 주제는 자동 발행하지 않습니다. 콘텐츠 검수 통과와 광고 심사 통과는 별개입니다.

## PC 없이 예약 점검

GitHub 공개 저장소에 올리면 `.github/workflows/scheduled.yml`이 매일 한국 오전 9시 30분과 일요일 오전 10시에 점검합니다. 예약 실행은 지연될 수 있습니다. 이 작업은 GitHub 서버에서 돌며 PC를 켤 필요가 없습니다. 실행 기록은 Actions에서 확인합니다. 보고서가 로컬에 저장돼 있어도 클라우드 실행 기록과 같지 않습니다.

## 호스팅

수익형 사이트이므로 Vercel Hobby에 광고를 켜지 않습니다. Cloudflare 계정에 로그인한 뒤 무료 Workers Static Assets를 사용합니다. 호스팅 계정과 무료 플랜을 실제 확인하기 전 배포하지 않습니다. Workers Paid 전환, DB/유료 서버 추가, 도메인 구매는 하지 않습니다.

GitHub 예약 점검과 이 대화의 Codex 개발 재개는 다른 기능입니다. 로컬 Codex 재개에는 PC와 앱이 필요합니다. 기존 Azure 서버로 개발 에이전트를 옮기려면 실제 무료 잔액·메모리·로그인 방식부터 확인해야 하며 로컬 인증 토큰을 임의로 복제하지 않습니다.

## 현재 미완료

무료 AI 공급자의 실제 계정 연결, 무인 조사·사실 재검증, 자동 배포 계정 연결, 호스팅 로그인, AdSense 게시자 설정·검색 소유 인증, 9개 글의 전체 최신 사실 재검증. 키나 계정이 없어도 검수·후보 수집은 실행되지만 이를 자동 수익화 완성으로 보고하지 않습니다.

무료 Gemini 공급자 인터페이스와 초안 생성기는 구현되어 있습니다. `--generate`는 `automation/briefs/ready/<slug>.json`에 조사 브리프가 있고 공급자 프로젝트 Free tier·결제 계정 미연결을 확인했을 때만 사용합니다. 브리프에는 slug, title, category, cluster, targetQuery, tags, checkedAt, sources, facts가 필요합니다. 자동화는 조사하지 않은 날짜를 오늘로 바꾸지 않습니다. 생성 결과는 항상 초안이며 승인 기록이 없으면 발행할 수 없습니다.

현재 AI 기본값은 비활성화입니다. 하루 최대 2회, 월 최대 40회·예약 토큰 400,000 한도입니다. 요청당 30,000을 미리 예약하므로 실제로는 토큰 보호 한도가 먼저 작동할 수 있습니다. 실패 시 환원하거나 재시도하지 않습니다. 이 기록은 `automation/state/ai-usage.json`에 저장되므로 AI를 클라우드 예약 실행에 연결하기 전 상태를 영속화해야 합니다. 현재 GitHub 예약 점검은 AI 호출 옵션 없이 실행됩니다.
