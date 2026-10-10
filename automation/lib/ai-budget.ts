export interface UsageBudget { day: string; month: string; dailyCalls: number; monthlyCalls: number; reservedTokens: number }
export function reserveCall(previous: UsageBudget | null, date: string, tokens: number): UsageBudget {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isSafeInteger(tokens) || tokens <= 0) throw new Error('잘못된 예산 입력');
  if (previous && (typeof previous.day !== 'string' || typeof previous.month !== 'string' ||
    ![previous.dailyCalls, previous.monthlyCalls, previous.reservedTokens].every((v) => Number.isSafeInteger(v) && v >= 0))) {
    throw new Error('예산 기록 손상');
  }
  const month = date.slice(0, 7);
  const state: UsageBudget = { day: date, month,
    dailyCalls: previous?.day === date ? previous.dailyCalls : 0,
    monthlyCalls: previous?.month === month ? previous.monthlyCalls : 0,
    reservedTokens: previous?.month === month ? previous.reservedTokens : 0 };
  if (Object.values(state).some((v) => typeof v === 'number' && (!Number.isSafeInteger(v) || v < 0))) throw new Error('예산 기록 손상');
  // 두 글에 작성·독립 검토 각 1회. 실패 요청도 차감하고 유료 전환하지 않습니다.
  // 사용자가 승인한 오늘의 추가 초안 시험만 허용. 예약 실행에는 적용하지 않습니다.
  const dailyLimit = date === '2026-10-10' && process.env.EDITORIAL_PREVIEW_EXCEPTION === '2026-10-10' ? 8 : 4;
  if (state.dailyCalls >= dailyLimit || state.monthlyCalls >= 124 || state.reservedTokens + tokens > 14_000_000) throw new Error('무료 호출 보호 한도: 다음 기간까지 중단');
  return { ...state, dailyCalls: state.dailyCalls + 1, monthlyCalls: state.monthlyCalls + 1, reservedTokens: state.reservedTokens + tokens };
}
