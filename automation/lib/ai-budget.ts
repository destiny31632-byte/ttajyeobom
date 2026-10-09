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
  if (state.dailyCalls >= 2 || state.monthlyCalls >= 40 || state.reservedTokens + tokens > 400_000) throw new Error('무료 호출 보호 한도: 다음 기간까지 중단');
  return { ...state, dailyCalls: state.dailyCalls + 1, monthlyCalls: state.monthlyCalls + 1, reservedTokens: state.reservedTokens + tokens };
}
