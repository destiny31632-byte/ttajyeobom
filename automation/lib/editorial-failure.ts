// 확인되지 않은 사실/근거가 문제인 글은 수동 검토까지 보류합니다.
// 일시적 공급자 장애, 사용량 부족 또는 비공개 미리보기는 주제 자체를 차단하지 않습니다.
export function shouldHoldTopic(reason: string, preview: boolean): boolean {
  if(preview)return false;
  return !(/시간 초과|timeout|timed out|무료 AI 응답 (429|500|502|503|504)|무료 호출 보호 한도|작성 전송 오류|작성 전송 미완료|작성 스트림 없음/i.test(reason));
}
