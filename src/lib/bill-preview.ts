// 글 본문(마크다운)의 '예상 청구액' 표를 홈 화면 미리보기로 꺼냅니다.
// 숫자를 홈에 따로 적지 않으므로, 글의 표를 고치면 홈도 함께 바뀝니다.

export interface BillRow {
  usage: string;
  amount: number;
  /** 바로 위 행과의 차이 (첫 행은 null) */
  delta: number | null;
}

export interface BillPreview {
  heading: string;
  basis: string;
  rows: BillRow[];
}

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim());

export function readBillPreview(markdown: string, column = '예상 청구액'): BillPreview | null {
  const lines = markdown.split(/\r?\n/);
  const head = lines.findIndex((l) => l.trim().startsWith('|') && l.includes(column));
  if (head < 0) return null;

  const col = cells(lines[head]).indexOf(column);
  const rows: BillRow[] = [];
  for (let i = head + 2; i < lines.length && lines[i].trim().startsWith('|'); i++) {
    const c = cells(lines[i]);
    const amount = Number(c[col]?.replace(/[^\d]/g, ''));
    if (!c[0] || !amount) continue;
    const prev = rows.at(-1);
    rows.push({ usage: c[0], amount, delta: prev ? amount - prev.amount : null });
  }

  // 표 바로 위 문단의 '…기준입니다' 문장과 가장 가까운 ## 제목
  let heading = '';
  let basis = '';
  for (let i = head - 1; i >= 0; i--) {
    const l = lines[i].trim();
    if (!basis && l && !l.startsWith('|')) {
      const m = l.match(/[^.]*기준(?=입니다)/);
      if (m) basis = m[0].replace(/^\s*모두\s*/, '').replace(/,\s*/g, ' · ').trim();
    }
    if (l.startsWith('## ')) {
      heading = l.slice(3).trim();
      break;
    }
  }

  return rows.length >= 2 ? { heading, basis, rows } : null;
}
