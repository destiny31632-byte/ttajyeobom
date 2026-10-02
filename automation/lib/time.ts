// 자동화의 "하루" 기준은 한국 시간(KST)

export function kstNow(now = new Date()): Date {
  return new Date(now.getTime() + 9 * 3600 * 1000);
}

/** YYYY-MM-DD (KST) */
export function kstDate(now = new Date()): string {
  return kstNow(now).toISOString().slice(0, 10);
}

/** 2026-10-01T06:17:00+09:00 */
export function kstIso(now = new Date()): string {
  return kstNow(now).toISOString().slice(0, 19) + '+09:00';
}

export function kstMonth(now = new Date()): number {
  return kstNow(now).getUTCMonth() + 1;
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86400000);
}

/** YYYYMMDD (UTC 기준, 외부 API 경로용) */
export function compactUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
