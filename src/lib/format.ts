// 날짜 표시는 모두 한국 시간(KST) 기준

const dateFmt = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function formatDateKo(date: Date): string {
  return dateFmt.format(date);
}

function kstParts(date: Date) {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return {
    y: kst.getUTCFullYear(),
    m: p(kst.getUTCMonth() + 1),
    d: p(kst.getUTCDate()),
    hh: p(kst.getUTCHours()),
    mm: p(kst.getUTCMinutes()),
    ss: p(kst.getUTCSeconds()),
  };
}

/** 2026-10-01T09:00:00+09:00 형식 */
export function isoKst(date: Date): string {
  const { y, m, d, hh, mm, ss } = kstParts(date);
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}+09:00`;
}

/** 2026-10-01 형식 */
export function ymdKst(date: Date): string {
  const { y, m, d } = kstParts(date);
  return `${y}-${m}-${d}`;
}
